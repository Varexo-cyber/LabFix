'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { MapPin, Users, Award, Globe } from 'lucide-react';

export default function AboutPage() {
  const { t, locale } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 animate-fade-in-up">{t('about.title')}</h1>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div className="animate-fade-in-left delay-200">
          <p className="text-gray-600 leading-relaxed text-lg mb-6">{t('about.text')}</p>
          <p className="text-gray-600 leading-relaxed">
            {locale === 'nl'
              ? 'Wij selecteren onze onderdelen met zorg en leveren aan reparatiebedrijven door heel Europa. Ons doel is om u de onderdelen te bieden die u nodig heeft, wanneer u ze nodig heeft.'
              : 'We select our parts with care and supply repair businesses across Europe. Our goal is to provide you with the parts you need, when you need them.'}
          </p>
        </div>
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-8 text-white animate-fade-in-right delay-300">
          <img src="/logo.png" alt="LabFix" className="h-12 w-auto brightness-0 invert mb-4" />
          <p className="text-blue-100 mb-6">
            {locale === 'nl'
              ? 'Uw partner in professionele reparatieonderdelen'
              : 'Your partner in professional repair parts'}
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="flex-shrink-0" />
              <span>{locale === 'nl' ? 'Gevestigd in Nederland' : 'Based in the Netherlands'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="flex-shrink-0" />
              <span>{locale === 'nl' ? 'Levering door heel Europa' : 'Delivery across Europe'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Award className="flex-shrink-0" />
              <span>{locale === 'nl' ? 'Geregistreerd bij de KVK' : 'Registered at Chamber of Commerce'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {[
          { icon: <Users size={32} />, title: locale === 'nl' ? 'Klantgericht' : 'Customer Focused', desc: locale === 'nl' ? 'Persoonlijke service' : 'Personal service' },
          { icon: <Award size={32} />, title: locale === 'nl' ? 'Kwaliteit' : 'Quality', desc: locale === 'nl' ? 'Geteste onderdelen' : 'Tested parts' },
          { icon: <Globe size={32} />, title: locale === 'nl' ? 'Europees' : 'European', desc: locale === 'nl' ? 'Levering in heel Europa' : 'Delivery across Europe' },
          { icon: <MapPin size={32} />, title: locale === 'nl' ? 'Nederlands' : 'Dutch', desc: locale === 'nl' ? 'Gevestigd in NL' : 'Based in NL' },
        ].map((item, i) => (
          <div key={i} className={`bg-white rounded-xl shadow-md p-6 text-center animate-fade-in-up delay-${(i + 2) * 100}`}>
            <div className="text-primary-500 mb-3 flex justify-center">{item.icon}</div>
            <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
