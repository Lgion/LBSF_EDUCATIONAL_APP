import React, { useState, useEffect } from 'react';
import type { IFormation, ITestimonial, ICurrencyConfig } from '../../types/bsf';
import { DEFAULT_CURRENCY, formatCurrency } from '../../lib/settings';

export default function FormationsManager() {
  const [formations, setFormations] = useState<IFormation[]>([]);
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [currency, setCurrency] = useState<ICurrencyConfig>(DEFAULT_CURRENCY);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'formations' | 'testimonials'>('formations');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Modal / Form state for formation editing
  const [editingFormation, setEditingFormation] = useState<IFormation | null>(null);
  // Modal / Form state for testimonial editing
  const [editingTestimonial, setEditingTestimonial] = useState<ITestimonial | null>(null);
  const [isNewTestimonial, setIsNewTestimonial] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/formations').then((r) => r.json()),
      fetch('/api/admin/testimonials').then((r) => r.json()),
      fetch('/api/config').then((r) => r.json())
    ])
      .then(([fData, tData, cData]) => {
        if (fData.success) setFormations(fData.formations);
        if (tData.success) setTestimonials(tData.testimonials);
        if (cData.success && cData.devise) setCurrency(cData.devise);
      })
      .catch((err) => console.error('Erreur chargement données:', err))
      .finally(() => setLoading(false));
  }, []);

  // Save Formation
  const handleSaveFormation = async (formation: IFormation) => {
    try {
      const res = await fetch('/api/admin/formations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formation)
      });
      const data = await res.json();
      if (data.success) {
        setFormations((prev) => prev.map((f) => (f._id === formation._id ? formation : f)));
        setEditingFormation(null);
        setFeedback('✅ Formation mise à jour avec succès.');
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  // Save Testimonial
  const handleSaveTestimonial = async (t: ITestimonial) => {
    try {
      const method = isNewTestimonial ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/testimonials', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(t)
      });
      const data = await res.json();
      if (data.success) {
        if (isNewTestimonial) {
          setTestimonials((prev) => [...prev, { ...t, _id: data.insertedId }]);
        } else {
          setTestimonials((prev) => prev.map((item) => (item._id === t._id ? t : item)));
        }
        setEditingTestimonial(null);
        setFeedback('✅ Témoignage enregistré avec succès.');
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  // Delete Testimonial
  const handleDeleteTestimonial = async (id?: string) => {
    if (!id || !confirm('Supprimer définitivement ce témoignage ?')) return;
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setTestimonials((prev) => prev.filter((item) => item._id !== id));
        setFeedback('Témoignage supprimé.');
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
        Chargement des formations et témoignages...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
            <span className="material-icons text-emerald-400">school</span>
            Gestion des Formations & Témoignages
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Modifiez la durée (en jours), les tarifs ({currency.symbole}), les descriptifs et les retours d'expérience.
          </p>
        </div>

        {activeTab === 'testimonials' && (
          <button
            onClick={() => {
              setIsNewTestimonial(true);
              setEditingTestimonial({
                nom: '',
                titreOuMetier: '',
                localisation: 'Côte d\'Ivoire',
                message: '',
                noteEtoiles: 5,
                avatarUrl: '',
                actif: true,
                ordreAffichage: testimonials.length + 1
              });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-colors"
          >
            <span className="material-icons text-sm">add</span>
            <span>Nouveau témoignage</span>
          </button>
        )}
      </div>

      {feedback && (
        <div className="p-4 rounded-xl text-sm font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800 flex items-center gap-2">
          <span className="material-icons text-base">check_circle</span>
          <span>{feedback}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-800 space-x-2">
        <button
          onClick={() => setActiveTab('formations')}
          className={`px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'formations'
              ? 'bg-slate-900 text-emerald-400 border-t-2 border-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="material-icons text-base">menu_book</span>
          Programmes de Formation ({formations.length})
        </button>
        <button
          onClick={() => setActiveTab('testimonials')}
          className={`px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'testimonials'
              ? 'bg-slate-900 text-emerald-400 border-t-2 border-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="material-icons text-base">reviews</span>
          Témoignages & Avis ({testimonials.length})
        </button>
      </div>

      {/* Tab 1 : Programmes de Formation */}
      {activeTab === 'formations' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {formations.map((f) => (
              <div
                key={f._id || f.code}
                className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {f.code}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-amber-300">
                      ⏱ {f.dureeJours} {f.dureeJours > 1 ? 'jours' : 'jour'}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-900/50 text-emerald-300 border border-emerald-700">
                      {formatCurrency(f.prixFcfa, currency)}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{f.titre}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{f.description}</p>
                  <div className="text-[11px] text-slate-500">
                    Sessions planifiées : {f.sessionsAvenir?.length || 0}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setEditingFormation(f)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    <span className="material-icons text-sm text-emerald-400">edit</span>
                    <span>Modifier tarifs & durée</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2 : Témoignages */}
      {activeTab === 'testimonials' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((t) => (
              <div
                key={t._id || t.nom}
                className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {t.avatarUrl ? (
                        <img
                          src={t.avatarUrl}
                          alt={t.nom}
                          className="w-10 h-10 rounded-full object-cover border border-slate-700"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm">
                          {t.nom.slice(0, 2)}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-white text-sm">{t.nom}</div>
                        <div className="text-xs text-slate-400">{t.titreOuMetier} • {t.localisation}</div>
                      </div>
                    </div>

                    <div className="flex items-center text-amber-400 text-xs">
                      {Array.from({ length: t.noteEtoiles || 5 }).map((_, i) => (
                        <span key={i} className="material-icons text-sm">star</span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 italic mb-4">"{t.message}"</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${t.actif ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'}`}>
                    {t.actif ? 'En ligne' : 'Masqué'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setIsNewTestimonial(false);
                        setEditingTestimonial(t);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      title="Modifier"
                    >
                      <span className="material-icons text-sm">edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteTestimonial(t._id)}
                      className="p-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/80 text-red-300"
                      title="Supprimer"
                    >
                      <span className="material-icons text-sm">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Edition Formation */}
      {editingFormation && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">
                Modifier la formation : {editingFormation.code}
              </h3>
              <button
                onClick={() => setEditingFormation(null)}
                className="text-slate-400 hover:text-white"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Titre de la formation</label>
                <input
                  type="text"
                  value={editingFormation.titre}
                  onChange={(e) =>
                    setEditingFormation({ ...editingFormation, titre: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">
                    Durée (en jours) <span className="text-amber-400 font-bold">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={editingFormation.dureeJours}
                    onChange={(e) =>
                      setEditingFormation({
                        ...editingFormation,
                        dureeJours: Number(e.target.value)
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Ex: 1, 3, 5, 10 jours...</span>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">
                    Prix ({currency.symbole}) <span className="text-amber-400 font-bold">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={editingFormation.prixFcfa}
                    onChange={(e) =>
                      setEditingFormation({
                        ...editingFormation,
                        prixFcfa: Number(e.target.value)
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">0 pour gratuit</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description pédagogique</label>
                <textarea
                  rows={3}
                  value={editingFormation.description}
                  onChange={(e) =>
                    setEditingFormation({ ...editingFormation, description: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingFormation(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleSaveFormation(editingFormation)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edition Testimonial */}
      {editingTestimonial && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">
                {isNewTestimonial ? 'Nouveau Témoignage' : 'Modifier le Témoignage'}
              </h3>
              <button
                onClick={() => setEditingTestimonial(null)}
                className="text-slate-400 hover:text-white"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Nom complet</label>
                  <input
                    type="text"
                    value={editingTestimonial.nom}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, nom: e.target.value })
                    }
                    placeholder="Ex: Kouamé N."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Profession / Rôle</label>
                  <input
                    type="text"
                    value={editingTestimonial.titreOuMetier}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, titreOuMetier: e.target.value })
                    }
                    placeholder="Ex: Aviculteur, Ferme Satellite"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Localisation</label>
                  <input
                    type="text"
                    value={editingTestimonial.localisation}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, localisation: e.target.value })
                    }
                    placeholder="Ex: Songon, Abidjan"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Note (1 à 5 étoiles)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={editingTestimonial.noteEtoiles}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, noteEtoiles: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">URL Avatar (Image)</label>
                <input
                  type="text"
                  value={editingTestimonial.avatarUrl || ''}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, avatarUrl: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Témoignage</label>
                <textarea
                  rows={3}
                  value={editingTestimonial.message}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, message: e.target.value })
                  }
                  placeholder="Ce que l'apprenant ou le client a dit..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={editingTestimonial.actif}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, actif: e.target.checked })
                  }
                  className="rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-0"
                />
                <span className="text-slate-300">Visible sur le site public</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingTestimonial(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleSaveTestimonial(editingTestimonial)}
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
