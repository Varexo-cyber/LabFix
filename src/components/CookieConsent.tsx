'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Shield, FileText } from 'lucide-react';

interface ConsentPreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  accepted: boolean;
  timestamp: string;
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    accepted: false,
    timestamp: '',
  });

  useEffect(() => {
    // Check if user has already made a choice
    const stored = localStorage.getItem('cookieConsent');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.accepted) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    } else {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const consent: ConsentPreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      accepted: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    setPreferences(consent);
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    const consent: ConsentPreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      accepted: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    setPreferences(consent);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    const consent: ConsentPreferences = {
      ...preferences,
      accepted: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    setPreferences(consent);
    setIsVisible(false);
  };

  const handleDecline = () => {
    const consent: ConsentPreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      accepted: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    setPreferences(consent);
    setIsVisible(false);
  };

  const togglePreference = (key: 'analytics' | 'marketing') => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1.5">
              <img src="/logo.png" alt="LabFix" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Cookie Voorkeuren</h3>
              <p className="text-sm text-white/80">Wij waarderen uw privacy</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showDetails ? (
            <>
              <p className="text-gray-600 mb-4">
                Wij gebruiken cookies om uw ervaring op onze website te verbeteren, 
                verkeer te analyseren en gepersonaliseerde content te tonen. 
                Door op "Accepteren" te klikken, gaat u akkoord met ons gebruik van cookies.
              </p>

              {/* Links */}
              <div className="flex flex-wrap gap-3 mb-6">
                <Link 
                  href="/algemene-voorwaarden" 
                  className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                >
                  <FileText size={14} />
                  Algemene Voorwaarden
                </Link>
                <Link 
                  href="/privacy-policy" 
                  className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                >
                  <Shield size={14} />
                  Privacy Policy
                </Link>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-md"
                >
                  Alle Cookies Accepteren
                </button>
                <button
                  onClick={() => setShowDetails(true)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Voorkeuren Beheren
                </button>
              </div>

              <button
                onClick={handleDecline}
                className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 py-2"
              >
                Alleen Essentiële Cookies
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowDetails(false)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
              >
                ← Terug
              </button>

              <div className="space-y-4 mb-6">
                {/* Essential - Always on */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-5 h-5 bg-primary-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">Essentiële Cookies</h4>
                    <p className="text-sm text-gray-500">
                      Noodzakelijk voor het functioneren van de website. Kan niet worden uitgeschakeld.
                    </p>
                  </div>
                </div>

                {/* Analytics */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="analytics"
                    checked={preferences.analytics}
                    onChange={() => togglePreference('analytics')}
                    className="w-5 h-5 text-primary-500 rounded focus:ring-primary-500 mt-0.5"
                  />
                  <div className="flex-1">
                    <label htmlFor="analytics" className="font-semibold text-gray-800 cursor-pointer">
                      Analytische Cookies
                    </label>
                    <p className="text-sm text-gray-500">
                      Helpen ons de website te verbeteren door bezoekersstatistieken te verzamelen.
                    </p>
                  </div>
                </div>

                {/* Marketing */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="marketing"
                    checked={preferences.marketing}
                    onChange={() => togglePreference('marketing')}
                    className="w-5 h-5 text-primary-500 rounded focus:ring-primary-500 mt-0.5"
                  />
                  <div className="flex-1">
                    <label htmlFor="marketing" className="font-semibold text-gray-800 cursor-pointer">
                      Marketing Cookies
                    </label>
                    <p className="text-sm text-gray-500">
                      Worden gebruikt om relevante advertenties en marketingcampagnes te tonen.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSavePreferences}
                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-md"
              >
                Voorkeuren Opslaan
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
