import { getDb } from './mongodb';
import type { 
  IPlatformSettings, 
  ICurrencyConfig, 
  IPaymentMethodConfig,
  ITestimonial,
  IFaqItem,
  IDiagnosticEntry,
  IFormation,
  IProduct
} from '../types/bsf';

export const DEFAULT_CURRENCY: ICurrencyConfig = {
  code: 'XOF',
  nom: 'Franc CFA',
  symbole: 'FCFA',
  position: 'AFTER'
};

export const DEFAULT_PAYMENT_METHODS: IPaymentMethodConfig[] = [
  {
    id: 'WAVE',
    nomAffiche: 'Wave Côte d\'Ivoire',
    actif: true,
    badge: 'Recommandé (Instantané)',
    instructions: 'Paiement direct via application Wave ou QR Code',
    numeroOuCompte: '+225 07 07 00 00 00',
    urlPaiementBase: 'https://pay.wave.com/m/M_ci_hsvjN_ywTw2K/c/ci/'
  },
  {
    id: 'ORANGE_MONEY',
    nomAffiche: 'Orange Money CI',
    actif: false,
    badge: 'Mobile Money',
    instructions: 'Composez le #144# ou via Orange Money CI',
    numeroOuCompte: '+225 07 00 00 00 00'
  },
  {
    id: 'DJAMO',
    nomAffiche: 'Djamo Côte d\'Ivoire',
    actif: false,
    badge: 'Virement instantané',
    instructions: 'Envoyez sur le compte Djamo @rewastebsf',
    numeroOuCompte: '@rewastebsf'
  },
  {
    id: 'TOUCH_PAY',
    nomAffiche: 'TouchPay / Pech / Moov / MTN',
    actif: false,
    badge: 'Agrégateur multi-opérateurs',
    instructions: 'Guichet multi-opérateurs (MTN MoMo, Moov Money, Cartes)',
    apiKeyPublic: ''
  },
  {
    id: 'STRIPE',
    nomAffiche: 'Carte Bancaire (Stripe)',
    actif: false,
    badge: 'Visa / Mastercard',
    instructions: 'Paiement sécurisé par carte de crédit ou débit internationale'
  },
  {
    id: 'PAYPAL',
    nomAffiche: 'PayPal International',
    actif: false,
    badge: 'International',
    instructions: 'Règlement sécurisé pour la diaspora et partenaires internationaux'
  },
  {
    id: 'GOOGLE_WALLET',
    nomAffiche: 'Google Pay / Wallet',
    actif: false,
    badge: 'Sans contact mobile',
    instructions: 'Paiement 1-click depuis votre téléphone Android ou navigateur'
  }
];

export const DEFAULT_CALCULATOR = {
  prixLarvesFraichesParKg: 400,
  prixFrassParKg: 250,
  prix5DolPour1000: 550,
  rendementLarvesHumidesRatio: 0.19,
  rendementFrassRatio: 0.65,
  tauxReductionDechetsRatio: 0.80
};

export const DEFAULT_CONTACT = {
  telephoneSupport: '+225 07 07 00 00 00',
  whatsappSupport: '+225 07 07 00 00 00',
  emailContact: 'contact@rewaste-bsf.ci',
  adresseFermeCentrale: 'Unité Centrale & Nurserie BSF, Songon, Abidjan, Côte d\'Ivoire'
};

export const DEFAULT_SETTINGS: IPlatformSettings = {
  devise: DEFAULT_CURRENCY,
  payments: DEFAULT_PAYMENT_METHODS,
  calculator: DEFAULT_CALCULATOR,
  contact: DEFAULT_CONTACT
};

// Formateur universel de prix avec la devise configurée
export function formatCurrency(amount: number, currency: ICurrencyConfig = DEFAULT_CURRENCY): string {
  const formatted = Math.round(amount).toLocaleString('fr-FR');
  if (currency.position === 'BEFORE') {
    return `${currency.symbole} ${formatted}`;
  }
  return `${formatted} ${currency.symbole}`;
}

// Récupérer les réglages depuis MongoDB avec fallback sécurisé
export async function getPlatformSettings(): Promise<IPlatformSettings> {
  try {
    const db = await getDb();
    const settings = await db.collection('platform_settings').findOne({ _id: 'global_config' as any });
    if (settings) {
      return {
        ...DEFAULT_SETTINGS,
        ...settings,
        devise: { ...DEFAULT_CURRENCY, ...(settings.devise || {}) },
        calculator: { ...DEFAULT_CALCULATOR, ...(settings.calculator || {}) },
        contact: { ...DEFAULT_CONTACT, ...(settings.contact || {}) },
        // Fusionner les paiements pour que de nouvelles passerelles restent visibles dans l'admin
        payments: DEFAULT_PAYMENT_METHODS.map((defaultMethod) => {
          const found = (settings.payments || []).find((p: any) => p.id === defaultMethod.id);
          return found ? { ...defaultMethod, ...found } : defaultMethod;
        })
      };
    }
  } catch (err) {
    console.warn('Impossible de charger les paramètres depuis MongoDB, fallback par défaut appliqué:', err);
  }
  return DEFAULT_SETTINGS;
}

// Récupérer uniquement les passerelles actives
export async function getActivePaymentMethods(): Promise<IPaymentMethodConfig[]> {
  const settings = await getPlatformSettings();
  return settings.payments.filter((p) => p.actif);
}
