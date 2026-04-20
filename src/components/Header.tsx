'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ShoppingCart, Menu, X, Search, User, Globe, ChevronDown, Phone, Mail, Truck } from 'lucide-react';

export default function Header() {
  const { t, locale, setLocale, cartCount, user, logout } = useApp();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const categories = [
    { name: t('nav.iphone'), href: '/products?category=iphone' },
    { name: t('nav.samsung'), href: '/products?category=samsung' },
    { name: t('nav.ipad'), href: '/products?category=ipad' },
    { name: t('nav.macbook'), href: '/products?category=macbook' },
    { name: t('nav.tools'), href: '/products?category=tools' },
    { name: t('nav.accessories'), href: '/products?category=accessories' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top bar */}
      <div className="bg-primary-600 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Truck size={14} />
              {t('cart.freeShipping')}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="mailto:info@labfix.nl" className="flex items-center gap-1 hover:text-gray-200">
              <Mail size={14} />
              info@labfix.nl
            </a>
            <a href="tel:+31850000000" className="hidden sm:flex items-center gap-1 hover:text-gray-200">
              <Phone size={14} />
              +31 (0) 85 000 0000
            </a>
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-1 hover:text-gray-200"
              >
                <Globe size={14} />
                {locale === 'nl' ? 'NL' : 'EN'}
                <ChevronDown size={12} />
              </button>
              {showLangDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-white text-gray-800 rounded shadow-lg py-1 min-w-[120px] z-50">
                  <button
                    onClick={() => { setLocale('nl'); setShowLangDropdown(false); }}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${locale === 'nl' ? 'font-bold text-primary-500' : ''}`}
                  >
                    🇳🇱 Nederlands
                  </button>
                  <button
                    onClick={() => { setLocale('en'); setShowLangDropdown(false); }}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${locale === 'en' ? 'font-bold text-primary-500' : ''}`}
                  >
                    🇬🇧 English
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <img src="/logo.png" alt="LabFix" className="h-20 w-auto" />
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
              <div className="flex w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('nav.search')}
                  className="flex-1 border-2 border-r-0 border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="bg-accent-500 text-white px-6 py-2 rounded-r-lg hover:bg-accent-600 transition-colors"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            {/* Right icons */}
            <div className="flex items-center gap-4">
              {user ? (
                <Link href="/account" className="hidden sm:flex flex-col items-center text-primary-500">
                  <User size={22} />
                  <span className="text-xs font-medium truncate max-w-[80px]">{user.companyName.split(' ')[0]}</span>
                </Link>
              ) : (
                <Link href="/account/login" className="hidden sm:flex flex-col items-center text-gray-600 hover:text-primary-500">
                  <User size={22} />
                  <span className="text-xs">{t('auth.login')}</span>
                </Link>
              )}
              <Link href="/cart" className="flex flex-col items-center text-gray-600 hover:text-primary-500 relative">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
                <span className="text-xs">{t('nav.cart')}</span>
              </Link>
              <button
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation bar */}
        <nav className="bg-primary-500 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="hidden md:flex items-center">
              <Link
                href="/products"
                className={`px-4 py-3 font-semibold hover:bg-primary-600 transition-colors flex items-center gap-1 whitespace-nowrap ${pathname === '/products' || pathname.startsWith('/products/') ? 'bg-primary-600 border-b-2 border-white' : ''}`}
              >
                <Menu size={16} />
                {t('nav.allProducts')}
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className={`px-3 py-3 hover:bg-primary-600 transition-colors text-sm font-medium whitespace-nowrap ${pathname === cat.href || pathname.startsWith(cat.href) ? 'bg-primary-600' : ''}`}
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                href="/about"
                className={`px-3 py-3 hover:bg-primary-600 transition-colors text-sm font-medium whitespace-nowrap ${pathname === '/about' ? 'bg-primary-600 border-b-2 border-white' : ''}`}
              >
                {t('nav.about')}
              </Link>
              <Link
                href="/contact"
                className={`px-3 py-3 hover:bg-primary-600 transition-colors text-sm font-medium whitespace-nowrap ${pathname === '/contact' ? 'bg-primary-600 border-b-2 border-white' : ''}`}
              >
                {t('nav.contact')}
              </Link>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t animate-slide-down">
            <form onSubmit={handleSearch} className="p-4">
              <div className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('nav.search')}
                  className="flex-1 border-2 border-r-0 border-gray-300 rounded-l-lg px-4 py-2"
                />
                <button type="submit" className="bg-accent-500 text-white px-4 py-2 rounded-r-lg">
                  <Search size={20} />
                </button>
              </div>
            </form>
            <div className="border-t">
              <Link href="/products" className="block px-4 py-3 hover:bg-gray-50 font-semibold" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.allProducts')}
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="block px-4 py-3 hover:bg-gray-50 border-t"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
              <Link href="/about" className="block px-4 py-3 hover:bg-gray-50 border-t" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.about')}
              </Link>
              <Link href="/contact" className="block px-4 py-3 hover:bg-gray-50 border-t" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.contact')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
