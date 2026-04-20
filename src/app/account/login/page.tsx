'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { loginUserApi, setCurrentUser } from '@/lib/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Building2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { t, setUser } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await loginUserApi(email, password);
      if (result.success && result.user) {
        setCurrentUser(result.user);
        setUser(result.user);
        router.push('/account');
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
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-scale-in">
          <div className="text-center mb-8">
            <img src="/logo.png" alt="LabFix" className="h-14 w-auto mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800">{t('auth.loginTitle')}</h1>
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('auth.email')}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="info@uwbedrijf.nl"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-semibold text-gray-700">{t('auth.password')}</label>
                <Link href="/account/forgot-password" className="text-xs text-primary-500 hover:underline">
                  Wachtwoord vergeten?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
            >
              {t('auth.login')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              {t('auth.noAccount')}{' '}
              <Link href="/account/register" className="text-primary-500 font-semibold hover:underline">
                {t('auth.register')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
