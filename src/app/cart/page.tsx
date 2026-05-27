'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Trash2, Minus, Plus, ShoppingCart, ArrowLeft, Truck } from 'lucide-react';
import { NL_SHIPPING, FREE_SHIPPING_THRESHOLD } from '@/lib/shipping';

// Highlight important model keywords for better distinction
function highlightModelKeywords(name: string) {
  const keywords = [
    { pattern: /\bPro Max\b/gi, className: 'text-primary-600 font-bold' },
    { pattern: /\bPro\b(?! Max)/gi, className: 'text-primary-600 font-semibold' },
    { pattern: /\bPlus\b/gi, className: 'text-blue-600 font-semibold' },
    { pattern: /\bMini\b/gi, className: 'text-green-600 font-semibold' },
    { pattern: /\bUltra\b/gi, className: 'text-purple-600 font-semibold' },
    { pattern: /\bMax\b(?! Pro)/gi, className: 'text-orange-600 font-semibold' },
    { pattern: /\bSE\b/gi, className: 'text-gray-600 font-semibold' },
  ];

  let highlighted = name;
  keywords.forEach(({ pattern, className }) => {
    highlighted = highlighted.replace(pattern, `<span class="${className}">$&</span>`);
  });

  return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
}

export default function CartPage() {
  const { t, locale, formatPrice, cart, cartTotal, removeFromCart, updateQuantity, user, vatMode } = useApp();
  // cartTotal = gross (incl BTW). Derive helpers for cart summary.
  const VAT_RATE = 0.21;
  const shippingIncl = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : NL_SHIPPING;
  const totalIncl = cartTotal + shippingIncl; // what customer actually pays
  const subtotalDisplay = vatMode === 'incl' ? cartTotal : cartTotal / (1 + VAT_RATE);
  const shippingDisplay = vatMode === 'incl' ? shippingIncl : shippingIncl / (1 + VAT_RATE);
  const vatAmount = totalIncl - totalIncl / (1 + VAT_RATE); // BTW portion of the full bill

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">{t('cart.title')}</h1>

      {cart.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center animate-scale-in">
          <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-xl mb-6">{t('cart.empty')}</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-semibold"
          >
            <ArrowLeft size={18} />
            {t('cart.continue')}
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, i) => {
              const name = locale === 'nl' ? item.product.name : item.product.nameEn;
              return (
                <div key={item.product.id} className="bg-white rounded-xl shadow-md p-4 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="flex gap-3">
                    <Link href={`/products/${item.product.id}`} className="flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={name}
                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/products/${item.product.id}`} className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 hover:text-primary-500 transition-colors text-sm md:text-base leading-tight">
                            {highlightModelKeywords(name)}
                          </h3>
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 flex-shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{item.product.sku}</p>
                      <p className="text-primary-500 font-bold mt-1 text-sm md:text-base">{formatPrice(item.product.price)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100 active:bg-gray-200"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-4 text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100 active:bg-gray-200"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="font-bold text-gray-800">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-5 lg:sticky lg:top-32">
              <h2 className="text-xl font-bold mb-4">{t('cart.title')}</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span>{t('cart.subtotal')} <span className="text-xs text-gray-400">({vatMode === 'incl' ? (locale === 'nl' ? 'incl.' : 'incl.') : (locale === 'nl' ? 'excl.' : 'excl.')} BTW)</span></span>
                  <span className="font-semibold">€{subtotalDisplay.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t('cart.shipping')}</span>
                  <span className="font-semibold">
                    {shippingIncl === 0
                      ? (locale === 'nl' ? 'Gratis' : 'Free')
                      : `€${shippingDisplay.toFixed(2)}`}
                  </span>
                </div>
                {vatMode === 'excl' && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{locale === 'nl' ? 'BTW (21%)' : 'VAT (21%)'}</span>
                    <span className="font-semibold">€{vatAmount.toFixed(2)}</span>
                  </div>
                )}
                {cartTotal < FREE_SHIPPING_THRESHOLD && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Truck size={14} />
                    {t('cart.freeShipping')}
                  </div>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>{t('cart.total')}</span>
                  <span className="text-primary-500">€{totalIncl.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{locale === 'nl' ? 'incl. BTW' : 'incl. VAT'}</p>
              </div>

              <Link href={user ? '/checkout' : '/account/login?redirect=/cart'} className="block w-full bg-accent-500 text-white py-3 rounded-lg font-semibold hover:bg-accent-600 transition-colors text-center">
                {t('cart.checkout')}
              </Link>
              {!user && (
                <p className="text-xs text-gray-400 text-center mt-2">{t('checkout.loginRequired')}</p>
              )}

              <Link
                href="/products"
                className="block text-center text-primary-500 hover:text-primary-600 mt-4 text-sm"
              >
                {t('cart.continue')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
