'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { registerUserApi } from '@/lib/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, Building2, AlertCircle, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const { t } = useApp();
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    kvkNumber: '',
    contactPerson: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Nederland',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return;
    }
    if (form.password.length < 6) {
      setError('Wachtwoord moet minimaal 6 tekens zijn');
      return;
    }
    if (form.kvkNumber.length < 8) {
      setError('KVK nummer moet 8 cijfers bevatten');
      return;
    }

    setLoading(true);
    try {
      const result = await registerUserApi({
        email: form.email,
        password: form.password,
        companyName: form.companyName,
        kvkNumber: form.kvkNumber,
        contactPerson: form.contactPerson,
        phone: form.phone,
        address: form.address,
        city: form.city,
        postalCode: form.postalCode,
        country: form.country,
      });

      if (result.success) {
        setSuccess(t('auth.registerSuccess'));
        setTimeout(() => router.push('/account/login'), 2000);
      } else {
        setError(result.message);
      }
    } catch {
      setError('Er is een fout opgetreden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-scale-in">
          <div className="text-center mb-8">
            <img src="/logo.png" alt="LabFix" className="h-14 w-auto mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800">{t('auth.registerTitle')}</h1>
            <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-500">
              <Building2 size={14} />
              <span>{t('auth.b2bOnly')}</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <CheckCircle size={16} />
              <span className="text-sm">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="border-b pb-5">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">{t('account.company')}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t('auth.companyName')} *</label>
                  <input type="text" name="companyName" required value={form.companyName} onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t('auth.kvkNumber')} *</label>
                  <input type="text" name="kvkNumber" required value={form.kvkNumber} onChange={handleChange}
                    placeholder="12345678" maxLength={8}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t('auth.contactPerson')} *</label>
                  <input type="text" name="contactPerson" required value={form.contactPerson} onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t('auth.phone')} *</label>
                  <input type="tel" name="phone" required value={form.phone} onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors" />
                </div>
              </div>
            </div>

            <div className="border-b pb-5">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">{t('checkout.shippingAddress')}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t('auth.address')} *</label>
                  <input type="text" name="address" required value={form.address} onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t('auth.postalCode')} *</label>
                  <input type="text" name="postalCode" required value={form.postalCode} onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t('auth.city')} *</label>
                  <input type="text" name="city" required value={form.city} onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t('auth.country')} *</label>
                  <input type="text" name="country" required value={form.country} onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">{t('auth.loginTitle')}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t('auth.email')} *</label>
                  <input type="email" name="email" required value={form.email} onChange={handleChange}
                    placeholder="info@uwbedrijf.nl"
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t('auth.password')} *</label>
                  <input type="password" name="password" required value={form.password} onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t('auth.confirmPassword')} *</label>
                  <input type="password" name="confirmPassword" required value={form.confirmPassword} onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-accent-500 text-white py-3 rounded-lg font-semibold hover:bg-accent-600 transition-colors text-lg"
            >
              {t('auth.register')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              {t('auth.hasAccount')}{' '}
              <Link href="/account/login" className="text-primary-500 font-semibold hover:underline">
                {t('auth.login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
