import { useState } from 'react';
import { Zap, Users, Building2, TrendingUp, Activity, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';

const mockPractices = [
  { id: '1', name: 'ClearView Opticians', city: 'Leeds', plan: 'growth', conversations: 312, status: 'active' },
  { id: '2', name: 'Maple Eye Care', city: 'Manchester', plan: 'practice', conversations: 891, status: 'active' },
  { id: '3', name: 'London Vision Centre', city: 'London', plan: 'starter', conversations: 143, status: 'active' },
  { id: '4', name: 'Bristol Opticians', city: 'Bristol', plan: 'growth', conversations: 245, status: 'trial' },
  { id: '5', name: 'Caledonian Eye Clinic', city: 'Edinburgh', plan: 'starter', conversations: 67, status: 'trial' },
];

const PLAN_BADGE: Record<string, string> = {
  starter:    'badge-muted',
  growth:     'badge-brand',
  practice:   'badge-violet',
  enterprise: 'badge-amber',
};

export default function SuperAdmin() {
  const [search, setSearch] = useState('');

  const filtered = mockPractices.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.city.toLowerCase().includes(search.toLowerCase())
  );

  const mrr = mockPractices.reduce((sum, p) => {
    const prices: Record<string, number> = { starter: 79, growth: 149, practice: 299, enterprise: 599 };
    return sum + (prices[p.plan] || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-ink">VisionFlow Admin</h1>
            <p className="text-xs text-muted">Super administrator panel</p>
          </div>
          <div className="ml-auto">
            <span className="badge badge-rose flex items-center gap-1">
              <Shield className="w-3 h-3" /> Admin Only
            </span>
          </div>
        </div>

        {/* Platform stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Active Practices', value: mockPractices.filter(p => p.status === 'active').length, icon: Building2, color: 'text-brand-600', bg: 'bg-brand-50' },
            { label: 'Monthly Recurring Revenue', value: `£${mrr}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Total Conversations', value: mockPractices.reduce((a, p) => a + p.conversations, 0), icon: Activity, color: 'text-violet-600', bg: 'bg-violet-50' },
            { label: 'Trials Active', value: mockPractices.filter(p => p.status === 'trial').length, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
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

        {/* Practices table */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-display font-semibold text-ink text-sm">All Practices</h3>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search practices…"
              className="input w-48 py-1.5 text-xs"
            />
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="table-head text-left">Practice</th>
                <th className="table-head text-left">City</th>
                <th className="table-head text-left">Plan</th>
                <th className="table-head text-left">Conversations</th>
                <th className="table-head text-left">Status</th>
                <th className="table-head text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="table-row">
                  <td className="table-cell font-semibold text-ink">{p.name}</td>
                  <td className="table-cell text-muted">{p.city}</td>
                  <td className="table-cell">
                    <span className={cn('badge', PLAN_BADGE[p.plan])}>
                      {p.plan.charAt(0).toUpperCase() + p.plan.slice(1)}
                    </span>
                  </td>
                  <td className="table-cell text-muted">{p.conversations.toLocaleString()}</td>
                  <td className="table-cell">
                    <span className={cn('badge', p.status === 'active' ? 'badge-green' : 'badge-amber')}>
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </span>
                  </td>
                  <td className="table-cell">
                    <button className="btn-ghost text-xs py-1 px-2">Impersonate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
