import { useState } from 'react';
import { Users, Plus, Mail, Shield, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Role } from '../../types';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  initials: string;
  color: string;
  lastActive: string;
}

const mockTeam: TeamMember[] = [
  { id: '1', name: 'Mr. Raj Patel MCOptom', email: 'raj@clearviewopticians.co.uk', role: 'Owner', initials: 'SW', color: 'bg-brand-600', lastActive: 'Now' },
  { id: '2', name: 'Ms. Sarah Williams FCOptom', email: 'sarah@clearviewopticians.co.uk', role: 'Optometrist', initials: 'JO', color: 'bg-violet-500', lastActive: '2h ago' },
  { id: '3', name: 'Claire Hutchinson', email: 'claire@clearviewopticians.co.uk', role: 'Receptionist', initials: 'CH', color: 'bg-amber-500', lastActive: '30m ago' },
  { id: '4', name: 'Raj Patel', email: 'david@clearviewopticians.co.uk', role: 'Admin', initials: 'RP', color: 'bg-emerald-600', lastActive: 'Yesterday' },
];

const ROLE_PERMISSIONS: Record<Role, string[]> = {
  Owner:                  ['Full access', 'Billing', 'Team management', 'AI settings', 'All conversations'],
  Admin:                  ['All conversations', 'Appointments', 'Leads', 'Analytics', 'AI settings'],
  Optometrist:            ['Own appointments', 'Escalations assigned to them', 'Knowledge base (read)'],
  'Dispensing Optician':  ['Own appointments', 'Spectacle dispensing records', 'Knowledge base (read)'],
  Receptionist:           ['Conversations', 'Appointments', 'Leads (read)', 'Escalation handling'],
  'Support Manager':      ['All conversations', 'Escalations', 'Leads', 'Analytics'],
};

const ROLE_BADGE: Record<Role, string> = {
  Owner:                 'badge-brand',
  Admin:                 'badge-violet',
  Optometrist:           'badge-green',
  'Dispensing Optician': 'badge-green',
  Receptionist:          'badge-amber',
  'Support Manager':     'badge-muted',
};

export default function Team() {
  const [showInvite, setShowInvite] = useState(false);
  const [team, setTeam] = useState(mockTeam);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Team</h1>
          <p className="page-subtitle">{team.length} members · escalation recipients &amp; dashboard access</p>
        </div>
        <button onClick={() => setShowInvite(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Invite Member
        </button>
      </div>

      {/* Team list */}
      <div className="card overflow-hidden">
        <div className="divide-y divide-border">
          {team.map(member => (
            <div key={member.id} className="px-5 py-4 flex items-center gap-4">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0', member.color)}>
                {member.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink">{member.name}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted mt-0.5">
                  <Mail className="w-3 h-3" />
                  {member.email}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-muted">{member.lastActive}</span>
                <span className={cn('badge', ROLE_BADGE[member.role])}>{member.role}</span>
                {member.role !== 'Owner' && (
                  <button
                    onClick={() => setTeam(t => t.filter(m => m.id !== member.id))}
                    className="w-8 h-8 rounded-lg hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center text-muted transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role permissions */}
      <div className="card p-5">
        <h3 className="font-display font-semibold text-ink text-sm mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-brand-600" /> Role Permissions
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {(Object.entries(ROLE_PERMISSIONS) as [Role, string[]][]).map(([role, perms]) => (
            <div key={role} className="bg-surface rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <span className={cn('badge', ROLE_BADGE[role])}>{role}</span>
              </div>
              <ul className="space-y-1">
                {perms.map(p => (
                  <li key={p} className="text-xs text-muted flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-brand-400 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Invite modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="font-display font-bold text-lg text-ink mb-6">Invite Team Member</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input className="input" placeholder="e.g. Gemma Thornton" />
              </div>
              <div>
                <label className="label">Work Email</label>
                <input type="email" className="input" placeholder="gemma@yourpractice.co.uk" />
              </div>
              <div>
                <label className="label">Role</label>
                <select className="input">
                  <option>Receptionist</option>
                  <option>Optometrist</option>
                  <option>Admin</option>
                  <option>Support Manager</option>
                </select>
              </div>
              <p className="text-xs text-muted bg-surface rounded-xl p-3 border border-border">
                An email invite will be sent. They'll be able to log in and manage conversations and escalations based on their role.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowInvite(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => setShowInvite(false)} className="btn-primary flex-1">Send Invite</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
