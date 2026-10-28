import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import type { IProduct } from '../../../types/bsf';

export const prerender = false;

const DEFAULT_PRODUCTS: IProduct[] = [
  {
    code: 'INTR-5DOL-25K',
    nom: 'Dose 25 000 Jeunes Larves (5-DOL)',
    categorie: 'INTRANTS_5DOL',
    description: 'Larves de 5 jours saines et calibrées issues de la nurserie centrale de Songon, prêtes pour l\'engraissement immédiat.',
    prixFcfa: 15000,
    unite: 'DOSE_25K_LARVES',
    estAbonnement: false,
    stockDisponible: 40,
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=60'
  },
  {
    code: 'INTR-5DOL-50K',
    nom: 'Dose 50 000 Jeunes Larves (5-DOL)',
    categorie: 'INTRANTS_5DOL',
    description: 'Dose optimale pour traiter 250 à 300 kg de biodéchets. Résilience maximale et croissance accélérée en 12 jours.',
    prixFcfa: 28000,
    unite: 'DOSE_50K_LARVES',
    estAbonnement: false,
    stockDisponible: 30,
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=60'
  },
  {
    code: 'INTR-SUB-MONTH',
    nom: 'Abonnement Ferme Satellite (4 x 50k 5-DOL)',
    categorie: 'INTRANTS_5DOL',
    description: 'Livraison hebdomadaire garantie à votre ferme chaque lundi matin pour assurer un roulement continu de vos bacs de grossissement.',
    prixFcfa: 95000,
    unite: 'DOSE_50K_LARVES',
    estAbonnement: true,
    frequenceAbonnement: 'MENSUEL',
    stockDisponible: 15,
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60'
  },
  {
    code: 'BIO-FRASS-50KG',
    nom: 'Frass Organique Tamisé Pur (Sac de 50 kg)',
    categorie: 'BIOPRODUITS',
    description: 'Biofertilisant premium N-P-K 4-3-2 enrichi en chitine naturelle, activateur de défenses immunitaires végétales.',
    prixFcfa: 12500,
    unite: 'UNITE',
    estAbonnement: false,
    stockDisponible: 60,
    imageUrl: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=500&auto=format&fit=crop&q=60'
  },
  {
    code: 'BIO-LARV-SEC-10KG',
    nom: 'Larves BSF Séchées Protéinées (Carton 10 kg)',
    categorie: 'BIOPRODUITS',
    description: 'Protéines brutes 42%, lipides sains 28%, calcium biodisponible. Idéal pour pisciculture, aviculture et porciculture.',
    prixFcfa: 18000,
    unite: 'UNITE',
    estAbonnement: false,
    stockDisponible: 25,
    imageUrl: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=500&auto=format&fit=crop&q=60'
  }
];

export const GET: APIRoute = async () => {
  try {
    const db = await getDb();
    const collection = db.collection('products');
    let items = await collection.find({}).toArray();

    if (items.length === 0) {
      await collection.insertMany(DEFAULT_PRODUCTS as any);
      items = await collection.find({}).toArray();
    }

    return new Response(JSON.stringify({ success: true, products: items }), {
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
    const collection = db.collection('products');

    const item: IProduct = {
      code: body.code || `PROD-${Date.now().toString().slice(-6)}`,
      nom: body.nom || 'Nouveau Produit',
      categorie: body.categorie || 'INTRANTS_5DOL',
      description: body.description || '',
      prixFcfa: Number(body.prixFcfa || body.prix) || 0,
      unite: body.unite || 'UNITE',
      estAbonnement: Boolean(body.estAbonnement),
      frequenceAbonnement: body.frequenceAbonnement,
      stockDisponible: Number(body.stockDisponible) || 0,
      imageUrl: body.imageUrl || ''
    };

    const res = await collection.insertOne(item as any);
    return new Response(JSON.stringify({ success: true, insertedId: res.insertedId, product: item }), {
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
    if (fields.prixFcfa !== undefined) fields.prixFcfa = Number(fields.prixFcfa);
    if (fields.stockDisponible !== undefined) fields.stockDisponible = Number(fields.stockDisponible);
    if (fields.estAbonnement !== undefined) fields.estAbonnement = Boolean(fields.estAbonnement);

    await db.collection('products').updateOne(
      { _id: new ObjectId(_id) },
      { $set: fields }
    );

    return new Response(JSON.stringify({ success: true, message: 'Produit mis à jour' }), {
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
    await db.collection('products').deleteOne({ _id: new ObjectId(id) });

    return new Response(JSON.stringify({ success: true, message: 'Produit supprimé' }), {
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
