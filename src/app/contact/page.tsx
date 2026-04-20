'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const { t, locale } = useApp();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 animate-fade-in-up">{t('contact.title')}</h1>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-6 animate-fade-in-left delay-200">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('contact.name')}</label>
              <input type="text" required className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('contact.email')}</label>
              <input type="email" required className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('contact.message')}</label>
              <textarea rows={5} required className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500 resize-none"></textarea>
            </div>
            <button type="submit" className="w-full bg-accent-500 text-white py-3 rounded-lg font-semibold hover:bg-accent-600 transition-colors flex items-center justify-center gap-2">
              {sent ? <><CheckCircle size={18} /> {t('contact.success')}</> : <><Send size={18} /> {t('contact.send')}</>}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-8 animate-fade-in-right delay-200">
            <h2 className="text-xl font-bold mb-6">{t('footer.contact')}</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-accent-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold">LabFix</p>
                  <p className="text-gray-600">{t('footer.address')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-accent-500 flex-shrink-0" size={20} />
                <a href="mailto:info@labfix.nl" className="text-primary-500 hover:underline">info@labfix.nl</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-accent-500 flex-shrink-0" size={20} />
                <a href="tel:+31850000000" className="text-primary-500 hover:underline">+31 (0) 85 000 0000</a>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-8 text-white animate-fade-in-right delay-400">
            <h3 className="text-xl font-bold mb-2">
              {locale === 'nl' ? 'Openingstijden' : 'Business Hours'}
            </h3>
            <div className="space-y-2 text-blue-100">
              <p>{locale === 'nl' ? 'Maandag - Vrijdag: 09:00 - 17:00' : 'Monday - Friday: 09:00 - 17:00'}</p>
              <p>{locale === 'nl' ? 'Zaterdag - Zondag: Gesloten' : 'Saturday - Sunday: Closed'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
