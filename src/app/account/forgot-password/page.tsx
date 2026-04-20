'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, Mail, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || 'Er is een fout opgetreden');
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
            <h1 className="text-2xl font-bold text-gray-800">Wachtwoord vergeten</h1>
            <p className="text-gray-500 mt-2">Voer uw email in om een reset link te ontvangen</p>
          </div>

          {success ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-6 rounded-lg text-center">
              <CheckCircle size={48} className="mx-auto mb-4" />
              <p className="font-semibold">Reset link verstuurd!</p>
              <p className="text-sm mt-2">Controleer uw email inbox voor de reset link.</p>
              <Link href="/account/login" className="text-primary-500 font-semibold mt-4 inline-block hover:underline">
                Terug naar login
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="info@uwbedrijf.nl"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Versturen...' : 'Reset link versturen'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/account/login" className="text-gray-500 text-sm hover:text-primary-500">
                  ← Terug naar login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
