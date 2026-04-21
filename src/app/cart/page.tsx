'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Trash2, Minus, Plus, ShoppingCart, ArrowLeft, Truck } from 'lucide-react';

export default function CartPage() {
  const { t, locale, formatPrice, cart, cartTotal, removeFromCart, updateQuantity, user } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">{t('cart.title')}</h1>

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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, i) => {
              const name = locale === 'nl' ? item.product.name : item.product.nameEn;
              return (
                <div key={item.product.id} className="bg-white rounded-xl shadow-md p-4 flex gap-4 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <Link href={`/products/${item.product.id}`} className="flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.product.id}`}>
                      <h3 className="font-semibold text-gray-800 hover:text-primary-500 transition-colors">
                        {name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500">{item.product.sku}</p>
                    <p className="text-primary-500 font-bold mt-1">{formatPrice(item.product.price)}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-gray-100"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-gray-100"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="font-bold text-gray-800">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-32">
              <h2 className="text-xl font-bold mb-4">{t('cart.title')}</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span>{t('cart.subtotal')}</span>
                  <span className="font-semibold">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t('cart.shipping')}</span>
                  <span className="font-semibold">
                    {cartTotal >= 150
                      ? (locale === 'nl' ? 'Gratis' : 'Free')
                      : formatPrice(14.95)}
                  </span>
                </div>
                {cartTotal < 150 && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Truck size={14} />
                    {t('cart.freeShipping')}
                  </div>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>{t('cart.total')}</span>
                  <span className="text-primary-500">
                    {formatPrice(cartTotal + (cartTotal >= 150 ? 0 : 14.95))}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{locale === 'nl' ? 'incl. BTW' : 'incl. VAT'}</p>
              </div>

              <Link href={user ? '/checkout' : '/account/login'} className="block w-full bg-accent-500 text-white py-3 rounded-lg font-semibold hover:bg-accent-600 transition-colors text-center">
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
