import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    // Extraer moneda, por defecto VES
    const { searchParams } = new URL(request.url)
    const fiat = searchParams.get('fiat') || 'VES'

    let bcvRate = null;
    let binanceRate = null;

    // 1. Obtener BCV (sólo aplica para VES)
    if (fiat === 'VES') {
      try {
        const bcvRes = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', { cache: 'no-store' });
        if (bcvRes.ok) {
          const data = await bcvRes.json();
          bcvRate = data.promedio;
        }
      } catch (err) {
        console.error('Error fetching BCV:', err);
      }
    }

    // 2. Obtener Binance P2P Promedio
    try {
      const binanceRes = await fetch('https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fiat: fiat,
          page: 1,
          rows: 10,
          tradeType: 'BUY',
          asset: 'USDT',
          countries: [],
          proMerchantAds: false,
          shieldMerchantAds: false,
          publisherType: null,
          payTypes: []
        }),
        cache: 'no-store'
      });

      if (binanceRes.ok) {
        const responseData = await binanceRes.json();
        const ads = responseData.data;
        if (ads && ads.length > 0) {
          const prices = ads.map(ad => parseFloat(ad.adv.price));
          const sum = prices.reduce((a, b) => a + b, 0);
          binanceRate = sum / prices.length;
        }
      }
    } catch (err) {
      console.error('Error fetching Binance:', err);
    }

    return NextResponse.json({
      bcv: bcvRate,
      binance: binanceRate,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error in rates API:', error)
    return NextResponse.json({ error: 'Failed to fetch rates' }, { status: 500 })
  }
}
