'use client';

import { useState, useEffect } from 'react';
import { Lock, Unlock, Construction } from 'lucide-react';

export default function MaintenancePage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Check if already unlocked on mount
  useEffect(() => {
    const unlocked = document.cookie.includes('maintenance_unlock=123');
    if (unlocked) {
      setIsUnlocked(true);
      // Auto redirect after 1.5 seconds
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    }
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (code === '123') {
      // Set cookie
      document.cookie = 'maintenance_unlock=123; path=/; max-age=86400';
      setIsUnlocked(true);
      
      // Reload to trigger middleware
      window.location.href = '/';
    } else {
      setError('Ongeldige code. Probeer opnieuw.');
    }
  };

  if (isUnlocked) {
    return (
      <div className="min-h-screen bg-[#1e40af] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Unlock className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Toegang Verleend</h1>
          <p className="text-gray-600 mb-6">Je hebt toegang tot de website. Even geduld...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1e40af] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
        {/* Icon */}
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Construction className="w-10 h-10 text-orange-500" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Tijdelijk in Onderhoud
        </h1>
        
        <p className="text-gray-600 text-center mb-8">
          De website is momenteel in onderhoud. Vul de toegangscode in om door te gaan.
        </p>

        {/* Lock Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
            <Lock className="w-8 h-8 text-gray-500" />
          </div>
        </div>

        {/* Unlock Form */}
        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Voer code in..."
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 text-center text-lg tracking-widest placeholder:text-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              maxLength={10}
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center bg-red-50 py-2 rounded-lg border border-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
          >
            Ontgrendelen
          </button>
        </form>

        {/* Footer */}
        <p className="text-gray-400 text-xs text-center mt-8">
          © {new Date().getFullYear()} LabFix - Tijdelijk niet beschikbaar
        </p>
      </div>
    </div>
  );
}
