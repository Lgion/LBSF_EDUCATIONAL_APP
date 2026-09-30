// Service d'intégration des paiements direct Wave Côte d'Ivoire

export function getWavePaymentUrl(amountFcfa: number, orderOrEnrollmentId: string, clientName?: string): string {
  const baseUrl = 
    (typeof process !== 'undefined' && process.env?.MY_WAVE_URI) ||
    (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_MY_WAVE_URI) ||
    'https://pay.wave.com/m/M_ci_hsvjN_ywTw2K/c/ci/?amount=';

  const cleanAmount = Math.max(0, Math.round(amountFcfa));
  const memo = encodeURIComponent(`REWASTE_${orderOrEnrollmentId}${clientName ? '_' + clientName.replace(/\s+/g, '') : ''}`);
  
  // Si le baseUrl contient déjà 'amount=', on concatène directement
  if (baseUrl.includes('amount=')) {
    return `${baseUrl}${cleanAmount}&memo=${memo}`;
  }
  return `${baseUrl}?amount=${cleanAmount}&memo=${memo}`;
}
