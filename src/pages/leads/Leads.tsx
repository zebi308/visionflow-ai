import { useState } from 'react';
import { Target, TrendingUp, Search, Star, Phone, Calendar } from 'lucide-react';
import { mockLeads, leadCategoryLabels } from '../../constants';
import { cn, formatDate } from '../../lib/utils';
import type { LeadStatus } from '../../types';

const STATUS_STYLES: Record<LeadStatus, string> = {
  new:       'badge-amber',
  contacted: 'badge-brand',
  qualified: 'badge-violet',
  converted: 'badge-green',
  lost:      'badge-rose',
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-400' : 'bg-rose-400';
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-surface rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-semibold text-ink">{score}</span>
    </div>
  );
}

export default function Leads() {
  const [search, setSearch] = useState('');
  const filtered = mockLeads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.phone.includes(search) ||
    l.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Leads</h1>
          <p className="page-subtitle">AI-categorised patient enquiries</p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: mockLeads.length, icon: Target, color: 'text-brand-600', bg: 'bg-brand-50' },
          { label: 'High Intent (80+)', value: mockLeads.filter(l => l.score >= 80).length, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Converted', value: mockLeads.filter(l => l.status === 'converted').length, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'NHS Eligible', value: mockLeads.filter(l => l.isNhsEligible).length, icon: Phone, color: 'text-violet-600', bg: 'bg-violet-50' },
        ].map(s => (
          <div key={s.label} className="card p-4 flex items-center gap-3">
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', s.bg)}>
              <s.icon className={cn('w-4 h-4', s.color)} />
            </div>
            <div>
              <p className="text-xl font-display font-bold text-ink">{s.value}</p>
              <p className="text-xs text-muted">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted/60" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search leads…"
              className="input pl-9 py-2 text-xs"
            />
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="table-head text-left">Patient</th>
              <th className="table-head text-left">Category</th>
              <th className="table-head text-left">Lead Score</th>
              <th className="table-head text-left">Summary</th>
              <th className="table-head text-left">Last Contact</th>
              <th className="table-head text-left">Status</th>
              <th className="table-head text-left">NHS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(lead => (
              <tr key={lead.id} className="table-row">
                <td className="table-cell">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center text-violet-700 font-bold text-xs">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-ink text-sm">{lead.name}</p>
                      <p className="text-xs text-muted">{lead.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="table-cell">
                  <span className="badge badge-brand">
                    {leadCategoryLabels[lead.category] || lead.category}
                  </span>
                </td>
                <td className="table-cell">
                  <ScoreBar score={lead.score} />
                </td>
                <td className="table-cell max-w-xs">
                  <p className="text-xs text-muted truncate">{lead.summary}</p>
                </td>
                <td className="table-cell">
                  <div className="flex items-center gap-1 text-xs text-muted">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(lead.lastContact)}
                  </div>
                </td>
                <td className="table-cell">
                  <span className={cn('badge', STATUS_STYLES[lead.status])}>
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </span>
                </td>
                <td className="table-cell">
                  {lead.isNhsEligible ? (
                    <span className="badge badge-green">NHS</span>
                  ) : (
                    <span className="badge badge-muted">Private</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
