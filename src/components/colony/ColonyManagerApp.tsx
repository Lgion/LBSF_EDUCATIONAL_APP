import React, { useState, useEffect } from 'react';
import { dbLocal } from '../../lib/dexie';
import type { IProductionLog } from '../../types/bsf';

export default function ColonyManagerApp() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [logs, setLogs] = useState<IProductionLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string>('');

  // Form state
  const [satelliteId, setSatelliteId] = useState<string>('SAT-AZAGUIE-01');
  const [numLot, setNumLot] = useState<string>(`LOT-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-01`);
  const [typeSubstrat, setTypeSubstrat] = useState<string>('Déchets de fruits & marché');
  const [masseSubstratKg, setMasseSubstratKg] = useState<number>(50);
  const [masse5DolGrams, setMasse5DolGrams] = useState<number>(250);
  const [masseLarvesRecolteesKg, setMasseLarvesRecolteesKg] = useState<number>(10);
  const [temperaturePieceC, setTemperaturePieceC] = useState<number>(28);
  const [humiditePourcent, setHumiditePourcent] = useState<number>(75);
  const [tauxSurviePourcent, setTauxSurviePourcent] = useState<number>(92);
  const [notesObservation, setNotesObservation] = useState<string>('');

  // Détection en ligne / hors ligne
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    loadLocalLogs();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadLocalLogs = async () => {
    setLoading(true);
    try {
      const allLogs = await dbLocal.productionLogs.orderBy('dateSaisie').reverse().toArray();
      setLogs(allLogs);
    } catch (err) {
      console.error('Erreur chargement logs Dexie:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calcul du BCR en direct
  const inoculeesKg = masse5DolGrams / 1000;
  const netGainLarvesKg = Math.max(0, masseLarvesRecolteesKg - inoculeesKg);
  const calculatedBcr = masseSubstratKg > 0 ? (netGainLarvesKg / masseSubstratKg) * 100 : 0;
  const isBcrCritical = calculatedBcr > 0 && calculatedBcr < 12;
  const isTempCritical = temperaturePieceC > 32 || temperaturePieceC < 24;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newLog: IProductionLog = {
      idLocalDexie: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      satelliteId,
      dateSaisie: new Date().toISOString(),
      numLot,
      masseSubstratDistribueKg: masseSubstratKg,
      typeSubstrat,
      masse5DolInoculeesGrams: masse5DolGrams,
      masseLarvesRecolteesKg,
      temperaturePieceC,
      humiditeRelativePourcent: humiditePourcent,
      tauxSurviePourcent,
      bcrCalculatedPourcent: Math.round(calculatedBcr * 10) / 10,
      notesObservation,
      isSynced: 0
    };

    try {
      await dbLocal.productionLogs.add(newLog);
      await loadLocalLogs();
      setSyncMessage('✅ Log-sheet sauvegardé localement (0ms de latence, sécurisé en mode hors-ligne).');
      // Réinitialisation partielle
      setNotesObservation('');
      setTimeout(() => setSyncMessage(''), 4000);
    } catch (err) {
      console.error('Erreur sauvegarde Dexie:', err);
      setSyncMessage('❌ Erreur lors de la sauvegarde locale.');
    }
  };

  const handleSyncCloud = async () => {
    if (!isOnline) {
      alert('Impossible de synchroniser : vous êtes actuellement hors-ligne.');
      return;
    }

    setSyncing(true);
    setSyncMessage('Synchronisation en cours vers MongoDB Atlas...');

    try {
      const unsyncedLogs = await dbLocal.productionLogs.where('isSynced').equals(0).toArray();

      if (unsyncedLogs.length === 0) {
        setSyncMessage('Toutes vos données sont déjà synchronisées avec le Cloud Atlas.');
        setSyncing(false);
        setTimeout(() => setSyncMessage(''), 3000);
        return;
      }

      const res = await fetch('/api/colony/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs: unsyncedLogs })
      });

      if (res.ok) {
        // Mettre à jour le statut en base locale
        for (const item of unsyncedLogs) {
          await dbLocal.productionLogs.update(item.idLocalDexie, { isSynced: 1, syncedAt: new Date().toISOString() });
        }
        await loadLocalLogs();
        setSyncMessage(`✅ ${unsyncedLogs.length} relevé(s) synchronisé(s) avec succès !`);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setSyncMessage(`⚠️ Échec synchronisation : ${errorData.message || res.statusText}`);
      }
    } catch (err: any) {
      setSyncMessage(`⚠️ Synchronisation en attente (serveur distant ou réseau) : ${err.message}`);
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMessage(''), 5000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header statut réseau & action sync */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-3.5 h-3.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {isOnline ? 'Connecté au Réseau (Online)' : 'Mode Hors-Ligne (Offline Active)'}
            </h3>
            <p className="text-xs text-gray-500">
              Base locale Dexie.js active — saisissez vos données même sans signal GSM à la ferme.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncCloud}
            disabled={syncing || !isOnline}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${
              isOnline
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span className={`material-icons text-sm ${syncing ? 'animate-spin' : ''}`}>sync</span>
            <span>{syncing ? 'Synchronisation...' : 'Synchroniser avec le Cloud'}</span>
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-medium flex items-center gap-2">
          <span className="material-icons text-emerald-600">info</span>
          <span>{syncMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Formulaire de saisie terrain (Log-sheet) */}
        <div className="lg:col-span-6 bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="material-icons text-emerald-600">edit_note</span>
                Saisie Relevé de Production
              </h2>
              <p className="text-xs text-gray-500 mt-1">Numérisation directe des fiches terrain (Annexes D & E SOPs)</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-100 text-emerald-800">
              {satelliteId}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Code Partenaire</label>
                <input
                  type="text"
                  value={satelliteId}
                  onChange={(e) => setSatelliteId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Numéro de Lot</label>
                <input
                  type="text"
                  value={numLot}
                  onChange={(e) => setNumLot(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Type de Substrat Utilisé</label>
              <select
                value={typeSubstrat}
                onChange={(e) => setTypeSubstrat(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Déchets de fruits & marché">Déchets de fruits & marché</option>
                <option value="Drêches de bière + épluchures">Drêches de bière + épluchures</option>
                <option value="Restes de restauration / cantine">Restes de restauration / cantine</option>
                <option value="Sous-produits agro-industriels">Sous-produits agro-industriels</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Substrat Distribué (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  value={masseSubstratKg}
                  onChange={(e) => setMasseSubstratKg(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">5-DOL Inoculées (grammes)</label>
                <input
                  type="number"
                  step="10"
                  min="10"
                  value={masse5DolGrams}
                  onChange={(e) => setMasse5DolGrams(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Larves Récoltées à J14 (kg)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={masseLarvesRecolteesKg}
                onChange={(e) => setMasseLarvesRecolteesKg(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Temp. Pièce (°C)</label>
                <input
                  type="number"
                  step="0.5"
                  value={temperaturePieceC}
                  onChange={(e) => setTemperaturePieceC(Number(e.target.value))}
                  className={`w-full px-3 py-2 rounded-lg border text-sm font-semibold focus:outline-none ${
                    isTempCritical ? 'border-amber-400 bg-amber-50 text-amber-900' : 'border-gray-300 text-gray-800'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Humidité (%)</label>
                <input
                  type="number"
                  value={humiditePourcent}
                  onChange={(e) => setHumiditePourcent(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Survie (%)</label>
                <input
                  type="number"
                  value={tauxSurviePourcent}
                  onChange={(e) => setTauxSurviePourcent(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Observations Terrain</label>
              <textarea
                rows={2}
                placeholder="Ex: Température stable, bon compostage, aucune fourmi détectée..."
                value={notesObservation}
                onChange={(e) => setNotesObservation(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Jauge et indicateur BCR temps réel */}
            <div className={`p-4 rounded-xl border ${isBcrCritical ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-emerald-50 border-emerald-200 text-emerald-950'}`}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Taux de Bioconversion (BCR Calculé)
                </span>
                <span className="text-xl font-extrabold">
                  {calculatedBcr.toFixed(1)} %
                </span>
              </div>
              <p className="text-xs mt-1">
                {isBcrCritical
                  ? '⚠️ Attention : Le BCR est inférieur au seuil recommandé de 12%. Vérifiez l\'humidité et la température.'
                  : '✅ Excellent rendement opérationnel (supérieur à la norme standard de 15%).'}
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span className="material-icons text-base">save</span>
              <span>Enregistrer le Relevé (Hors-Ligne)</span>
            </button>
          </form>
        </div>

        {/* Historique et KPI (Droite) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="material-icons text-emerald-600">history</span>
              Historique des Relevés Locaux ({logs.length})
            </h3>

            {loading ? (
              <div className="p-8 text-center text-gray-400">Chargement des données...</div>
            ) : logs.length === 0 ? (
              <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <span className="material-icons text-3xl text-gray-400 mb-2">inbox</span>
                <p className="text-sm font-medium">Aucun relevé enregistré pour l'instant.</p>
                <p className="text-xs text-gray-400 mt-1">Utilisez le formulaire pour enregistrer votre première pesée.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                {logs.map((log) => (
                  <div
                    key={log.idLocalDexie}
                    className="p-4 rounded-xl border border-gray-200 bg-white hover:border-emerald-300 transition-all shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold text-gray-900 text-sm">{log.numLot}</span>
                        <span className="text-xs text-gray-500 block">
                          {new Date(log.dateSaisie).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.isSynced === 1
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {log.isSynced === 1 ? 'Cloud Sync ✅' : 'Local En attente ⏳'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs py-2 bg-gray-50 rounded-lg px-3">
                      <div>
                        <span className="text-gray-400 block">Substrat</span>
                        <span className="font-semibold text-gray-800">{log.masseSubstratDistribueKg} kg</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Récolte</span>
                        <span className="font-semibold text-emerald-700">{log.masseLarvesRecolteesKg} kg</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">BCR</span>
                        <span className="font-bold text-gray-900">{log.bcrCalculatedPourcent} %</span>
                      </div>
                    </div>

                    {log.notesObservation && (
                      <p className="text-xs text-gray-600 mt-2 italic">
                        "{log.notesObservation}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
