import React, { useState, useEffect } from 'react';

interface DiagnosticIssue {
  id: string;
  icon: string;
  title: string;
  category: 'Comportement' | 'Parasites' | 'Environnement & Odeurs' | 'Reproduction';
  symptoms: string[];
  diagnosis: string;
  actions: string[];
  scientificRef: string;
}

const DIAGNOSTIC_ISSUES: DiagnosticIssue[] = [
  {
    id: 'escape',
    icon: 'warning',
    title: 'Mes larves s\'échappent ou rampent hors des bacs',
    category: 'Comportement',
    symptoms: [
      'Larves grimpant sur les parois des bacs de grossissement (Larveros)',
      'Accumulation de larves le long des bordures ou au sol',
      'Activité frénétique en surface'
    ],
    diagnosis: 'Surchauffe métabolique interne (> 30-35°C) OU taux d\'humidité excessif dans le substrat (> 85%), provoquant un manque d\'oxygène dans le fond du bac.',
    actions: [
      'Mesurer la température au cœur du substrat avec une sonde. Si T > 30°C, étaler la couche de substrat (ne pas dépasser 5 à 7 cm d\'épaisseur).',
      'Effectuer le "test du poing serré" : presser une poignée de substrat. Si de l\'eau ruisselle entre les doigts, le milieu est trop humide. Ajouter immédiatement un matériau absorbant carboné (son de riz, sciure fine de bois non traité).',
      'Assurer une bonne ventilation au-dessus des bacs pour favoriser l\'évaporation.'
    ],
    scientificRef: 'Manuel EAWAG / SOP Unité de Traitement des Déchets — Chapitre 3'
  },
  {
    id: 'ants',
    icon: 'bug_report',
    title: 'Invasion de fourmis ou d\'autres prédateurs',
    category: 'Parasites',
    symptoms: [
      'Colonnes de fourmis grimpant sur les pieds des tables ou étagères',
      'Fourmis attaquant les grappes d\'œufs ou les jeunes larves 5-DOL'
    ],
    diagnosis: 'Rupture de la barrière physique de biosécurité. Les fourmis sont les prédateurs les plus destructeurs des pontes et des nouveau-nés en climat tropical.',
    actions: [
      'Vérifier impérativement les "Ant Traps" (pièges à eau) sous chaque pied de support.',
      'Remplir chaque coupelle d\'eau et ajouter UNE GOUTTE DE DÉTERGENT LIQUIDE pour rompre la tension superficielle de l\'eau (empêche les fourmis de flotter et traverser).',
      'Éloigner les étagères d\'au moins 15 cm des murs et couper toute branche ou câble en contact avec les structures.',
      'Nettoyer le sol avec une solution désinfectante pour effacer les pistes de phéromones.'
    ],
    scientificRef: 'SOP Biosécurité Insectarium — Annexe Technique Ant Traps'
  },
  {
    id: 'smell',
    icon: 'air',
    title: 'Odeurs nauséabondes ou fortes d\'ammoniac',
    category: 'Environnement & Odeurs',
    symptoms: [
      'Forte odeur d\'ammoniac irritante pour les yeux',
      'Odeur putride anaérobie rappelant les décharges non contrôlées',
      'Substrat noirci et visqueux'
    ],
    diagnosis: 'Anaérobiose aiguë (manque d\'oxygène) due à un excès d\'azote/protéines, à un substrat trop compact ou à une humidité excessive sans aération.',
    actions: [
      'Remuer doucement le substrat à l\'aide d\'une fourche ou spatule pour réoxygéner le milieu.',
      'Réduire la part de déchets carnés, poissonniers ou fientes pures, et rééquilibrer le ratio C/N avec des déchets végétaux et du son.',
      'Diminuer la ration quotidienne et vérifier le drainage au fond du conteneur.',
      'S\'assurer que le flux d\'air dans le bâtiment de conversion est d\'au moins 0.5 à 1 m/s.'
    ],
    scientificRef: 'Gestion de l\'Aération et du Frass — Guide FiBL Bioconversion'
  },
  {
    id: 'nurserie-mortality',
    icon: 'dangerous',
    title: 'Mortalité anormale des jeunes larves (5-DOL)',
    category: 'Comportement',
    symptoms: [
      'Les larves nouveau-nées ne grandissent pas ou meurent en 48-72h',
      'Le substrat de démarrage a formé une croûte sèche en surface',
      'Les larves sont desséchées ou immobiles'
    ],
    diagnosis: 'Dessèchement précoce du milieu de nurserie OU toxicité chimique (résidus d\'insecticides sur épluchures) OU température de nurserie < 24°C ou > 35°C.',
    actions: [
      'Respecter la formule standard de démarrage : 30% provende pour poussins + 70% eau tiède propre.',
      'Couvrir légèrement les bacs de nurserie d\'un voile respirant pour maintenir 65-75% d\'humidité sans condensation directe sur les larves.',
      'S\'approvisionner en intrants 5-DOL certifiés auprès de l\'Unité Centrale pour sécuriser les premiers cycles.',
      'Tester la présence de résidus toxiques sur les lots de déchets suspects.'
    ],
    scientificRef: 'Protocole de Nurserie Standardisée — Hatchling Showers EAWAG'
  },
  {
    id: 'mating-failure',
    icon: 'wb_sunny',
    title: 'Absence d\'accouplement ou ponte très faible dans l\'insectarium',
    category: 'Reproduction',
    symptoms: [
      'Les mouches restent immobiles au sol ou au fond de la Love Cage',
      'Pas de formation de couples en vol',
      'Très peu ou pas de pontes déposées dans les planchettes alvéolées'
    ],
    diagnosis: 'Intensité lumineuse ou spectre inadapté, température trop basse (< 25°C), ou absence d\'attractant olfactif pour stimuler la ponte.',
    actions: [
      'Vérifier la lumière : Hermetia illucens exige une lumière naturelle directe ou un éclairage LED spécifique avec pics à 440 nm (bleu) et 540 nm (vert), avec une intensité de 3 000 à 6 000 lux.',
      'Maintenir la température de la chambre nuptiale entre 27°C et 32°C avec un taux d\'humidité supérieur à 60%.',
      'Placer un récipient d\'attractant odorant (eau + substrat fermenté de larves) sous les blocs de ponte sans que les planchettes ne touchent le liquide.',
      'Vaporiser une brumisation fine d\'eau potable sur la maille des cages deux fois par jour pour l\'hydratation des adultes.'
    ],
    scientificRef: 'Optimisation de la Chambre Nuptiale — EAWAG Section Reproduction'
  }
];

export default function DiagnosticWizard() {
  const [issues, setIssues] = useState<DiagnosticIssue[]>(DIAGNOSTIC_ISSUES);
  const [selectedIssueId, setSelectedIssueId] = useState<string>(DIAGNOSTIC_ISSUES[0].id);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetch('/api/admin/diagnostic')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.rules && data.rules.length > 0) {
          const activeRules = data.rules
            .filter((r: any) => r.actif)
            .map((r: any) => ({
              id: r.idRegle || r._id,
              icon: r.icon,
              title: r.title,
              category: r.category,
              symptoms: r.symptoms || [],
              diagnosis: r.diagnosis,
              actions: r.actions || [],
              scientificRef: r.scientificRef
            }));
          if (activeRules.length > 0) {
            setIssues(activeRules);
            setSelectedIssueId(activeRules[0].id);
          }
        }
      })
      .catch((err) => console.warn('Fallback diagnostic local:', err));
  }, []);

  const filteredIssues = issues.filter(issue => {
    const matchCat = filterCategory === 'all' || issue.category === filterCategory;
    const matchSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        issue.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        issue.symptoms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const currentIssue = issues.find(i => i.id === selectedIssueId) || issues[0];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-6 md:p-8 text-white">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-100 text-xs font-semibold backdrop-blur-sm mb-2">
          <span className="material-icons text-sm">health_and_safety</span>
          Outil d'Aide à la Décision Terrain
        </div>
        <h2 className="text-2xl md:text-3xl font-heading font-bold">
          Wizard de Diagnostic d'Élevage BSF
        </h2>
        <p className="text-amber-100 text-sm md:text-base mt-1 max-w-2xl">
          Identifiez instantanément les causes d'anomalies sur votre site de grossissement et appliquez les protocoles correctifs officiels.
        </p>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Colonne Liste & Filtres (Gauche) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Recherche */}
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un symptôme..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
            <span className="material-icons absolute left-3 top-2.5 text-gray-400 text-lg">search</span>
          </div>

          {/* Filtres catégories */}
          <div className="flex flex-wrap gap-1.5 pb-2">
            {['all', 'Comportement', 'Parasites', 'Environnement & Odeurs', 'Reproduction'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  filterCategory === cat
                    ? 'bg-amber-600 text-white font-semibold shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'Tous' : cat}
              </button>
            ))}
          </div>

          {/* Liste des anomalies */}
          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {filteredIssues.map(issue => (
              <div
                key={issue.id}
                onClick={() => setSelectedIssueId(issue.id)}
                className={`p-4 rounded-xl cursor-pointer border transition-all text-left ${
                  selectedIssueId === issue.id
                    ? 'bg-amber-50/80 border-amber-400 shadow-sm'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${selectedIssueId === issue.id ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <span className="material-icons text-lg">{issue.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded">
                      {issue.category}
                    </span>
                    <h4 className="font-semibold text-gray-900 text-sm mt-1 leading-snug">
                      {issue.title}
                    </h4>
                  </div>
                </div>
              </div>
            ))}

            {filteredIssues.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-sm">
                Aucun problème trouvé pour cette recherche.
              </div>
            )}
          </div>
        </div>

        {/* Colonne Détail & Résolution (Droite) */}
        <div className="lg:col-span-7">
          <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                  {currentIssue.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-2">
                  {currentIssue.title}
                </h3>
              </div>
              <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
                <span className="material-icons text-2xl">{currentIssue.icon}</span>
              </div>
            </div>

            {/* Symptômes observés */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
                <span className="material-icons text-sm text-gray-400">visibility</span>
                Symptômes observables
              </h4>
              <ul className="space-y-1.5">
                {currentIssue.symptoms.map((symptom, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="material-icons text-amber-600 text-sm mt-0.5">fiber_manual_record</span>
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Diagnostic scientifique */}
            <div className="p-4 bg-white rounded-xl border-l-4 border-amber-500 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1 flex items-center gap-1">
                <span className="material-icons text-sm">psychology</span>
                Diagnostic & Cause Biologique
              </h4>
              <p className="text-sm text-gray-800 leading-relaxed font-medium">
                {currentIssue.diagnosis}
              </p>
            </div>

            {/* Protocole d'actions correctives */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-1.5">
                <span className="material-icons text-sm text-emerald-600">task_alt</span>
                Actions Correctives Immédiates
              </h4>
              <div className="space-y-2.5">
                {currentIssue.actions.map((action, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-200">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-gray-700 leading-snug">
                      {action}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Référence et contact */}
            <div className="pt-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="material-icons text-xs">menu_book</span>
                Source : {currentIssue.scientificRef}
              </span>
              <a
                href="https://wa.me/2250700000000?text=Bonjour,%20j'ai%20besoin%20d'aide%20pour%20un%20diagnostic%20d'élevage%20BSF"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold hover:underline"
              >
                <span className="material-icons text-xs">support_agent</span>
                Assistance Technique WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
