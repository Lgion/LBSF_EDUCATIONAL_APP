import React, { useState, useEffect } from 'react';
import type { ICurrencyConfig } from '../../types/bsf';
import { DEFAULT_CURRENCY, DEFAULT_CALCULATOR, formatCurrency } from '../../lib/settings';

export default function BsfCalculator() {
  const [calcMode, setCalcMode] = useState<'waste' | 'eggs'>('waste');
  const [currency, setCurrency] = useState<ICurrencyConfig>(DEFAULT_CURRENCY);
  const [constants, setConstants] = useState(DEFAULT_CALCULATOR);
  
  // Paramètres déchets
  const [wastePerDayKg, setWastePerDayKg] = useState<number>(500);
  const [wasteType, setWasteType] = useState<string>('mixed');
  
  // Paramètres œufs
  const [eggsGrams, setEggsGrams] = useState<number>(1);

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          if (data.devise) setCurrency(data.devise);
          if (data.calculator) setConstants(data.calculator);
        }
      })
      .catch((err) => console.warn('Config fallback calculateur:', err));
  }, []);

  // Calculs Mode Déchets
  const surfaceReqM2 = Math.round((wastePerDayKg / 31.25) * 10) / 10;
  const cycleDays = 12;
  const wastePerCycleKg = wastePerDayKg * cycleDays;
  const freshLarvaeProducedKg = Math.round(wastePerDayKg * (constants.rendementLarvesHumidesRatio || 0.19));
  const frassProducedKg = Math.round(wastePerDayKg * (constants.rendementFrassRatio || 0.65));
  const weekly5DolNeeded = Math.round((wastePerDayKg * 7) * 2000);
  const dailyRevenueFcfa = (freshLarvaeProducedKg * constants.prixLarvesFraichesParKg) + (frassProducedKg * constants.prixFrassParKg);
  const monthlyRevenueFcfa = dailyRevenueFcfa * 30;

  // Calculs Mode Œufs
  const larvaeFromEggs = eggsGrams * 17500;
  const wasteNeededForEggsKg = Math.round(eggsGrams * 21);
  const starterFeedWetGrams = eggsGrams * 75; // 30% provende / 70% eau
  const feedFlourGrams = Math.round(starterFeedWetGrams * 0.3);
  const feedWaterGrams = Math.round(starterFeedWetGrams * 0.7);
  const freshLarvaeFromEggsKg = Math.round(eggsGrams * 3.8 * 10) / 10;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-700 p-6 md:p-8 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-sm mb-2">
              <span className="material-icons text-sm">science</span>
              Simulateur Grounded EAWAG / FiBL
            </div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold">
              BSF Dimensioning Calculator
            </h2>
            <p className="text-emerald-100 text-sm md:text-base mt-1 max-w-2xl">
              Dimensionnez votre unité de bioconversion en fonction de votre gisement de biodéchets ou de votre nurserie.
            </p>
          </div>

          {/* Sélecteur de mode */}
          <div className="inline-flex p-1 rounded-xl bg-black/20 backdrop-blur-sm">
            <button
              onClick={() => setCalcMode('waste')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                calcMode === 'waste'
                  ? 'bg-white text-emerald-900 shadow-md font-semibold'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Par Gisement de Déchets
            </button>
            <button
              onClick={() => setCalcMode('eggs')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                calcMode === 'eggs'
                  ? 'bg-white text-emerald-900 shadow-md font-semibold'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Par Quantité d'Œufs
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Colonne Contrôles (Gauche) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200/80">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="material-icons text-emerald-600">tune</span>
              Paramètres d'Entrée
            </h3>

            {calcMode === 'waste' ? (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Gisement de Déchets Quotidien
                    </label>
                    <span className="text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full text-sm">
                      {wastePerDayKg >= 1000 ? `${(wastePerDayKg / 1000).toFixed(1)} t/jour` : `${wastePerDayKg} kg/jour`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="5000"
                    step="50"
                    value={wastePerDayKg}
                    onChange={(e) => setWastePerDayKg(Number(e.target.value))}
                    className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>50 kg/j (Ferme pilote)</span>
                    <span>1 000 kg/j</span>
                    <span>5 000 kg/j (Centrale)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Typologie Principale du Substrat
                  </label>
                  <select
                    value={wasteType}
                    onChange={(e) => setWasteType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="fruits">Déchets de fruits & légumes de marché (forte humidité)</option>
                    <option value="mixed">Mélange cantines & résidus agro-alimentaires</option>
                    <option value="brewery">Drêches de brasserie + épluchures</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1.5">
                    *Taux d'humidité cible recommandé : 70% à 80% (test du poing serré).
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Masse d'Œufs en Incubation
                    </label>
                    <span className="text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full text-sm">
                      {eggsGrams} g d'œufs
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="50"
                    step="0.5"
                    value={eggsGrams}
                    onChange={(e) => setEggsGrams(Number(e.target.value))}
                    className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0.5 g</span>
                    <span>25 g</span>
                    <span>50 g</span>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50/70 rounded-lg border border-emerald-100">
                  <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                    Protocole de Nurserie Standard
                  </h4>
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    Les œufs sont suspendus au-dessus de la provende de démarrage dans une atmosphère à 27-30°C et 60-70% d'humidité relative.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Note de référence */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <span className="material-icons text-amber-600 text-lg flex-shrink-0">info</span>
            <div>
              <strong>Modèle Hybride (Scénario 2) :</strong> Les fermes satellites s'approvisionnent en jeunes larves 5-DOL calibrées auprès de l'Unité Centrale pour éliminer le risque biologique lié à la reproduction.
            </div>
          </div>
        </div>

        {/* Colonne Résultats (Droite) */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="material-icons text-emerald-600">analytics</span>
            Projections Opérationnelles & Techniques
          </h3>

          {calcMode === 'waste' ? (
            <>
              {/* Grille 4 indicateurs clés */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between text-emerald-800 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider">Surface d'Élevage Requise</span>
                    <span className="material-icons text-emerald-600">aspect_ratio</span>
                  </div>
                  <div className="text-3xl font-extrabold text-emerald-950">
                    {surfaceReqM2} <span className="text-base font-medium">m²</span>
                  </div>
                  <div className="text-xs text-emerald-700 mt-1">
                    Emprise standard : 31,25 kg déchet/m²/jour
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between text-blue-800 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider">Besoins 5-DOL / Semaine</span>
                    <span className="material-icons text-blue-600">bug_report</span>
                  </div>
                  <div className="text-3xl font-extrabold text-blue-950">
                    {weekly5DolNeeded.toLocaleString('fr-FR')}
                  </div>
                  <div className="text-xs text-blue-700 mt-1">
                    Jeunes larves de 5 jours à inoculer
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border border-amber-200">
                  <div className="flex items-center justify-between text-amber-800 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider">Larves Fraîches / Jour</span>
                    <span className="material-icons text-amber-600">scale</span>
                  </div>
                  <div className="text-3xl font-extrabold text-amber-950">
                    {freshLarvaeProducedKg.toLocaleString('fr-FR')} <span className="text-base font-medium">kg/j</span>
                  </div>
                  <div className="text-xs text-amber-700 mt-1">
                    Rendement de bioconversion ~19%
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between text-purple-800 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider">Frass (Amendement) / Jour</span>
                    <span className="material-icons text-purple-600">compost</span>
                  </div>
                  <div className="text-3xl font-extrabold text-purple-950">
                    {frassProducedKg.toLocaleString('fr-FR')} <span className="text-base font-medium">kg/j</span>
                  </div>
                  <div className="text-xs text-purple-700 mt-1">
                    Engrais organique riche en chitine
                  </div>
                </div>
              </div>

              {/* Bilan Économique Estimé */}
              <div className="p-6 bg-gray-900 text-white rounded-xl shadow-lg">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Projection Financière Mensuelle Indicative
                  </span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Devise : {currency.nom} ({currency.symbole})
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-400">Chiffre d'Affaires Brut Estimé / Mois</div>
                    <div className="text-2xl font-black text-emerald-400 mt-0.5">
                      {formatCurrency(monthlyRevenueFcfa, currency)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      (Vente larves fraîches @ {constants.prixLarvesFraichesParKg} + Frass @ {constants.prixFrassParKg})
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-400">Volume de Déchets Détournés / Mois</div>
                    <div className="text-2xl font-black text-blue-400 mt-0.5">
                      {((wastePerDayKg * 30) / 1000).toFixed(1)} Tonnes
                    </div>
                    <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                      <span className="material-icons text-xs">eco</span>
                      Réduction de 80% du volume envoyé en décharge
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Mode Œufs */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="text-xs font-bold text-emerald-800 uppercase mb-1">Population 5-DOL Obtenue</div>
                  <div className="text-3xl font-extrabold text-emerald-950">
                    {larvaeFromEggs.toLocaleString('fr-FR')}
                  </div>
                  <div className="text-xs text-emerald-700 mt-1">
                    ~17 500 jeunes larves par gramme d'œufs
                  </div>
                </div>

                <div className="p-5 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-xs font-bold text-blue-800 uppercase mb-1">Gisement Biodéchets Nécessaire</div>
                  <div className="text-3xl font-extrabold text-blue-950">
                    {wasteNeededForEggsKg} <span className="text-base font-medium">kg</span>
                  </div>
                  <div className="text-xs text-blue-700 mt-1">
                    Sur un cycle de croissance de 12 jours
                  </div>
                </div>
              </div>

              {/* Formulation Aliment Démarrage */}
              <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="material-icons text-amber-500">restaurant</span>
                  Formulation de l'Aliment de Démarrage (Nurserie)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500">Aliment Humide Total</div>
                    <div className="text-xl font-bold text-gray-900">{starterFeedWetGrams} g</div>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <div className="text-xs text-amber-800">Provende Poussin (30%)</div>
                    <div className="text-xl font-bold text-amber-900">{feedFlourGrams} g</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-xs text-blue-800">Eau Propre (70%)</div>
                    <div className="text-xl font-bold text-blue-900">{feedWaterGrams} g</div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Cette émulsion nutritive garantit un démarrage homogène et évite l'étouffement ou la déshydratation des nouveau-nés.
                </p>
              </div>
            </div>
          )}

          {/* Action CTA */}
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="/formations"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm transition-colors shadow-sm"
            >
              <span>Se Former à la Pratique BSF</span>
              <span className="material-icons text-sm">arrow_forward</span>
            </a>
            <a
              href="/boutique"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-sm transition-colors"
            >
              <span>Commander des 5-DOL Calibrées</span>
              <span className="material-icons text-sm">shopping_bag</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
