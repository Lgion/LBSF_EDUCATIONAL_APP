import React, { useState, useEffect } from 'react';
import type { IDiagnosticEntry } from '../../types/bsf';

export default function DiagnosticManager() {
  const [rules, setRules] = useState<IDiagnosticEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRule, setEditingRule] = useState<IDiagnosticEntry | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/diagnostic')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setRules(data.rules);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (rule: IDiagnosticEntry) => {
    try {
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/diagnostic', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rule)
      });
      const data = await res.json();
      if (data.success) {
        if (isNew) {
          setRules((prev) => [...prev, { ...rule, _id: data.insertedId }]);
        } else {
          setRules((prev) => prev.map((r) => (r._id === rule._id ? rule : r)));
        }
        setEditingRule(null);
        setFeedback('✅ Règle diagnostique enregistrée.');
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm('Supprimer cette fiche diagnostique ?')) return;
    try {
      const res = await fetch(`/api/admin/diagnostic?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setRules((prev) => prev.filter((r) => r._id !== id));
        setFeedback('Fiche supprimée.');
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <span className="material-icons animate-spin text-3xl text-emerald-400 mr-3">refresh</span>
        Chargement des fiches SOP...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
            <span className="material-icons text-emerald-400">healing</span>
            Assistant Diagnostic & Protocoles SOP
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Gérez les pathologies, anomalies biologiques et protocoles d'intervention de l'assistant de dépannage.
          </p>
        </div>

        <button
          onClick={() => {
            setIsNew(true);
            setEditingRule({
              idRegle: `rule-${Date.now()}`,
              icon: 'warning',
              title: '',
              category: 'Comportement',
              symptoms: [''],
              diagnosis: '',
              actions: [''],
              scientificRef: 'Manuel EAWAG / SOP ReWaste BSF',
              actif: true
            });
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-colors"
        >
          <span className="material-icons text-sm">add</span>
          <span>Ajouter une anomalie</span>
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl text-sm font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800 flex items-center gap-2">
          <span className="material-icons text-base">check_circle</span>
          <span>{feedback}</span>
        </div>
      )}

      {/* Rules list */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <div
            key={rule._id || rule.idRegle}
            className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-slate-800 text-emerald-400 material-icons">
                  {rule.icon || 'warning'}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {rule.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${rule.actif ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-500'}`}>
                      {rule.actif ? 'Actif' : 'Désactivé'}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base mt-0.5">{rule.title}</h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsNew(false);
                    setEditingRule(rule);
                  }}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  <span className="material-icons text-sm">edit</span>
                </button>
                <button
                  onClick={() => handleDelete(rule._id)}
                  className="p-2 rounded-lg bg-red-950/50 hover:bg-red-900/80 text-red-300"
                >
                  <span className="material-icons text-sm">delete</span>
                </button>
              </div>
            </div>

            <div className="text-xs text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
              <strong className="text-emerald-400 block mb-1">Diagnostic Biologique :</strong>
              {rule.diagnosis}
            </div>

            <div className="text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Protocole correctif :</span>{' '}
              {rule.actions?.slice(0, 2).join(' • ')}...
            </div>
          </div>
        ))}
      </div>

      {/* Modal Edition */}
      {editingRule && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">
                {isNew ? 'Nouvelle fiche diagnostique' : `Modifier : ${editingRule.title}`}
              </h3>
              <button onClick={() => setEditingRule(null)} className="text-slate-400 hover:text-white">
                <span className="material-icons">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Catégorie</label>
                  <select
                    value={editingRule.category}
                    onChange={(e) => setEditingRule({ ...editingRule, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="Comportement">Comportement</option>
                    <option value="Parasites">Parasites & Prédateurs</option>
                    <option value="Environnement & Odeurs">Environnement & Odeurs</option>
                    <option value="Reproduction">Reproduction & Accouplement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Icône Material Icons</label>
                  <input
                    type="text"
                    value={editingRule.icon}
                    onChange={(e) => setEditingRule({ ...editingRule, icon: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                    placeholder="warning, bug_report, air..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Titre de l'anomalie</label>
                <input
                  type="text"
                  value={editingRule.title}
                  onChange={(e) => setEditingRule({ ...editingRule, title: e.target.value })}
                  placeholder="Ex: Mes larves rampent hors du bac..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Symptômes observables (un par ligne)</label>
                <textarea
                  rows={2}
                  value={Array.isArray(editingRule.symptoms) ? editingRule.symptoms.join('\n') : editingRule.symptoms}
                  onChange={(e) => setEditingRule({ ...editingRule, symptoms: e.target.value.split('\n') })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Diagnostic & Cause Biologique</label>
                <textarea
                  rows={2}
                  value={editingRule.diagnosis}
                  onChange={(e) => setEditingRule({ ...editingRule, diagnosis: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Actions Correctives SOP (une par ligne)</label>
                <textarea
                  rows={3}
                  value={Array.isArray(editingRule.actions) ? editingRule.actions.join('\n') : editingRule.actions}
                  onChange={(e) => setEditingRule({ ...editingRule, actions: e.target.value.split('\n') })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Référence scientifique SOP</label>
                <input
                  type="text"
                  value={editingRule.scientificRef}
                  onChange={(e) => setEditingRule({ ...editingRule, scientificRef: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={editingRule.actif}
                  onChange={(e) => setEditingRule({ ...editingRule, actif: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-0"
                />
                <span className="text-slate-300">Actif et visible dans l'assistant de diagnostic</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingRule(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleSave(editingRule)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
