import React, { useState, useEffect } from 'react';
import type { IUser, UserRole } from '../../types/bsf';

const AVAILABLE_ROLES: { role: UserRole; label: string; color: string }[] = [
  { role: 'SUPER_ADMIN', label: 'Super Admin', color: 'bg-red-950 text-red-300 border-red-800' },
  { role: 'SATELLITE_PARTNER', label: 'Ferme Satellite', color: 'bg-emerald-950 text-emerald-300 border-emerald-800' },
  { role: 'B2B_MUNICIPAL', label: 'Client B2B', color: 'bg-blue-950 text-blue-300 border-blue-800' },
  { role: 'CLIENT', label: 'Client Shop', color: 'bg-purple-950 text-purple-300 border-purple-800' },
  { role: 'LEARNER', label: 'Apprenant', color: 'bg-amber-950 text-amber-300 border-amber-800' }
];

export default function UsersTable() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/users')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setUsers(data.users);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleRole = async (user: IUser, role: UserRole) => {
    const currentRoles = user.roles || [];
    const hasRole = currentRoles.includes(role);
    const newRoles = hasRole
      ? currentRoles.filter((r) => r !== role)
      : [...currentRoles, role];

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: user._id, roles: newRoles })
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, roles: newRoles } : u))
        );
        setFeedback(`✅ Rôles actualisés pour ${user.nom || user.email}`);
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.email?.toLowerCase().includes(term) ||
      u.nom?.toLowerCase().includes(term) ||
      u.prenom?.toLowerCase().includes(term) ||
      u.localisation?.ville?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <span className="material-icons animate-spin text-3xl text-emerald-400 mr-3">refresh</span>
        Chargement des utilisateurs...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
            <span className="material-icons text-emerald-400">manage_accounts</span>
            Comptes & Attribution des Rôles
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Attribuez les permissions nécessaires (Super Admin, Opérateur Ferme Satellite, Client B2B).
          </p>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Rechercher nom, email, ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl text-sm font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800 flex items-center gap-2">
          <span className="material-icons text-base">check_circle</span>
          <span>{feedback}</span>
        </div>
      )}

      {/* Users table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Utilisateur</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Localisation</th>
                <th className="p-4">Rôles Attribués (Cliquer pour basculer)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((u) => (
                <tr key={u._id || u.clerkUserId} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-white text-sm">
                      {u.prenom} {u.nom}
                    </div>
                    <div className="font-mono text-slate-400 text-[11px]">{u.email}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-slate-300">{u.telephone || '-'}</div>
                    <div className="text-[10px] text-slate-500">WA: {u.whatsapp || '-'}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-slate-300">{u.localisation?.ville || 'Côte d\'Ivoire'}</div>
                    <div className="text-[10px] text-slate-500">{u.localisation?.commune || ''}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1.5">
                      {AVAILABLE_ROLES.map(({ role, label, color }) => {
                        const hasRole = (u.roles || []).includes(role);
                        return (
                          <button
                            key={role}
                            onClick={() => handleToggleRole(u, role)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all ${
                              hasRole
                                ? `${color} shadow-sm ring-1 ring-white/20`
                                : 'bg-slate-950/40 text-slate-600 border-slate-800 hover:border-slate-700 hover:text-slate-400'
                            }`}
                            title={hasRole ? `Retirer le rôle ${label}` : `Attribuer le rôle ${label}`}
                          >
                            {hasRole ? `✓ ${label}` : `+ ${label}`}
                          </button>
                        );
                      })}
                    </div>
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
