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

function getEnv(key: string): string {
  return (import.meta.env as Record<string, string | undefined>)[key] ?? '';
}

// Split text into ~500 word overlapping chunks
function chunkText(text: string, size = 500, overlap = 50): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks: string[] = [];
  let i = 0;
  while (i < words.length) {
    const chunk = words.slice(i, i + size).join(' ');
    if (chunk.trim().length > 30) chunks.push(chunk);
    i += size - overlap;
  }
  return chunks;
}

// Fetch Google Doc via Vercel serverless proxy (avoids CORS)
async function fetchGoogleDoc(url: string): Promise<string> {
  const match = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) throw new Error('Not a valid Google Doc URL — it should contain /document/d/YOUR_ID');
  const docId = match[1];

  // Use our Vercel proxy to avoid Google CORS blocks
  const proxyUrl = `/api/fetch-doc?docId=${encodeURIComponent(docId)}`;
  const res = await fetch(proxyUrl);

  if (!res.ok) {
    let msg = `Could not fetch document (${res.status})`;
    try { const j = await res.json(); msg = j.error ?? msg; } catch {}
    throw new Error(msg);
  }

  const text = await res.text();
  if (text.length < 50) throw new Error('Document is empty or not publicly shared. Set sharing to "Anyone with the link → Viewer".');
  return text;
}

// Embed chunks via OpenAI
async function embedChunks(chunks: string[]): Promise<number[][]> {
  const key = getEnv('VITE_OPENAI_API_KEY');
  if (!key) throw new Error('OpenAI API key missing — check Vercel environment variables.');
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({ model: 'text-embedding-ada-002', input: chunks }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`OpenAI error: ${(err as any).error?.message ?? res.status}`);
  }
  const data = await res.json() as { data: { embedding: number[] }[] };
  return data.data.map(d => d.embedding);
}

// Upsert to Pinecone in batches
async function saveToPinecone(
  chunks: string[], embeddings: number[][], docId: string, namespace: string
): Promise<void> {
  const host = getEnv('VITE_PINECONE_HOST');
  const key  = getEnv('VITE_PINECONE_API_KEY');
  if (!host || !key) throw new Error('Pinecone not configured — check Vercel environment variables.');
  const vectors = chunks.map((text, i) => ({
    id: `${docId}_${i}`,
    values: embeddings[i],
    metadata: { text, doc_id: docId, chunk_index: i, namespace },
  }));
  for (let i = 0; i < vectors.length; i += 100) {
    const batch = vectors.slice(i, i + 100);
    const res = await fetch(`${host}/vectors/upsert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Api-Key': key },
      body: JSON.stringify({ vectors: batch, namespace }),
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Pinecone error: ${txt}`);
    }
  }
}

// ── Add Document Modal ────────────────────────────────────────────────────────
function AddDocModal({
  practiceId, namespace, onClose, onDone,
}: {
  practiceId: string; namespace: string;
  onClose: () => void; onDone: () => void;
}) {
  const [url,   setUrl]   = useState('');
  const [title, setTitle] = useState('');
  const [type,  setType]  = useState('general');
  const [step,  setStep]  = useState<'idle'|'fetch'|'embed'|'pinecone'|'save'|'done'|'error'>('idle');
  const [info,  setInfo]  = useState('');
  const [err,   setErr]   = useState('');

  const busy = ['fetch','embed','pinecone','save'].includes(step);

  async function run() {
    if (!url.trim())   { setErr('Paste your Google Doc URL'); return; }
    if (!title.trim()) { setErr('Give this document a title'); return; }
    setErr('');

    try {
      setStep('fetch'); setInfo('Fetching document…');
      const text = await fetchGoogleDoc(url);
      const words = text.split(/\s+/).length;
      const chunks = chunkText(text);
      setInfo(`${chunks.length} chunks from ${words.toLocaleString()} words`);

      setStep('embed'); setInfo(`Embedding ${chunks.length} chunks with OpenAI…`);
      const embeddings = await embedChunks(chunks);

      setStep('pinecone'); setInfo(`Saving ${chunks.length} vectors to Pinecone…`);
      const docId = `${practiceId}_${Date.now()}`;
      await saveToPinecone(chunks, embeddings, docId, namespace);

      setStep('save'); setInfo('Saving to database…');
      const { error: dbErr } = await (supabase as any).from('kb_entries').insert({
        practice_id:    practiceId,
        title,
        type,
        source_url:     url.trim(),
        status:         'synced',
        chunk_count:    chunks.length,
        word_count:     words,
        last_synced:    new Date().toISOString(),
        pinecone_doc_id: docId,
        namespace,
      });
      if (dbErr) throw new Error(dbErr.message);

      setStep('done'); setInfo(`Done! ${chunks.length} chunks saved to Pinecone.`);
      setTimeout(() => { onDone(); onClose(); }, 1800);
    } catch (e: any) {
      setStep('error'); setErr(e.message);
    }
  }

  const stepLabels: Record<string, string> = {
    fetch: '1 / 4 — Fetching Google Doc…',
    embed: '2 / 4 — Generating OpenAI embeddings…',
    pinecone: '3 / 4 — Saving vectors to Pinecone…',
    save: '4 / 4 — Saving to database…',
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="rounded-2xl w-full max-w-md shadow-2xl" style={{ background: 'var(--bg-card)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Add to Knowledge Base</h2>
            <p className="text-xs text-muted mt-0.5">Google Doc → chunks → OpenAI embeddings → Pinecone</p>
          </div>
          <button type="button" onClick={onClose} disabled={busy}
            className="w-8 h-8 rounded-lg hover:bg-[var(--bg-surface)] flex items-center justify-center text-muted disabled:opacity-30 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">

          {/* Checklist */}
          <div className="p-4 rounded-xl border border-brand-100" style={{ background: 'var(--bg-surface)' }}>
            <p className="text-xs font-semibold text-brand-700 mb-2">Before pasting your URL:</p>
            {[
              'Google Doc shared as "Anyone with the link → Viewer"',
              'You filled in your practice details in the template',
              'Copy the /edit link (not /copy)',
            ].map(s => (
              <div key={s} className="flex items-center gap-2 text-xs text-muted mt-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 shrink-0" />{s}
              </div>
            ))}
          </div>

          <div>
            <label className="label">Document Title</label>
            <input className="input" placeholder="e.g. Clariana Opticians — Full Practice Info"
              value={title} onChange={e => setTitle(e.target.value)} disabled={busy} />
          </div>

          <div>
            <label className="label">Document Type</label>
            <select className="input" value={type} onChange={e => setType(e.target.value)} disabled={busy}>
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
                <ExternalLink className="w-3 h-3" /> Get template
              </a>
            </div>
            <input className="input font-mono text-xs"
              placeholder="https://docs.google.com/document/d/YOUR_DOC_ID/edit"
              value={url} onChange={e => setUrl(e.target.value)} disabled={busy} />
          </div>

          {/* Progress */}
          {busy && (
            <div className="flex items-center gap-3 p-3 bg-brand-50 border border-brand-200 rounded-xl">
              <Loader2 className="w-4 h-4 text-brand-600 animate-spin shrink-0" />
              <div>
                <p className="text-xs font-semibold text-brand-700">{stepLabels[step]}</p>
                <p className="text-xs text-brand-600 mt-0.5">{info}</p>
              </div>
            </div>
          )}
          {step === 'done' && (
            <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <p className="text-xs font-semibold text-emerald-700">{info}</p>
            </div>
          )}
          {err && (
            <div className="flex items-start gap-3 p-3 bg-rose-50 border border-rose-200 rounded-xl">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-rose-700 mb-0.5">Error</p>
                <p className="text-xs text-rose-600">{err}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-border">
          <button type="button" onClick={onClose} disabled={busy} className="btn-secondary flex-1 disabled:opacity-40">
            Cancel
          </button>
          <button type="button" onClick={run} disabled={busy || step === 'done'}
            className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60">
            {busy
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
              : <><Plus className="w-4 h-4" /> Embed & Save</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function KnowledgeBase() {
  const { practice } = useApp();
  const { data: entries, loading, reload } = useKBEntries();
  const [showAdd,  setShowAdd]  = useState(false);
  const [syncing,  setSyncing]  = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const syncedCount = entries.filter((k: any) => k.status === 'synced').length;
  const totalChunks = entries.reduce((a: number, k: any) => a + (k.chunk_count ?? 0), 0);

  const handleResync = async (entry: any) => {
    setSyncing(entry.id);
    await (supabase as any).from('kb_entries').update({ status: 'pending' }).eq('id', entry.id);
    setTimeout(() => { setSyncing(null); reload(); }, 1000);
  };

  const handleDelete = async (entry: any) => {
    if (!confirm(`Delete "${entry.title}"?`)) return;
    setDeleting(entry.id);
    try {
      // Delete from Pinecone
      const host = getEnv('VITE_PINECONE_HOST');
      const key  = getEnv('VITE_PINECONE_API_KEY');
      if (host && key && entry.pinecone_doc_id) {
        await fetch(`${host}/vectors/delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Api-Key': key },
          body: JSON.stringify({
            filter: { doc_id: { '$eq': entry.pinecone_doc_id } },
            namespace: entry.namespace,
          }),
        });
      }
      await (supabase as any).from('kb_entries').delete().eq('id', entry.id);
      reload();
    } catch (e) { console.error(e); }
    finally { setDeleting(null); }
  };

  // Use practice namespace or fallback
  const namespace = (practice as any)?.kb_namespace ?? `practice_${practice?.id ?? 'default'}`;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Knowledge Base</h1>
          <p className="page-subtitle">
            Pinecone RAG · {syncedCount}/{entries.length} docs synced · {totalChunks} vectors
          </p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Document
        </button>
      </div>

      {/* NHS eligibility */}
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
        <p className="text-[11px] text-muted mt-3">Source: NHS England / GOC. Different rules apply in Wales, Scotland, and Northern Ireland.</p>
      </div>

      {/* Documents list */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Documents</h3>
            <p className="text-xs text-muted mt-0.5">Google Doc → chunked (~500 words) → OpenAI embeddings → Pinecone</p>
          </div>
          <button onClick={reload} className="btn-ghost text-xs py-1 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-14">
            <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <div className="py-14 text-center px-6">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-border" />
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>No documents yet</p>
            <p className="text-xs text-muted mt-1 mb-6 max-w-sm mx-auto">
              Fill in the KB template with your practice details, then paste your Google Doc URL here.
              We chunk it and embed it into Pinecone automatically.
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
                    {entry.chunk_count > 0 && <span className="font-semibold text-brand-600">{entry.chunk_count} chunks</span>}
                    {entry.word_count   > 0 && <span>{entry.word_count.toLocaleString()} words</span>}
                    {entry.last_synced && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Synced {formatDate(entry.last_synced)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {entry.status === 'synced'  && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  {entry.status === 'error'   && <AlertCircle  className="w-4 h-4 text-rose-500" />}
                  {entry.status === 'pending' && <Clock        className="w-4 h-4 text-amber-500 animate-pulse" />}
                  {entry.source_url && (
                    <a href={entry.source_url} target="_blank" rel="noreferrer"
                      className="btn-ghost text-xs py-1 px-2" title="Open source doc">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button onClick={() => handleResync(entry)} disabled={syncing === entry.id}
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 disabled:opacity-50">
                    <RefreshCw className={cn('w-3 h-3', syncing === entry.id && 'animate-spin')} />
                    {syncing === entry.id ? 'Marking…' : 'Re-sync'}
                  </button>
                  <button onClick={() => handleDelete(entry)} disabled={deleting === entry.id}
                    className="w-8 h-8 rounded-lg hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center text-muted transition-colors disabled:opacity-40">
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
        <h3 className="font-display font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
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
            <div key={tip} className="flex items-center gap-2 text-xs text-muted">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 shrink-0" />{tip}
            </div>
          ))}
        </div>
      </div>

      {/* Modal — always render if showAdd, use fallback if practice not loaded yet */}
      {showAdd && (
        <AddDocModal
          practiceId={practice?.id ?? 'unknown'}
          namespace={namespace}
          onClose={() => setShowAdd(false)}
          onDone={reload}
        />
      )}
    </div>
  );
}
