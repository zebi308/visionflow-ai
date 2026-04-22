import { useState } from 'react';
import { Calendar, Plus, Search, Filter, Clock, Eye, Stethoscope } from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';
import type { AppointmentStatus, Appointment } from '../../types';

const appointments: Appointment[] = [];

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  confirmed: 'badge-green', pending: 'badge-amber',
  completed: 'badge-muted', cancelled: 'badge-rose', dna: 'badge-rose',
};
const STATUS_LABELS: Record<AppointmentStatus, string> = {
  confirmed: 'Confirmed', pending: 'Pending',
  completed: 'Completed', cancelled: 'Cancelled', dna: 'DNA',
};

export default function Appointments() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const filtered = appointments.filter(a =>
    a.patientName.toLowerCase().includes(search.toLowerCase()) ||
    a.service.toLowerCase().includes(search.toLowerCase()) ||
    a.optometristName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Appointments</h1>
          <p className="page-subtitle">AI-booked and manual appointments · {appointments.length} total</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Appointment
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Today', value: 0, color: 'text-brand-600' },
          { label: 'This Week', value: 0, color: 'text-violet-600' },
          { label: 'Booked by AI', value: '0%', color: 'text-emerald-600' },
          { label: 'DNA Rate', value: '0%', color: 'text-rose-600' },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <p className={cn('text-2xl font-display font-bold', s.color)}>{s.value}</p>
            <p className="text-xs text-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted/60" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search appointments…" className="input pl-9 py-2 text-xs" />
          </div>
          <button className="btn-secondary flex items-center gap-2 text-xs py-2"><Filter className="w-3.5 h-3.5" /> Filter</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="table-head text-left">Patient</th>
                <th className="table-head text-left">Service</th>
                <th className="table-head text-left">Optometrist</th>
                <th className="table-head text-left">Date & Time</th>
                <th className="table-head text-left">NHS / Private</th>
                <th className="table-head text-left">Booked Via</th>
                <th className="table-head text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(apt => (
                <tr key={apt.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-brand-50 flex items-center justify-center text-brand-700 font-bold text-xs">{apt.patientName.charAt(0)}</div>
                      <div>
                        <p className="font-semibold text-ink text-sm">{apt.patientName}</p>
                        <p className="text-xs text-muted">{apt.patientPhone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                      <span className="text-sm text-ink">{apt.service}</span>
                    </div>
                  </td>
                  <td className="table-cell"><span className="text-sm text-ink">{apt.optometristName}</span></td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-muted shrink-0" />
                      <div>
                        <p className="text-sm text-ink">{formatDate(apt.date)}</p>
                        <p className="text-xs text-muted flex items-center gap-1"><Clock className="w-3 h-3" /> {apt.time} · {apt.duration}min</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={cn('badge', apt.nhsFunded ? 'badge-green' : 'badge-brand')}>
                      {apt.nhsFunded ? 'NHS Funded' : 'Private'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={cn('badge text-[10px]', apt.bookedVia === 'whatsapp-ai' ? 'badge-brand' : apt.bookedVia === 'voice-ai' ? 'badge-violet' : 'badge-muted')}>
                      {apt.bookedVia === 'whatsapp-ai' ? '💬 WhatsApp AI' : apt.bookedVia === 'voice-ai' ? '🎙 Voice AI' : 'Manual'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={cn('badge', STATUS_STYLES[apt.status])}>{STATUS_LABELS[apt.status]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="font-display font-bold text-lg text-ink mb-6">New Appointment</h2>
            <div className="space-y-4">
              <div><label className="label">Patient Name</label><input className="input" placeholder="e.g. Jane Smith" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Date</label><input type="date" className="input" /></div>
                <div><label className="label">Time</label><input type="time" className="input" /></div>
              </div>
              <div>
                <label className="label">Service</label>
                <select className="input">
                  <option>NHS Sight Test</option>
                  <option>Private Sight Test</option>
                  <option>Contact Lens Consultation</option>
                  <option>Contact Lens Aftercare</option>
                  <option>OCT Scan</option>
                  <option>Dry Eye Clinic</option>
                  <option>Myopia Management</option>
                  <option>Children's Eye Test</option>
                  <option>Spectacle Collection</option>
                  <option>Emergency Appointment</option>
                </select>
              </div>
              <div>
                <label className="label">NHS or Private?</label>
                <select className="input">
                  <option>NHS Funded</option>
                  <option>Private</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => setShowModal(false)} className="btn-primary flex-1">Book Appointment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
