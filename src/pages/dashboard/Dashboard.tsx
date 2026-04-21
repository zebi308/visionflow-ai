import { MessageSquare, Calendar, Target, ShieldAlert, TrendingUp, Bot, Clock, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useApp } from '../../context/AppContext';
import { mockAnalytics, mockAppointments, mockConversations, mockEscalations } from '../../constants';
import { cn, formatDate } from '../../lib/utils';

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'badge-green', pending: 'badge-amber',
  completed: 'badge-muted', cancelled: 'badge-rose', dna: 'badge-rose',
};
const PIE_COLORS = ['#1aa18d', '#35bda7', '#6dd7c3', '#a8e9db', '#d2f4ed'];

export default function Dashboard() {
  const { user, practice } = useApp();
  const a = mockAnalytics;

  const stats = [
    { label: 'AI-Handled Rate', value: `${Math.round(a.aiHandledRate * 100)}%`, sub: 'of all conversations', icon: Bot, color: 'text-brand-600', bg: 'bg-brand-50', trend: '+4% vs last month' },
    { label: 'Bookings This Month', value: a.bookingsThisMonth, sub: 'via WhatsApp & Voice AI', icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12 vs last month' },
    { label: 'Total Conversations', value: a.totalConversations, sub: 'this month', icon: MessageSquare, color: 'text-violet-600', bg: 'bg-violet-50', trend: '+23% vs last month' },
    { label: 'Avg Response Time', value: a.avgResponseTime, sub: 'median first reply', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'Down from 4m manual' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Good morning, {user?.name.split(' ')[0]} 👋</h1>
          <p className="page-subtitle">{practice?.name} · {practice?.city} · {practice?.type}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-green"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />AI Active</span>
          <span className="badge badge-brand">{practice?.plan?.charAt(0).toUpperCase()}{practice?.plan?.slice(1)} Plan</span>
        </div>
      </div>

      {/* GOC reminder */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-center gap-4">
        <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
          <TrendingUp className="w-4 h-4 text-amber-700" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-900">NHS sight test fee reminder — April 2025</p>
          <p className="text-xs text-amber-700 mt-0.5">Standard NHS sight test: £0 (patient-funded categories only). Ensure your knowledge base reflects current GOC-compliant eligibility criteria.</p>
        </div>
        <button className="btn-secondary text-xs py-1.5 px-3 shrink-0">Update KB</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', s.bg)}>
              <s.icon className={cn('w-4 h-4', s.color)} />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-ink">{s.value}</p>
              <p className="text-xs text-muted mt-0.5">{s.label}</p>
            </div>
            <p className="text-[11px] font-medium text-emerald-600">{s.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-semibold text-ink text-sm">Weekly Activity</h3>
              <p className="text-xs text-muted mt-0.5">Conversations, bookings & escalations</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={a.dailyStats} barGap={3}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 12 }} cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="conversations" name="Conversations" fill="#1aa18d" radius={[4,4,0,0]} />
              <Bar dataKey="bookings" name="Bookings" fill="#6dd7c3" radius={[4,4,0,0]} />
              <Bar dataKey="escalations" name="Escalations" fill="#fbbf24" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-display font-semibold text-ink text-sm mb-1">Enquiry Categories</h3>
          <p className="text-xs text-muted mb-4">This month's breakdown</p>
          <div className="flex justify-center mb-4">
            <PieChart width={140} height={140}>
              <Pie data={a.topLeadCategories} dataKey="value" cx={65} cy={65} innerRadius={42} outerRadius={65} paddingAngle={3}>
                {a.topLeadCategories.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
            </PieChart>
          </div>
          <div className="space-y-2">
            {a.topLeadCategories.map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-xs text-muted">{cat.name}</span>
                </div>
                <span className="text-xs font-semibold text-ink">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-display font-semibold text-ink text-sm">Today's Appointments</h3>
            <button className="btn-ghost text-xs py-1">View all</button>
          </div>
          <div className="divide-y divide-border">
            {mockAppointments.slice(0, 4).map(apt => (
              <div key={apt.id} className="px-5 py-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                  <Eye className="w-4 h-4 text-brand-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{apt.patientName}</p>
                  <p className="text-xs text-muted">{apt.time} · {apt.service}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={cn('badge text-[10px]', STATUS_COLORS[apt.status])}>
                    {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                  </span>
                  <p className="text-[10px] text-muted mt-1">{apt.nhsFunded ? 'NHS' : 'Private'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-display font-semibold text-ink text-sm">Open Escalations</h3>
            <span className="badge badge-rose">{mockEscalations.filter(e => e.status === 'open').length} urgent</span>
          </div>
          <div className="divide-y divide-border">
            {mockEscalations.map(esc => (
              <div key={esc.id} className="px-5 py-3.5 flex items-center gap-3">
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
                  esc.status === 'open' ? 'bg-rose-50' : esc.status === 'in-progress' ? 'bg-amber-50' : 'bg-emerald-50')}>
                  <ShieldAlert className={cn('w-4 h-4',
                    esc.status === 'open' ? 'text-rose-500' : esc.status === 'in-progress' ? 'text-amber-600' : 'text-emerald-600')} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{esc.patientName}</p>
                  <p className="text-xs text-muted truncate">{esc.summary.slice(0, 60)}…</p>
                </div>
                <span className={cn('badge text-[10px] shrink-0',
                  esc.status === 'open' ? 'badge-rose' : esc.status === 'in-progress' ? 'badge-amber' : 'badge-green')}>
                  {esc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-5 flex items-center gap-6">
        <Eye className="w-5 h-5 text-brand-600 shrink-0" />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-ink">NHS vs Private Patient Enquiries</span>
            <span className="text-xs text-muted">{a.nhsVsPrivate.nhs}% NHS · {a.nhsVsPrivate.private}% Private</span>
          </div>
          <div className="h-2.5 rounded-full bg-surface overflow-hidden flex">
            <div className="bg-brand-600 transition-all duration-500" style={{ width: `${a.nhsVsPrivate.nhs}%` }} />
            <div className="bg-violet-400 flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
