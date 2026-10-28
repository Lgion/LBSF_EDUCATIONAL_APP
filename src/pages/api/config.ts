import type { APIRoute } from 'astro';
import { getPlatformSettings } from '../../lib/settings';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const settings = await getPlatformSettings();
    // Filtre les passerelles pour n'exposer au public QUE celles activées
    const activePayments = settings.payments.filter((p) => p.actif);

    return new Response(
      JSON.stringify({
        success: true,
        devise: settings.devise,
        calculator: settings.calculator,
        payments: activePayments,
        contact: settings.contact
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60'
        }
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, message: error.message || 'Erreur chargement configuration' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
