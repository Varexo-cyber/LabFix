'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  const { t, locale } = useApp();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="mb-6">
              <img src="/logo.png" alt="LabFix" className="h-20 w-auto brightness-0 invert" />
            </div>
            <p className="text-sm leading-relaxed mb-4">{t('footer.aboutText')}</p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors">
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">{t('footer.links')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-white transition-colors">{t('nav.products')}</Link></li>
              <li><Link href="/products?brand=apple" className="hover:text-white transition-colors">Apple</Link></li>
              <li><Link href="/products?brand=samsung" className="hover:text-white transition-colors">Samsung</Link></li>
              <li><Link href="/products?brand=google" className="hover:text-white transition-colors">Google</Link></li>
              <li><Link href="/products?brand=huawei" className="hover:text-white transition-colors">Huawei</Link></li>
              <li><Link href="/products?brand=tools" className="hover:text-white transition-colors">{locale === 'nl' ? 'Gereedschap' : 'Tools'}</Link></li>
              <li><Link href="/products?brand=accessories" className="hover:text-white transition-colors">{locale === 'nl' ? 'Accessoires' : 'Accessories'}</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">{t('footer.customer')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">{t('nav.about')}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">{t('nav.contact')}</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">{t('footer.terms')}</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">{t('footer.returns')}</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">{t('footer.shipping')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-accent-500 flex-shrink-0" />
                <span>{t('footer.address')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-accent-500 flex-shrink-0" />
                <a href="mailto:info@labfix.nl" className="hover:text-white transition-colors">{t('footer.email')}</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-accent-500 flex-shrink-0" />
                <a href="tel:+31850000000" className="hover:text-white transition-colors">{t('footer.phone')}</a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-white font-semibold mb-2">{t('footer.newsletter')}</h4>
              <p className="text-xs mb-2">{t('footer.newsletterText')}</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="E-mail"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-l px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                />
                <button className="bg-accent-500 text-white px-4 py-2 rounded-r text-sm hover:bg-accent-600 transition-colors">
                  {t('footer.subscribe')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping & Payment */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Shipping Partners */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">{locale === 'nl' ? 'Verzendpartners' : 'Shipping Partners'}</h4>
              <div className="flex flex-wrap items-center gap-3">
                {['DHL', 'FedEx', 'UPS', 'PostNL', 'DPD', 'GLS'].map((carrier) => (
                  <div key={carrier} className="bg-white rounded-md px-3 py-1.5 text-xs font-bold text-gray-700 min-w-[60px] text-center">
                    {carrier}
                  </div>
                ))}
              </div>
            </div>
            {/* Payment Methods */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">{locale === 'nl' ? 'Betaalmethoden' : 'Payment Methods'}</h4>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { name: 'Visa', bg: 'bg-[#1A1F71]', text: 'text-white' },
                  { name: 'Mastercard', bg: 'bg-[#EB001B]', text: 'text-white' },
                  { name: 'PayPal', bg: 'bg-[#003087]', text: 'text-white' },
                  { name: 'iDEAL', bg: 'bg-[#CC0066]', text: 'text-white' },
                  { name: 'Apple Pay', bg: 'bg-black', text: 'text-white' },
                  { name: 'Google Pay', bg: 'bg-white', text: 'text-gray-800' },
                  { name: 'Bancontact', bg: 'bg-[#005498]', text: 'text-white' },
                  { name: 'SEPA', bg: 'bg-[#2B6CB0]', text: 'text-white' },
                  { name: 'Bank Transfer', bg: 'bg-gray-600', text: 'text-white' },
                ].map((method) => (
                  <div key={method.name} className={`${method.bg} ${method.text} rounded-md px-2.5 py-1.5 text-xs font-bold min-w-[55px] text-center`}>
                    {method.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm">
          <p>&copy; {new Date().getFullYear()} LabFix. {t('footer.rights')}.</p>
          <div className="flex items-center gap-4">
            <span className="text-gray-500">{t('footer.kvk')}: 12345678</span>
            <span className="text-gray-500">BTW: NL123456789B01</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
