import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import type { IFaqItem } from '../../../types/bsf';

export const prerender = false;

const DEFAULT_FAQ: IFaqItem[] = [
  {
    question: 'Faut-il des connaissances préalables pour suivre vos formations ?',
    reponse: 'Non, nos formations sont conçues pour être accessibles à tous les niveaux. Que vous soyez éleveur, agriculteur ou sans formation biologique, nos agronomes vous transmettent les protocoles pas-à-pas.',
    categorie: 'FORMATIONS',
    ordreAffichage: 1,
    actif: true
  },
  {
    question: 'Où se déroulent les formations pratiques ?',
    reponse: 'Nos formations pratiques ont lieu au Centre BSF de Songon (banlieue ouest d\'Abidjan) où vous manipulez directement les Love Cages, les hatchling showers de la nurserie et les Larveros de grossissement.',
    categorie: 'FORMATIONS',
    ordreAffichage: 2,
    actif: true
  },
  {
    question: 'Puis-je devenir ferme satellite après la formation ?',
    reponse: 'Absolument ! Les participants aux formations 3 jours et 5 jours peuvent candidater prioritairement pour rejoindre le réseau satellite et recevoir leurs doses hebdomadaires de 5-DOL calibrées.',
    categorie: 'SATELLITE',
    ordreAffichage: 3,
    actif: true
  },
  {
    question: 'Comment fonctionnent les livraisons de 5-DOL par la boutique ?',
    reponse: 'Les jeunes larves (5-DOL) sont expédiées sous conditionnement ventilé thermo-régulé partout à Abidjan et dans les villes connectées (Azaguié, Dabou, Bassam). Les commandes Wave sont traitées sous 24h ouvrées.',
    categorie: 'BOUTIQUE',
    ordreAffichage: 4,
    actif: true
  },
  {
    question: 'Quels sont les modes de paiement acceptés ?',
    reponse: 'Nous acceptons principalement Wave Côte d\'Ivoire pour des règlements instantanés et sans frais. Selon la configuration, d\'autres moyens (Orange Money, Djamo, espèces au centre) sont également disponibles.',
    categorie: 'GENERAL',
    ordreAffichage: 5,
    actif: true
  }
];

export const GET: APIRoute = async () => {
  try {
    const db = await getDb();
    const collection = db.collection('faq');
    let items = await collection.find({}).sort({ ordreAffichage: 1 }).toArray();

    if (items.length === 0) {
      await collection.insertMany(DEFAULT_FAQ as any);
      items = await collection.find({}).sort({ ordreAffichage: 1 }).toArray();
    }

    return new Response(JSON.stringify({ success: true, faq: items }), {
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
    const collection = db.collection('faq');

    const item: IFaqItem = {
      question: body.question || '',
      reponse: body.reponse || '',
      categorie: body.categorie || 'GENERAL',
      ordreAffichage: Number(body.ordreAffichage) || 0,
      actif: body.actif !== undefined ? Boolean(body.actif) : true,
      createdAt: new Date()
    };

    const res = await collection.insertOne(item as any);
    return new Response(JSON.stringify({ success: true, insertedId: res.insertedId, faq: item }), {
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
    if (fields.ordreAffichage !== undefined) fields.ordreAffichage = Number(fields.ordreAffichage);
    if (fields.actif !== undefined) fields.actif = Boolean(fields.actif);

    await db.collection('faq').updateOne(
      { _id: new ObjectId(_id) },
      { $set: fields }
    );

    return new Response(JSON.stringify({ success: true, message: 'FAQ mise à jour' }), {
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
    await db.collection('faq').deleteOne({ _id: new ObjectId(id) });

    return new Response(JSON.stringify({ success: true, message: 'Question supprimée' }), {
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
