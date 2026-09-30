import React, { useState } from 'react';
import type { IB2BDelivery, IEnvCertificate } from '../../types/bsf';

const MOCK_DELIVERIES: IB2BDelivery[] = [
  {
    _id: 'del-01',
    clientB2bId: 'cli-agro-01',
    clientNom: 'Brasserie SOLIBRA / Agro-Abidjan',
    dateLivraison: '2026-09-22',
    typeDechet: 'AGRO_INDUSTRIEL',
    poidsTonne: 12.5,
    gateFeeAppliqueParTonneFcfa: 15000,
    montantTotalFcfa: 187500,
    statutFacturation: 'PAYE',
    numeroBonPesee: 'BP-2026-0922-04'
  },
  {
    _id: 'del-02',
    clientB2bId: 'cli-agro-02',
    clientNom: 'Marché de Gros d\'Adjamé (District Autonome)',
    dateLivraison: '2026-09-25',
    typeDechet: 'MARCHE_LEGUMES',
    poidsTonne: 28.0,
    gateFeeAppliqueParTonneFcfa: 10000,
    montantTotalFcfa: 280000,
    statutFacturation: 'PAYE',
    numeroBonPesee: 'BP-2026-0925-11'
  },
  {
    _id: 'del-03',
    clientB2bId: 'cli-agro-03',
    clientNom: 'Agro-Fruits Côte d\'Ivoire',
    dateLivraison: '2026-09-28',
    typeDechet: 'AGRO_INDUSTRIEL',
    poidsTonne: 16.0,
    gateFeeAppliqueParTonneFcfa: 15000,
    montantTotalFcfa: 240000,
    statutFacturation: 'FACTURE_EMISE',
    numeroBonPesee: 'BP-2026-0928-02'
  }
];

export default function B2BPortalApp() {
  const [deliveries] = useState<IB2BDelivery[]>(MOCK_DELIVERIES);

  // Simulateur de Gate Fees
  const [simTonnage, setSimTonnage] = useState<number>(50);
  const [simWasteType, setSimWasteType] = useState<'MARCHE_LEGUMES' | 'AGRO_INDUSTRIEL' | 'CANTINE_RESTAURATION'>('AGRO_INDUSTRIEL');

  const getRatePerTon = (type: string) => {
    switch (type) {
      case 'MARCHE_LEGUMES': return 10000;
      case 'AGRO_INDUSTRIEL': return 15000;
      case 'CANTINE_RESTAURATION': return 20000;
      default: return 15000;
    }
  };

  const ratePerTon = getRatePerTon(simWasteType);
  const totalGateFeeFcfa = simTonnage * ratePerTon;
  const co2AvoidedTons = Math.round(simTonnage * 0.65 * 10) / 10;
  const wasteDivertedTons = Math.round(simTonnage * 0.8 * 10) / 10;

  const [certGenerated, setCertGenerated] = useState<boolean>(false);

  return (
    <div className="space-y-8">
      {/* Header Portail B2B */}
      <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-emerald-950 p-6 md:p-8 rounded-2xl text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 mb-2">
              <span className="material-icons text-sm">business</span>
              Portail Entreprises & Collectivités
            </div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold">
              Traitement des Biodéchets & Gate Fees BSF
            </h2>
            <p className="text-gray-300 text-sm md:text-base mt-1 max-w-2xl">
              Confiez vos flux de déchets organiques à l'Unité Centrale : traçabilité certifiée, conformité environnementale et réduction d'empreinte carbone.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-white/10 text-emerald-300 text-xs font-semibold backdrop-blur-sm border border-white/10">
              Zone Industrielle Abidjan / Songon
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Simulateur Gate Fees & Impact (Gauche) */}
        <div className="lg:col-span-6 bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-100 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="material-icons text-emerald-600">calculate</span>
              Simulateur de Dépôt & Tarification
            </h3>
            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg font-semibold">
              Tarif Dégressif
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                Catégorie de Biodéchets Industriels
              </label>
              <select
                value={simWasteType}
                onChange={(e) => setSimWasteType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="MARCHE_LEGUMES">Déchets de marchés / fruits & légumes (10 000 FCFA/t)</option>
                <option value="AGRO_INDUSTRIEL">Drêches, sons, coproduits agro-alimentaires (15 000 FCFA/t)</option>
                <option value="CANTINE_RESTAURATION">Restes de cantines, restauration collective (20 000 FCFA/t)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold uppercase text-gray-600">
                  Tonnage Mensuel Estimé
                </label>
                <span className="text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full text-xs">
                  {simTonnage} Tonnes / mois
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="300"
                step="5"
                value={simTonnage}
                onChange={(e) => setSimTonnage(Number(e.target.value))}
                className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>5 t/mois</span>
                <span>150 t/mois</span>
                <span>300 t/mois</span>
              </div>
            </div>
          </div>

          {/* Résultats de simulation */}
          <div className="p-5 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Frais de Traitement Estimés (Gate Fee)
              </span>
              <span className="text-2xl font-black text-emerald-950">
                {totalGateFeeFcfa.toLocaleString('fr-FR')} FCFA
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-emerald-200/60 text-xs">
              <div>
                <span className="text-gray-600 block">Détournement Décharge</span>
                <span className="text-base font-bold text-gray-900">{wasteDivertedTons} Tonnes nettes</span>
              </div>
              <div>
                <span className="text-gray-600 block">Émissions Méthane Évitées</span>
                <span className="text-base font-bold text-emerald-700">~{co2AvoidedTons} t eq. CO₂</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCertGenerated(true)}
            className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span className="material-icons text-base">verified</span>
            <span>Générer un Certificat d'Impact BSF</span>
          </button>

          {certGenerated && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 text-xs space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-blue-800">
                <span className="material-icons text-sm">verified_user</span>
                Certificat de Traçabilité RSE Émis : CERT-ENV-2026-09-042
              </div>
              <p>
                Ce certificat officiel atteste du traitement biologique de <strong>{simTonnage} tonnes</strong> de biodéchets, réduisant vos pénalités environnementales et générant <strong>{co2AvoidedTons} tonnes d'équivalent CO₂ évitées</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Historique des Réceptions & Bons de Pesée (Droite) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="material-icons text-emerald-600">receipt_long</span>
              Bons de Pesée & Réceptions Récentes
            </h3>

            <div className="space-y-3">
              {deliveries.map((del) => (
                <div
                  key={del._id}
                  className="p-4 rounded-xl border border-gray-200 bg-white hover:border-emerald-300 transition-all shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold text-gray-900 text-sm block">{del.clientNom}</span>
                      <span className="text-xs text-gray-500">
                        Bon : {del.numeroBonPesee} • {del.dateLivraison}
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      del.statutFacturation === 'PAYE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {del.statutFacturation === 'PAYE' ? 'Réglé ✅' : 'Facturé ⏳'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs py-2 bg-gray-50 rounded-lg px-3">
                    <div>
                      <span className="text-gray-400 block">Poids pesé</span>
                      <span className="font-semibold text-gray-800">{del.poidsTonne} t</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Tarif Gate Fee</span>
                      <span className="font-semibold text-gray-800">{del.gateFeeAppliqueParTonneFcfa.toLocaleString('fr-FR')} F/t</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Montant</span>
                      <span className="font-bold text-emerald-800">{del.montantTotalFcfa.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <a
                href="https://wa.me/2250700000000?text=Bonjour,%20notre%20entreprise%20souhaite%20mettre%20en%20place%20un%20contrat%20d'apport%20de%20biodéchets%20BSF"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-emerald-700 font-bold text-sm hover:underline"
              >
                <span className="material-icons text-base">support_agent</span>
                <span>Contacter l'Unité Centrale pour un Contrat d'Apport Annuel</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
