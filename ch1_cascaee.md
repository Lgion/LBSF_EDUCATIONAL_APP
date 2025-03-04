<!--
SPÉCIFICATIONS FONCTIONNELLES - PAGE WEB CHAPITRE 1 BSF
=======================================================

INFORMATIONS GÉNÉRALES
---------------------
- Type: Page web responsive
- Breakpoints: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)
- Police principale: 'Open Sans' ou équivalent système
- Palette de couleurs: 
  * Principal: #2C5F2D (vert forêt)
  * Secondaire: #97BC62 (vert clair)
  * Accent: #FE6D73 (corail)
  * Fond: #FCFCFC (blanc cassé)
  * Texte: #333333 (gris foncé)

NAVIGATION
----------
- Barre de navigation fixe en haut
- Menu hamburger sur mobile
- Indicateur de progression de lecture
- Boutons de navigation rapide vers les sections

-->

# La Technologie BSF : Transformer nos Déchets en Ressources {.page-title}
<!-- 
HEADER
- Animation: Fade-in au chargement
- Typographie: 2.5em sur desktop, 2em sur mobile
- Marge: 2rem en haut et en bas
-->

## Section d'Accroche {.hero-section}
<!-- 
HERO SECTION
- Hauteur: 100vh
- Arrière-plan: Image en parallaxe de BSF
- Disposition: Grille 3 colonnes sur desktop, 1 colonne sur mobile
- Animation: Les 3 blocs apparaissent successivement avec un délai de 0.3s
-->

:::flex-container
<!-- 
FLEX CONTAINER
- Display: flex
- Justify-content: space-between
- Gap: 2rem
- Flex-direction: row sur desktop, column sur mobile
- Padding: 2rem
-->

:::{.target-audience}
<!-- 
TARGET AUDIENCE BLOCK
- Largeur: 30% sur desktop, 100% sur mobile
- Fond: Blanc semi-transparent (rgba(255,255,255,0.9))
- Border-radius: 10px
- Box-shadow: 0 4px 6px rgba(0,0,0,0.1)
- Hover: Scale 1.02
-->
### 👥 Public Cible
- Entrepreneurs visionnaires
- Gestionnaires municipaux
- Passionnés d'écologie
- Débutants curieux
:::

:::{.learning-objectives}
<!-- Mêmes spécifications que target-audience -->
### 🎯 Objectifs de Formation
- Comprendre le processus BSF
- Maîtriser les bases opérationnelles
- Identifier les opportunités
- Développer des projets durables
:::

:::{.key-points}
<!-- Mêmes spécifications que target-audience -->
### 📚 Points Clés
- Solution écologique innovante
- Technologie accessible
- Double impact positif
- Modèle économique viable
- Bénéfices environnementaux
:::
:::

---

## La Gestion des Déchets : Un Défi Global {.context-banner}
<!-- 
BANNER SECTION
- Hauteur: 50vh
- Arrière-plan: Dégradé de vert (#2C5F2D -> #97BC62)
- Texte: Blanc
- Animation: Parallaxe au scroll
- Padding: 4rem
-->

:::{.context-content}
<!-- 
CONTEXT CONTENT
- Max-width: 800px
- Margin: auto
- Animation: Fade-in + slide-up au scroll
-->
### 🌍 Contexte et Enjeux
Face à l'urbanisation galopante et à l'augmentation constante des déchets urbains, les pays en développement font face à un défi majeur : la gestion des déchets organiques. Cette fraction, représentant la plus grande partie des déchets municipaux, nécessite des solutions innovantes et durables.
:::

---

## Une Solution Naturelle et Innovante {.solution-section}
<!-- 
SOLUTION SECTION
- Layout: Grid 2 colonnes sur desktop
- Espacement: 3rem entre les sections
- Animations: 
  * Icônes: Rotation douce au hover
  * Listes: Fade-in progressif des items
-->

:::{.solution-content}
<!-- 
SOLUTION CONTENT
- Cards avec effet de profondeur
- Transition douce au hover
- Liste à puces personnalisée avec icônes
-->
### 🦟 La Solution BSF

#### Comment ça marche ?
La technologie BSF utilise les larves de la Mouche Soldat Noire pour :
- Réduire drastiquement le volume des déchets organiques
- Transformer les déchets en ressources valorisables
- Créer un processus écologique complet

#### Bénéfices Multiples
1. **Environnementaux**
   - Réduction significative des déchets
   - Processus 100% naturel
   - Économie circulaire

2. **Économiques**
   - Production d'aliments pour animaux
   - Création d'emplois locaux
   - Opportunités entrepreneuriales

3. **Sociaux**
   - Amélioration de l'hygiène urbaine
   - Développement local
   - Formation et expertise
:::

---

## De la Théorie à la Pratique {.applications-section}
<!-- 
APPLICATIONS SECTION
- Fond: Pattern subtil
- Layout: Grid responsive
- Animations:
  * Compteurs animés pour les chiffres
  * Progress bars pour les capacités
-->

:::{.applications-content}
<!-- 
APPLICATIONS CONTENT
- Cards interactives
- Hover: Révélation d'informations supplémentaires
- Infographies animées
-->
### 💼 Applications Pratiques

#### Exemple de Réussite
Notre installation de référence en Indonésie démontre la viabilité du concept :
- Capacité : 2 tonnes/jour
- 5+ années d'exploitation
- Modèle reproductible

#### Structure d'une Installation BSF
1. **Unité d'Élevage**
   - Reproduction contrôlée
   - Gestion des cycles de vie
   - Optimisation de la production

2. **Unité de Conversion**
   - Traitement des déchets
   - Surveillance du processus
   - Contrôle qualité

3. **Post-traitement**
   - Récolte des larves
   - Transformation des produits
   - Valorisation des résidus
:::

---

<!--
INTERACTIONS GÉNÉRALES
---------------------
1. Scroll Smooth
   - Comportement: scroll-behavior: smooth
   - Ancres: Défilement progressif vers les sections

2. Animations au Scroll
   - Bibliothèque: Intersection Observer API
   - Éléments: Fade-in et slide-up au défilement

3. Responsive
   - Images: Srcset pour différentes résolutions
   - Texte: Fluid typography (clamp())
   - Layout: Grid/Flex adaptatif

4. Performance
   - Images: Lazy loading
   - Fonts: Preload des polices critiques
   - CSS: Critical CSS inline

5. Accessibilité
   - ARIA labels sur les sections interactives
   - Contraste suffisant (WCAG AA)
   - Navigation au clavier
   - Support lecteur d'écran
-->

*Ce document fait partie d'une série de guides pratiques sur la technologie BSF et la gestion durable des déchets organiques.*
