'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { fetchOrders, Order } from '@/lib/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Building2, LogOut, User, Clock, CheckCircle, Truck, XCircle, AlertCircle, Edit2, Save, X, MapPin, FileText, Check } from 'lucide-react';

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
  const { t, user, logout, setUser } = useApp();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'details'>('orders');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    kvkNumber: '',
    btwNumber: '',
    contactPerson: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Nederland',
    billingAddress: '',
    billingCity: '',
    billingPostalCode: '',
    billingCountry: 'Nederland',
    billingSameAsShipping: true,
  });

  // Redirect if not logged in + fetch orders
  useEffect(() => {
    if (!user) {
      router.push('/account/login');
      return;
    }
    fetchOrders(user.id).then(setOrders);
  }, [user, router]);

  // Initialize form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        companyName: user.companyName || '',
        kvkNumber: user.kvkNumber || '',
        btwNumber: user.btwNumber || '',
        contactPerson: user.contactPerson || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
        country: user.country || 'Nederland',
        billingAddress: user.billingAddress || '',
        billingCity: user.billingCity || '',
        billingPostalCode: user.billingPostalCode || '',
        billingCountry: user.billingCountry || 'Nederland',
        billingSameAsShipping: user.billingSameAsShipping !== false,
      });
    }
  }, [user]);

  // Sync billing address when shipping changes and "same as shipping" is checked
  useEffect(() => {
    if (formData.billingSameAsShipping) {
      setFormData(prev => ({
        ...prev,
        billingAddress: prev.address,
        billingCity: prev.city,
        billingPostalCode: prev.postalCode,
        billingCountry: prev.country,
      }));
    }
  }, [formData.address, formData.city, formData.postalCode, formData.country, formData.billingSameAsShipping]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBillingSameAsShippingChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      billingSameAsShipping: checked,
      ...(checked && {
        billingAddress: prev.address,
        billingCity: prev.city,
        billingPostalCode: prev.postalCode,
        billingCountry: prev.country,
      })
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          ...formData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setUser(result.user);
        setSaveSuccess(true);
        setIsEditing(false);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(result.message || 'Er is een fout opgetreden');
      }
    } catch (error) {
      setSaveError('Er is een fout opgetreden bij het opslaan');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSaveError('');
    // Reset form to user data
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        companyName: user.companyName || '',
        kvkNumber: user.kvkNumber || '',
        btwNumber: user.btwNumber || '',
        contactPerson: user.contactPerson || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
        country: user.country || 'Nederland',
        billingAddress: user.billingAddress || '',
        billingCity: user.billingCity || '',
        billingPostalCode: user.billingPostalCode || '',
        billingCountry: user.billingCountry || 'Nederland',
        billingSameAsShipping: user.billingSameAsShipping !== false,
      });
    }
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
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{t('account.details')}</h1>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    <Edit2 size={18} />
                    Bewerken
                  </button>
                )}
              </div>

              {saveSuccess && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <Check size={18} />
                  <span>Gegevens succesvol opgeslagen!</span>
                </div>
              )}

              {saveError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <AlertCircle size={18} />
                  <span>{saveError}</span>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-md p-6">
                {isEditing ? (
                  // Edit Mode
                  <div className="space-y-6">
                    {/* Personal/Business Info */}
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <User size={20} />
                        {user.customerType === 'business' ? 'Bedrijfsgegevens' : 'Persoonlijke gegevens'}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {user.customerType === 'business' ? (
                          <>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1">Bedrijfsnaam</label>
                              <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleInputChange}
                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1">KVK Nummer</label>
                              <input
                                type="text"
                                name="kvkNumber"
                                value={formData.kvkNumber}
                                onChange={handleInputChange}
                                maxLength={8}
                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1">BTW Nummer</label>
                              <input
                                type="text"
                                name="btwNumber"
                                value={formData.btwNumber}
                                onChange={handleInputChange}
                                placeholder="NL123456789B01"
                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1">Contactpersoon</label>
                              <input
                                type="text"
                                name="contactPerson"
                                value={formData.contactPerson}
                                onChange={handleInputChange}
                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors"
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1">Voornaam</label>
                              <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1">Achternaam</label>
                              <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors"
                              />
                            </div>
                          </>
                        )}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Telefoonnummer</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">E-mailadres</label>
                          <input
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 bg-gray-100 text-gray-500 cursor-not-allowed"
                          />
                          <p className="text-xs text-gray-500 mt-1">E-mail kan niet worden gewijzigd. Neem contact op met <a href="/contact" className="text-primary-600 hover:underline">klantenservice</a>.</p>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="border-t pt-6">
                      <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <MapPin size={20} />
                        Verzendadres
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Adres</label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Postcode</label>
                          <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Plaats</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Land</label>
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Billing Address */}
                    <div className="border-t pt-6">
                      <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <FileText size={20} />
                        Factuuradres
                      </h3>
                      
                      <label className="flex items-center gap-3 mb-4 cursor-pointer">
                        <input
                          type="checkbox"
                          name="billingSameAsShipping"
                          checked={formData.billingSameAsShipping}
                          onChange={(e) => handleBillingSameAsShippingChange(e.target.checked)}
                          className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">Factuuradres is hetzelfde als verzendadres</span>
                      </label>

                      {!formData.billingSameAsShipping && (
                        <div className="grid md:grid-cols-2 gap-4 animate-fade-in">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Factuuradres</label>
                            <input
                              type="text"
                              name="billingAddress"
                              value={formData.billingAddress}
                              onChange={handleInputChange}
                              className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Postcode</label>
                            <input
                              type="text"
                              name="billingPostalCode"
                              value={formData.billingPostalCode}
                              onChange={handleInputChange}
                              className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Plaats</label>
                            <input
                              type="text"
                              name="billingCity"
                              value={formData.billingCity}
                              onChange={handleInputChange}
                              className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Land</label>
                            <input
                              type="text"
                              name="billingCountry"
                              value={formData.billingCountry}
                              onChange={handleInputChange}
                              className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="border-t pt-6 flex gap-3">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Opslaan...
                          </>
                        ) : (
                          <>
                            <Save size={18} />
                            Opslaan
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                      >
                        <X size={18} />
                        Annuleren
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Company/Personal Info */}
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <User size={20} />
                        {user.customerType === 'business' ? 'Bedrijfsgegevens' : 'Persoonlijke gegevens'}
                      </h3>
                      <div className="space-y-3 text-sm">
                        {user.customerType === 'business' ? (
                          <>
                            <p><span className="text-gray-500">Bedrijfsnaam:</span> <strong>{user.companyName || '-'}</strong></p>
                            <p><span className="text-gray-500">KVK Nummer:</span> <strong>{user.kvkNumber || '-'}</strong></p>
                            <p><span className="text-gray-500">BTW Nummer:</span> <strong>{user.btwNumber || '-'}</strong></p>
                            <p><span className="text-gray-500">Contactpersoon:</span> <strong>{user.contactPerson || '-'}</strong></p>
                          </>
                        ) : (
                          <>
                            <p><span className="text-gray-500">Voornaam:</span> <strong>{user.firstName || '-'}</strong></p>
                            <p><span className="text-gray-500">Achternaam:</span> <strong>{user.lastName || '-'}</strong></p>
                          </>
                        )}
                        <p><span className="text-gray-500">Telefoon:</span> <strong>{user.phone || '-'}</strong></p>
                        <p><span className="text-gray-500">E-mail:</span> <strong>{user.email}</strong></p>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <MapPin size={20} />
                        Verzendadres
                      </h3>
                      <div className="space-y-1 text-sm bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium">{user.companyName || user.firstName + ' ' + user.lastName}</p>
                        <p>{user.address || '-'}</p>
                        <p>{user.postalCode} {user.city}</p>
                        <p>{user.country}</p>
                      </div>
                    </div>

                    {/* Billing Address */}
                    <div className="md:col-span-2">
                      <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <FileText size={20} />
                        Factuuradres
                      </h3>
                      {user.billingSameAsShipping !== false ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 p-4 rounded-lg border border-green-200">
                          <Check size={16} className="text-green-500" />
                          <span>Hetzelfde als verzendadres</span>
                        </div>
                      ) : (
                        <div className="space-y-1 text-sm bg-gray-50 p-4 rounded-lg">
                          <p className="font-medium">{user.companyName || user.firstName + ' ' + user.lastName}</p>
                          <p>{user.billingAddress || '-'}</p>
                          <p>{user.billingPostalCode} {user.billingCity}</p>
                          <p>{user.billingCountry}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
