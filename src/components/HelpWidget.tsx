'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import {
  MessageCircle,
  X,
  MapPin,
  Phone,
  Mail,
  HelpCircle,
  ExternalLink,
  ChevronLeft,
  Clock,
  Navigation,
} from 'lucide-react';

type ActivePanel = 'main' | 'phone' | 'email' | 'location' | null;

export default function HelpWidget() {
  const { locale } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>('main');
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setActivePanel('main'), 300);
  };

  const nl = locale === 'nl';

  return (
    <div ref={widgetRef} className="fixed bottom-6 right-6 z-50">
      {/* Popup */}
      <div
        className={`absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-primary-600 text-white px-5 py-4">
          <div className="flex items-center justify-between">
            {activePanel !== 'main' && (
              <button
                onClick={() => setActivePanel('main')}
                className="p-1 hover:bg-white/20 rounded-full transition-colors mr-2"
              >
                <ChevronLeft size={18} />
              </button>
            )}
            <div className="flex-1">
              <h3 className="font-bold text-lg">
                {activePanel === 'main' && (nl ? 'Hallo!' : 'Hello!')}
                {activePanel === 'phone' && (nl ? 'Bel ons' : 'Call Us')}
                {activePanel === 'email' && 'E-mail'}
                {activePanel === 'location' && (nl ? 'Locatie' : 'Location')}
              </h3>
              {activePanel === 'main' && (
                <p className="text-sm text-white/80 mt-0.5">
                  {nl ? 'Hoe kunnen we je helpen?' : 'How can we help you?'}
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[400px] overflow-y-auto">
          {/* Main menu */}
          {activePanel === 'main' && (
            <div className="py-2">
              {/* Location */}
              <button
                onClick={() => setActivePanel('location')}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} className="text-primary-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-800 text-sm">{nl ? 'Locatie' : 'Location'}</span>
                  <p className="text-xs text-gray-500">{nl ? 'Ons adres & routebeschrijving' : 'Our address & directions'}</p>
                </div>
                <ExternalLink size={14} className="text-gray-400 ml-auto" />
              </button>

              {/* Live Chat */}
              <button
                onClick={() => {
                  handleClose();
                }}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={20} className="text-green-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-800 text-sm">Live Chat</span>
                  <p className="text-xs text-gray-500">{nl ? 'Chat met ons team' : 'Chat with our team'}</p>
                </div>
                <span className="ml-auto flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-green-600 font-medium">Online</span>
                </span>
              </button>

              {/* Phone */}
              <button
                onClick={() => setActivePanel('phone')}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Phone size={20} className="text-blue-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-800 text-sm">{nl ? 'Telefoon' : 'Phone'}</span>
                  <p className="text-xs text-gray-500">{nl ? 'Bel ons direct' : 'Call us directly'}</p>
                </div>
                <ExternalLink size={14} className="text-gray-400 ml-auto" />
              </button>

              {/* WhatsApp */}
              <a
                href="https://wa.me/31850000000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#25D366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-gray-800 text-sm">WhatsApp</span>
                  <p className="text-xs text-gray-500">{nl ? 'Stuur ons een bericht' : 'Send us a message'}</p>
                </div>
                <ExternalLink size={14} className="text-gray-400 ml-auto" />
              </a>

              {/* Email */}
              <button
                onClick={() => setActivePanel('email')}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                  <Mail size={20} className="text-orange-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-800 text-sm">E-mail</span>
                  <p className="text-xs text-gray-500">{nl ? 'Stuur ons een e-mail' : 'Send us an email'}</p>
                </div>
                <ExternalLink size={14} className="text-gray-400 ml-auto" />
              </button>

              {/* FAQs */}
              <Link
                href="/faq"
                onClick={handleClose}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <HelpCircle size={20} className="text-purple-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-800 text-sm">FAQ&apos;s</span>
                  <p className="text-xs text-gray-500">{nl ? 'Veelgestelde vragen' : 'Frequently asked questions'}</p>
                </div>
                <ExternalLink size={14} className="text-gray-400 ml-auto" />
              </Link>
            </div>
          )}

          {/* Phone panel */}
          {activePanel === 'phone' && (
            <div className="p-5 space-y-4">
              <a
                href="tel:+31850000000"
                className="flex items-center gap-3 bg-blue-50 rounded-xl p-4 hover:bg-blue-100 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Phone size={22} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">+31 (0) 85 000 0000</p>
                  <p className="text-xs text-gray-500">{nl ? 'Klik om te bellen' : 'Click to call'}</p>
                </div>
              </a>

              <div className="flex items-start gap-2 text-sm text-gray-600">
                <Clock size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">{nl ? 'Openingstijden' : 'Business Hours'}</p>
                  <p>{nl ? 'Ma - Vr: 09:00 - 17:00' : 'Mon - Fri: 09:00 - 17:00'}</p>
                  <p>{nl ? 'Za - Zo: Gesloten' : 'Sat - Sun: Closed'}</p>
                </div>
              </div>

              <p className="text-xs text-gray-400 text-center">
                {nl ? 'Standaard belkosten zijn van toepassing' : 'Standard call charges apply'}
              </p>
            </div>
          )}

          {/* Email panel */}
          {activePanel === 'email' && (
            <div className="p-5 space-y-4">
              <a
                href="mailto:info@labfix.nl"
                className="flex items-center gap-3 bg-orange-50 rounded-xl p-4 hover:bg-orange-100 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                  <Mail size={22} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">info@labfix.nl</p>
                  <p className="text-xs text-gray-500">{nl ? 'Klik om te e-mailen' : 'Click to email'}</p>
                </div>
              </a>

              <a
                href="mailto:support@labfix.nl"
                className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center flex-shrink-0">
                  <Mail size={22} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">support@labfix.nl</p>
                  <p className="text-xs text-gray-500">{nl ? 'Technische ondersteuning' : 'Technical support'}</p>
                </div>
              </a>

              <div className="flex items-start gap-2 text-sm text-gray-600">
                <Clock size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <p>{nl ? 'Reactie binnen 24 uur op werkdagen' : 'Response within 24 hours on business days'}</p>
              </div>
            </div>
          )}

          {/* Location panel */}
          {activePanel === 'location' && (
            <div className="p-5 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">LabFix B.V.</p>
                    <p className="text-sm text-gray-600 mt-1">Elektronicaweg 10</p>
                    <p className="text-sm text-gray-600">5651 GJ Eindhoven</p>
                    <p className="text-sm text-gray-600">{nl ? 'Nederland' : 'Netherlands'}</p>
                  </div>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=Eindhoven+Netherlands"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-primary-600 text-white rounded-xl py-3 px-4 hover:bg-primary-700 transition-colors font-medium text-sm"
              >
                <Navigation size={16} />
                {nl ? 'Route beschrijving' : 'Get directions'}
              </a>

              <div className="flex items-start gap-2 text-sm text-gray-600">
                <Clock size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">{nl ? 'Openingstijden' : 'Business Hours'}</p>
                  <p>{nl ? 'Ma - Vr: 09:00 - 17:00' : 'Mon - Fri: 09:00 - 17:00'}</p>
                  <p>{nl ? 'Za - Zo: Gesloten' : 'Sat - Sun: Closed'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-5 py-3 bg-gray-50">
          <p className="text-xs text-gray-400 text-center">
            {nl ? 'Aangedreven door LabFix Support' : 'Powered by LabFix Support'}
          </p>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => {
          if (isOpen) handleClose();
          else { setIsOpen(true); setActivePanel('main'); }
        }}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen
            ? 'bg-gray-700 hover:bg-gray-800'
            : 'bg-primary-600 hover:bg-primary-700'
        }`}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-white" />
        )}
      </button>

      {/* Notification badge when closed */}
      {!isOpen && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 rounded-full border-2 border-white animate-pulse" />
      )}
    </div>
  );
}
