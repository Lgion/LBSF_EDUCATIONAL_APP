import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import type { IOrder } from '../../../types/bsf';

export const prerender = false;

const SAMPLE_ORDERS: IOrder[] = [
  {
    numeroCommande: 'CMD-2610-001',
    userId: 'user_dev_01',
    articles: [
      { productId: 'p-5dol-50k', nom: 'Dose 50 000 Jeunes Larves (5-DOL)', quantite: 2, prixUnitaireFcfa: 28000 }
    ],
    montantTotalFcfa: 56000,
    statutPaiement: 'PAYE_WAVE',
    statutLivraison: 'PREPARATION',
    adresseLivraison: {
      destinataire: 'Kouassi Jean-Marc',
      telephone: '+225 07 48 12 34 56',
      ville: 'Abidjan',
      quartierOuRepere: 'Yopougon Maroc, carrefour Oasis'
    },
    createdAt: new Date(Date.now() - 3600000 * 4)
  },
  {
    numeroCommande: 'CMD-2610-002',
    userId: 'user_dev_02',
    articles: [
      { productId: 'bio-frass-50kg', nom: 'Frass Organique Tamisé Pur (Sac de 50 kg)', quantite: 4, prixUnitaireFcfa: 12500 }
    ],
    montantTotalFcfa: 50000,
    statutPaiement: 'PAYE_WAVE',
    statutLivraison: 'EN_TRANSIT',
    adresseLivraison: {
      destinataire: 'Mme Bamba Fatou',
      telephone: '+225 05 11 22 33 44',
      ville: 'Azaguié',
      quartierOuRepere: 'Ferme Avicole Les Palmiers'
    },
    createdAt: new Date(Date.now() - 3600000 * 18)
  }
];

export const GET: APIRoute = async () => {
  try {
    const db = await getDb();
    const collection = db.collection('orders');
    let items = await collection.find({}).sort({ createdAt: -1 }).toArray();

    if (items.length === 0) {
      await collection.insertMany(SAMPLE_ORDERS as any);
      items = await collection.find({}).sort({ createdAt: -1 }).toArray();
    }

    return new Response(JSON.stringify({ success: true, orders: items }), {
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

export const PATCH: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { _id, statutLivraison, statutPaiement } = body;

    if (!_id) {
      return new Response(JSON.stringify({ success: false, message: '_id requis' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = await getDb();
    const updateFields: any = { updatedAt: new Date() };
    if (statutLivraison) updateFields.statutLivraison = statutLivraison;
    if (statutPaiement) updateFields.statutPaiement = statutPaiement;

    await db.collection('orders').updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateFields }
    );

    return new Response(JSON.stringify({ success: true, message: 'Commande mise à jour' }), {
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
