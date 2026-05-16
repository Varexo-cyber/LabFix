'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';

export default function BetalingVoltooidPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [status, setStatus] = useState<'loading' | 'paid' | 'pending' | 'failed'>('loading');

  useEffect(() => {
    if (!orderId) {
      setStatus('failed');
      return;
    }

    // Poll order status — webhook may still be processing
    let attempts = 0;
    const check = async () => {
      try {
        const res = await fetch(`/api/orders?orderId=${orderId}`);
        const orders = await res.json();
        const order = Array.isArray(orders) ? orders.find((o: any) => o.id === orderId) : null;

        if (order?.status === 'paid') {
          setStatus('paid');
        } else if (attempts >= 8) {
          // After ~8 seconds, show pending if not yet confirmed
          setStatus('pending');
        } else {
          attempts++;
          setTimeout(check, 1000);
        }
      } catch {
        setStatus('pending');
      }
    };

    check();
  }, [orderId]);

  if (status === 'loading') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Loader2 size={48} className="animate-spin text-primary-500 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">Betaling wordt verwerkt...</p>
      </div>
    );
  }

  if (status === 'paid') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Betaling geslaagd!</h1>
          <p className="text-gray-500 mb-6">Uw bestelling is bevestigd en wordt zo snel mogelijk verwerkt.</p>
          {orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <p className="text-sm text-gray-500">Bestelnummer</p>
              <p className="text-xl font-bold text-primary-500">{orderId}</p>
            </div>
          )}
          <div className="flex gap-4 justify-center">
            <Link href="/account" className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-semibold">
              Mijn bestellingen
            </Link>
            <Link href="/products" className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold">
              Verder winkelen
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock size={40} className="text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Betaling in behandeling</h1>
          <p className="text-gray-500 mb-6">Uw betaling wordt verwerkt. U ontvangt een bevestigingsmail zodra de betaling is goedgekeurd.</p>
          {orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <p className="text-sm text-gray-500">Bestelnummer</p>
              <p className="text-xl font-bold text-primary-500">{orderId}</p>
            </div>
          )}
          <Link href="/account" className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-semibold">
            Mijn bestellingen
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-2xl shadow-xl p-12">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={40} className="text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Betaling mislukt</h1>
        <p className="text-gray-500 mb-8">Er is iets misgegaan met uw betaling. Probeer het opnieuw.</p>
        <Link href="/checkout" className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-semibold">
          Opnieuw proberen
        </Link>
      </div>
    </div>
  );
}
