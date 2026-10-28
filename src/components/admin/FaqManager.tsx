import React, { useState, useEffect } from 'react';
import type { IFaqItem } from '../../types/bsf';

export default function FaqManager() {
  const [faq, setFaq] = useState<IFaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<IFaqItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/faq')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setFaq(data.faq);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (item: IFaqItem) => {
    try {
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/faq', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      const data = await res.json();
      if (data.success) {
        if (isNew) {
          setFaq((prev) => [...prev, { ...item, _id: data.insertedId }]);
        } else {
          setFaq((prev) => prev.map((f) => (f._id === item._id ? item : f)));
        }
        setEditingItem(null);
        setFeedback('✅ Question FAQ enregistrée.');
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm('Supprimer cette question fréquente ?')) return;
    try {
      const res = await fetch(`/api/admin/faq?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setFaq((prev) => prev.filter((f) => f._id !== id));
        setFeedback('Question supprimée.');
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
        Chargement des questions fréquentes...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
            <span className="material-icons text-emerald-400">quiz</span>
            Gestion de la Foire Aux Questions (FAQ)
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Personnalisez les questions et réponses affichées sur les pages formations, boutique et assistance.
          </p>
        </div>

        <button
          onClick={() => {
            setIsNew(true);
            setEditingItem({
              question: '',
              reponse: '',
              categorie: 'FORMATIONS',
              ordreAffichage: faq.length + 1,
              actif: true
            });
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-colors"
        >
          <span className="material-icons text-sm">add</span>
          <span>Ajouter une question</span>
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl text-sm font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800 flex items-center gap-2">
          <span className="material-icons text-base">check_circle</span>
          <span>{feedback}</span>
        </div>
      )}

      {/* FAQ list */}
      <div className="space-y-3">
        {faq.map((item) => (
          <div
            key={item._id || item.question}
            className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-2"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400">
                    {item.categorie}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.actif ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-500'}`}>
                    {item.actif ? 'Visible' : 'Masquée'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Ordre : {item.ordreAffichage}
                  </span>
                </div>
                <h3 className="font-bold text-white text-base">{item.question}</h3>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => {
                    setIsNew(false);
                    setEditingItem(item);
                  }}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                >
                  <span className="material-icons text-sm">edit</span>
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 rounded-lg bg-red-950/50 hover:bg-red-900/80 text-red-300"
                >
                  <span className="material-icons text-sm">delete</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
              {item.reponse}
            </p>
          </div>
        ))}
      </div>

      {/* Modal Edition */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">
                {isNew ? 'Nouvelle Question FAQ' : 'Modifier la Question'}
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-white">
                <span className="material-icons">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Catégorie</label>
                  <select
                    value={editingItem.categorie}
                    onChange={(e) => setEditingItem({ ...editingItem, categorie: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="GENERAL">Général</option>
                    <option value="FORMATIONS">Formations</option>
                    <option value="BOUTIQUE">Boutique & Intrants</option>
                    <option value="SATELLITE">Fermes Satellites</option>
                    <option value="B2B">B2B & Gate Fees</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Ordre d'affichage</label>
                  <input
                    type="number"
                    value={editingItem.ordreAffichage}
                    onChange={(e) => setEditingItem({ ...editingItem, ordreAffichage: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Question</label>
                <input
                  type="text"
                  value={editingItem.question}
                  onChange={(e) => setEditingItem({ ...editingItem, question: e.target.value })}
                  placeholder="Ex: Faut-il des prérequis ?"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Réponse détaillée</label>
                <textarea
                  rows={4}
                  value={editingItem.reponse}
                  onChange={(e) => setEditingItem({ ...editingItem, reponse: e.target.value })}
                  placeholder="Explication claire et rassurante pour l'apprenant..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={editingItem.actif}
                  onChange={(e) => setEditingItem({ ...editingItem, actif: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-0"
                />
                <span className="text-slate-300">Question active et publiée</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleSave(editingItem)}
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
