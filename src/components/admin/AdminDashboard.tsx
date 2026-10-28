import React, { useState, useEffect } from 'react';
import type { ICurrencyConfig } from '../../types/bsf';
import { DEFAULT_CURRENCY, formatCurrency } from '../../lib/settings';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [currency, setCurrency] = useState<ICurrencyConfig>(DEFAULT_CURRENCY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then((r) => r.json()),
      fetch('/api/config').then((r) => r.json())
    ])
      .then(([sData, cData]) => {
        if (sData.success) setStats(sData.stats);
        if (cData.success && cData.devise) setCurrency(cData.devise);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <span className="material-icons animate-spin text-3xl text-emerald-400 mr-3">refresh</span>
        Chargement du tableau de bord...
      </div>
    );
  }

  const kpis = [
    {
      title: 'Biodéchets Recyclés',
      value: `${stats?.totalWasteTons || 12.5} T`,
      sub: 'Détournés des décharges d\'Abidjan',
      icon: 'recycling',
      gradient: 'from-emerald-500 to-green-600',
      border: 'border-emerald-500/30'
    },
    {
      title: 'Larves BSF Produites',
      value: `${(stats?.totalLarvaeKg || 2350).toLocaleString('fr-FR')} kg`,
      sub: 'Protéines & intrants 5-DOL générés',
      icon: 'pest_control',
      gradient: 'from-lime-500 to-emerald-600',
      border: 'border-lime-500/30'
    },
    {
      title: 'Fermes Satellites',
      value: `${stats?.totalSatellites || 4} Unités`,
      sub: 'Songon, Azaguié, Dabou, Bassam',
      icon: 'hub',
      gradient: 'from-amber-500 to-orange-600',
      border: 'border-amber-500/30'
    },
    {
      title: 'Commandes Shop',
      value: `${stats?.totalOrders || 14}`,
      sub: 'Règlements Wave CI & Expéditions',
      icon: 'shopping_bag',
      gradient: 'from-sky-500 to-blue-600',
      border: 'border-sky-500/30'
    },
    {
      title: 'Utilisateurs & Opérateurs',
      value: `${stats?.totalUsers || 28}`,
      sub: 'Apprenants & partenaires inscrits',
      icon: 'group',
      gradient: 'from-indigo-500 to-purple-600',
      border: 'border-indigo-500/30'
    },
    {
      title: 'Devise Active',
      value: `${currency.symbole} (${currency.code})`,
      sub: 'Modifiable dans Paramètres',
      icon: 'payments',
      gradient: 'from-teal-500 to-emerald-600',
      border: 'border-teal-500/30'
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-emerald-500/5 blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-3">
              <span className="material-icons text-sm">security</span>
              Espace Direction & Super Administration
            </div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white">
              Supervision ReWaste BSF
            </h2>
            <p className="text-slate-400 text-sm md:text-base mt-1 max-w-2xl">
              Console centrale pour piloter l'économie circulaire, les approvisionnements des fermes satellites et les configurations en direct.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <a
              href="/admin/settings"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-colors"
            >
              <span className="material-icons text-sm">tune</span>
              <span>Paramètres & Paiements</span>
            </a>
            <a
              href="/admin/formations"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <span className="material-icons text-sm">school</span>
              <span>Formations & Tarifs</span>
            </a>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className={`bg-slate-900/60 p-5 rounded-2xl border ${kpi.border} shadow-lg backdrop-blur-sm flex items-start justify-between relative overflow-hidden`}
          >
            <div>
              <div className="text-xs font-medium text-slate-400">{kpi.title}</div>
              <div className="text-2xl font-heading font-bold text-white mt-1">
                {kpi.value}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{kpi.sub}</div>
            </div>

            <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${kpi.gradient} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
              <span className="material-icons text-xl">{kpi.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Two Columns : Recent Orders & Recent Field Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <span className="material-icons text-emerald-400 text-lg">receipt_long</span>
              Dernières Commandes
            </h3>
            <a href="/admin/orders" className="text-xs text-emerald-400 hover:underline">
              Voir tout →
            </a>
          </div>

          <div className="space-y-2.5">
            {(stats?.recentOrders || []).length > 0 ? (
              stats.recentOrders.map((ord: any, i: number) => (
                <div
                  key={i}
                  className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white">{ord.numeroCommande}</div>
                    <div className="text-slate-400 text-[11px]">{ord.adresseLivraison?.destinataire}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-400">
                      {formatCurrency(ord.montantTotalFcfa, currency)}
                    </div>
                    <span className="text-[10px] text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                      {ord.statutPaiement}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-xs py-4 text-center">Aucune commande récente.</div>
            )}
          </div>
        </div>

        {/* Recent Field Logs */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <span className="material-icons text-emerald-400 text-lg">sensors</span>
              Télémétrie Fermes Satellites
            </h3>
            <span className="text-xs text-slate-400">Données synchronisées</span>
          </div>

          <div className="space-y-2.5">
            {(stats?.recentLogs || []).length > 0 ? (
              stats.recentLogs.map((log: any, i: number) => (
                <div
                  key={i}
                  className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{log.satelliteId}</span>
                      <span className="text-[10px] text-slate-400">({log.numLot})</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Substrat : {log.masseSubstratDistribueKg} kg • Récolte : {log.masseLarvesRecolteesKg} kg
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-mono font-bold text-amber-300">
                      BCR: {log.bcrCalculatedPourcent}%
                    </span>
                    <div className="text-[10px] text-slate-500">{log.dateSaisie}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-xs py-4 text-center">Aucun log synchronisé pour le moment.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
