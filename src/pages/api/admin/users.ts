import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import type { IUser } from '../../../types/bsf';

export const prerender = false;

const SAMPLE_USERS: IUser[] = [
  {
    clerkUserId: 'user_admin_01',
    email: 'hi.cyril@gmail.com',
    nom: 'Admin',
    prenom: 'Cyril',
    telephone: '+225 07 07 00 00 01',
    whatsapp: '+225 07 07 00 00 01',
    roles: ['SUPER_ADMIN'],
    localisation: { ville: 'Abidjan', commune: 'Cocody' },
    createdAt: new Date('2026-09-01')
  },
  {
    clerkUserId: 'user_sat_01',
    email: 'ferme.azaguie@rewaste-bsf.ci',
    nom: 'Kouassi',
    prenom: 'Jean-Marc',
    telephone: '+225 07 48 12 34 56',
    whatsapp: '+225 07 48 12 34 56',
    roles: ['SATELLITE_PARTNER'],
    localisation: { ville: 'Azaguié', commune: 'Zone Agricole Est' },
    createdAt: new Date('2026-09-10')
  },
  {
    clerkUserId: 'user_client_01',
    email: 'bamba.fatou@yahoo.fr',
    nom: 'Bamba',
    prenom: 'Fatou',
    telephone: '+225 05 11 22 33 44',
    whatsapp: '+225 05 11 22 33 44',
    roles: ['CLIENT', 'LEARNER'],
    localisation: { ville: 'Abidjan', commune: 'Yopougon' },
    createdAt: new Date('2026-09-18')
  }
];

export const GET: APIRoute = async () => {
  try {
    const db = await getDb();
    const collection = db.collection('users');
    let items = await collection.find({}).toArray();

    if (items.length === 0) {
      await collection.insertMany(SAMPLE_USERS as any);
      items = await collection.find({}).toArray();
    }

    return new Response(JSON.stringify({ success: true, users: items }), {
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
    const { _id, roles } = body;

    if (!_id) {
      return new Response(JSON.stringify({ success: false, message: '_id requis' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = await getDb();
    await db.collection('users').updateOne(
      { _id: new ObjectId(_id) },
      { $set: { roles, updatedAt: new Date() } }
    );

    return new Response(JSON.stringify({ success: true, message: 'Rôles utilisateur mis à jour' }), {
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
