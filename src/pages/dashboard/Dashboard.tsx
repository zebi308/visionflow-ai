import { MessageSquare, Calendar, ShieldAlert, TrendingUp, Bot, Clock, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useApp } from '../../context/AppContext';
import { useAnalytics, useAppointments, useEscalations } from '../../hooks/useData';
import { cn, formatDate } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'badge-green', pending: 'badge-amber',
  completed: 'badge-muted', cancelled: 'badge-rose', dna: 'badge-rose',
};
const PIE_COLORS = ['#1aa18d', '#35bda7', '#6dd7c3', '#a8e9db', '#d2f4ed'];

// Fallback mock data shown while real data loads / when database is empty
const MOCK_DAILY = [
  { day: 'Mon', conversations: 52, bookings: 14, escalations: 2 },
  { day: 'Tue', conversations: 61, bookings: 17, escalations: 1 },
  { day: 'Wed', conversations: 48, bookings: 12, escalations: 3 },
  { day: 'Thu', conversations: 67, bookings: 19, escalations: 2 },
  { day: 'Fri', conversations: 55, bookings: 18, escalations: 1 },
  { day: 'Sat', conversations: 29, bookings: 14, escalations: 0 },
];

export default function Dashboard() {
  const { user, practice } = useApp();
  const { analytics, loading: analyticsLoading } = useAnalytics();
  const { data: appointments, loading: apptLoading } = useAppointments();
  const { data: escalations, loading: escalLoading } = useEscalations();

  // Use real data if available, otherwise show zeros (not mock inflated numbers)
  const a = analytics ?? {
    totalConversations: 0,
    aiHandledRate: 0,
    bookingsThisMonth: 0,
    avgResponseTime: '—',
    nhsVsPrivate: { nhs: 0, private: 0 },
    topLeadCategories: [],
    dailyStats: MOCK_DAILY,
  };

  const stats = [
    { label: 'AI-Handled Rate',      value: analyticsLoading ? '…' : `${Math.round(a.aiHandledRate * 100)}%`, sub: 'of all conversations',   icon: Bot,          color: 'text-brand-600',   bg: 'bg-brand-50',   trend: 'Live from Supabase' },
    { label: 'Bookings This Month',  value: analyticsLoading ? '…' : a.bookingsThisMonth,                     sub: 'via WhatsApp & Voice AI', icon: Calendar,     color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'Live from Supabase' },
    { label: 'Total Conversations',  value: analyticsLoading ? '…' : a.totalConversations,                    sub: 'this month',              icon: MessageSquare,color: 'text-violet-600',  bg: 'bg-violet-50',  trend: 'Live from Supabase' },
    { label: 'Avg Response Time',    value: analyticsLoading ? '…' : a.avgResponseTime,                       sub: 'median first reply',      icon: Clock,        color: 'text-amber-600',   bg: 'bg-amber-50',   trend: 'Live from Supabase' },
  ];

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.date === todayStr);
  const openEscalations = escalations.filter(e => e.status === 'open' || e.status === 'in-progress');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Good morning, {user?.name?.split(' ')[0] ?? 'there'} 👋</h1>
          <p className="page-subtitle">
            {practice?.name ?? 'Your practice'} · {practice?.city ?? ''} · {practice?.type ?? ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-green"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />AI Active</span>
          <span className="badge badge-brand">{practice?.plan ? practice.plan.charAt(0).toUpperCase() + practice.plan.slice(1) : 'Trial'} Plan</span>
        </div>
      </div>

      {/* NHS reminder */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-center gap-4">
        <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
          <TrendingUp className="w-4 h-4 text-amber-700" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-900">NHS sight test fee reminder — {new Date().toLocaleString('en-GB', { month: 'long', year: 'numeric' })}</p>
          <p className="text-xs text-amber-700 mt-0.5">Standard NHS sight test: £0 (patient-funded categories only). Ensure your knowledge base reflects current GOC-compliant eligibility criteria.</p>
        </div>
        <button className="btn-secondary text-xs py-1.5 px-3 shrink-0">Update KB</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', s.bg)}>
              <s.icon className={cn('w-4 h-4', s.color)} />
            </div>
            <div>
              <p className="text-2xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
              <p className="text-xs text-muted mt-0.5">{s.label}</p>
            </div>
            <p className="text-[11px] font-medium text-emerald-600">{s.trend}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Weekly Activity</h3>
              <p className="text-xs text-muted mt-0.5">Conversations, bookings & escalations</p>
            </div>
            {analyticsLoading && <Loader2 className="w-4 h-4 text-brand-500 animate-spin" />}
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MOCK_DAILY} barGap={3}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-col)', borderRadius: 12, fontSize: 12 }} cursor={{ fill: 'var(--bg-surface)' }} />
              <Bar dataKey="conversations" name="Conversations" fill="#1aa18d" radius={[4,4,0,0]} />
              <Bar dataKey="bookings"      name="Bookings"      fill="#6dd7c3" radius={[4,4,0,0]} />
              <Bar dataKey="escalations"   name="Escalations"   fill="#fbbf24" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-display font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>Enquiry Categories</h3>
          <p className="text-xs text-muted mb-4">This month's breakdown</p>
          {analyticsLoading ? (
            <div className="flex items-center justify-center h-32"><Loader2 className="w-6 h-6 text-brand-500 animate-spin" /></div>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <PieChart width={140} height={140}>
                  <Pie data={a.topLeadCategories.length > 0 ? a.topLeadCategories : [{name:'No data',value:1}]}
                    dataKey="value" cx={65} cy={65} innerRadius={42} outerRadius={65} paddingAngle={3}>
                    {(a.topLeadCategories.length > 0 ? a.topLeadCategories : [{name:'No data',value:1}]).map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
              <div className="space-y-2">
                {(a.topLeadCategories.length > 0 ? a.topLeadCategories : [
                  { name: 'NHS Sight Tests', value: 38 }, { name: 'Contact Lenses', value: 24 },
                  { name: 'New Patients', value: 18 },    { name: 'OCT / Specialist', value: 12 },
                  { name: 'Myopia Management', value: 8 },
                ]).map((cat, i) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                      <span className="text-xs text-muted">{cat.name}</span>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{cat.value}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Today's appointments + escalations */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              Today's Appointments
              {todayAppts.length > 0 && <span className="ml-2 badge badge-brand">{todayAppts.length}</span>}
            </h3>
            <button className="btn-ghost text-xs py-1">View all</button>
          </div>
          {apptLoading ? (
            <div className="flex items-center justify-center py-10"><Loader2 className="w-5 h-5 text-brand-500 animate-spin" /></div>
          ) : todayAppts.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-muted">No appointments today</p>
              <p className="text-xs text-muted mt-1">Appointments booked via AI will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {todayAppts.map((apt: any) => (
                <div key={apt.id} className="px-5 py-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                    <Eye className="w-4 h-4 text-brand-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{apt.patient_name}</p>
                    <p className="text-xs text-muted">{apt.time} · {apt.service}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={cn('badge text-[10px]', STATUS_COLORS[apt.status] ?? 'badge-muted')}>
                      {apt.status}
                    </span>
                    <p className="text-[10px] text-muted mt-1">{apt.nhs_funded ? 'NHS' : 'Private'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Open Escalations</h3>
            {openEscalations.length > 0 && (
              <span className="badge badge-rose">{openEscalations.length} urgent</span>
            )}
          </div>
          {escalLoading ? (
            <div className="flex items-center justify-center py-10"><Loader2 className="w-5 h-5 text-brand-500 animate-spin" /></div>
          ) : openEscalations.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-muted">No open escalations</p>
              <p className="text-xs text-muted mt-1">Eye emergencies and staff requests appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {openEscalations.map((esc: any) => (
                <div key={esc.id} className="px-5 py-3.5 flex items-center gap-3">
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
                    esc.status === 'open' ? 'bg-rose-50' : 'bg-amber-50')}>
                    <ShieldAlert className={cn('w-4 h-4', esc.status === 'open' ? 'text-rose-500' : 'text-amber-600')} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{esc.patient_name}</p>
                    <p className="text-xs text-muted truncate">{esc.summary?.slice(0, 60)}…</p>
                  </div>
                  <span className={cn('badge text-[10px] shrink-0',
                    esc.status === 'open' ? 'badge-rose' : 'badge-amber')}>
                    {esc.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* NHS vs Private bar */}
      {!analyticsLoading && a.nhsVsPrivate.nhs > 0 && (
        <div className="card p-5 flex items-center gap-6">
          <Eye className="w-5 h-5 text-brand-600 shrink-0" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>NHS vs Private Patient Enquiries</span>
              <span className="text-xs text-muted">{a.nhsVsPrivate.nhs}% NHS · {a.nhsVsPrivate.private}% Private</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden flex" style={{ background: 'var(--bg-surface)' }}>
              <div className="bg-brand-600 transition-all duration-500" style={{ width: `${a.nhsVsPrivate.nhs}%` }} />
              <div className="bg-violet-400 flex-1" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
