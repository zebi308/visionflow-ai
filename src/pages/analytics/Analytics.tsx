import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, Bot, Calendar, Clock, Users, MessageSquare } from 'lucide-react';
import { mockAnalytics } from '../../constants';

const PIE_COLORS = ['#1aa18d', '#35bda7', '#6dd7c3', '#a8e9db', '#d2f4ed'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-border rounded-xl px-3 py-2 shadow-lg text-xs">
        <p className="font-semibold text-ink mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const a = mockAnalytics;

  const kpis = [
    { label: 'AI-Handled Rate', value: `${Math.round(a.aiHandledRate * 100)}%`, icon: Bot, color: 'text-brand-600', bg: 'bg-brand-50', desc: 'conversations resolved without staff' },
    { label: 'Total Conversations', value: a.totalConversations, icon: MessageSquare, color: 'text-violet-600', bg: 'bg-violet-50', desc: 'this month' },
    { label: 'AI-Booked Appointments', value: a.bookingsThisMonth, icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50', desc: 'via WhatsApp this month' },
    { label: 'Avg First Response', value: a.avgResponseTime, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', desc: 'vs ~4 min manual' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Performance overview — April 2025</p>
        </div>
        <select className="input w-auto py-2 text-xs">
          <option>Last 30 days</option>
          <option>Last 7 days</option>
          <option>This quarter</option>
        </select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="card p-5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${k.bg}`}>
              <k.icon className={`w-4 h-4 ${k.color}`} />
            </div>
            <p className="text-2xl font-display font-bold text-ink">{k.value}</p>
            <p className="text-xs font-semibold text-ink mt-0.5">{k.label}</p>
            <p className="text-[11px] text-muted mt-0.5">{k.desc}</p>
          </div>
        ))}
      </div>

      {/* Weekly activity */}
      <div className="card p-5">
        <h3 className="font-display font-semibold text-ink text-sm mb-1">Weekly Conversation Activity</h3>
        <p className="text-xs text-muted mb-5">Conversations, bookings and escalations by day</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={a.dailyStats} barGap={4} barCategoryGap="30%">
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 16 }} />
            <Bar dataKey="conversations" name="Conversations" fill="#1aa18d" radius={[4, 4, 0, 0]} />
            <Bar dataKey="bookings"      name="Bookings"      fill="#6dd7c3" radius={[4, 4, 0, 0]} />
            <Bar dataKey="escalations"   name="Escalations"   fill="#fbbf24" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Two-column charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Lead breakdown */}
        <div className="card p-5">
          <h3 className="font-display font-semibold text-ink text-sm mb-1">Enquiry Categories</h3>
          <p className="text-xs text-muted mb-5">What patients are asking about</p>
          <div className="flex items-center gap-6">
            <PieChart width={160} height={160}>
              <Pie
                data={a.topLeadCategories} dataKey="value"
                cx={75} cy={75} innerRadius={48} outerRadius={72} paddingAngle={3}
              >
                {a.topLeadCategories.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
            <div className="space-y-2.5 flex-1">
              {a.topLeadCategories.map((cat, i) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i] }} />
                    <span className="text-xs text-muted">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-surface rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${cat.value}%`, background: PIE_COLORS[i] }} />
                    </div>
                    <span className="text-xs font-semibold text-ink w-7 text-right">{cat.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* NHS vs Private */}
        <div className="card p-5">
          <h3 className="font-display font-semibold text-ink text-sm mb-1">NHS vs Private Mix</h3>
          <p className="text-xs text-muted mb-5">Patient enquiry breakdown</p>
          <div className="flex items-center justify-center mb-6">
            <PieChart width={160} height={160}>
              <Pie
                data={[
                  { name: 'NHS', value: a.nhsVsPrivate.nhs },
                  { name: 'Private', value: a.nhsVsPrivate.private },
                ]}
                dataKey="value" cx={75} cy={75} innerRadius={48} outerRadius={72} paddingAngle={3}
              >
                <Cell fill="#1aa18d" />
                <Cell fill="#8b5cf6" />
              </Pie>
            </PieChart>
          </div>
          <div className="space-y-3">
            {[
              { label: 'NHS Enquiries', value: a.nhsVsPrivate.nhs, color: '#1aa18d', bg: 'bg-brand-50' },
              { label: 'Private Enquiries', value: a.nhsVsPrivate.private, color: '#8b5cf6', bg: 'bg-violet-50' },
            ].map(item => (
              <div key={item.label} className={`rounded-xl p-3 ${item.bg} flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                  <span className="text-xs font-semibold text-ink">{item.label}</span>
                </div>
                <span className="text-lg font-display font-bold text-ink">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROI callout */}
      <div className="card p-6 bg-ink text-white border-ink">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-display font-bold text-lg mb-1">Estimated time saved this month</h3>
            <p className="text-slate-400 text-sm">Based on {a.totalConversations} conversations at avg 4 min manual handling time</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-display font-bold text-brand-400">{Math.round(a.totalConversations * 4 / 60)}h</p>
            <p className="text-slate-400 text-sm mt-1">≈ {Math.round(a.totalConversations * 4 / 60 / 7.5)} receptionist days</p>
          </div>
        </div>
      </div>
    </div>
  );
}
