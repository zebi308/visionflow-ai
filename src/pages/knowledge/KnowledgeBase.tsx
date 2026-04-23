import { useState } from 'react';
import { BookOpen, Plus, RefreshCw, CheckCircle2, AlertCircle, Clock, FileText, Loader2, X, ExternalLink, Trash2 } from 'lucide-react';
import { useKBEntries } from '../../hooks/useData';
import { useApp } from '../../context/AppContext';
import { cn, formatDate } from '../../lib/utils';
import { nhsEligibility } from '../../constants';
import { supabase } from '../../lib/supabase';

const TYPE_LABELS: Record<string, string> = {
  'faq': 'FAQ', 'pricing': 'Pricing', 'policy': 'Policy',
  'optometrist-bio': 'Optometrist Bio', 'nhs-info': 'NHS Info',
  'eye-health-guide': 'Eye Health', 'product-info': 'Product Info', 'general': 'General',
};
const TYPE_COLORS: Record<string, string> = {
  'faq': 'badge-brand', 'pricing': 'badge-green', 'policy': 'badge-muted',
  'optometrist-bio': 'badge-violet', 'nhs-info': 'badge-amber',
  'eye-health-guide': 'badge-brand', 'product-info': 'badge-green', 'general': 'badge-muted',
};

// ── Chunk text into ~500 word segments ────────────────────────────────────────
function chunkText(text: string, chunkSize = 500): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(' '));
  }
  return chunks.filter(c => c.trim().length > 20);
}

// ── Fetch Google Doc content via CORS proxy ───────────────────────────────────
async function fetchDocContent(url: string): Promise<string> {
  // Extract doc ID from Google Doc URL
  const match = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) throw new Error('Invalid Google Doc URL — make sure it ends with /edit or /view');
  const docId = match[1];

  // Export as plain text
  const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;

  // Try direct fetch first (works if doc is public)
  try {
    const res = await fetch(exportUrl);
    if (!res.ok) throw new Error(`Could not fetch document (${res.status})`);
    const text = await res.text();
    if (text.length < 50) throw new Error('Document appears to be empty or not shared publicly');
    return text;
  } catch (e: any) {
    throw new Error(
      'Could not fetch your Google Doc. Make sure: (1) The document is shared as "Anyone with the link can view", (2) The URL is correct. Error: ' + e.message
    );
  }
}

// ── Embed text chunks with OpenAI ─────────────────────────────────────────────
async function embedChunks(chunks: string[], openaiKey: string): Promise<number[][]> {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiKey}` },
    body: JSON.stringify({ model: 'text-embedding-ada-002', input: chunks }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`OpenAI embedding failed: ${err.error?.message || res.status}`);
  }
  const data = await res.json();
  return data.data.map((d: any) => d.embedding);
}

// ── Upsert vectors to Pinecone ─────────────────────────────────────────────────
async function upsertToPinecone(
  chunks: string[],
  embeddings: number[][],
  namespace: string,
  docId: string,
  pineconeKey: string,
  pineconeHost: string
) {
  const vectors = chunks.map((chunk, i) => ({
    id: `${docId}_chunk_${i}`,
    values: embeddings[i],
    metadata: { text: chunk, doc_id: docId, chunk_index: i, namespace },
  }));

  // Pinecone upsert in batches of 100
  for (let i = 0; i < vectors.length; i += 100) {
    const batch = vectors.slice(i, i + 100);
    const res = await fetch(`${pineconeHost}/vectors/upsert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Api-Key': pineconeKey },
      body: JSON.stringify({ vectors: batch, namespace }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Pinecone upsert failed: ${err}`);
    }
  }
}

// ── Add Document Modal ─────────────────────────────────────────────────────────
function AddDocumentModal({ onClose, onSuccess, practiceId, namespace }: {
  onClose: () => void;
  onSuccess: () => void;
  practiceId: string;
  namespace: string;
}) {
  const [docUrl, setDocUrl] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('general');
  const [status, setStatus] = useState<'idle' | 'fetching' | 'embedding' | 'saving' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');

  const getEnv = (key: string) => (import.meta.env as any)[key] ?? '';

  const handleIngest = async () => {
    if (!docUrl.trim()) { setError('Please paste your Google Doc URL'); return; }
    if (!title.trim()) { setError('Please give this document a title'); return; }
    setError(''); setStatus('fetching');
    setProgress('Fetching your Google Doc…');

    try {
      // 1. Fetch doc content
      const rawText = await fetchDocContent(docUrl);
      const wordCount = rawText.split(/\s+/).length;
      setProgress(`Fetched ${wordCount.toLocaleString()} words — chunking…`);

      // 2. Chunk text
      const chunks = chunkText(rawText, 500);
      setProgress(`Created ${chunks.length} chunks — generating embeddings…`);
      setStatus('embedding');

      // 3. Embed with OpenAI
      const openaiKey = getEnv('VITE_OPENAI_API_KEY');
      if (!openaiKey) throw new Error('OpenAI API key not configured — check Vercel env vars');
      const embeddings = await embedChunks(chunks, openaiKey);
      setProgress(`Embedded ${chunks.length} chunks — saving to Pinecone…`);
      setStatus('saving');

      // 4. Upsert to Pinecone
      const pineconeKey = getEnv('VITE_PINECONE_API_KEY');
      const pineconeHost = getEnv('VITE_PINECONE_HOST');
      if (!pineconeKey || !pineconeHost) throw new Error('Pinecone not configured — check Vercel env vars');

      const docId = `${practiceId}_${Date.now()}`;
      await upsertToPinecone(chunks, embeddings, namespace || `practice_${practiceId}`, docId, pineconeKey, pineconeHost);

      // 5. Save to Supabase kb_entries
      const { error: dbErr } = await (supabase as any).from('kb_entries').insert({
        practice_id: practiceId,
        title,
        type,
        source_url: docUrl,
        status: 'synced',
        chunk_count: chunks.length,
        word_count: wordCount,
        last_synced: new Date().toISOString(),
        pinecone_doc_id: docId,
        namespace: namespace || `practice_${practiceId}`,
      });
      if (dbErr) throw new Error(`Database save failed: ${dbErr.message}`);

      setStatus('done');
      setProgress(`Done! ${chunks.length} chunks saved to Pinecone.`);
      setTimeout(() => { onSuccess(); onClose(); }, 1500);

    } catch (e: any) {
      setStatus('error');
      setError(e.message);
    }
  };

  const isProcessing = ['fetching', 'embedding', 'saving'].includes(status);

  return (
    <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="rounded-2xl w-full max-w-lg shadow-2xl" style={{ background: 'var(--bg-card)' }}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Add Document to Knowledge Base</h2>
            <p className="text-xs text-muted mt-0.5">Paste your Google Doc URL — we chunk and embed it automatically</p>
          </div>
          <button type="button" onClick={onClose} disabled={isProcessing}
            className="w-8 h-8 rounded-lg hover:bg-[var(--bg-surface)] flex items-center justify-center text-muted transition-colors disabled:opacity-40">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Step guide */}
          <div className="p-4 rounded-xl border border-brand-100" style={{ background: 'var(--bg-surface)' }}>
            <p className="text-xs font-semibold text-brand-700 mb-2">Before pasting your URL, make sure:</p>
            <div className="space-y-1.5">
              {[
                'Your Google Doc is shared as "Anyone with the link can view"',
                'You have filled in your practice details in the template',
                'The document link ends with /edit or /view (not /copy)',
              ].map(step => (
                <div key={step} className="flex items-start gap-2 text-xs text-muted">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 shrink-0 mt-0.5" />{step}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Document Title</label>
            <input className="input" placeholder="e.g. Practice Information & Services"
              value={title} onChange={e => setTitle(e.target.value)} disabled={isProcessing} />
          </div>

          <div>
            <label className="label">Document Type</label>
            <select className="input" value={type} onChange={e => setType(e.target.value)} disabled={isProcessing}>
              <option value="general">General Practice Info</option>
              <option value="pricing">Pricing & Services</option>
              <option value="faq">Patient FAQs</option>
              <option value="policy">Policies</option>
              <option value="optometrist-bio">Optometrist Bio</option>
              <option value="nhs-info">NHS Information</option>
              <option value="product-info">Products & Brands</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="label mb-0">Google Doc URL</label>
              <a href="https://docs.google.com/document/d/13zxuTEyhoS5cTsYtOaFpxRRXzVmekHtl/copy?usp=drive_link&ouid=107846856459450315273&rtpof=true&sd=true"
                target="_blank" rel="noreferrer"
                className="text-[11px] text-brand-600 hover:underline flex items-center gap-1">
                <ExternalLink className="w-3 h-3" /> Open template
              </a>
            </div>
            <input className="input font-mono text-xs" placeholder="https://docs.google.com/document/d/..."
              value={docUrl} onChange={e => setDocUrl(e.target.value)} disabled={isProcessing} />
          </div>

          {/* Progress / error */}
          {isProcessing && (
            <div className="flex items-center gap-3 p-3 bg-brand-50 border border-brand-100 rounded-xl">
              <Loader2 className="w-4 h-4 text-brand-600 animate-spin shrink-0" />
              <p className="text-xs text-brand-700">{progress}</p>
            </div>
          )}
          {status === 'done' && (
            <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <p className="text-xs text-emerald-700 font-semibold">{progress}</p>
            </div>
          )}
          {error && (
            <div className="flex items-start gap-3 p-3 bg-rose-50 border border-rose-200 rounded-xl">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-700">{error}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 px-6 py-5 border-t border-border">
          <button type="button" onClick={onClose} disabled={isProcessing} className="btn-secondary flex-1 disabled:opacity-40">Cancel</button>
          <button type="button" onClick={handleIngest} disabled={isProcessing || status === 'done'}
            className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60">
            {isProcessing
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
              : <><Plus className="w-4 h-4" /> Embed & Save</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function KnowledgeBase() {
  const { practice } = useApp();
  const { data: entries, loading, reload } = useKBEntries();
  const [showAdd, setShowAdd] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const syncedCount = entries.filter((k: any) => k.status === 'synced').length;
  const totalChunks = entries.reduce((a: number, k: any) => a + (k.chunk_count ?? 0), 0);

  const handleResync = async (entry: any) => {
    setSyncing(entry.id);
    try {
      // Re-trigger the full ingestion by opening the add modal pre-filled
      // For now mark as pending and reload
      await (supabase as any).from('kb_entries').update({ status: 'pending' }).eq('id', entry.id);
      setTimeout(() => { setSyncing(null); reload(); }, 1500);
    } catch { setSyncing(null); }
  };

  const handleDelete = async (entry: any) => {
    if (!confirm(`Delete "${entry.title}" from your knowledge base?`)) return;
    setDeleting(entry.id);
    try {
      // Delete from Pinecone namespace (best effort)
      const pineconeKey = (import.meta.env as any).VITE_PINECONE_API_KEY;
      const pineconeHost = (import.meta.env as any).VITE_PINECONE_HOST;
      if (pineconeKey && pineconeHost && entry.namespace) {
        // Delete all vectors for this doc from Pinecone
        await fetch(`${pineconeHost}/vectors/delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Api-Key': pineconeKey },
          body: JSON.stringify({ filter: { doc_id: { '$eq': entry.pinecone_doc_id } }, namespace: entry.namespace }),
        });
      }
      await (supabase as any).from('kb_entries').delete().eq('id', entry.id);
      reload();
    } catch (e) { console.error(e); }
    finally { setDeleting(null); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Knowledge Base</h1>
          <p className="page-subtitle">
            Pinecone RAG · {syncedCount}/{entries.length} documents synced · {totalChunks} vectors
          </p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Document
        </button>
      </div>

      {/* NHS eligibility quick ref */}
      <div className="card p-5">
        <h3 className="font-display font-semibold text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <span className="w-6 h-6 rounded-lg bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold">N</span>
          NHS Sight Test Eligibility (England 2025)
        </h3>
        <div className="grid md:grid-cols-2 gap-2">
          {nhsEligibility.map((e: any) => (
            <div key={e.group} className="rounded-xl p-3 border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-col)' }}>
              <p className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>{e.group}</p>
              <p className="text-xs text-muted mt-0.5">{e.detail}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted mt-3">Source: NHS England / GOC. Eligibility criteria apply to England. Different rules apply in Wales, Scotland, and Northern Ireland.</p>
      </div>

      {/* Documents */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Documents</h3>
            <p className="text-xs text-muted mt-0.5">Google Docs → chunked (~500 words) → OpenAI embeddings → Pinecone</p>
          </div>
          <button onClick={reload} className="btn-ghost text-xs py-1.5 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 text-brand-500 animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <div className="py-14 text-center px-6">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-border" />
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>No documents yet</p>
            <p className="text-xs text-muted mt-1 mb-5 max-w-sm mx-auto">
              Fill in the KB template with your practice details, then paste your Google Doc URL here. We chunk it and embed it into Pinecone automatically.
            </p>
            <div className="flex items-center justify-center gap-3">
              <a href="https://docs.google.com/document/d/13zxuTEyhoS5cTsYtOaFpxRRXzVmekHtl/copy?usp=drive_link&ouid=107846856459450315273&rtpof=true&sd=true"
                target="_blank" rel="noreferrer" className="btn-secondary text-xs flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" /> Get template
              </a>
              <button onClick={() => setShowAdd(true)} className="btn-primary text-xs flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add document
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {entries.map((entry: any) => (
              <div key={entry.id} className="px-5 py-4 flex items-center gap-4 hover:bg-[var(--bg-surface)] transition-colors">
                <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-brand-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{entry.title}</p>
                    <span className={cn('badge text-[10px] shrink-0', TYPE_COLORS[entry.type] ?? 'badge-muted')}>
                      {TYPE_LABELS[entry.type] ?? entry.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted flex-wrap">
                    {entry.chunk_count > 0 && <span className="font-medium text-brand-600">{entry.chunk_count} chunks</span>}
                    {entry.word_count ? <span>{entry.word_count.toLocaleString()} words</span> : null}
                    {entry.last_synced && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Synced {formatDate(entry.last_synced)}
                      </span>
                    )}
                    {entry.namespace && <span className="font-mono text-[10px] bg-surface px-1.5 rounded">{entry.namespace}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {entry.status === 'synced' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  {entry.status === 'error' && <AlertCircle className="w-4 h-4 text-rose-500" />}
                  {entry.status === 'pending' && <Clock className="w-4 h-4 text-amber-500 animate-pulse" />}
                  {entry.source_url && (
                    <a href={entry.source_url} target="_blank" rel="noreferrer"
                      className="btn-ghost text-xs py-1.5 px-2" title="Open source doc">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button onClick={() => handleResync(entry)}
                    disabled={syncing === entry.id}
                    className={cn('btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5',
                      entry.status === 'error' && 'border-rose-200 text-rose-600 hover:bg-rose-50')}>
                    <RefreshCw className={cn('w-3 h-3', syncing === entry.id && 'animate-spin')} />
                    {syncing === entry.id ? 'Syncing…' : entry.status === 'error' ? 'Retry' : 'Re-sync'}
                  </button>
                  <button onClick={() => handleDelete(entry)}
                    disabled={deleting === entry.id}
                    className="w-7 h-7 rounded-lg hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center text-muted transition-colors disabled:opacity-40">
                    {deleting === entry.id
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="card p-5" style={{ background: 'var(--bg-surface)' }}>
        <h3 className="font-display font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          💡 What to include in your knowledge base
        </h3>
        <div className="grid md:grid-cols-2 gap-2">
          {[
            'NHS sight test eligibility (all 8 categories)',
            'Private eye test and OCT scan prices',
            'Contact lens range, brands, and monthly costs',
            "Each optometrist's GOC number and specialisms",
            'Myopia management programme details',
            'Dry eye clinic and specialist services',
            'Opening hours, parking, and access info',
            'Spectacle frame brands and price ranges',
            'DNA and cancellation policy',
            'How to request domiciliary eye tests',
          ].map(tip => (
            <div key={tip} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 shrink-0" />{tip}
            </div>
          ))}
        </div>
      </div>

      {showAdd && practice?.id && (
        <AddDocumentModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => { reload(); }}
          practiceId={practice.id}
          namespace={practice.kb_namespace ?? `practice_${practice.id}`}
        />
      )}
    </div>
  );
}
