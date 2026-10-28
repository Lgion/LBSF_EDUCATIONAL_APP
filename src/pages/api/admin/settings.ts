import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/mongodb';
import { getPlatformSettings, DEFAULT_SETTINGS } from '../../../lib/settings';
import type { IPlatformSettings } from '../../../types/bsf';

export const prerender = false;

// GET : Récupérer tous les paramètres (y compris passerelles inactives pour l'admin)
export const GET: APIRoute = async () => {
  try {
    const settings = await getPlatformSettings();
    return new Response(JSON.stringify({ success: true, settings }), {
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

// PUT : Sauvegarder les paramètres dans MongoDB
export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const db = await getDb();
    const collection = db.collection('platform_settings');

    const updatedData: Partial<IPlatformSettings> = {
      devise: body.devise || DEFAULT_SETTINGS.devise,
      payments: body.payments || DEFAULT_SETTINGS.payments,
      calculator: body.calculator || DEFAULT_SETTINGS.calculator,
      contact: body.contact || DEFAULT_SETTINGS.contact,
      updatedAt: new Date()
    };

    await collection.updateOne(
      { _id: 'global_config' as any },
      { $set: updatedData },
      { upsert: true }
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Paramètres mis à jour avec succès.',
        settings: updatedData
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, message: error.message || 'Erreur mise à jour paramètres' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
