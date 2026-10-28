// Types et modèles de données conformes aux spécifications ReWaste BSF / Wast4R

export type UserRole =
  | 'VISITOR'           // Visiteur anonyme (accès cours gratuits, tools)
  | 'LEARNER'           // Apprenant inscrit aux cours/lives
  | 'CLIENT'            // Client e-commerce (intrants, bioproduits)
  | 'SATELLITE_PARTNER' // Opérateur de ferme satellite (accès Colony Manager)
  | 'B2B_MUNICIPAL'     // Client apporteur de déchets (Portail Gate Fees)
  | 'SUPER_ADMIN';      // Administrateur plateforme

export interface IUser {
  _id?: string;
  clerkUserId: string;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  whatsapp: string;
  roles: UserRole[];
  localisation: {
    ville: string;
    commune?: string;
    coordonneesGps?: { lat: number; lng: number };
  };
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IFormationSession {
  idSession: string;
  dateDebut: string;
  dateFin: string;
  lieu: string;
  placesDisponibles: number;
}

export interface IFormation {
  _id?: string;
  code: 'DEBUTANT' | 'INTERMEDIAIRE' | 'AVANCE';
  titre: string;
  description: string;
  dureeJours: number;
  prixFcfa: number;
  sessionsAvenir: IFormationSession[];
}

export interface IEnrollment {
  _id?: string;
  userId: string;
  formationId: string;
  idSession: string;
  statutPaiement: 'EN_ATTENTE' | 'PAYE_WAVE' | 'PAYE_ESPECES' | 'ANNULE';
  modePaiement: 'WAVE' | 'ESPECES' | 'GRATUIT';
  montantFcfa: number;
  waveRef?: string;
  createdAt?: string | Date;
}

export interface IProduct {
  _id?: string;
  code: string;
  nom: string;
  categorie: 'INTRANTS_5DOL' | 'MATERIEL' | 'BIOPRODUITS';
  description: string;
  prixFcfa: number;
  unite: 'UNITE' | 'KG' | 'LITRE' | 'DOSE_25K_LARVES' | 'DOSE_50K_LARVES';
  estAbonnement: boolean;
  frequenceAbonnement?: 'HEBDOMADAIRE' | 'MENSUEL';
  stockDisponible: number;
  imageUrl?: string;
}

export interface IOrder {
  _id?: string;
  numeroCommande: string;
  userId: string;
  articles: Array<{
    productId: string;
    nom: string;
    quantite: number;
    prixUnitaireFcfa: number;
  }>;
  montantTotalFcfa: number;
  statutPaiement: 'EN_ATTENTE' | 'PAYE_WAVE' | 'PAYE_ORANGE' | 'ESPECES';
  statutLivraison: 'PREPARATION' | 'EN_TRANSIT' | 'LIVRE' | 'ANNULE';
  adresseLivraison: {
    destinataire: string;
    telephone: string;
    ville: string;
    quartierOuRepere: string;
  };
  wavePaymentUrl?: string;
  createdAt?: string | Date;
}

export interface ISatellite {
  _id?: string;
  nomFerme: string;
  proprietaireUserId: string;
  codePartenaire: string;
  capaciteTraitementTonsMois: number;
  localisation: {
    ville: string;
    region: string;
    coordonneesGps?: { lat: number; lng: number };
  };
  statut: 'ACTIF' | 'EN_PAUSE' | 'INACTIF';
  createdAt?: string | Date;
}

export interface IProductionLog {
  _id?: string;
  idLocalDexie: string;
  satelliteId: string;
  dateSaisie: string;
  numLot: string;
  masseSubstratDistribueKg: number;
  typeSubstrat: string;
  masse5DolInoculeesGrams: number;
  masseLarvesRecolteesKg: number;
  temperaturePieceC: number;
  humiditeRelativePourcent: number;
  tauxSurviePourcent: number;
  bcrCalculatedPourcent: number;
  notesObservation?: string;
  isSynced: number; // 0: non synchronisé, 1: synchronisé
  syncedAt?: string | Date;
}

export interface IB2BDelivery {
  _id?: string;
  clientB2bId: string;
  clientNom: string;
  dateLivraison: string;
  typeDechet: 'MARCHE_LEGUMES' | 'AGRO_INDUSTRIEL' | 'CANTINE_RESTAURATION';
  poidsTonne: number;
  gateFeeAppliqueParTonneFcfa: number;
  montantTotalFcfa: number;
  statutFacturation: 'A_FACTURER' | 'FACTURE_EMISE' | 'PAYE';
  numeroBonPesee: string;
}

export interface IEnvCertificate {
  _id?: string;
  numeroCertificat: string;
  clientB2bId: string;
  clientNom: string;
  periodeMoisAnnee: string;
  tonnageTotalDetourneTons: number;
  emissionsCh4EviteesEqCo2Tons: number;
  dateEmission: string;
  pdfUrlCloudinary?: string;
}

// Configuration des passerelles de paiement
export interface IPaymentMethodConfig {
  id: 'WAVE' | 'ORANGE_MONEY' | 'DJAMO' | 'TOUCH_PAY' | 'STRIPE' | 'PAYPAL' | 'GOOGLE_WALLET';
  nomAffiche: string;
  actif: boolean;
  badge?: string;
  instructions?: string;
  numeroOuCompte?: string;
  urlPaiementBase?: string;
  apiKeyPublic?: string;
}

// Configuration de la devise
export interface ICurrencyConfig {
  code: string;       // ex: 'XOF', 'EUR', 'USD'
  nom: string;        // ex: 'Franc CFA', 'Euro', 'Dollar'
  symbole: string;    // ex: 'FCFA', '€', '$'
  position: 'AFTER' | 'BEFORE'; // 'AFTER' -> 15 000 FCFA, 'BEFORE' -> $15,000
}

// Paramètres globaux de la plateforme
export interface IPlatformSettings {
  _id?: string;
  devise: ICurrencyConfig;
  payments: IPaymentMethodConfig[];
  calculator: {
    prixLarvesFraichesParKg: number;
    prixFrassParKg: number;
    prix5DolPour1000: number;
    rendementLarvesHumidesRatio: number;
    rendementFrassRatio: number;
    tauxReductionDechetsRatio: number;
  };
  contact: {
    telephoneSupport: string;
    whatsappSupport: string;
    emailContact: string;
    adresseFermeCentrale: string;
  };
  updatedAt?: string | Date;
}

// Témoignages
export interface ITestimonial {
  _id?: string;
  nom: string;
  titreOuMetier: string;
  localisation: string;
  message: string;
  noteEtoiles: number;
  avatarUrl?: string;
  actif: boolean;
  ordreAffichage: number;
  createdAt?: string | Date;
}

// FAQ
export interface IFaqItem {
  _id?: string;
  question: string;
  reponse: string;
  categorie: 'GENERAL' | 'FORMATIONS' | 'BOUTIQUE' | 'SATELLITE' | 'B2B';
  ordreAffichage: number;
  actif: boolean;
  createdAt?: string | Date;
}

// Fiche Diagnostic personnalisable
export interface IDiagnosticEntry {
  _id?: string;
  idRegle: string;
  icon: string;
  title: string;
  category: 'Comportement' | 'Parasites' | 'Environnement & Odeurs' | 'Reproduction';
  symptoms: string[];
  diagnosis: string;
  actions: string[];
  scientificRef: string;
  actif: boolean;
  createdAt?: string | Date;
}

