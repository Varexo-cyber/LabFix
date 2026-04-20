'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { fetchOrders, Order } from '@/lib/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Building2, LogOut, User, Clock, CheckCircle, Truck, XCircle, AlertCircle } from 'lucide-react';

const statusIcon = (status: string) => {
  switch (status) {
    case 'pending': return <Clock size={16} className="text-yellow-500" />;
    case 'processing': return <AlertCircle size={16} className="text-blue-500" />;
    case 'shipped': return <Truck size={16} className="text-purple-500" />;
    case 'delivered': return <CheckCircle size={16} className="text-green-500" />;
    case 'cancelled': return <XCircle size={16} className="text-red-500" />;
    default: return null;
  }
};

export default function AccountPage() {
  const { t, user, logout } = useApp();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'details'>('orders');

  useEffect(() => {
    if (!user) {
      router.push('/account/login');
      return;
    }
    fetchOrders(user.id).then(setOrders);
  }, [user, router]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in-up">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-md p-6 animate-fade-in-left">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <User size={28} className="text-primary-500" />
              </div>
              <h2 className="font-bold text-gray-800">{user.contactPerson}</h2>
              <p className="text-sm text-gray-500">{user.companyName}</p>
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Package size={18} /> {t('account.orders')}
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${activeTab === 'details' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Building2 size={18} /> {t('account.details')}
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} /> {t('auth.logout')}
              </button>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 animate-fade-in-right delay-100">
          {activeTab === 'orders' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('account.orders')}</h1>
              {orders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <Package size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">{t('account.noOrders')}</p>
                  <Link href="/products" className="inline-block bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                    {t('cart.continue')}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <p className="font-bold text-gray-800">{order.id}</p>
                          <p className="text-sm text-gray-500">
                            {t('account.orderDate')}: {new Date(order.createdAt).toLocaleDateString('nl-NL')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {statusIcon(order.status)}
                          <span className="text-sm font-medium">{t(`order.${order.status}`)}</span>
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex flex-wrap gap-4">
                          {order.items.slice(0, 3).map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                              {item.product.image && (
                                <img src={item.product.image} alt="" className="w-10 h-10 rounded object-cover" />
                              )}
                              <div>
                                <p className="text-sm font-medium">{item.product.name}</p>
                                <p className="text-xs text-gray-500">x{item.quantity}</p>
                              </div>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <span className="text-sm text-gray-400">+{order.items.length - 3} meer</span>
                          )}
                        </div>
                      </div>
                      <div className="border-t mt-4 pt-4 flex justify-between items-center">
                        <p className="font-bold text-lg">€{order.total.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('account.details')}</h1>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3">{t('account.company')}</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">{t('auth.companyName')}:</span> <strong>{user.companyName}</strong></p>
                      <p><span className="text-gray-500">{t('auth.kvkNumber')}:</span> <strong>{user.kvkNumber}</strong></p>
                      <p><span className="text-gray-500">{t('auth.contactPerson')}:</span> <strong>{user.contactPerson}</strong></p>
                      <p><span className="text-gray-500">{t('auth.phone')}:</span> <strong>{user.phone}</strong></p>
                      <p><span className="text-gray-500">{t('auth.email')}:</span> <strong>{user.email}</strong></p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3">{t('checkout.shippingAddress')}</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>{user.companyName}</strong></p>
                      <p>{user.address}</p>
                      <p>{user.postalCode} {user.city}</p>
                      <p>{user.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
