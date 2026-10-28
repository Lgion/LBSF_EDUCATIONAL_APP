import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import type { IDiagnosticEntry } from '../../../types/bsf';

export const prerender = false;

const DEFAULT_DIAGNOSTIC_RULES: IDiagnosticEntry[] = [
  {
    idRegle: 'escape',
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
      'Effectuer le test du poing serré : presser une poignée de substrat. Si de l\'eau ruisselle, ajouter immédiatement du son de riz ou de la sciure fine non traitée.',
      'Assurer une bonne ventilation au-dessus des bacs pour favoriser l\'évaporation.'
    ],
    scientificRef: 'Manuel EAWAG / SOP Unité de Traitement des Déchets — Chapitre 3',
    actif: true
  },
  {
    idRegle: 'ants',
    icon: 'bug_report',
    title: 'Invasion de fourmis ou de prédateurs dans l\'insectarium',
    category: 'Parasites',
    symptoms: [
      'Colonnes de fourmis grimpant sur les pieds des tables ou étagères',
      'Fourmis attaquant les grappes d\'œufs ou les jeunes larves 5-DOL'
    ],
    diagnosis: 'Rupture de la barrière physique de biosécurité. Les fourmis sont les prédateurs les plus destructeurs des pontes en climat tropical.',
    actions: [
      'Vérifier impérativement les "Ant Traps" (coupelles d\'eau) sous chaque pied de support.',
      'Remplir chaque coupelle d\'eau et ajouter une goutte de détergent liquide pour rompre la tension superficielle.',
      'Éloigner les étagères d\'au moins 15 cm des murs et couper toute branche ou câble en contact.'
    ],
    scientificRef: 'SOP Biosécurité Insectarium — Annexe Technique Ant Traps',
    actif: true
  },
  {
    idRegle: 'smell',
    icon: 'air',
    title: 'Odeurs nauséabondes ou fortes d\'ammoniac',
    category: 'Environnement & Odeurs',
    symptoms: [
      'Forte odeur d\'ammoniac irritante pour les yeux',
      'Odeur putride anaérobie rappelant les décharges non contrôlées',
      'Substrat noirci et visqueux'
    ],
    diagnosis: 'Conditions anaérobies par manque d\'oxygène OU excès d\'azote/protéines fermentescibles dans la ration.',
    actions: [
      'Retourner et aérer mécaniquement le substrat 2 fois par jour à la fourche ou au râteau à main.',
      'Rééquilibrer le ratio C/N en apportant un co-substrat carboné sec (son de blé, sciure fine, balle de riz).',
      'Réduire la ration d\'apport journalière jusqu\'à ce que la colonie résorbe l\'excès.'
    ],
    scientificRef: 'FiBL BSF Field Manual — Optimisation du milieu de bioconversion',
    actif: true
  }
];

export const GET: APIRoute = async () => {
  try {
    const db = await getDb();
    const collection = db.collection('diagnostic_rules');
    let items = await collection.find({}).toArray();

    if (items.length === 0) {
      await collection.insertMany(DEFAULT_DIAGNOSTIC_RULES as any);
      items = await collection.find({}).toArray();
    }

    return new Response(JSON.stringify({ success: true, rules: items }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const db = await getDb();
    const collection = db.collection('diagnostic_rules');

    const item: IDiagnosticEntry = {
      idRegle: body.idRegle || `rule-${Date.now()}`,
      icon: body.icon || 'help_outline',
      title: body.title || 'Nouveau cas de diagnostic',
      category: body.category || 'Comportement',
      symptoms: Array.isArray(body.symptoms) ? body.symptoms : (body.symptoms ? body.symptoms.split('\n') : []),
      diagnosis: body.diagnosis || '',
      actions: Array.isArray(body.actions) ? body.actions : (body.actions ? body.actions.split('\n') : []),
      scientificRef: body.scientificRef || 'SOP ReWaste BSF',
      actif: body.actif !== undefined ? Boolean(body.actif) : true,
      createdAt: new Date()
    };

    const res = await collection.insertOne(item as any);
    return new Response(JSON.stringify({ success: true, insertedId: res.insertedId, rule: item }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { _id, ...fields } = body;

    if (!_id) {
      return new Response(JSON.stringify({ success: false, message: '_id requis' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = await getDb();
    if (fields.actif !== undefined) fields.actif = Boolean(fields.actif);

    await db.collection('diagnostic_rules').updateOne(
      { _id: new ObjectId(_id) },
      { $set: fields }
    );

    return new Response(JSON.stringify({ success: true, message: 'Règle mise à jour' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ success: false, message: 'id requis' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = await getDb();
    await db.collection('diagnostic_rules').deleteOne({ _id: new ObjectId(id) });

    return new Response(JSON.stringify({ success: true, message: 'Règle supprimée' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
