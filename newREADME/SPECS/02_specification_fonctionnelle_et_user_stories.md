# 📋 Spécification Fonctionnelle 02 — Modules Applicatifs & User Stories

## 1. Vue d'Ensemble des 5 Piliers Applicatifs

La plateforme s'articule autour de 5 grands modules interconnectés pour répondre au **Business Plan Modèle Hybride (Scénario 2)** :

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PLATEFORME BSF (Wast4R)                         │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
      ┌─────────────┴─────────────┐    ┌─────────────┴─────────────┐
      │   PILIERS GRATUITS / LEAD │    │ PILIERS DE REVENUS B2B/B2C│
      └─────────────┬─────────────┘    └─────────────┬─────────────┘
                    │                                │
   ┌────────────────┴───────────────┐ ┌──────────────┴──────────────┐
   │ 1. Hub Pédagogique (LMS Free)  │ │ 2. Offre Formations (Live/  │
   │    - Cours Biologie & Process │ │    Présentiel)            │
   │    - BSF Calculator & Wizard   │ │ 3. Boutique E-Commerce      │
   │    - Glossaire & Ressources    │ │    (5-DOL, Kits, Bioproduits)│
   └────────────────────────────────┘ │ 4. SaaS Colony Manager      │
                                      │    (Suivi Nurserie/Satellite)│
                                      │ 5. Portail B2B Municipal    │
                                      │    (Gate Fees & Biodéchets) │
                                      └─────────────────────────────┘
```

---

## 2. Description Détaillée des Modules

### 2.1 Module 1 : Hub Pédagogique LMS (100% Gratuit)

- **Objectif** : Attirer et former gratuitement la communauté d'entrepreneurs et d'agriculteurs (Lead Generation), positionner l'Unité Centrale comme référence technique en Afrique de l'Ouest.
- **Fonctionnalités** :
  1. **Cours Structurés (Chapitres 1 à 4)** : Reprise et enrichissement du contenu Astro existant (Biologie BSF, Déchets admis/interdits, Unités de production, Business Plan).
  2. **Intégration Vidéos YouTube** : Intégration fluide des tutoriels et enregistrements de lives sociaux (TikTok, YouTube, Instagram).
  3. **BSF Calculator (Simulateur d'Élevage)** :
     - Entrée : Tonnage de biodéchets disponibles par jour (ex: 500 kg/jour).
     - Sortie automatique : Nombre de 5-DOL requis/semaine, surface de bacs de grossissement nécessaire ($m^2$), production estimée de larves fraîches ($kg$), production estimée de frass ($kg$), besoin d'eau/aliment.
  4. **Wizard de Diagnostic Interactif** :
     - Diagnostic des anomalies d'élevage (ex: Larves qui s'échappent $\rightarrow$ surchauffe ou trop grande humidité; Odeur d'ammoniac $\rightarrow$ excès de protéines/anaérobiose).
  5. **Glossaire Technico-Scientifique** : 50+ définitions avec recherche en temps réel et schémas d'illustration issus du manuel EAWAG/FiBL.

---

### 2.2 Module 2 : Formations & Réservations (Présentiel / Lives)

- **Structure de l'offre** :
  - **Niveau 1 — Débutant / Sensibilisation** : **100% Gratuit** (Lives réseaux sociaux + modules en ligne + accès BSF Calculator).
  - **Niveau 2 — Intermédiaire (Pratique 3 jours à Abidjan)** : Tarification sur demande / devis.
  - **Niveau 3 — Avancé (Mastery & Implantation Unité 5 jours)** : Tarification sur demande / accompagnement sur mesure.
- **Workflow de réservation** :
  1. Choix de la session dans le calendrier dynamique.
  2. Formulaire de pré-inscription (Nom, Prénom, WhatsApp `+225...`, Ville, Type de projet).
  3. Choix du mode de paiement :
     - **Paiement direct Wave** (déclenchement via `MY_WAVE_URI`).
     - **Paiement en espèces** (à l'arrivée sur le site d'Abidjan).
  4. Notification instantanée reçue sur WhatsApp & Email (`EMAIL_ADMIN`).

---

### 2.3 Module 3 : Boutique E-Commerce

- **Catalogue Produits** :
  - **A. Intrants de Reproduction (5-DOL)** :
    - Larves de 5 jours (5-DOL) pré-comptées et calibrées.
    - Formule abonnement hebdomadaire récurrent pour fermes satellites.
  - **B. Matériel & Kits d'Élevage** :
    - Kits de ponte (caisses, planchettes en bois alvéolé).
    - Bac de grossissement ("Larveros" calibrés).
    - Tamis de séparation rotatif / manuel.
  - **C. Bioproduits Transformés** :
    - **Farine de BSF** (40-45% protéines brutes pour aviculture/aquaculture).
    - **Huile de BSF** (extrait lipidique pour alimentation animale/cosmétique).
    - **Pop-Larvae** (larves séchées/soufflées pour volailles et reptiles).
    - **Frass BSF** (engrais organique certifié riche en chitine et N-P-K).
- **Processus de commande** :
  - Panier et checkout ultra-simplifiés (compatibles smartphones).
  - Intégration paiement Wave + Orange Money.

---

### 2.4 Module 4 : SaaS "Colony Manager" (Local-First pour Fermes Satellites)

#### Que fait le Colony Manager ?
C'est l'outil métier au cœur du modèle hybride BSF. Il remplace les registres papier et annexes manuscrites (Annexes D, E, F, G des SOPs) par une interface mobile **utilisable sans réseau internet**.

#### Fonctionnalités clés :
1. **Numérisation des Log-Sheets d'Élevage** :
   - Saisie quotidienne de la quantité de déchets distribués ($kg$).
   - Saisie de la masse de 5-DOL inoculées ($g$ ou unités).
   - Saisie des conditions environnementales : Température ($°C$), Humidité relative ($\%$).
   - Saisie de la récolte de larves fraîches ($kg$) à J14.
2. **Calcul Automatique des KPIs Métier** :
   - **Taux de Bioconversion (BCR)** : 
     $$\text{BCR (\%)} = \left( \frac{\text{Poids larves récoltées (kg) - Poids larves inoculées (kg)}}{\text{Poids total déchet frais distribué (kg)}} \right) \times 100$$
   - **Taux de Réduction de la Matière Sèche (WWR)**.
   - **Taux de Survie Larvaire**.
3. **Système d'Alertes Prédictives (Offline & Online)** :
   - Notification si le BCR chute sous 12%.
   - Alerte si la température dépasse 32°C ou descend sous 24°C.
4. **Générateur d'Annexes Interactif** :
   - Génération automatique du calendrier d'alimentation de la nurserie et du registre de traçabilité des lots.

---

### 2.5 Module 5 : Portail B2B Municipal & Agro-Industriel (Gate Fees)

- **Contexte & Benchmarking des Gate Fees (Frais de Dépôt)** :
  - *Analyse marché Afrique de l'Ouest / Côte d'Ivoire* : L'élimination non contrôlée ou la mise en décharge des déchets solides industriels coûte cher ou fait l'objet de pénalités environnementales.
  - **Fourchette de Tarification proposée pour les Gate Fees** :
    - **Déchets de marchés/fruits (Fortement hydratés)** : 8 000 à 12 000 FCFA / tonne.
    - **Restes de cantines / Agro-alimentaire haut risque** : 15 000 à 25 000 FCFA / tonne.
    - **Drêches de brasserie / Restes céréaliers pré-triés** : 10 000 à 18 000 FCFA / tonne.
- **Fonctionnalités du Portail Pro** :
  1. **Tableau de Bord des Apports** : Suivi des tonnages de biodéchets livrés par camion/pesée.
  2. **Certificats de Traçabilité Environnementale** : Attestation officielle émise par l'Unité Centrale certifiant le détournement de décharge et l'évitement d'émissions de méthane ($CH_4$).
  3. **Facturation Mensuelle Automatisée** : Édition des factures de Gate Fees calculées au tonnage.

---

## 3. User Stories Principales

### US-01 : Consultation du BSF Calculator (Visiteur / Agriculteur)
> *En tant qu'* agriculteur à Azaguié,  
> *Je veux* entrer la quantité de déchets de papaye dont je dispose par jour,  
> *Afin de* savoir combien de 5-DOL je dois commander chaque semaine et quelle quantité de protéines je vais produire.

### US-02 : Inscription à une Formation avec Paiement Wave (Apprenant)
> *En tant qu'* entrepreneur à Abidjan,  
> *Je veux* réserver ma place pour la session pratique BSF de 3 jours via mon téléphone,  
> *Afin de* recevoir immédiatement la confirmation sur WhatsApp et régler via Wave.

### US-03 : Saisie d'une Pesée Terrain Hors-Ligne (Opérateur Satellite)
> *En tant qu'* opérateur de nurserie en zone rurale sans connexion internet,  
> *Je veux* enregistrer le poids des larves et la température de la pièce dans l'application,  
> *Afin que* les données soient sauvegardées localement et synchronisées avec le serveur dès que je capte le réseau.

### US-04 : Génération de Certificat d'Impact Carbone (Directeur Agro-Industrie)
> *En tant que* responsable RSE d'une usine de transformation de fruits,  
> *Je veux* télécharger le rapport mensuel des tonnages de biodéchets traités par l'Unité Centrale BSF,  
> *Afin de* prouver notre conformité environnementale lors des audits.
