import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import type { ITestimonial } from '../../../types/bsf';

export const prerender = false;

const DEFAULT_TESTIMONIALS: ITestimonial[] = [
  {
    nom: 'Lucas D.',
    titreOuMetier: 'Agriculteur & Aviculteur',
    localisation: 'Yamoussoukro, Côte d\'Ivoire',
    message: 'Après avoir suivi la formation pratique, j\'ai pu mettre en place une unité BSF sur mon exploitation qui valorise mes déchets agricoles. Mes volailles bénéficient d\'une alimentation riche en protéines fraîches à moindre coût.',
    noteEtoiles: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    actif: true,
    ordreAffichage: 1
  },
  {
    nom: 'Maria S.',
    titreOuMetier: 'Entrepreneure Circulaire',
    localisation: 'Abidjan (Cocody), Côte d\'Ivoire',
    message: 'J\'ai suivi la formation avant de me lancer dans mon projet de ferme satellite. L\'approvisionnement régulier en 5-DOL de la nurserie centrale m\'a permis de démarrer sereinement et sans mortalité.',
    noteEtoiles: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    actif: true,
    ordreAffichage: 2
  },
  {
    nom: 'Hamid T.',
    titreOuMetier: 'Gérant de Restaurant & Traiteur',
    localisation: 'Songon, Côte d\'Ivoire',
    message: 'La journée d\'initiation m\'a ouvert les yeux sur le potentiel des biodéchets de mon établissement. Aujourd\'hui nous valorisons 100% de nos épluchures et restes de cuisine grâce au réseau ReWaste.',
    noteEtoiles: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    actif: true,
    ordreAffichage: 3
  },
  {
    nom: 'Jacinthe M.',
    titreOuMetier: 'Directrice de Coopérative Maraîchère',
    localisation: 'Azaguié, Côte d\'Ivoire',
    message: 'Notre coopérative utilise le frass BSF comme biofertilisant certifié. Nos rendements en tomates et piments ont augmenté de 25% tout en éliminant les intrants chimiques de synthèse.',
    noteEtoiles: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    actif: true,
    ordreAffichage: 4
  }
];

export const GET: APIRoute = async () => {
  try {
    const db = await getDb();
    const collection = db.collection('testimonials');
    let items = await collection.find({}).sort({ ordreAffichage: 1 }).toArray();

    if (items.length === 0) {
      await collection.insertMany(DEFAULT_TESTIMONIALS as any);
      items = await collection.find({}).sort({ ordreAffichage: 1 }).toArray();
    }

    return new Response(JSON.stringify({ success: true, testimonials: items }), {
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
    const collection = db.collection('testimonials');

    const item: ITestimonial = {
      nom: body.nom || 'Anonyme',
      titreOuMetier: body.titreOuMetier || '',
      localisation: body.localisation || '',
      message: body.message || '',
      noteEtoiles: Number(body.noteEtoiles) || 5,
      avatarUrl: body.avatarUrl || '',
      actif: body.actif !== undefined ? Boolean(body.actif) : true,
      ordreAffichage: Number(body.ordreAffichage) || 0,
      createdAt: new Date()
    };

    const res = await collection.insertOne(item as any);
    return new Response(JSON.stringify({ success: true, insertedId: res.insertedId, testimonial: item }), {
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
    if (fields.noteEtoiles !== undefined) fields.noteEtoiles = Number(fields.noteEtoiles);
    if (fields.ordreAffichage !== undefined) fields.ordreAffichage = Number(fields.ordreAffichage);
    if (fields.actif !== undefined) fields.actif = Boolean(fields.actif);

    await db.collection('testimonials').updateOne(
      { _id: new ObjectId(_id) },
      { $set: fields }
    );

    return new Response(JSON.stringify({ success: true, message: 'Témoignage mis à jour' }), {
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
    await db.collection('testimonials').deleteOne({ _id: new ObjectId(id) });

    return new Response(JSON.stringify({ success: true, message: 'Témoignage supprimé' }), {
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
