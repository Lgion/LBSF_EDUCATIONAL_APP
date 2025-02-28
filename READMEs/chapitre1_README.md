# Chapitre 1 : Justification

## Spécification Fonctionnelle

### Objectif de la page
Présenter une introduction générale au projet de gestion des déchets par les larves de mouches soldats noires (BSF) et justifier son importance.

### Sections principales
1. **Introduction générale**
   - Présentation du problème des déchets urbains
   - Introduction à la solution BSF
   - Mise en contexte environnemental

2. **Portée et public cible**
   - Description de l'échelle du projet (5 tonnes/jour)
   - Identification du public cible
   - Niveau de connaissances requis

3. **Structure de navigation**
   - Présentation des trois unités principales de traitement
   - Schéma interactif des unités

### Fonctionnalités interactives
- Diagramme cliquable des unités de traitement
- Boutons de navigation vers les chapitres suivants
- Infographie interactive sur le processus global

## Spécification Technique

### Composants Requis
```
src/
├── pages/
│   └── chapitre1.astro
├── components/
│   └── chapitre1/
│       ├── Introduction.astro
│       ├── PublicCible.astro
│       ├── Navigation.astro
│       └── DiagrammeUnites.jsx
├── styles/
│   └── components/
│       └── _chapitre1.scss
└── assets/
    └── chapitre1/
        └── units-diagram.svg
```

### Intégration
- Utilisation du `ChapterLayout.astro` commun
- Composants React pour les parties interactives
- Styles SCSS spécifiques au chapitre
- Optimisation des SVG avec SCSS

### Performance
- Rendu statique par défaut avec Astro
- Hydratation partielle pour les composants interactifs
- Optimisation automatique des images
- Temps de chargement cible < 2s
