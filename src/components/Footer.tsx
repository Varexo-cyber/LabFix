'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Mail, Phone, MessageCircle, HelpCircle, MapPinIcon, Send, CheckCircle } from 'lucide-react';

export default function Footer() {
  const { t, locale, setLocale, currency, setCurrency } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      
      if (res.ok) {
        setNewsletterStatus('success');
        setNewsletterEmail('');
        setTimeout(() => setNewsletterStatus('idle'), 3000);
      } else {
        setNewsletterStatus('error');
      }
    } catch {
      setNewsletterStatus('error');
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo + Selectors + Shipping */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <div className="bg-white rounded-lg p-0.2 inline-block">
                <img src="/logo.png" alt="LabFix" className="h-[60px] w-[125px] object-contain" />
              </div>
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
                onChange={(e) => setCurrency(e.target.value as 'EUR' | 'USD' | 'GBP')}
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
                <img src="/images/logos/fedex.svg" alt="FedEx" className="h-5 w-auto" loading="eager" onError={(e) => {(e.target as HTMLImageElement).style.display='none'}} />
              </div>
              {/* UPS */}
              <div className="bg-[#351C15] rounded-md h-9 w-12 flex items-center justify-center">
                <img src="/images/logos/ups.svg" alt="UPS" className="h-6 w-auto" loading="eager" onError={(e) => {(e.target as HTMLImageElement).style.display='none'}} />
              </div>
              {/* PostNL */}
              <div className="bg-white rounded-md h-9 w-16 flex items-center justify-center px-1.5">
                <img src="/images/logos/postnl.svg" alt="PostNL" className="h-5 w-auto" loading="eager" onError={(e) => {(e.target as HTMLImageElement).style.display='none'}} />
              </div>
              {/* DHL */}
              <div className="bg-[#FFCC00] rounded-md h-9 w-14 flex items-center justify-center">
                <img src="/images/logos/dhl.svg" alt="DHL" className="h-4 w-auto" loading="eager" onError={(e) => {(e.target as HTMLImageElement).style.display='none'}} />
              </div>
              {/* DPD */}
              <div className="bg-[#DC0032] rounded-md h-9 w-12 flex items-center justify-center">
                <img src="/images/logos/dpd.svg" alt="DPD" className="h-5 w-auto" loading="eager" onError={(e) => {(e.target as HTMLImageElement).style.display='none'}} />
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
              <li><Link href="/nieuws" className="hover:text-white transition-colors">{locale === 'nl' ? 'Nieuws' : 'News'}</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">{locale === 'nl' ? 'Privacy Policy' : 'Privacy Policy'}</Link></li>
              <li><Link href="/algemene-voorwaarden" className="hover:text-white transition-colors">{locale === 'nl' ? 'Algemene Voorwaarden' : 'Terms & Conditions'}</Link></li>
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
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">{locale === 'nl' ? 'Meer' : 'More'}</h3>
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

          {/* Support + Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">{locale === 'nl' ? 'Klantenservice' : 'Support'}</h3>
            <ul className="space-y-3 text-sm mb-6">
              <li>
                <Link href="/contact" className="flex items-center gap-2 hover:text-white transition-colors">
                  <MapPinIcon size={15} className="text-gray-400" />
                  {locale === 'nl' ? 'Leyweg 303, Den Haag' : 'Leyweg 303, The Hague'}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone size={15} className="text-gray-400" />
                  {locale === 'nl' ? 'Telefoon' : 'Phone'}
                </Link>
              </li>
              <li>
                <Link href="https://wa.me/31651131133" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
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
            
            {/* Newsletter Signup */}
            <div className="border-t border-gray-700 pt-4">
              <h4 className="text-white font-semibold text-sm mb-3">
                {locale === 'nl' ? 'Nieuwsbrief' : 'Newsletter'}
              </h4>
              {newsletterStatus === 'success' ? (
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <CheckCircle size={16} />
                  {locale === 'nl' ? 'Bedankt voor je aanmelding!' : 'Thanks for subscribing!'}
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder={locale === 'nl' ? 'Jouw e-mailadres' : 'Your email address'}
                    className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-primary-500"
                  />
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                  >
                    <Send size={14} />
                    {locale === 'nl' ? 'Aanmelden' : 'Subscribe'}
                  </button>
                  {newsletterStatus === 'error' && (
                    <span className="text-red-400 text-xs">
                      {locale === 'nl' ? 'Er ging iets mis. Probeer opnieuw.' : 'Something went wrong. Try again.'}
                    </span>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* iDEAL */}
            <div className="bg-black rounded-lg h-8 px-2 flex items-center">
              <img src="/images/logos/ideal.svg" alt="iDEAL" className="h-5 w-auto" />
            </div>

            {/* Klarna */}
            <div className="bg-[#FFB3C7] rounded-lg h-8 px-2 flex items-center">
              <img src="/images/logos/klarna.svg" alt="Klarna" className="h-5 w-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 text-sm text-gray-500">
            <div className="flex flex-col gap-1">
              <p>&copy; {new Date().getFullYear()} LabFix {t('footer.rights')}.</p>
              <p className="text-xs text-gray-600">
                {locale === 'nl'
                  ? 'Alle handelsmerken zijn eigendom van hun respectievelijke houders. LabFix claimt geen eigendom van handelsmerken die op deze website worden gebruikt.'
                  : 'All trademarks are properties of their respective holders. LabFix does not own or make claim to trademarks used on this website.'}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-4">
                <span>{t('footer.kvk')}: 42035906</span>
                <span>BTW: NL005445900B06</span>
              </div>
              <p className="text-xs text-gray-500">
                Bank: NL36INGB0115171061 (LabFix)
              </p>
              <p className="text-[11px] text-gray-600">
                {locale === 'nl' ? 'Medemogelijk gemaakt door' : 'Made possible by'}{' '}
                <a href="https://varexo.nl" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                  Varexo
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
