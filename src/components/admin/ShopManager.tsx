import React, { useState, useEffect } from 'react';
import type { IProduct, ICurrencyConfig } from '../../types/bsf';
import { DEFAULT_CURRENCY, formatCurrency } from '../../lib/settings';

export default function ShopManager() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [currency, setCurrency] = useState<ICurrencyConfig>(DEFAULT_CURRENCY);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/shop').then((r) => r.json()),
      fetch('/api/config').then((r) => r.json())
    ])
      .then(([pData, cData]) => {
        if (pData.success) setProducts(pData.products);
        if (cData.success && cData.devise) setCurrency(cData.devise);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (prod: IProduct) => {
    try {
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/shop', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prod)
      });
      const data = await res.json();
      if (data.success) {
        if (isNew) {
          setProducts((prev) => [...prev, { ...prod, _id: data.insertedId }]);
        } else {
          setProducts((prev) => prev.map((p) => (p._id === prod._id ? prod : p)));
        }
        setEditingProduct(null);
        setFeedback('✅ Produit enregistré avec succès.');
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm('Supprimer ce produit de la boutique ?')) return;
    try {
      const res = await fetch(`/api/admin/shop?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        setFeedback('Produit supprimé.');
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
        Chargement du catalogue boutique...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
            <span className="material-icons text-emerald-400">storefront</span>
            Gestion de la Boutique & Stocks
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Gérez vos intrants 5-DOL, bioproduits finis (frass, larves séchées), prix ({currency.symbole}) et stocks disponibles.
          </p>
        </div>

        <button
          onClick={() => {
            setIsNew(true);
            setEditingProduct({
              code: `PROD-${Date.now().toString().slice(-4)}`,
              nom: '',
              categorie: 'INTRANTS_5DOL',
              description: '',
              prixFcfa: 15000,
              unite: 'UNITE',
              estAbonnement: false,
              stockDisponible: 20,
              imageUrl: ''
            });
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-colors"
        >
          <span className="material-icons text-sm">add</span>
          <span>Ajouter un produit</span>
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl text-sm font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800 flex items-center gap-2">
          <span className="material-icons text-base">check_circle</span>
          <span>{feedback}</span>
        </div>
      )}

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div
            key={p._id || p.code}
            className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between"
          >
            <div>
              {p.imageUrl ? (
                <div className="h-36 w-full overflow-hidden bg-slate-950 relative">
                  <img src={p.imageUrl} alt={p.nom} className="w-full h-full object-cover" />
                  <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950/80 text-emerald-400 border border-slate-700 backdrop-blur-sm">
                    {p.categorie}
                  </span>
                </div>
              ) : (
                <div className="h-24 w-full bg-slate-950 flex items-center justify-center text-slate-600">
                  <span className="material-icons text-3xl">image</span>
                </div>
              )}

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400">{p.code}</span>
                  <span className="text-xs font-bold text-emerald-400">
                    {formatCurrency(p.prixFcfa, currency)}
                  </span>
                </div>
                <h3 className="font-bold text-white text-sm line-clamp-1">{p.nom}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
              </div>
            </div>

            <div className="p-4 pt-0">
              <div className="flex items-center justify-between text-xs py-2 border-t border-slate-800/80 text-slate-400">
                <span>Stock : <strong className="text-slate-200">{p.stockDisponible}</strong></span>
                {p.estAbonnement && (
                  <span className="text-[10px] font-semibold text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800">
                    Abonnement
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    setIsNew(false);
                    setEditingProduct(p);
                  }}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1"
                >
                  <span className="material-icons text-xs">edit</span>
                  <span>Modifier</span>
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="p-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/80 text-red-300"
                  title="Supprimer"
                >
                  <span className="material-icons text-xs">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Edition Produit */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">
                {isNew ? 'Nouveau Produit' : `Modifier : ${editingProduct.nom}`}
              </h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white">
                <span className="material-icons">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Code Article</label>
                  <input
                    type="text"
                    value={editingProduct.code}
                    onChange={(e) => setEditingProduct({ ...editingProduct, code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Catégorie</label>
                  <select
                    value={editingProduct.categorie}
                    onChange={(e) => setEditingProduct({ ...editingProduct, categorie: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="INTRANTS_5DOL">Intrants 5-DOL (Larves)</option>
                    <option value="BIOPRODUITS">Bioproduits (Frass / Protéines)</option>
                    <option value="MATERIEL">Matériel d'élevage</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nom du produit</label>
                <input
                  type="text"
                  value={editingProduct.nom}
                  onChange={(e) => setEditingProduct({ ...editingProduct, nom: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Prix ({currency.symbole})</label>
                  <input
                    type="number"
                    value={editingProduct.prixFcfa}
                    onChange={(e) => setEditingProduct({ ...editingProduct, prixFcfa: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Stock Disponible</label>
                  <input
                    type="number"
                    value={editingProduct.stockDisponible}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockDisponible: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">URL de l'image</label>
                <input
                  type="text"
                  value={editingProduct.imageUrl || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description commerciale</label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={editingProduct.estAbonnement}
                  onChange={(e) => setEditingProduct({ ...editingProduct, estAbonnement: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-0"
                />
                <span className="text-slate-300">Formule d'abonnement récurrent (hebdomadaire/mensuel)</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleSave(editingProduct)}
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
