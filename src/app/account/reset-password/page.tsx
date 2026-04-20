'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, Lock, CheckCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Ongeldige reset link');
      setVerifying(false);
      return;
    }

    // Verify token
    fetch(`/api/auth/verify-reset-token?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          setValidToken(true);
        } else {
          setError('Deze reset link is verlopen of ongeldig');
        }
        setVerifying(false);
      })
      .catch(() => {
        setError('Er is een fout opgetreden');
        setVerifying(false);
      });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Wachtwoorden komen niet overeen');
      return;
    }

    if (password.length < 6) {
      setError('Wachtwoord moet minimaal 6 tekens zijn');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
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

  if (verifying) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-12 px-4 animate-fade-in">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Link verifiëren...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4 animate-fade-in-up">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-scale-in">
          <div className="text-center mb-8">
            <img src="/logo.png" alt="LabFix" className="h-14 w-auto mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800">Nieuw wachtwoord</h1>
          </div>

          {success ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-6 rounded-lg text-center">
              <CheckCircle size={48} className="mx-auto mb-4" />
              <p className="font-semibold">Wachtwoord gewijzigd!</p>
              <p className="text-sm mt-2">Uw wachtwoord is succesvol aangepast.</p>
              <Link href="/account/login" className="text-primary-500 font-semibold mt-4 inline-block hover:underline">
                Inloggen met nieuw wachtwoord
              </Link>
            </div>
          ) : !validToken ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-6 rounded-lg text-center">
              <AlertCircle size={48} className="mx-auto mb-4" />
              <p className="font-semibold">Ongeldige link</p>
              <p className="text-sm mt-2">{error}</p>
              <Link href="/account/forgot-password" className="text-primary-500 font-semibold mt-4 inline-block hover:underline">
                Nieuwe reset link aanvragen
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nieuw wachtwoord</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="Minimaal 6 tekens"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Wachtwoord bevestigen</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="Herhaal wachtwoord"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Opslaan...' : 'Wachtwoord wijzigen'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
