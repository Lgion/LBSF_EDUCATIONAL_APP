# 🗄️ Spécification Technique 03 — Modèles de Données & APIs

## 1. Modèle de Données Cloud (MongoDB Atlas)

### 1.1 Collection `users`
```typescript
interface IUser {
  _id?: string;
  clerkUserId: string;          // Extrait du SDK Clerk Auth
  email: string;
  nom: string;
  prenom: string;
  telephone: string;            // Format: +225...
  whatsapp: string;
  roles: UserRole[];           // ['LEARNER', 'SATELLITE_PARTNER', 'SUPER_ADMIN']
  localisation: {
    ville: string;
    commune?: string;
    coordonneesGps?: { lat: number; lng: number };
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### 1.2 Collection `formations` & `enrollments`
```typescript
interface IFormation {
  _id?: string;
  code: 'DEBUTANT' | 'INTERMEDIAIRE' | 'AVANCE';
  titre: string;
  description: string;
  dureeJours: number;
  prixFcfa: number;             // 0 pour DEBUTANT
  sessionsAvenir: Array<{
    idSession: string;
    dateDebut: Date;
    dateFin: Date;
    lieu: string;               // Ex: "Centre BSF Abidjan - Songon"
    placesDisponibles: number;
  }>;
}

interface IEnrollment {
  _id?: string;
  userId: string;               // Reference IUser (clerkUserId)
  formationId: string;          // Reference IFormation
  idSession: string;
  statutPaiement: 'EN_ATTENTE' | 'PAYE_WAVE' | 'PAYE_ESPECES' | 'ANNULE';
  modePaiement: 'WAVE' | 'ESPECES' | 'GRATUIT';
  montantFcfa: number;
  waveRef?: string;
  createdAt: Date;
}
```

### 1.3 Collection `products` & `orders`
```typescript
interface IProduct {
  _id?: string;
  code: string;
  nom: string;
  categorie: 'INTRANTS_5DOL' | 'MATERIEL' | 'BIOPRODUITS';
  description: string;
  prixFcfa: number;
  unite: 'UNITE' | 'KG' | 'LITRE' | 'LIVRAISON_50K_LARVES';
  estAbonnement: boolean;
  frequenceAbonnement?: 'HEBDOMADAIRE' | 'MENSUEL';
  stockDisponible: number;
  imageUrl?: string;
}

interface IOrder {
  _id?: string;
  numeroCommande: string;       // Ex: "CMD-2026-0818-001"
  userId: string;
  articles: Array<{
    productId: string;
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
  createdAt: Date;
}
```

### 1.4 Collection `satellites` & `production_logs` (SaaS Colony Manager)
```typescript
interface ISatellite {
  _id?: string;
  nomFerme: string;
  proprietaireUserId: string;   // Reference IUser
  codePartenaire: string;       // Ex: "SAT-AZAGUIE-01"
  capaciteTraitementTonsMois: number;
  localisation: {
    ville: string;
    region: string;
    coordonneesGps?: { lat: number; lng: number };
  };
  statut: 'ACTIF' | 'EN_PAUSE' | 'INACTIF';
  createdAt: Date;
}

interface IProductionLog {
  _id?: string;
  idLocalDexie?: string;        // ID généré côté client en mode offline
  satelliteId: string;          // Reference ISatellite
  dateSaisie: Date;
  numLot: string;               // Traçabilité du lot 5-DOL
  masseSubstratDistribueKg: number;
  typeSubstrat: string;         // Ex: "Déchets de fruits + Drêche de bière"
  masse5DolInoculeesGrams: number;
  masseLarvesRecolteesKg: number;
  temperaturePieceC: number;
  humiditeRelativePourcent: number;
  tauxSurviePourcent: number;
  bcrCalculatedPourcent: number; // (Larves récoltées - Inoculées) / Substrat
  notesObservation?: string;
  syncedAt?: Date;
}
```

### 1.5 Collection `b2b_deliveries` & `env_certificates` (Portail Gate Fees)
```typescript
interface IB2BDelivery {
  _id?: string;
  clientB2bId: string;          // Reference IUser
  dateLivraison: Date;
  typeDechet: 'MARCHE_LEGUMES' | 'AGRO_INDUSTRIEL' | 'CANTINE_RESTAURATION';
  poidsTonne: number;
  gateFeeAppliqueParTonneFcfa: number; // Ex: 15 000 FCFA
  montantTotalFcfa: number;
  statutFacturation: 'A_FACTURER' | 'FACTURE_EMISE' | 'PAYE';
  numeroBonPesee: string;
}

interface IEnvCertificate {
  _id?: string;
  numeroCertificat: string;     // Ex: "CERT-ENV-2026-08-042"
  clientB2bId: string;
  periodeMoisAnnee: string;     // Ex: "2026-08"
  tonnageTotalDetourneTons: number;
  emissionsCh4EviteesEqCo2Tons: number; // ~0.5 à 0.8 tonne eq CO2 évitée / tonne biodéchet
  dateEmission: Date;
  pdfUrlCloudinary?: string;
}
```

---

## 2. Schéma IndexedDB Local (Dexie.js)

Le schéma Dexie.js miroir s'exécute directement dans le navigateur du smartphone de l'opérateur satellite :

```typescript
import Dexie, { Table } from 'dexie';

export class BsfLocalDatabase extends Dexie {
  productionLogs!: Table<IProductionLog & { idLocalDexie: string; isSynced: number }>;
  productsCache!: Table<IProduct>;
  userProfileCache!: Table<IUser>;

  constructor() {
    super('bsf_colony_db');
    this.version(1).stores({
      productionLogs: 'idLocalDexie, satelliteId, dateSaisie, isSynced, [satelliteId+dateSaisie]',
      productsCache: '_id, categorie, nom',
      userProfileCache: 'clerkUserId'
    });
  }
}

export const dbLocal = new BsfLocalDatabase();
```

---

## 3. Endpoints API Serverless (Netlify Functions)

| Route Endpoint | Méthode | Rôle | Description |
|---|---|---|---|
| `/api/webhooks/clerk` | `POST` | Public (Clerk) | Synchronise la création/mise à jour d'utilisateurs Clerk vers MongoDB Atlas. |
| `/api/formations/register` | `POST` | Authentifié | Enregistre une pré-inscription et génère l'URL de paiement Wave si demandé. |
| `/api/orders/create` | `POST` | Authentifié | Crée une commande e-commerce, calcule les frais et renvoie le lien Wave. |
| `/api/colony/sync` | `POST` | Satellite | Reçoit le batch de `productionLogs` Dexie.js non synchronisés et les insère dans MongoDB. |
| `/api/b2b/certificates` | `GET` | B2B / Admin | Génère le rapport PDF d'impact environnemental mensuel et renvoie le lien Cloudinary. |
| `/api/ai/assistant` | `POST` | Public / Free | Endpoint interrogeant l'API Gemini avec le contexte scientifique BSF (manuels FiBL/EAWAG). |
