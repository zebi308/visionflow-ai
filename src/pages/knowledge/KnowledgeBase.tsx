import { useState } from 'react';
import { BookOpen, Plus, RefreshCw, CheckCircle2, AlertCircle, Clock, FileText } from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';
import { nhsEligibility } from '../../constants';
import type { KBEntry } from '../../types';

const mockKB: KBEntry[] = [];

const TYPE_LABELS: Record<string, string> = {
  'faq':'FAQ','pricing':'Pricing','policy':'Policy','optometrist-bio':'Optometrist Bio',
  'nhs-info':'NHS Info','eye-health-guide':'Eye Health','product-info':'Product Info',
};
const TYPE_COLORS: Record<string, string> = {
  'faq':'badge-brand','pricing':'badge-green','policy':'badge-muted',
  'optometrist-bio':'badge-violet','nhs-info':'badge-amber',
  'eye-health-guide':'badge-brand','product-info':'badge-green',
};

export default function KnowledgeBase() {
  const [syncing, setSyncing] = useState<string|null>(null);
  const syncedCount = mockKB.filter(k=>k.status==='synced').length;
  const totalChunks = mockKB.reduce((a,k)=>a+k.chunkCount,0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Knowledge Base</h1>
          <p className="page-subtitle">Pinecone RAG · {syncedCount}/{mockKB.length} documents synced · {totalChunks} vectors</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Add Document</button>
      </div>

      {/* NHS eligibility quick ref */}
      <div className="card p-5">
        <h3 className="font-display font-semibold text-ink text-sm mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold">N</span>
          NHS Sight Test Eligibility (England 2025)
        </h3>
        <div className="grid md:grid-cols-2 gap-2">
          {nhsEligibility.map(e => (
            <div key={e.group} className="bg-surface rounded-xl p-3 border border-border">
              <p className="font-semibold text-ink text-xs">{e.group}</p>
              <p className="text-xs text-muted mt-0.5">{e.detail}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted mt-3">Source: NHS England / GOC. Eligibility criteria apply to England. Different rules apply in Wales, Scotland, and Northern Ireland.</p>
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-display font-semibold text-ink text-sm">Documents</h3>
          <p className="text-xs text-muted">Google Docs → chunked → Pinecone</p>
        </div>
        <div className="divide-y divide-border">
          {mockKB.map(entry => (
            <div key={entry.id} className="px-5 py-4 flex items-center gap-4 hover:bg-surface/50 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-brand-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-ink truncate">{entry.title}</p>
                  <span className={cn('badge text-[10px] shrink-0', TYPE_COLORS[entry.type])}>{TYPE_LABELS[entry.type]}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted">
                  {entry.chunkCount > 0 && <span>{entry.chunkCount} chunks</span>}
                  {entry.wordCount ? <span>{entry.wordCount.toLocaleString()} words</span> : null}
                  {entry.lastSynced && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Synced {formatDate(entry.lastSynced)}</span>}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {entry.status === 'synced' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                {entry.status === 'error' && <AlertCircle className="w-4 h-4 text-rose-500" />}
                {entry.status === 'pending' && <Clock className="w-4 h-4 text-amber-500" />}
                <button onClick={() => { setSyncing(entry.id); setTimeout(()=>setSyncing(null),2000); }}
                  className={cn('btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5', entry.status==='error' && 'border-rose-200 text-rose-600 hover:bg-rose-50')}>
                  <RefreshCw className={cn('w-3 h-3', syncing===entry.id && 'animate-spin')} />
                  {syncing===entry.id ? 'Syncing…' : entry.status==='error' ? 'Retry' : 'Re-sync'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5 bg-brand-50 border-brand-100">
        <h3 className="font-display font-semibold text-brand-800 text-sm mb-3">💡 What to include in your knowledge base</h3>
        <div className="grid md:grid-cols-2 gap-2">
          {[
            'NHS sight test eligibility (all 8 categories)',
            'Private eye test and OCT scan prices',
            'Contact lens range, brands, and monthly costs',
            'Each optometrist\'s GOC number and specialisms',
            'Myopia management programme details',
            'Dry eye clinic and specialist services',
            'Opening hours, parking, and access info',
            'Spectacle frame brands and price ranges',
            'DNA and cancellation policy',
            'How to request domiciliary eye tests',
          ].map(tip => (
            <div key={tip} className="flex items-center gap-2 text-xs text-brand-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />{tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
