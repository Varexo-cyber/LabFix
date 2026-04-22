'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { registerUserApi } from '@/lib/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, Building2, AlertCircle, CheckCircle, User, Briefcase } from 'lucide-react';

export default function RegisterPage() {
  const { t } = useApp();
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [customerType, setCustomerType] = useState<'individual' | 'business'>('individual');
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    companyName: '',
    kvkNumber: '',
    contactPerson: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Nederland',
    agreeTerms: false,
    newsletter: false,
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
    if (customerType === 'business' && form.kvkNumber.length < 8) {
      setError('KVK nummer moet 8 cijfers bevatten');
      return;
    }

    if (!form.agreeTerms) {
      setError('Je moet akkoord gaan met de algemene voorwaarden en privacy policy');
      return;
    }

    setLoading(true);
    try {
      const result = await registerUserApi({
        email: form.email,
        password: form.password,
        customerType,
        firstName: form.firstName,
        lastName: form.lastName,
        companyName: customerType === 'business' ? form.companyName : undefined,
        kvkNumber: customerType === 'business' ? form.kvkNumber : undefined,
        contactPerson: customerType === 'business' ? form.contactPerson : undefined,
        phone: form.phone,
        address: form.address,
        city: form.city,
        postalCode: form.postalCode,
        country: form.country,
        newsletter: form.newsletter,
      });

      // If newsletter is checked, also subscribe to newsletter
      if (form.newsletter && result.success) {
        fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email })
        }).catch(() => {});
      }

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
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4 animate-fade-in-up">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-scale-in">
          <div className="text-center mb-8">
            <img src="/logo.png" alt="LabFix" className="h-14 w-auto mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800">
              {customerType === 'business' ? t('auth.registerTitle') : 'Account Aanmaken'}
            </h1>
            <p className="text-gray-500 text-center mt-2">
              {customerType === 'business' ? 'Maak een zakelijk account aan' : 'Maak een persoonlijk account aan'}
            </p>
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
            {/* Customer Type Toggle */}
            <div className="border-b pb-5">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Account Type</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setCustomerType('individual')}
                  className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    customerType === 'individual'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <User size={20} />
                  <span className="font-medium">Particulier</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerType('business')}
                  className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    customerType === 'business'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Briefcase size={20} />
                  <span className="font-medium">Zakelijk</span>
                </button>
              </div>
            </div>

            {/* Personal/Business Info */}
            <div className="border-b pb-5">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                {customerType === 'business' ? 'Bedrijfsgegevens' : 'Persoonlijke gegevens'}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {customerType === 'individual' ? (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Voornaam *</label>
                      <input type="text" name="firstName" required value={form.firstName} onChange={handleChange}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Achternaam *</label>
                      <input type="text" name="lastName" required value={form.lastName} onChange={handleChange}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors" />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Bedrijfsnaam *</label>
                      <input type="text" name="companyName" required value={form.companyName} onChange={handleChange}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">KVK Nummer *</label>
                      <input type="text" name="kvkNumber" required value={form.kvkNumber} onChange={handleChange}
                          placeholder="12345678" maxLength={8}
                          className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Contactpersoon *</label>
                      <input type="text" name="contactPerson" required value={form.contactPerson} onChange={handleChange}
                          className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors" />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Telefoonnummer *</label>
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

            {/* Terms and Newsletter Checkboxes */}
            <div className="space-y-3 border-t border-gray-200 pt-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.agreeTerms}
                  onChange={(e) => setForm({ ...form, agreeTerms: e.target.checked })}
                  className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600">
                  Ik ga akkoord met de{' '}
                  <Link href="/algemene-voorwaarden" className="text-primary-600 hover:underline" target="_blank">
                    Algemene Voorwaarden
                  </Link>{' '}
                  en{' '}
                  <Link href="/privacy-policy" className="text-primary-600 hover:underline" target="_blank">
                    Privacy Policy
                  </Link>
                  <span className="text-red-500">*</span>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.newsletter}
                  onChange={(e) => setForm({ ...form, newsletter: e.target.checked })}
                  className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600">
                  Ik wil me aanmelden voor de nieuwsbrief met updates en aanbiedingen
                </span>
              </label>
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
