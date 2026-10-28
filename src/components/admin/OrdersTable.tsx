import React, { useState, useEffect } from 'react';
import type { IOrder, ICurrencyConfig } from '../../types/bsf';
import { DEFAULT_CURRENCY, formatCurrency } from '../../lib/settings';

export default function OrdersTable() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [currency, setCurrency] = useState<ICurrencyConfig>(DEFAULT_CURRENCY);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/orders').then((r) => r.json()),
      fetch('/api/config').then((r) => r.json())
    ])
      .then(([oData, cData]) => {
        if (oData.success) setOrders(oData.orders);
        if (cData.success && cData.devise) setCurrency(cData.devise);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateStatus = async (orderId?: string, statutLivraison?: string) => {
    if (!orderId || !statutLivraison) return;
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: orderId, statutLivraison })
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, statutLivraison: statutLivraison as any } : o))
        );
        setFeedback('✅ Statut de livraison actualisé.');
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
        Chargement des commandes...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
            <span className="material-icons text-emerald-400">receipt_long</span>
            Commandes Shop & Expéditions
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Suivez les commandes d'intrants 5-DOL et de matériel, vérifiez les paiements Wave et gérez les statuts de livraison.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl text-sm font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800 flex items-center gap-2">
          <span className="material-icons text-base">check_circle</span>
          <span>{feedback}</span>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">N° Commande</th>
                <th className="p-4">Destinataire & Contact</th>
                <th className="p-4">Articles</th>
                <th className="p-4">Total ({currency.symbole})</th>
                <th className="p-4">Paiement</th>
                <th className="p-4">Livraison</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orders.map((o) => (
                <tr key={o._id || o.numeroCommande} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-mono font-bold text-white">
                    {o.numeroCommande}
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-white">{o.adresseLivraison?.destinataire}</div>
                    <div className="text-[11px] text-slate-400">{o.adresseLivraison?.telephone}</div>
                    <div className="text-[10px] text-slate-500">{o.adresseLivraison?.ville} • {o.adresseLivraison?.quartierOuRepere}</div>
                  </td>
                  <td className="p-4 space-y-0.5">
                    {o.articles?.map((art, idx) => (
                      <div key={idx} className="text-[11px] text-slate-300">
                        {art.quantite}x {art.nom}
                      </div>
                    ))}
                  </td>
                  <td className="p-4 font-bold text-emerald-400">
                    {formatCurrency(o.montantTotalFcfa, currency)}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {o.statutPaiement}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      o.statutLivraison === 'LIVRE'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : o.statutLivraison === 'EN_TRANSIT'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {o.statutLivraison}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={o.statutLivraison}
                      onChange={(e) => handleUpdateStatus(o._id, e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-xs"
                    >
                      <option value="PREPARATION">Préparation</option>
                      <option value="EN_TRANSIT">En transit</option>
                      <option value="LIVRE">Livré</option>
                      <option value="ANNULE">Annulé</option>
                    </select>
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
