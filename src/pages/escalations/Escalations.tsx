import { useState } from 'react';
import { ShieldAlert, Clock, CheckCircle2, User, Phone, AlertTriangle, MessageSquare } from 'lucide-react';
import { cn, timeAgo } from '../../lib/utils';
import type { EscalationReason, Escalation } from '../../types';

const REASON_LABELS: Record<EscalationReason, string> = {
  'human-request':'Requested Staff','eye-emergency':'Eye Emergency',
  'complaint':'Complaint','medical-urgency':'Medical Urgency',
  'frustration':'Patient Frustrated','complex-query':'Complex Query','clinical-question':'Clinical Question',
};
const REASON_STYLES: Record<EscalationReason, string> = {
  'human-request':'badge-brand','eye-emergency':'badge-rose','complaint':'badge-amber',
  'medical-urgency':'badge-rose','frustration':'badge-amber','complex-query':'badge-muted','clinical-question':'badge-violet',
};
const STATUS_STYLES = { open:'badge-rose', 'in-progress':'badge-amber', resolved:'badge-green' };

export default function Escalations() {
  const [items, setItems] = useState<Escalation[]>([]);
  const resolve = (id: string) => setItems(prev => prev.map(e => e.id===id ? {...e, status:'resolved' as const} : e));
  const open = items.filter(e=>e.status==='open').length;
  const inProgress = items.filter(e=>e.status==='in-progress').length;
  const resolved = items.filter(e=>e.status==='resolved').length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="page-header">
        <div><h1 className="page-title">Escalations</h1><p className="page-subtitle">Cases the AI has handed off to your clinical team</p></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[{label:'Open',value:open,color:'text-rose-600'},{label:'In Progress',value:inProgress,color:'text-amber-600'},{label:'Resolved',value:resolved,color:'text-emerald-600'}].map(s=>(
          <div key={s.label} className="card p-4 text-center">
            <p className={cn('text-3xl font-display font-bold', s.color)}>{s.value}</p>
            <p className="text-xs text-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {items.map(esc => (
          <div key={esc.id} className={cn('card p-5', esc.status==='open'&&'border-rose-200 bg-rose-50/30', esc.status==='in-progress'&&'border-amber-200')}>
            <div className="flex items-start gap-4">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                esc.status==='open'?'bg-rose-100':esc.status==='in-progress'?'bg-amber-100':'bg-emerald-100')}>
                <ShieldAlert className={cn('w-5 h-5',esc.status==='open'?'text-rose-600':esc.status==='in-progress'?'text-amber-600':'text-emerald-600')} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-display font-semibold text-ink text-sm">{esc.patientName}</span>
                  <span className={cn('badge text-[10px]', REASON_STYLES[esc.reason])}>{REASON_LABELS[esc.reason]}</span>
                  <span className={cn('badge text-[10px]', STATUS_STYLES[esc.status])}>{esc.status.replace('-',' ')}</span>
                </div>
                <p className="text-sm text-muted leading-relaxed mb-3">{esc.summary}</p>
                <div className="flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {esc.patientPhone}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {timeAgo(esc.timestamp)}</span>
                  {esc.assignedTo && <span className="flex items-center gap-1"><User className="w-3 h-3" /> {esc.assignedTo}</span>}
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> View Chat</button>
                {esc.status!=='resolved' && <button onClick={()=>resolve(esc.id)} className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Resolve</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="card p-5 border-brand-100 bg-brand-50/50">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-brand-800 text-sm mb-1">When does the AI escalate?</h4>
            <ul className="text-xs text-brand-700 space-y-1 leading-relaxed">
              <li>• Patient reports sudden vision loss, flashing lights, floaters, or eye pain — immediate clinical escalation</li>
              <li>• Signs of serious eye conditions: red eye with pain, possible retinal detachment, chemical injury</li>
              <li>• Patient explicitly asks to speak with an optometrist or practice manager</li>
              <li>• Expressions of frustration, complaints, or distress</li>
              <li>• Clinical questions requiring professional judgement (e.g. prescription queries, diagnosis)</li>
            </ul>
            <p className="text-xs text-brand-600 mt-2">NHS eligibility, contact lens reorders, pricing, and bookings are <strong>never</strong> escalated.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
