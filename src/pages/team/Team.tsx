import { useState, useEffect } from 'react';
import { Users, Plus, Mail, Shield, Trash2, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';
import type { Role } from '../../types';

const ROLE_PERMISSIONS: Record<Role, string[]> = {
  'Owner':               ['Full access', 'Billing', 'Team management', 'AI settings', 'All conversations'],
  'Admin':               ['All conversations', 'Appointments', 'Leads', 'Analytics', 'AI settings'],
  'Optometrist':         ['Own appointments', 'Escalations assigned to them', 'Knowledge base (read)'],
  'Dispensing Optician': ['Own appointments', 'Spectacle dispensing records', 'Knowledge base (read)'],
  'Receptionist':        ['Conversations', 'Appointments', 'Leads (read)', 'Escalation handling'],
  'Support Manager':     ['All conversations', 'Escalations', 'Leads', 'Analytics'],
};

const ROLE_BADGE: Record<Role, string> = {
  'Owner':               'badge-brand',
  'Admin':               'badge-violet',
  'Optometrist':         'badge-green',
  'Dispensing Optician': 'badge-green',
  'Receptionist':        'badge-amber',
  'Support Manager':     'badge-muted',
};

const COLORS = ['bg-brand-600','bg-violet-500','bg-amber-500','bg-emerald-600','bg-rose-500','bg-sky-500'];

export default function Team() {
  const { practice, user } = useApp();
  const [team, setTeam]         = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteName, setInviteName]   = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole]   = useState('Receptionist');

  useEffect(() => {
    if (!practice?.id) return;
    loadTeam();
  }, [practice?.id]);

  const loadTeam = async () => {
    if (!practice?.id) return;
    setLoading(true);
    try {
      const { data } = await (supabase as any)
        .from('profiles')
        .select('id, name, role, created_at')
        .eq('practice_id', practice.id)
        .order('created_at', { ascending: true });
      setTeam(data ?? []);
    } catch (e) {
      console.error('Error loading team:', e);
    } finally {
      setLoading(false);
    }
  };

  const removeTeamMember = async (id: string) => {
    await (supabase as any)
      .from('profiles')
      .update({ practice_id: null })
      .eq('id', id);
    setTeam(t => t.filter(m => m.id !== id));
  };

  const handleInvite = () => {
    // In a full implementation this would send a Supabase invite email
    // For now just close the modal
    setShowInvite(false);
    setInviteName(''); setInviteEmail(''); setInviteRole('Receptionist');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Team</h1>
          <p className="page-subtitle">
            {loading ? '…' : team.length} member{team.length !== 1 ? 's' : ''} · escalation recipients &amp; dashboard access
          </p>
        </div>
        <button onClick={() => setShowInvite(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Invite Member
        </button>
      </div>

      {/* Team list */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
          </div>
        ) : team.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-10 h-10 mx-auto mb-3 text-border" />
            <p className="text-sm text-muted">No team members yet</p>
            <p className="text-xs text-muted mt-1">Invite your optometrists and reception staff</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {team.map((member: any, i: number) => {
              const initials = (member.name ?? 'U').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
              const isCurrentUser = member.id === user?.id;
              return (
                <div key={member.id} className="px-5 py-4 flex items-center gap-4">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0', COLORS[i % COLORS.length])}>
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {member.name ?? 'Unnamed user'}
                      {isCurrentUser && <span className="ml-2 text-[10px] text-brand-500 font-bold">YOU</span>}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted mt-0.5">
                      <Mail className="w-3 h-3" />
                      {member.email ?? '—'}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={cn('badge', ROLE_BADGE[member.role as Role] ?? 'badge-muted')}>
                      {member.role ?? 'Member'}
                    </span>
                    {!isCurrentUser && member.role !== 'Owner' && (
                      <button
                        onClick={() => removeTeamMember(member.id)}
                        className="w-8 h-8 rounded-lg hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center text-muted transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Role permissions */}
      <div className="card p-5">
        <h3 className="font-display font-semibold text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Shield className="w-4 h-4 text-brand-600" /> Role Permissions
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {(Object.entries(ROLE_PERMISSIONS) as [Role, string[]][]).map(([role, perms]) => (
            <div key={role} className="rounded-xl p-4 border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-col)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className={cn('badge', ROLE_BADGE[role])}>{role}</span>
              </div>
              <ul className="space-y-1">
                {perms.map(p => (
                  <li key={p} className="text-xs text-muted flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-brand-400 shrink-0" />{p}
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
          <div className="rounded-2xl w-full max-w-md p-6 shadow-2xl" style={{ background: 'var(--bg-card)' }}>
            <h2 className="font-display font-bold text-lg mb-6" style={{ color: 'var(--text-primary)' }}>Invite Team Member</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input className="input" placeholder="e.g. Gemma Thornton"
                  value={inviteName} onChange={e => setInviteName(e.target.value)} />
              </div>
              <div>
                <label className="label">Work Email</label>
                <input type="email" className="input" placeholder="gemma@yourpractice.co.uk"
                  value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
              </div>
              <div>
                <label className="label">Role</label>
                <select className="input" value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
                  <option>Receptionist</option>
                  <option>Optometrist</option>
                  <option>Dispensing Optician</option>
                  <option>Admin</option>
                  <option>Support Manager</option>
                </select>
              </div>
              <p className="text-xs text-muted rounded-xl p-3 border border-border" style={{ background: 'var(--bg-surface)' }}>
                They'll receive an email invitation to join your practice dashboard. They'll be able to manage conversations and escalations based on their role.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowInvite(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleInvite} className="btn-primary flex-1">Send Invite</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
