// Fichier de gestion des ressources pour le site BSF
// Structure similaire à glossary.js

// Ressources organisées par catégorie
export const resources = {
  videos: [
    // Unité de reproduction
    {
      title: "Stade mouche",
      url: "https://www.youtube.com/embed/HcfFoinWcs4",
      category: "Unité de reproduction",
      description: "Présentation du matériel nécessaire pour le stade mouche adulte."
    },
    {
      title: "Stade œuf",
      url: "https://www.youtube.com/embed/UR8mIbQtRak",
      category: "Unité de reproduction",
      description: "Présentation du matériel pour la gestion des œufs de BSF."
    },
    {
      title: "Stade éclosion",
      url: "https://www.youtube.com/embed/aQPfbSP0jx8",
      category: "Unité de reproduction",
      description: "Méthode d'extraction des larves et processus d'éclosion."
    },
    {
      title: "Stade nurserie",
      url: "https://www.youtube.com/embed/TXTTnEwsdgQ",
      category: "Unité de reproduction",
      description: "Guide pratique sur la manipulation correcte des larves en nurserie."
    },
    {
      title: "Stade pré-pupe",
      url: "https://www.youtube.com/embed/oAk9TNGgsSU",
      category: "Unité de reproduction",
      description: "Gestion du stade pré-pupe dans le cycle de reproduction."
    },
    {
      title: "Stade pupaison",
      url: "https://www.youtube.com/embed/YYGlTbRpxpY",
      category: "Unité de reproduction",
      description: "Processus et gestion du stade de pupaison des BSF."
    },
    
    // Unité de croissance larvaire
    {
      title: "Pré-traitement",
      url: "https://www.youtube.com/embed/JQPfbGSUFWk",
      category: "Unité de croissance larvaire",
      description: "Matériel et méthodes pour le pré-traitement dans l'unité de croissance larvaire."
    },
    {
      title: "Traitement",
      url: "https://www.youtube.com/embed/9xG_MXkjhWM",
      category: "Unité de croissance larvaire",
      description: "Processus de traitement des substrats dans l'unité de croissance larvaire."
    },
    {
      title: "Récolte",
      url: "https://www.youtube.com/embed/TwbBENbPs18",
      category: "Unité de croissance larvaire",
      description: "Méthodes de récolte des larves dans l'unité de croissance."
    },
    {
      title: "Suivi et contrôle qualité",
      url: "https://www.youtube.com/embed/RwGQzUkSbdQ",
      category: "Unité de croissance larvaire",
      description: "Techniques de suivi et contrôle qualité pour l'unité de croissance larvaire."
    },
    
    // Unité de traitement post-récolte
    {
      title: "Séchage par micro-ondes",
      url: "https://www.youtube.com/embed/A1CnpJDVL5Q?si=9eK-hkwim1yIVFTv",
      category: "Unité de traitement post-récolte",
      description: "Technique de séchage des larves par micro-ondes après récolte."
    },
    {
      title: "Torréfaction (1) - Torréfacteur à café",
      url: "https://www.youtube.com/embed/mjei68FHLb8?si=9eK-hkwim1yIVFTv",
      category: "Unité de traitement post-récolte",
      description: "Technique de torréfaction des larves avec un torréfacteur à café."
    },
    {
      title: "Torréfaction (2) - Four à gaz",
      url: "https://www.youtube.com/embed/hPM_e0H7CdI?si=9eK-hkwim1yIVFTv",
      category: "Unité de traitement post-récolte",
      description: "Méthode alternative de torréfaction utilisant un four à gaz."
    },
    {
      title: "Séchage au four",
      url: "https://www.youtube.com/embed/4CvlmePGIQs?si=9eK-hkwim1yIVFTv",
      category: "Unité de traitement post-récolte",
      description: "Technique de séchage des larves au four conventionnel."
    },
    {
      title: "Broyage",
      url: "https://www.youtube.com/embed/1Nn0W-FWgME?si=9eK-hkwim1yIVFTv",
      category: "Unité de traitement post-récolte",
      description: "Processus de broyage des larves séchées."
    },
    {
      title: "Fractionnement",
      url: "https://www.youtube.com/embed/c9VAffBMCP0?si=9eK-hkwim1yIVFTv",
      category: "Unité de traitement post-récolte",
      description: "Techniques de fractionnement des larves pour différentes utilisations."
    },
    {
      title: "Raffinage (1) - Filtration sous vide",
      url: "https://www.youtube.com/embed/c9VAffBMCP0?si=9eK-hkwim1yIVFTv",
      category: "Unité de traitement post-récolte",
      description: "Technique de raffinage par filtration sous vide."
    },
    {
      title: "Raffinage (2) - Décantation",
      url: "https://www.youtube.com/embed/c9VAffBMCP0?si=9eK-hkwim1yIVFTv",
      category: "Unité de traitement post-récolte",
      description: "Méthode de raffinage par décantation."
    }
  ],
  documents: [
    // Documents techniques généraux
    {
      title: "Technical Drawings",
      url: "https://www.eawag.ch/fileadmin/Domain1/Abteilungen/sandec/publikationen/SWM/BSF/Technical_Drawings.zip",
      category: "Schémas techniques",
      description: "Plans techniques détaillés pour la construction des équipements BSF (fichier ZIP)."
    },
    {
      title: "Guide complet d'élevage BSF (PDF)",
      url: "https://www.eawag.ch/fileadmin/Domain1/Abteilungen/sandec/publikationen/SWM/BSF/bsf_biowaste_processing_FR.pdf",
      category: "Guides pratiques",
      description: "Manuel complet d'élevage des mouches soldats noires pour le biotraitement des déchets organiques."
    },
    {
      title: "Manuel complet et annexes",
      url: "https://www.eawag.ch/fileadmin/Domain1/Abteilungen/sandec/schwerpunkte/swm/Practical_knowhow_on_BSF/Manual_and_Annexes.pdf",
      category: "Guides pratiques",
      description: "Guide pratique complet sur l'élevage et l'utilisation des BSF pour le traitement des déchets."
    },
    {
      title: "Guide des opérations quotidiennes",
      url: "https://www.eawag.ch/fileadmin/Domain1/Abteilungen/sandec/schwerpunkte/swm/Practical_knowhow_on_BSF/masterfile_a.docx",
      category: "Procédures opérationnelles",
      description: "Procédures standardisées pour la gestion quotidienne d'un élevage (Annexe A)."
    },
    {
      title: "Tableur de suivi des données",
      url: "https://www.eawag.ch/fileadmin/Domain1/Abteilungen/sandec/schwerpunkte/swm/Practical_knowhow_on_BSF/masterfile_b.xlsx",
      category: "Outils de gestion",
      description: "Tableur pour la collecte et l'analyse des données de production (Annexe B)."
    },
    // Unité de croissance larvaire - documents
    {
      title: "Manuel de compostage décentralisé pour les villes de pays à faible revenus",
      url: "https://www.eawag.ch/fileadmin/Domain1/Abteilungen/sandec/publikationen/SWM/Decentralized_Composting/Rothenberger_2006_en.pdf",
      category: "Unité de croissance larvaire",
      description: "Guide complet sur les techniques de compostage décentralisé adaptées aux pays à faibles revenus."
    },
    // Unité de traitement post-récolte - fiches techniques
    {
      title: "Fiche technique : Alimentation des poissons-chats",
      url: "https://www.eawag.ch/fileadmin/Domain1/Abteilungen/sandec/schwerpunkte/swm/Practical_knowhow_on_BSF/factsheet_catfish.pdf",
      category: "Fiches techniques",
      description: "Guide d'utilisation des produits BSF pour l'alimentation des poissons-chats."
    },
    {
      title: "Fiche technique : Alimentation des poulets",
      url: "https://www.eawag.ch/fileadmin/Domain1/Abteilungen/sandec/schwerpunkte/swm/Practical_knowhow_on_BSF/factsheet_chicken.pdf",
      category: "Fiches techniques",
      description: "Guide d'utilisation des produits BSF pour l'alimentation des poulets."
    },
    {
      title: "Rapport d'évaluation du marché BSF",
      url: "https://www.eawag.ch/fileadmin/Domain1/Abteilungen/sandec/schwerpunkte/swm/Practical_knowhow_on_BSF/market_assessment_report_bsf.pdf",
      category: "Fiches techniques",
      description: "Analyse complète du marché pour les produits dérivés des BSF."
    },
    {
      title: "Fiche technique : Étude de marché",
      url: "https://www.eawag.ch/fileadmin/Domain1/Abteilungen/sandec/schwerpunkte/swm/Practical_knowhow_on_BSF/factsheet_marketstudy.pdf",
      category: "Fiches techniques",
      description: "Méthodologie pour réaliser une étude de marché pour les produits BSF."
    },
    {
      title: "Fiche technique : Objectifs des essais",
      url: "https://www.eawag.ch/fileadmin/Domain1/Abteilungen/sandec/schwerpunkte/swm/Practical_knowhow_on_BSF/factsheet_ob_of_tirals.pdf",
      category: "Fiches techniques",
      description: "Guide pour définir et mettre en œuvre des essais expérimentaux avec les BSF."
    },
    {
      title: "Fiche technique : Fractionnement des larves",
      url: "https://www.eawag.ch/fileadmin/Domain1/Abteilungen/sandec/schwerpunkte/swm/Practical_knowhow_on_BSF/bsf_factsheet_fractioning.pdf",
      category: "Fiches techniques",
      description: "Techniques détaillées pour le fractionnement des larves BSF."
    },
    {
      title: "Fiche technique : Fabrication de savon",
      url: "https://www.eawag.ch/fileadmin/Domain1/Abteilungen/sandec/schwerpunkte/swm/Practical_knowhow_on_BSF/factssheet_soap.pdf",
      category: "Fiches techniques",
      description: "Guide pour la fabrication de savon à partir de produits dérivés des BSF."
    }
  ],
  websites: [
    {
      title: "Eawag/Sandec BSF Research",
      url: "https://www.eawag.ch/en/department/sandec/projects/mswm/black-soldier-fly-biowaste-processing/",
      category: "Centres de recherche",
      description: "Site du centre de recherche Eawag/Sandec sur le biotraitement par BSF."
    },
    {
      title: "BSF Community Forum",
      url: "https://www.blacksoldierflyfarming.com/forum",
      category: "Communautés",
      description: "Forum international d'échange sur l'élevage des BSF."
    }
  ]
};

// Fonction pour obtenir les ressources par catégorie
export function getResourcesByCategory(categoryName) {
  if (categoryName === 'videos') {
    return resources.videos;
  } else if (categoryName === 'documents') {
    return resources.documents;
  } else if (categoryName === 'websites') {
    return resources.websites;
  } else {
    return [];
  }
}

// Fonction pour obtenir un nombre aléatoire de ressources vidéo
export function getRandomVideos(count = 3) {
  const shuffled = [...resources.videos].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Fonction pour obtenir un nombre aléatoire de ressources documents
export function getRandomDocuments(count = 2) {
  const shuffled = [...resources.documents].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Fonction pour obtenir toutes les catégories uniques de ressources
export function getAllResourceCategories() {
  const categories = new Set();
  
  // Collecter toutes les catégories de vidéos
  resources.videos.forEach(video => {
    categories.add(video.category);
  });
  
  // Collecter toutes les catégories de documents
  resources.documents.forEach(doc => {
    categories.add(doc.category);
  });
  
  // Collecter toutes les catégories de sites web
  resources.websites.forEach(site => {
    categories.add(site.category);
  });
  
  return Array.from(categories).sort();
}
