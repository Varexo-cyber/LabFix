'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Mail, Phone, MessageCircle, HelpCircle, MapPinIcon } from 'lucide-react';

export default function Footer() {
  const { t, locale, setLocale } = useApp();
  const [currency, setCurrency] = useState('EUR');

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo + Selectors + Shipping */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <img src="/logo.png" alt="LabFix" className="h-24 w-auto brightness-0 invert" />
            </div>

            {/* Language + Currency Selectors */}
            <div className="flex gap-2 mb-5">
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as 'nl' | 'en')}
                className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-primary-500 cursor-pointer"
              >
                <option value="nl">Nederlands</option>
                <option value="en">English</option>
              </select>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-primary-500 cursor-pointer w-20"
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            {/* Shipping logos */}
            <div className="flex flex-wrap items-center gap-2">
              {/* FedEx */}
              <div className="bg-white rounded-md h-9 w-16 flex items-center justify-center px-1">
                <svg viewBox="0 0 960 320" className="h-5 w-auto">
                  <text x="10" y="240" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="260" fill="#4D148C">Fed</text>
                  <text x="520" y="240" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="260" fill="#FF6600">Ex</text>
                </svg>
              </div>
              {/* UPS */}
              <div className="bg-[#351C15] rounded-md h-9 w-12 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="h-6 w-auto">
                  <path d="M50 5C25 5 5 25 5 50s20 45 45 45 45-20 45-45S75 5 50 5z" fill="#FFB500"/>
                  <text x="50" y="62" textAnchor="middle" fontFamily="Arial Black" fontWeight="900" fontSize="30" fill="#351C15">UPS</text>
                </svg>
              </div>
              {/* PostNL */}
              <div className="bg-white rounded-md h-9 w-16 flex items-center justify-center px-1">
                <svg viewBox="0 0 200 60" className="h-4 w-auto">
                  <text x="5" y="45" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="38" fill="#EE7203">Post</text>
                  <text x="120" y="45" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="38" fill="#2E3192">NL</text>
                </svg>
              </div>
              {/* DHL */}
              <div className="bg-[#FFCC00] rounded-md h-9 w-14 flex items-center justify-center">
                <svg viewBox="0 0 120 40" className="h-4 w-auto">
                  <text x="10" y="32" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="34" fill="#D40511">DHL</text>
                </svg>
              </div>
              {/* DPD */}
              <div className="bg-[#DC0032] rounded-md h-9 w-12 flex items-center justify-center">
                <svg viewBox="0 0 100 40" className="h-4 w-auto">
                  <text x="8" y="32" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="32" fill="#fff">DPD</text>
                </svg>
              </div>
            </div>
          </div>

          {/* About / Info Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">{locale === 'nl' ? 'Over Ons' : 'About'}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">{t('nav.about')}</Link></li>
              <li><Link href="/quality" className="hover:text-white transition-colors">{locale === 'nl' ? 'Kwaliteitsstandaarden' : 'Quality Standards'}</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">{t('footer.returns')}</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">{t('footer.terms')}</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">{t('footer.shipping')}</Link></li>
              <li><Link href="/payment-methods" className="hover:text-white transition-colors">{locale === 'nl' ? 'Betaalmethoden' : 'Payment Methods'}</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">{locale === 'nl' ? 'Services' : 'Services'}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/account" className="hover:text-white transition-colors">{locale === 'nl' ? 'Mijn Account' : 'My Account'}</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">{t('nav.products')}</Link></li>
              <li><Link href="/products?brand=tools" className="hover:text-white transition-colors">{locale === 'nl' ? 'Gereedschap' : 'Tools'}</Link></li>
              <li><Link href="/products?brand=accessories" className="hover:text-white transition-colors">{locale === 'nl' ? 'Accessoires' : 'Accessories'}</Link></li>
            </ul>
          </div>

          {/* Our Brands */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">{locale === 'nl' ? 'Merken' : 'Our Brands'}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?brand=apple" className="hover:text-white transition-colors">Apple</Link></li>
              <li><Link href="/products?brand=samsung" className="hover:text-white transition-colors">Samsung</Link></li>
              <li><Link href="/products?brand=google" className="hover:text-white transition-colors">Google</Link></li>
              <li><Link href="/products?brand=huawei" className="hover:text-white transition-colors">Huawei</Link></li>
              <li><Link href="/products?brand=xiaomi" className="hover:text-white transition-colors">Xiaomi</Link></li>
              <li><Link href="/products?brand=motorola" className="hover:text-white transition-colors">Motorola</Link></li>
              <li><Link href="/products?brand=oneplus" className="hover:text-white transition-colors">OnePlus</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">{locale === 'nl' ? 'Klantenservice' : 'Support'}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/contact" className="flex items-center gap-2 hover:text-white transition-colors">
                  <MapPinIcon size={15} className="text-gray-400" />
                  {locale === 'nl' ? 'Locatie' : 'Location'}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone size={15} className="text-gray-400" />
                  {locale === 'nl' ? 'Telefoon' : 'Phone'}
                </Link>
              </li>
              <li>
                <Link href="https://wa.me/31850000000" className="flex items-center gap-2 hover:text-white transition-colors">
                  <MessageCircle size={15} className="text-gray-400" />
                  WhatsApp
                </Link>
              </li>
              <li>
                <a href="mailto:info@labfix.nl" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail size={15} className="text-gray-400" />
                  E-mail
                </a>
              </li>
              <li>
                <Link href="/faq" className="flex items-center gap-2 hover:text-white transition-colors">
                  <HelpCircle size={15} className="text-gray-400" />
                  FAQ&apos;s
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Methods Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* VISA */}
            <svg viewBox="0 0 780 500" className="h-8 w-auto">
              <rect width="780" height="500" rx="40" fill="#fff"/>
              <path d="M293.2 348.7l33.4-195.7h53.4l-33.4 195.7H293.2zM539.3 157.3c-10.6-4-27.2-8.3-47.9-8.3-52.8 0-90 26.6-90.3 64.7-.3 28.2 26.6 43.9 46.9 53.3 20.9 9.6 27.9 15.7 27.8 24.3-.1 13.1-16.7 19.1-32.1 19.1-21.5 0-32.9-3-50.5-10.3l-6.9-3.1-7.5 44c12.5 5.5 35.7 10.2 59.7 10.5 56.1 0 92.6-26.3 93-67 .2-22.3-14-39.3-44.8-53.3-18.6-9.1-30.1-15.1-30-24.3 0-8.1 9.7-16.8 30.6-16.8 17.5-.3 30.1 3.5 40 7.5l4.8 2.3 7.2-42.6zM676.4 153H637c-12.2 0-21.4 3.3-26.7 15.5l-75.8 171.2h53.6s8.8-23 10.7-28h65.5c1.5 6.5 6.2 28 6.2 28h47.4L676.4 153zm-63.1 126.4c4.2-10.8 20.5-52.4 20.5-52.4-.3.5 4.2-10.9 6.8-18l3.5 16.3 11.9 54.1h-42.7zM232.4 153l-52.3 133.4-5.6-27.1c-9.7-31.2-39.9-65-73.7-81.9l47.8 170.3h56.5l84-195.7h-56.7z" fill="#1A1F71"/>
              <path d="M124.7 153H38.2l-.7 3.8c67 16.2 111.3 55.3 129.7 102.3L149 171c-3-11.8-12-15.4-24.3-16z" fill="#F7A600"/>
            </svg>

            {/* Mastercard */}
            <svg viewBox="0 0 780 500" className="h-8 w-auto">
              <rect width="780" height="500" rx="40" fill="#fff"/>
              <circle cx="312" cy="250" r="150" fill="#EB001B"/>
              <circle cx="468" cy="250" r="150" fill="#F79E1B"/>
              <path d="M390 130.7c-38.5 30.4-63.2 77.5-63.2 130.3s24.7 99.9 63.2 130.3c38.5-30.4 63.2-77.5 63.2-130.3S428.5 161.1 390 130.7z" fill="#FF5F00"/>
            </svg>

            {/* PayPal */}
            <svg viewBox="0 0 780 500" className="h-8 w-auto">
              <rect width="780" height="500" rx="40" fill="#fff"/>
              <path d="M622.5 210.2c-5.6 36.6-33.4 36.6-60.3 36.6h-15.3l10.7-67.9h15.3c27 0 53.2 1.8 49.6 31.3zm-6.9-104.9h-101l-1.3 8.1-38.8 245.3 1.3 8.1h55.5l13.8-87.6h21.5c56.2 0 95.6-27.2 104.2-88.2 7-49.4-14.7-85.7-55.2-85.7z" fill="#003087"/>
              <path d="M504 210.2c-5.6 36.6-33.4 36.6-60.4 36.6h-15.3l10.8-67.9h15.3c27 0 53.2 1.8 49.6 31.3zm-6.9-104.9h-101l-1.3 8.1L356 358.7l1.3 8.1h55.5l13.8-87.6h21.5c56.2 0 95.6-27.2 104.2-88.2 7-49.4-14.8-85.7-55.2-85.7z" fill="#002F86" opacity=".7"/>
              <path d="M209.3 358.7l7.6-48.1 1.8-9.1h-56.6l38.8-245.3 1.3-8.1h148c35.2 0 59.3 28.3 54 63.3-9.1 60-52 88.2-104.2 88.2H279l-13.8 87.6-1.3 8.1h55.5l-13.8 87.6-1.3 8.1h-55.5z" fill="#009CDE" opacity=".6"/>
            </svg>

            {/* Apple Pay */}
            <div className="bg-black rounded-lg h-8 px-3 flex items-center">
              <svg viewBox="0 0 165.5 40" className="h-5 w-auto">
                <path fill="#fff" d="M36.2 6.5c-1.9 2.2-5 3.9-8 3.7-.4-3.2 1.2-6.5 3-8.5C33.1-.5 36.4-2 39-2.1c.3 3.3-1 6.4-2.8 8.6zM39 12c-4.5-.3-8.3 2.5-10.4 2.5s-5.4-2.4-9-2.3C14.7 12.3 10 15 7.5 19.3c-5.1 8.8-1.3 21.9 3.6 29.1 2.4 3.5 5.3 7.5 9.1 7.3 3.6-.1 5-2.3 9.4-2.3s5.6 2.3 9.4 2.2c3.9-.1 6.4-3.6 8.8-7.1 2.8-4 3.9-7.9 4-8.1-.1-.1-7.6-2.9-7.7-11.6-.1-7.2 5.9-10.7 6.2-10.9C47 13.2 41.8 12.2 39 12z"/>
                <path fill="#fff" d="M68.9 4.4c11.1 0 18.8 7.7 18.8 18.8s-7.9 18.9-19.1 18.9h-12.3v19.5H48V4.4h20.9zm-12.6 30.2h10.4c7.7 0 12.1-4.2 12.1-11.3 0-7.2-4.4-11.3-12.1-11.3H56.3v22.6zM90.2 48c0-7.8 6-12.5 16.6-13.1l12.2-.7v-3.4c0-5-3.4-8-9.1-8-5.4 0-8.8 2.6-9.6 6.6H93c.5-8.3 7.4-14.4 17.4-14.4 10.2 0 16.8 5.8 16.8 14.8v31.1h-7.5v-7.5h-.2c-2.2 4.9-7 8.1-13 8.1-8.1 0-16.3-5-16.3-13.5zm28.8-4.1v-3.5l-11 .7c-6.1.4-9.6 2.9-9.6 7s3.7 6.8 8.8 6.8c6.7 0 11.8-4.6 11.8-11zM135.7 76.7v-7.1c.5.1 1.8.2 2.3.2 3.6 0 5.5-1.5 6.7-5.4l.7-2.3-15.8-46.4h8.5l11.5 38.8h.2l11.5-38.8h8.3l-16.4 48.5c-3.8 11-8.1 14.5-17.1 14.5-.6 0-1.9-.1-2.4-.2z"/>
              </svg>
            </div>

            {/* Google Pay */}
            <div className="bg-white rounded-lg h-8 px-3 flex items-center border border-gray-200">
              <svg viewBox="0 0 435.97 173.13" className="h-4 w-auto">
                <path fill="#5F6368" d="M206.2 84.58v50.75h-16.1V10h42.7a38.61 38.61 0 0 1 27.55 10.85 35.25 35.25 0 0 1 0 51.44 37.89 37.89 0 0 1-27.55 11.12H206.2zm0-59.17v43.76h27a21.28 21.28 0 0 0 16.1-6.75 22.16 22.16 0 0 0 .31-30.58l-.31-.31a21 21 0 0 0-16.1-6.93H206.2z"/>
                <path fill="#4285F4" d="M309.1 46.98c11.85 0 21.22 3.15 28.08 9.54 6.86 6.39 10.29 15.12 10.29 26.19v52.92h-15.38v-11.93h-.72c-6.57 9.72-15.39 14.58-26.19 14.58-9.18 0-16.85-2.7-23.04-8.1a25.67 25.67 0 0 1-9.27-20.3c0-8.55 3.24-15.39 9.72-20.3 6.48-4.91 15.12-7.38 25.92-7.38 9.18 0 16.85 1.71 22.68 5.04v-3.51c0-5.31-2.25-9.81-6.66-13.5-4.41-3.69-9.54-5.49-15.3-5.49-8.82 0-15.84 3.69-21.06 11.07l-14.13-8.91c7.56-10.89 18.81-16.42 33.56-16.42zm-20.3 62.64c0 4.05 1.8 7.47 5.4 10.17 3.6 2.7 7.74 4.05 12.42 4.05 6.75 0 12.69-2.52 17.82-7.56 5.13-5.04 7.74-10.89 7.74-17.64-4.86-3.78-11.61-5.67-20.21-5.67-6.21 0-11.43 1.53-15.66 4.59-4.23 3.06-7.51 6.75-7.51 12.06z"/>
                <path fill="#34A853" d="M436 49.15l-53.82 123.75h-16.56l19.98-43.56-35.37-80.19h17.46l25.56 61.56h.36l24.84-61.56z"/>
              </svg>
            </div>

            {/* AMEX */}
            <div className="bg-[#006FCF] rounded-lg h-8 w-14 flex items-center justify-center">
              <svg viewBox="0 0 120 40" className="h-4 w-auto">
                <text x="8" y="28" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="22" fill="#fff">AMEX</text>
              </svg>
            </div>

            {/* SEPA */}
            <div className="bg-[#2B4D9B] rounded-lg h-8 px-3 flex items-center">
              <svg viewBox="0 0 100 30" className="h-4 w-auto">
                <text x="5" y="22" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="18" fill="#fff">sepa</text>
              </svg>
            </div>

            {/* Bank Transfer */}
            <div className="bg-gray-600 rounded-lg h-8 px-3 flex items-center">
              <span className="text-white text-xs font-bold tracking-wide">BANK TRANSFER</span>
            </div>

            {/* iDEAL */}
            <svg viewBox="0 0 780 500" className="h-8 w-auto">
              <rect width="780" height="500" rx="40" fill="#fff"/>
              <rect x="100" y="80" width="580" height="340" rx="20" fill="#CC0066"/>
              <text x="390" y="290" textAnchor="middle" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="140" fill="#fff">iDEAL</text>
            </svg>

            {/* Bancontact */}
            <div className="bg-white rounded-lg h-8 px-2 flex items-center border border-gray-200">
              <svg viewBox="0 0 160 40" className="h-5 w-auto">
                <circle cx="16" cy="20" r="12" fill="#005498"/>
                <circle cx="30" cy="20" r="12" fill="#FFD800"/>
                <text x="48" y="27" fontFamily="Arial" fontWeight="700" fontSize="16" fill="#1E1E1E">Bancontact</text>
              </svg>
            </div>

            {/* Trustly */}
            <div className="bg-[#0EE06E] rounded-lg h-8 px-3 flex items-center">
              <svg viewBox="0 0 120 30" className="h-4 w-auto">
                <text x="5" y="22" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="18" fill="#fff">Trustly</text>
              </svg>
            </div>

            {/* Klarna */}
            <div className="bg-[#FFB3C7] rounded-lg h-8 px-3 flex items-center">
              <svg viewBox="0 0 100 30" className="h-4 w-auto">
                <text x="5" y="22" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="18" fill="#0A0B09">Klarna</text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} LabFix B.V. {t('footer.rights')}.</p>
            <div className="flex items-center gap-4">
              <span>{t('footer.kvk')}: 12345678</span>
              <span>BTW: NL123456789B01</span>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2 text-center">
            {locale === 'nl'
              ? 'Alle handelsmerken zijn eigendom van hun respectievelijke houders. LabFix claimt geen eigendom van handelsmerken die op deze website worden gebruikt.'
              : 'All trademarks are properties of their respective holders. LabFix does not own or make claim to trademarks used on this website.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
