import React, { useState, useEffect } from 'react';
import type { IPlatformSettings, IPaymentMethodConfig, ICurrencyConfig } from '../../types/bsf';
import { DEFAULT_SETTINGS } from '../../lib/settings';

const CURRENCY_PRESETS: ICurrencyConfig[] = [
  { code: 'XOF', nom: 'Franc CFA (UEMOA)', symbole: 'FCFA', position: 'AFTER' },
  { code: 'EUR', nom: 'Euro', symbole: '€', position: 'AFTER' },
  { code: 'USD', nom: 'Dollar US', symbole: '$', position: 'BEFORE' },
  { code: 'GBP', nom: 'Livre Sterling', symbole: '£', position: 'BEFORE' },
  { code: 'GNF', nom: 'Franc Guinéen', symbole: 'GNF', position: 'AFTER' },
  { code: 'CDF', nom: 'Franc Congolais', symbole: 'CDF', position: 'AFTER' },
];

export default function SettingsManager() {
  const [settings, setSettings] = useState<IPlatformSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'payments' | 'currency' | 'calculator' | 'contact'>('payments');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch((err) => console.error('Erreur chargement settings:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: '✅ Paramètres enregistrés avec succès ! Répercussion en direct.' });
      } else {
        setFeedback({ type: 'error', message: data.message || 'Erreur lors de la sauvegarde.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Erreur réseau.' });
    } finally {
      setSaving(false);
    }
  };

  const updatePaymentMethod = (id: string, updates: Partial<IPaymentMethodConfig>) => {
    setSettings((prev) => ({
      ...prev,
      payments: prev.payments.map((p) => (p.id === id ? { ...p, ...updates } : p))
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <span className="material-icons animate-spin text-3xl text-emerald-400 mr-3">refresh</span>
        Chargement de la configuration...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
            <span className="material-icons text-emerald-400">tune</span>
            Configuration Générale & Passerelles
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Gérez la devise d'affichage, les moyens de paiement acceptés (Wave, OM, Djamo...) et les prix du calculateur.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white shadow-lg shadow-emerald-900/30 transition-all disabled:opacity-50"
        >
          <span className="material-icons text-sm">{saving ? 'hourglass_top' : 'save'}</span>
          <span>{saving ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
              : 'bg-red-950/60 text-red-300 border border-red-800'
          }`}
        >
          <span className="material-icons text-base">
            {feedback.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-800 space-x-2">
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'payments'
              ? 'bg-slate-900 text-emerald-400 border-t-2 border-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="material-icons text-base">payment</span>
          Paiements ({settings.payments.filter((p) => p.actif).length} actifs)
        </button>
        <button
          onClick={() => setActiveTab('currency')}
          className={`px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'currency'
              ? 'bg-slate-900 text-emerald-400 border-t-2 border-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="material-icons text-base">currency_exchange</span>
          Devise ({settings.devise.symbole})
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'calculator'
              ? 'bg-slate-900 text-emerald-400 border-t-2 border-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="material-icons text-base">calculate</span>
          Constantes Calculateur BSF
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'contact'
              ? 'bg-slate-900 text-emerald-400 border-t-2 border-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="material-icons text-base">support_agent</span>
          Support & WhatsApp
        </button>
      </div>

      {/* Tab 1 : Passerelles de Paiement */}
      {activeTab === 'payments' && (
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="bg-amber-950/30 border border-amber-800/60 p-4 rounded-xl text-amber-200 text-xs flex items-start gap-3">
            <span className="material-icons text-amber-400 text-lg flex-shrink-0">info</span>
            <div>
              <strong className="font-semibold block mb-0.5">Règle de visibilité :</strong>
              Seuls les modes de paiement avec l'interrupteur <span className="text-emerald-400 font-bold">"Activé"</span> apparaîtront dans la boutique et sur les pages de formation.
            </div>
          </div>

          <div className="space-y-4">
            {settings.payments.map((method) => (
              <div
                key={method.id}
                className={`p-4 rounded-xl border transition-all ${
                  method.actif
                    ? 'bg-slate-800/80 border-emerald-700/60 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800 opacity-75'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                        method.actif ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {method.id.slice(0, 3)}
                    </div>
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        {method.nomAffiche}
                        {method.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                            {method.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">{method.instructions}</div>
                    </div>
                  </div>

                  {/* Switch Actif / Inactif */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={method.actif}
                      onChange={(e) => updatePaymentMethod(method.id, { actif: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    <span className="ml-2 text-xs font-semibold text-slate-300">
                      {method.actif ? 'Activé' : 'Désactivé'}
                    </span>
                  </label>
                </div>

                {/* Champs de configuration si activé */}
                {method.actif && (
                  <div className="mt-3 pt-3 border-t border-slate-700/60 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">
                        Numéro marchand ou identifiant de compte
                      </label>
                      <input
                        type="text"
                        value={method.numeroOuCompte || ''}
                        onChange={(e) => updatePaymentMethod(method.id, { numeroOuCompte: e.target.value })}
                        placeholder="Ex: +225 07 07 00 00 00 ou @pseudo"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">
                        Lien direct de paiement (URL de base / QR link)
                      </label>
                      <input
                        type="text"
                        value={method.urlPaiementBase || ''}
                        onChange={(e) => updatePaymentMethod(method.id, { urlPaiementBase: e.target.value })}
                        placeholder="Ex: https://pay.wave.com/m/.../c/ci/"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2 : Devise */}
      {activeTab === 'currency' && (
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white mb-2">Choisir une devise principale</h3>
            <p className="text-xs text-slate-400">
              Tous les tarifs du site (formations, boutique, calculateur) seront automatiquement libellés avec ce symbole.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CURRENCY_PRESETS.map((curr) => {
              const isSelected = settings.devise.code === curr.code;
              return (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => setSettings((prev) => ({ ...prev, devise: curr }))}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-950/60 border-emerald-500 text-white ring-2 ring-emerald-500/30'
                      : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-emerald-400">{curr.symbole}</span>
                    <span className="text-xs font-mono text-slate-400">{curr.code}</span>
                  </div>
                  <div className="text-sm font-semibold mt-1">{curr.nom}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Exemple: {curr.position === 'BEFORE' ? `${curr.symbole} 25 000` : `25 000 ${curr.symbole}`}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 mb-3">Personnalisation avancée de la devise</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Code ISO (ex: XOF)</label>
                <input
                  type="text"
                  value={settings.devise.code}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, devise: { ...prev.devise, code: e.target.value } }))
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Symbole affiché (ex: FCFA)</label>
                <input
                  type="text"
                  value={settings.devise.symbole}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, devise: { ...prev.devise, symbole: e.target.value } }))
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Position du symbole</label>
                <select
                  value={settings.devise.position}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      devise: { ...prev.devise, position: e.target.value as 'AFTER' | 'BEFORE' }
                    }))
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="AFTER">Après le montant (ex: 25 000 FCFA)</option>
                  <option value="BEFORE">Avant le montant (ex: $ 25,000)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3 : Constantes du Calculateur BSF */}
      {activeTab === 'calculator' && (
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Prix de référence & Ratios scientifiques EAWAG</h3>
            <p className="text-xs text-slate-400">
              Ces valeurs alimentent en direct le simulateur économique du calculateur BSF.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800">
              <label className="block text-slate-300 font-semibold mb-1">
                Prix rachat Larves Fraîches ({settings.devise.symbole} / kg)
              </label>
              <input
                type="number"
                value={settings.calculator.prixLarvesFraichesParKg}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    calculator: { ...prev.calculator, prixLarvesFraichesParKg: Number(e.target.value) }
                  }))
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-base"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Valeur de marché standard: 400 FCFA</span>
            </div>

            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800">
              <label className="block text-slate-300 font-semibold mb-1">
                Prix Frass Organique ({settings.devise.symbole} / kg)
              </label>
              <input
                type="number"
                value={settings.calculator.prixFrassParKg}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    calculator: { ...prev.calculator, prixFrassParKg: Number(e.target.value) }
                  }))
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-base"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Biofertilisant tamisé: 250 FCFA</span>
            </div>

            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800">
              <label className="block text-slate-300 font-semibold mb-1">
                Prix 5-DOL Unité Centrale ({settings.devise.symbole} / 1000 larves)
              </label>
              <input
                type="number"
                value={settings.calculator.prix5DolPour1000}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    calculator: { ...prev.calculator, prix5DolPour1000: Number(e.target.value) }
                  }))
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-base"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Jeunes larves de 5 jours: 550 FCFA</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4 : Contact */}
      {activeTab === 'contact' && (
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
          <h3 className="text-base font-bold text-white mb-2">Coordonnées de l'Unité Centrale</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Téléphone Support</label>
              <input
                type="text"
                value={settings.contact.telephoneSupport}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, telephoneSupport: e.target.value }
                  }))
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">WhatsApp Business</label>
              <input
                type="text"
                value={settings.contact.whatsappSupport}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, whatsappSupport: e.target.value }
                  }))
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Email Officiel</label>
              <input
                type="email"
                value={settings.contact.emailContact}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, emailContact: e.target.value }
                  }))
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Adresse de la Ferme / Nurserie</label>
              <input
                type="text"
                value={settings.contact.adresseFermeCentrale}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, adresseFermeCentrale: e.target.value }
                  }))
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
