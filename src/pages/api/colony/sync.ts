import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/mongodb';
import type { IProductionLog } from '../../../types/bsf';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const logs: IProductionLog[] = body.logs || [];

    if (!Array.isArray(logs) || logs.length === 0) {
      return new Response(JSON.stringify({ success: false, message: 'Aucun log fourni' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = await getDb();
    const collection = db.collection('production_logs');

    // Insertion ou mise à jour avec upsert sur idLocalDexie
    const operations = logs.map((log) => ({
      updateOne: {
        filter: { idLocalDexie: log.idLocalDexie },
        update: {
          $set: {
            ...log,
            syncedAt: new Date()
          }
        },
        upsert: true
      }
    }));

    const result = await collection.bulkWrite(operations);

    return new Response(
      JSON.stringify({
        success: true,
        message: `${result.upsertedCount + result.modifiedCount} logs synchronisés avec succès.`,
        syncedCount: logs.length
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('Erreur API /api/colony/sync:', error);
    return new Response(
      JSON.stringify({ success: false, message: error.message || 'Erreur serveur interne' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
