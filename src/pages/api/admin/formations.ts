import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import type { IFormation } from '../../../types/bsf';

export const prerender = false;

const DEFAULT_FORMATIONS: IFormation[] = [
  {
    code: 'DEBUTANT',
    titre: 'Initiation à l\'Élevage BSF & Bioconversion',
    description: 'Une journée intensive pour comprendre les bases de l\'élevage BSF, la biologie d\'Hermetia illucens et le modèle hybride d\'Unité Centrale.',
    dureeJours: 1,
    prixFcfa: 25000,
    sessionsAvenir: [
      {
        idSession: 'sess-init-01',
        dateDebut: '2026-10-15',
        dateFin: '2026-10-15',
        lieu: 'Centre BSF Abidjan - Songon',
        placesDisponibles: 12
      }
    ]
  },
  {
    code: 'INTERMEDIAIRE',
    titre: 'Formation Pratique Élevage, Inoculation & Récolte',
    description: 'Formation hands-on au cœur de la ferme : manipulation des 5-DOL, gestion du substrat humide, récolte et blanchiment 90°C.',
    dureeJours: 3,
    prixFcfa: 150000,
    sessionsAvenir: [
      {
        idSession: 'sess-prat-01',
        dateDebut: '2026-10-22',
        dateFin: '2026-10-24',
        lieu: 'Centre BSF Abidjan - Songon',
        placesDisponibles: 8
      }
    ]
  },
  {
    code: 'AVANCE',
    titre: 'Intégration au Réseau de Fermes Satellites',
    description: 'Programme complet de partenariat : équipement, approvisionnement hebdomadaire garanti en 5-DOL, monitoring BCR et rachat des récoltes.',
    dureeJours: 5,
    prixFcfa: 450000,
    sessionsAvenir: [
      {
        idSession: 'sess-sat-01',
        dateDebut: '2026-11-05',
        dateFin: '2026-11-09',
        lieu: 'Songon & Visite Exploitation Azaguié',
        placesDisponibles: 5
      }
    ]
  }
];

export const GET: APIRoute = async () => {
  try {
    const db = await getDb();
    const collection = db.collection('formations');
    let items = await collection.find({}).toArray();

    // Auto-seed si la collection est vide
    if (items.length === 0) {
      await collection.insertMany(DEFAULT_FORMATIONS as any);
      items = await collection.find({}).toArray();
    }

    return new Response(JSON.stringify({ success: true, formations: items }), {
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
    const collection = db.collection('formations');

    const newFormation: IFormation = {
      code: body.code || 'INTERMEDIAIRE',
      titre: body.titre || 'Nouvelle Formation',
      description: body.description || '',
      dureeJours: Number(body.dureeJours) || 1,
      prixFcfa: Number(body.prixFcfa || body.prix) || 0,
      sessionsAvenir: body.sessionsAvenir || []
    };

    const result = await collection.insertOne(newFormation as any);
    return new Response(JSON.stringify({ success: true, insertedId: result.insertedId, formation: newFormation }), {
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
    const { _id, ...updateFields } = body;

    if (!_id) {
      return new Response(JSON.stringify({ success: false, message: '_id requis' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = await getDb();
    const collection = db.collection('formations');

    if (updateFields.dureeJours !== undefined) {
      updateFields.dureeJours = Number(updateFields.dureeJours);
    }
    if (updateFields.prixFcfa !== undefined) {
      updateFields.prixFcfa = Number(updateFields.prixFcfa);
    }

    await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateFields }
    );

    return new Response(JSON.stringify({ success: true, message: 'Formation mise à jour' }), {
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
    await db.collection('formations').deleteOne({ _id: new ObjectId(id) });

    return new Response(JSON.stringify({ success: true, message: 'Formation supprimée' }), {
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
