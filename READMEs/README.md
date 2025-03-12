# Application de Formation BSF (Black Soldier Fly)

## LIENS GLANÉS SUR LE WEB
- https://fr.wikipedia.org/wiki/Hermetia_illucens
- https://www.compagniedesinsectes.com/fr/about-bsf
- https://www.echocommunity.org/fr/resources/86a8212a-a048-41c6-ab31-536c111e75ac
- https://wiki.lowtechlab.org/wiki/Elevage_de_Mouches_Soldats_Noires/fr
- https://fractiondinstant.fr/hermetia-illucens/
- https://animalia.bio/fr/hermetia-illucens
## Structure du Projet

### Technologies Principales
- Astro.js comme framework principal
- React pour les composants interactifs
- TailwindCSS avec SCSS pour le styling
- GSAP pour les animations complexes

### Architecture du Projet
```
bsf-formation/
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── chapitre1.astro
│   │   ├── chapitre2.astro
│   │   ├── chapitre3.astro
│   │   ├── chapitre4.astro
│   │   ├── chapitre5.astro
│   │   └── chapitre6.astro
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navigation.astro
│   │   │   └── Footer.astro
│   │   ├── chapitre1/
│   │   ├── chapitre2/
│   │   ├── chapitre3/
│   │   ├── chapitre4/
│   │   ├── chapitre5/
│   │   └── chapitre6/
│   ├── layouts/
│   │   ├── MainLayout.astro
│   │   └── ChapterLayout.astro
│   ├── styles/
│   │   ├── main.scss
│   │   ├── tailwind.scss
│   │   └── components/
│   │       ├── _navigation.scss
│   │       ├── _chapitre1.scss
│   │       ├── _chapitre2.scss
│   │       ├── _chapitre3.scss
│   │       ├── _chapitre4.scss
│   │       ├── _chapitre5.scss
│   │       └── _chapitre6.scss
│   └── utils/
│       ├── animations.js
│       └── helpers.js
├── public/
│   ├── images/
│   └── documents/
├── astro.config.mjs
├── tailwind.config.js
└── package.json
```

### Configuration Astro
```javascript
// astro.config.mjs
export default defineConfig({
  integrations: [
    react(),
    tailwind({
      config: './tailwind.config.js',
    }),
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/main.scss";`
        }
      }
    }
  }
});
```

### Dépendances Principales
```json
{
  "dependencies": {
    "astro": "^4.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "@astrojs/react": "^3.x",
    "@astrojs/tailwind": "^5.x",
    "tailwindcss": "^3.x",
    "sass": "^1.x",
    "gsap": "^3.x"
  }
}
```

## Fonctionnalités Globales

### Navigation
- Menu de navigation principal
- Barre de progression
- Navigation entre chapitres

### Composants Communs
- En-tête responsive
- Pied de page avec liens utiles
- Barre latérale de navigation

### Performance
- Génération statique des pages
- Hydratation partielle des composants interactifs
- Optimisation automatique des images
- Préchargement des ressources critiques

### Accessibilité
- Support ARIA complet
- Navigation au clavier
- Contraste et taille de texte conformes WCAG
- Support multilingue

## Installation et Développement

```bash
# Installation des dépendances
npm install

# Développement
npm run dev

# Build
npm run build
```

Voir les READMEs spécifiques de chaque chapitre pour plus de détails sur leurs fonctionnalités respectives.
