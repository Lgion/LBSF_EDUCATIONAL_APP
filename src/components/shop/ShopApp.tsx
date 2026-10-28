import React, { useState, useEffect } from 'react';
import { getWavePaymentUrl } from '../../lib/wave';
import type { IProduct, ICurrencyConfig, IPaymentMethodConfig } from '../../types/bsf';
import { DEFAULT_CURRENCY, formatCurrency } from '../../lib/settings';

const PRODUCTS: IProduct[] = [
  // Intrants
  {
    _id: 'p-5dol-25k',
    code: 'INTR-5DOL-25K',
    nom: 'Dose 25 000 Jeunes Larves (5-DOL)',
    categorie: 'INTRANTS_5DOL',
    description: 'Larves de 5 jours saines et calibrées issues de la nurserie centrale, prêtes pour l\'engraissement immédiat sur vos biodéchets.',
    prixFcfa: 15000,
    unite: 'DOSE_25K_LARVES',
    estAbonnement: false,
    stockDisponible: 40,
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=60'
  },
  {
    _id: 'p-5dol-50k',
    code: 'INTR-5DOL-50K',
    nom: 'Dose 50 000 Jeunes Larves (5-DOL)',
    categorie: 'INTRANTS_5DOL',
    description: 'Dose optimale pour traiter 250 à 300 kg de biodéchets. Résilience maximale et croissance accélérée en 12 jours.',
    prixFcfa: 28000,
    unite: 'DOSE_50K_LARVES',
    estAbonnement: false,
    stockDisponible: 30,
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=60'
  },
  {
    _id: 'p-5dol-sub',
    code: 'INTR-SUB-MONTH',
    nom: 'Abonnement Ferme Satellite (4 x 50k 5-DOL)',
    categorie: 'INTRANTS_5DOL',
    description: 'Livraison hebdomadaire garantie à votre ferme chaque lundi matin pour assurer un roulement continu de vos bacs de grossissement.',
    prixFcfa: 95000,
    unite: 'DOSE_50K_LARVES',
    estAbonnement: true,
    frequenceAbonnement: 'MENSUEL',
    stockDisponible: 20
  },

  // Matériel
  {
    _id: 'p-larvero',
    code: 'MAT-LARVERO-01',
    nom: 'Bac de Grossissement "Larvero" Calibré',
    categorie: 'MATERIEL',
    description: 'Bac ergonomique en polyéthylène haute densité avec rampe d\'auto-récolte inclinée à 35° et bordure anti-fuite.',
    prixFcfa: 12500,
    unite: 'UNITE',
    estAbonnement: false,
    stockDisponible: 75
  },
  {
    _id: 'p-ant-traps',
    code: 'MAT-ANT-TRAP-4X',
    nom: 'Pièges à Fourmis "Ant Traps" Inox (Lot de 4)',
    categorie: 'MATERIEL',
    description: 'Coupelles anti-prédateurs à fixer sous les pieds d\'étagères. Biosécurité indispensable en climat tropical.',
    prixFcfa: 14000,
    unite: 'UNITE',
    estAbonnement: false,
    stockDisponible: 50
  },
  {
    _id: 'p-love-cage',
    code: 'MAT-LOVE-CAGE',
    nom: 'Chambre d\'Accouplement "Love Cage" Pro',
    categorie: 'MATERIEL',
    description: 'Cage moustiquaire respirante avec ouverture étanche et supports amovibles pour planchettes de ponte alvéolées.',
    prixFcfa: 45000,
    unite: 'UNITE',
    estAbonnement: false,
    stockDisponible: 15
  },

  // Bioproduits
  {
    _id: 'p-bsf-meal-5kg',
    code: 'BIO-MEAL-5KG',
    nom: 'Farine de BSF Dégraissée (Sac 5 kg)',
    categorie: 'BIOPRODUITS',
    description: 'Concentré protéique 55% PB avec profil complet d\'acides aminés pour volailles, tilapias et porcs.',
    prixFcfa: 7500,
    unite: 'KG',
    estAbonnement: false,
    stockDisponible: 120
  },
  {
    _id: 'p-bsf-oil-1l',
    code: 'BIO-OIL-1L',
    nom: 'Huile Brute de BSF Riche en Acide Laurique (1L)',
    categorie: 'BIOPRODUITS',
    description: 'Lipides extraits par pression mécanique. Propriétés antimicrobiennes naturelles reconnues pour l\'alimentation et la cosmétique.',
    prixFcfa: 3000,
    unite: 'LITRE',
    estAbonnement: false,
    stockDisponible: 80
  },
  {
    _id: 'p-pop-larvae',
    code: 'BIO-POP-500G',
    nom: 'Pop-Larvae Soufflées Micro-ondes (500g)',
    categorie: 'BIOPRODUITS',
    description: 'Larves séchées croustillantes couleur jaune doré. Idéales pour l\'aviculture d\'ornement, poissons de bassin et reptiles.',
    prixFcfa: 2500,
    unite: 'UNITE',
    estAbonnement: false,
    stockDisponible: 100
  },
  {
    _id: 'p-frass-25kg',
    code: 'BIO-FRASS-25KG',
    nom: 'Frass BSF — Amendement Organique (Sac 25 kg)',
    categorie: 'BIOPRODUITS',
    description: 'Digestat fertilisant riche en chitine, bactéries bénéfiques et oligo-éléments pour régénérer les sols fatigués.',
    prixFcfa: 6000,
    unite: 'KG',
    estAbonnement: false,
    stockDisponible: 200
  }
];

export default function ShopApp() {
  const [products, setProducts] = useState<IProduct[]>(PRODUCTS);
  const [currency, setCurrency] = useState<ICurrencyConfig>(DEFAULT_CURRENCY);
  const [activePayments, setActivePayments] = useState<IPaymentMethodConfig[]>([
    { id: 'WAVE', nomAffiche: 'Wave Côte d\'Ivoire', actif: true, badge: 'Recommandé' }
  ]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('WAVE');

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [cart, setCart] = useState<{ [productId: string]: number }>({});
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientAddress, setClientAddress] = useState<string>('Abidjan');
  const [orderSubmitted, setOrderSubmitted] = useState<boolean>(false);

  useEffect(() => {
    // 1. Charger la configuration publique (devise, passerelles actives)
    fetch('/api/config')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          if (data.devise) setCurrency(data.devise);
          if (data.payments && data.payments.length > 0) {
            setActivePayments(data.payments);
            setSelectedPaymentMethod(data.payments[0].id);
          }
        }
      })
      .catch((err) => console.warn('Fallback config locale:', err));

    // 2. Charger les produits de la boutique depuis MongoDB
    fetch('/api/admin/shop')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.warn('Fallback catalogue local:', err));
  }, []);

  const filteredProducts = selectedCategory === 'ALL'
    ? products
    : products.filter(p => p.categorie === selectedCategory);

  const addToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const copy = { ...prev };
      if (copy[productId] > 1) {
        copy[productId] -= 1;
      } else {
        delete copy[productId];
      }
      return copy;
    });
  };

  const cartItems = Object.entries(cart).map(([pId, qty]) => {
    const product = products.find(p => p._id === pId);
    return { product, qty };
  }).filter(item => item.product !== undefined);

  const totalAmountFcfa = cartItems.reduce((sum, item) => {
    return sum + (item.product!.prixFcfa * item.qty);
  }, 0);

  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const orderId = `CMD-${Date.now().toString().slice(-6)}`;
  const waveMethod = activePayments.find(p => p.id === 'WAVE');
  const baseWaveUrl = waveMethod?.urlPaiementBase || 'https://pay.wave.com/m/M_ci_hsvjN_ywTw2K/c/ci/';
  const cleanWaveUrl = baseWaveUrl.includes('?')
    ? `${baseWaveUrl}&amount=${Math.round(totalAmountFcfa)}&memo=REWASTE_${orderId}`
    : `${baseWaveUrl}?amount=${Math.round(totalAmountFcfa)}&memo=REWASTE_${orderId}`;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalAmountFcfa === 0) return;
    setOrderSubmitted(true);
    if (selectedPaymentMethod === 'WAVE') {
      window.open(cleanWaveUrl, '_blank');
    }
  };

  return (
    <div className="space-y-8">
      {/* Barre de filtrage */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'ALL', label: 'Tous les produits' },
            { id: 'INTRANTS_5DOL', label: '🐛 Intrants & 5-DOL' },
            { id: 'MATERIEL', label: '⚙️ Matériel & Kits' },
            { id: 'BIOPRODUITS', label: '🌱 Bioproduits Transformés' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                selectedCategory === tab.id
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-sm font-semibold text-gray-600 flex items-center gap-1.5">
          <span className="material-icons text-emerald-600 text-base">shopping_cart</span>
          <span>{totalItemsCount} article(s) dans le panier</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Grille des produits */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredProducts.map(product => {
              const inCartQty = cart[product._id!] || 0;
              return (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        product.categorie === 'INTRANTS_5DOL'
                          ? 'bg-emerald-100 text-emerald-800'
                          : product.categorie === 'MATERIEL'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {product.categorie.replace('_', ' ')}
                      </span>
                      {product.estAbonnement && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                          Abonnement
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-gray-900 text-base mb-2">
                      {product.nom}
                    </h3>
                    <p className="text-gray-600 text-xs leading-relaxed mb-4">
                      {product.description}
                    </p>
                  </div>

                  <div className="p-6 pt-0 border-t border-gray-100 mt-auto bg-gray-50/50">
                    <div className="flex items-baseline justify-between pt-4 mb-4">
                      <span className="text-xs text-gray-400">Prix unitaire</span>
                      <span className="text-xl font-extrabold text-gray-900">
                        {product.prixFcfa.toLocaleString('fr-FR')} <span className="text-xs font-semibold text-emerald-700">FCFA</span>
                      </span>
                    </div>

                    {inCartQty > 0 ? (
                      <div className="flex items-center justify-between bg-white rounded-xl border border-emerald-300 p-1">
                        <button
                          onClick={() => removeFromCart(product._id!)}
                          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold flex items-center justify-center transition-colors"
                        >
                          -
                        </button>
                        <span className="font-bold text-emerald-800 text-sm">{inCartQty}</span>
                        <button
                          onClick={() => addToCart(product._id!)}
                          className="w-8 h-8 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center justify-center transition-colors"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product._id!)}
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                      >
                        <span className="material-icons text-sm">add_shopping_cart</span>
                        <span>Ajouter au panier</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panier & Tunnel de Paiement Wave (Droite) */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 sticky top-24 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <span className="material-icons text-emerald-600">shopping_bag</span>
                Mon Panier
              </h3>
              <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {totalItemsCount} article(s)
              </span>
            </div>

            {cartItems.length === 0 ? (
              <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-xl">
                <span className="material-icons text-3xl mb-1">remove_shopping_cart</span>
                <p className="text-xs">Votre panier est vide.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cartItems.map(item => (
                  <div key={item.product!._id} className="flex justify-between items-center text-xs py-2 border-b border-gray-100">
                    <div className="flex-1 pr-2">
                      <div className="font-semibold text-gray-800">{item.product!.nom}</div>
                      <div className="text-gray-500">{item.qty} x {item.product!.prixFcfa.toLocaleString('fr-FR')} FCFA</div>
                    </div>
                    <div className="font-bold text-gray-900">
                      {(item.product!.prixFcfa * item.qty).toLocaleString('fr-FR')} FCFA
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total */}
            <div className="pt-2 border-t border-gray-100">
              <div className="flex justify-between items-baseline mb-4">
                <span className="text-sm font-bold text-gray-600">Montant Total</span>
                <span className="text-2xl font-black text-emerald-800">
                  {formatCurrency(totalAmountFcfa, currency)}
                </span>
              </div>

              {totalAmountFcfa > 0 && (
                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Nom & Prénom *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Kouamé Jean"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Téléphone (WhatsApp / Wave) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+225 07..."
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Ville & Lieu de Livraison *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Abidjan - Songon / Dabou"
                      value={clientAddress}
                      onChange={(e) => setClientAddress(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* Modes de paiement actifs uniquement */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Mode de règlement *</label>
                    <div className="space-y-2">
                      {activePayments.map((method) => (
                        <label
                          key={method.id}
                          className={`flex items-center p-2.5 rounded-xl border cursor-pointer transition-colors ${
                            selectedPaymentMethod === method.id
                              ? 'border-emerald-600 bg-emerald-50/60'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment_method"
                            value={method.id}
                            checked={selectedPaymentMethod === method.id}
                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                            className="text-emerald-600 focus:ring-emerald-500 mr-2.5"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-gray-900">{method.nomAffiche}</span>
                              {method.badge && (
                                <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                                  {method.badge}
                                </span>
                              )}
                            </div>
                            {method.instructions && (
                              <p className="text-[10px] text-gray-500 mt-0.5">{method.instructions}</p>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Bouton de confirmation selon la méthode sélectionnée */}
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span className="material-icons text-base">payments</span>
                    <span>
                      Valider ma commande ({formatCurrency(totalAmountFcfa, currency)})
                    </span>
                  </button>

                  <p className="text-[11px] text-gray-500 text-center leading-tight">
                    {selectedPaymentMethod === 'WAVE'
                      ? 'Paiement direct sécurisé via Wave Côte d\'Ivoire.'
                      : 'Notre équipe logistique vous contactera immédiatement pour la validation du paiement.'}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
