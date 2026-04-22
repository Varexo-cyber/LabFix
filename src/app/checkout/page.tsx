'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { createOrderApi } from '@/lib/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle, Lock, ShoppingBag, Truck } from 'lucide-react';

export default function CheckoutPage() {
  const { t, locale, formatPrice, user, cart, cartTotal, clearCart } = useApp();
  const router = useRouter();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [notes, setNotes] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingPostalCode, setShippingPostalCode] = useState('');
  const [shippingCountry, setShippingCountry] = useState('');
  const [useAccountAddress, setUseAccountAddress] = useState(true);
  
  // Guest checkout fields
  const [guestEmail, setGuestEmail] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestCompanyName, setGuestCompanyName] = useState('');
  const [guestKvkNumber, setGuestKvkNumber] = useState('');
  const [guestVatNumber, setGuestVatNumber] = useState('');
  
  // Billing address (for guests)
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billingAddress, setBillingAddress] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingPostalCode, setBillingPostalCode] = useState('');
  const [billingCountry, setBillingCountry] = useState('Nederland');

  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) {
      router.push('/cart');
      return;
    }
    if (user) {
      setShippingAddress(user.address);
      setShippingCity(user.city);
      setShippingPostalCode(user.postalCode);
      setShippingCountry(user.country);
    }
  }, [user, cart, router, orderPlaced]);

  const shippingCost = cartTotal >= 150 ? 0 : 14.95;
  const total = cartTotal + shippingCost;
  const isGuest = !user;

  const handleUseAccountAddress = (checked: boolean) => {
    setUseAccountAddress(checked);
    if (checked && user) {
      setShippingAddress(user.address);
      setShippingCity(user.city);
      setShippingPostalCode(user.postalCode);
      setShippingCountry(user.country);
    } else {
      setShippingAddress('');
    }
  };

  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createOrderApi({
        userId: user?.id || 'guest',
        userEmail: isGuest ? guestEmail : user?.email || '',
        companyName: isGuest ? guestCompanyName : user?.companyName || '',
        kvkNumber: isGuest ? guestKvkNumber : user?.kvkNumber || '',
        vatNumber: isGuest ? guestVatNumber : user?.btwNumber || '',
        contactPerson: isGuest ? guestName : user?.contactPerson || '',
        phone: isGuest ? guestPhone : user?.phone || '',
        shippingAddress,
        shippingCity,
        shippingPostalCode,
        shippingCountry,
        billingAddress: billingSameAsShipping ? shippingAddress : billingAddress,
        billingCity: billingSameAsShipping ? shippingCity : billingCity,
        billingPostalCode: billingSameAsShipping ? shippingPostalCode : billingPostalCode,
        billingCountry: billingSameAsShipping ? shippingCountry : billingCountry,
        items: cart.map(item => ({
          product: item.product,
          quantity: item.quantity,
          priceAtPurchase: item.product.price,
        })),
        subtotal: cartTotal,
        shippingCost,
        total,
        notes,
      });
      if (result.success && result.id) {
        setOrderId(result.id);
        setOrderPlaced(true);
        clearCart();
      }
    } catch (err) {
      console.error('Order placement failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 animate-scale-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">{t('checkout.success')}</h1>
          <p className="text-gray-500 mb-6">{t('checkout.successMessage')}</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-500">{t('checkout.orderNumber')}</p>
            <p className="text-xl font-bold text-primary-500">{orderId}</p>
          </div>
          <div className="flex gap-4 justify-center">
            <Link href="/account" className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-semibold">
              {t('account.orders')}
            </Link>
            <Link href="/products" className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold">
              {t('cart.continue')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">{t('checkout.title')}</h1>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Shipping details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Verzending</h2>
              
              {/* Guest or User Info */}
                {!user && !orderPlaced && (
                  <div className="bg-white rounded-lg border p-6 mb-4">
                    <h3 className="text-lg font-semibold mb-4">Contactgegevens</h3>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Naam *</label>
                          <input
                            type="text"
                            required
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                            placeholder="Jan Jansen"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Telefoon *</label>
                          <input
                            type="tel"
                            required
                            value={guestPhone}
                            onChange={(e) => setGuestPhone(e.target.value)}
                            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                            placeholder="06 12345678"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                        <input
                          type="email"
                          required
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                          placeholder="jan@example.com"
                        />
                      </div>
                      
                      {/* Company Info (Optional) */}
                      <div className="border-t pt-4 mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Bedrijfsgegevens (optioneel)</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Bedrijfsnaam</label>
                            <input
                              type="text"
                              value={guestCompanyName}
                              onChange={(e) => setGuestCompanyName(e.target.value)}
                              className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                              placeholder="Uw Bedrijf B.V."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">KVK-nummer</label>
                            <input
                              type="text"
                              value={guestKvkNumber}
                              onChange={(e) => setGuestKvkNumber(e.target.value)}
                              className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                              placeholder="12345678"
                            />
                          </div>
                        </div>
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-600 mb-1">BTW-nummer</label>
                          <input
                            type="text"
                            value={guestVatNumber}
                            onChange={(e) => setGuestVatNumber(e.target.value)}
                            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                            placeholder="NL123456789B01"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t text-center">
                      <p className="text-sm text-gray-500">
                        Al een account?{' '}
                        <Link href="/account/login" className="text-primary-600 hover:underline">
                          Log in
                        </Link>
                      </p>
                    </div>
                  </div>
                )}

                {/* Shipping Form */}
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="text-lg font-semibold mb-4">{t('checkout.shipping')}</h3>
                  
                  {user && (
                    <label className="flex items-center gap-2 mb-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useAccountAddress}
                        onChange={(e) => setUseAccountAddress(e.target.checked)}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span className="text-sm text-gray-600">Gebruik mijn account adres</span>
                    </label>
                  )}
                </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t('auth.address')} *</label>
                  <input type="text" required value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)}
                    disabled={useAccountAddress}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t('auth.postalCode')} *</label>
                  <input type="text" required value={shippingPostalCode} onChange={(e) => setShippingPostalCode(e.target.value)}
                    disabled={useAccountAddress}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t('auth.city')} *</label>
                  <input type="text" required value={shippingCity} onChange={(e) => setShippingCity(e.target.value)}
                    disabled={useAccountAddress}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t('auth.country')} *</label>
                  <input type="text" required value={shippingCountry} onChange={(e) => setShippingCountry(e.target.value)}
                    disabled={useAccountAddress}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500" />
                </div>
              </div>
            </div>

            {/* Billing Address */}
            {!user && (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Factuuradres</h3>
                
                <label className="flex items-center gap-2 mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={billingSameAsShipping}
                    onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span className="text-sm text-gray-600">Factuuradres is hetzelfde als verzendadres</span>
                </label>
                
                {!billingSameAsShipping && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Adres *</label>
                      <input 
                        type="text" 
                        required 
                        value={billingAddress} 
                        onChange={(e) => setBillingAddress(e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Postcode *</label>
                      <input 
                        type="text" 
                        required 
                        value={billingPostalCode} 
                        onChange={(e) => setBillingPostalCode(e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Plaats *</label>
                      <input 
                        type="text" 
                        required 
                        value={billingCity} 
                        onChange={(e) => setBillingCity(e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Land *</label>
                      <input 
                        type="text" 
                        required 
                        value={billingCountry} 
                        onChange={(e) => setBillingCountry(e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500" />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold mb-3">{t('checkout.notes')}</h2>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 resize-none"
                placeholder={t('checkout.notes')}
              />
            </div>
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-32">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShoppingBag size={20} className="text-primary-500" />
                {t('checkout.summary')}
              </h2>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    {item.product.image && (
                      <img src={item.product.image} alt="" className="w-12 h-12 rounded object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-500">x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t('cart.subtotal')}</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t('cart.shipping')}</span>
                  <span>{shippingCost === 0 ? <span className="text-green-600 font-medium">Gratis</span> : formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                  <span>{t('cart.total')}</span>
                  <span className="text-primary-500">{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-gray-400">{locale === 'nl' ? 'incl. BTW' : 'incl. VAT'}</p>
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-accent-500 text-white py-3 rounded-lg font-semibold hover:bg-accent-600 transition-colors flex items-center justify-center gap-2"
              >
                <Lock size={16} />
                {t('checkout.placeOrder')}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">{t('features.secureDesc')}</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
