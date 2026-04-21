'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ShoppingCart, Menu, X, Search, User, Globe, ChevronDown, ChevronRight, Phone, Mail, Truck, Wrench } from 'lucide-react';
import { brandCategories } from '@/lib/categories';

export default function Header() {
  const { t, locale, setLocale, cartCount, user, logout } = useApp();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenBrand, setMobileOpenBrand] = useState<string | null>(null);
  const [mobileOpenSub, setMobileOpenSub] = useState<string | null>(null);
  const [hoveredSub, setHoveredSub] = useState<string | null>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navBrands = brandCategories.slice(0, 8);
  const moreBrands = brandCategories.slice(8);

  const handleDropdownEnter = (slug: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(slug);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 200);
  };

  useEffect(() => {
    return () => { if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current); };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="relative">
      {/* Top bar */}
      <div className="bg-primary-600 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-end items-center gap-4">
          <a href="mailto:info@labfix.nl" className="flex items-center gap-1 hover:text-gray-200">
            <Mail size={14} />
            info@labfix.nl
          </a>
          <a href="tel:+31651131133" className="hidden sm:flex items-center gap-1 hover:text-gray-200">
            <Phone size={14} />
            +31 6 5113 1133
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

      {/* Main header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <img src="/logo.png" alt="LabFix" className="h-24 w-auto" />
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
                  <span className="text-xs font-medium truncate max-w-[80px]">{user.contactPerson?.split(' ')[0] || user.companyName?.split(' ')[0] || 'Account'}</span>
                </Link>
              ) : (
                <Link href="/account/login" className="hidden sm:flex flex-col items-center text-gray-600 hover:text-primary-500">
                  <User size={22} />
                  <span className="text-xs">{t('auth.login')}</span>
                </Link>
              )}
              <Link href="/repair" className="hidden sm:flex flex-col items-center text-gray-600 hover:text-primary-500">
                <Wrench size={22} />
                <span className="text-xs">{locale === 'nl' ? 'Reparatie' : 'Repair'}</span>
              </Link>
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
        <nav className="bg-primary-500 text-white relative">
          <div className="max-w-7xl mx-auto px-4">
            <div className="hidden md:flex items-center">
              <Link
                href="/products"
                className={`px-4 py-2 font-semibold hover:bg-primary-600 transition-colors flex items-center gap-1 whitespace-nowrap ${pathname === '/products' ? 'bg-primary-600 border-b-2 border-white' : ''}`}
              >
                <Menu size={16} />
                {t('nav.allProducts')}
              </Link>
              {navBrands.map((brand) => (
                <div
                  key={brand.slug}
                  className="relative"
                  onMouseEnter={() => { handleDropdownEnter(brand.slug); setHoveredSub(null); }}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    href={`/products?brand=${brand.slug}`}
                    className={`px-3 py-2 hover:bg-primary-600 transition-colors text-sm font-medium whitespace-nowrap flex items-center gap-1 ${pathname.includes(brand.slug) ? 'bg-primary-600' : ''}`}
                  >
                    {locale === 'en' ? brand.nameEn : brand.name}
                    <ChevronDown size={12} />
                  </Link>
                  {openDropdown === brand.slug && (
                    <div className="absolute top-full left-0 bg-white text-gray-800 rounded-b-lg shadow-xl min-w-[240px] z-50 border-t-2 border-accent-500 flex">
                      {/* Subcategories column */}
                      <div className="py-2 min-w-[240px] border-r border-gray-100">
                        <Link
                          href={`/products?brand=${brand.slug}`}
                          className="block px-4 py-2 text-sm font-semibold text-primary-600 hover:bg-gray-50 border-b"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {locale === 'nl' ? `Alle ${brand.name}` : `All ${brand.nameEn}`}
                        </Link>
                        {brand.subcategories.map((sub) => (
                          <div
                            key={sub.slug}
                            onMouseEnter={() => setHoveredSub(sub.slug)}
                            className="relative"
                          >
                            <Link
                              href={`/products?brand=${brand.slug}&sub=${sub.slug}`}
                              className={`flex items-center justify-between px-4 py-2 text-sm transition-colors ${hoveredSub === sub.slug ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'}`}
                              onClick={() => setOpenDropdown(null)}
                            >
                              {locale === 'en' ? sub.nameEn : sub.name}
                              {sub.models.length > 0 && <ChevronRight size={14} className="text-gray-400" />}
                            </Link>
                          </div>
                        ))}
                      </div>
                      {/* Models flyout column */}
                      {hoveredSub && (() => {
                        const activeSub = brand.subcategories.find(s => s.slug === hoveredSub);
                        if (!activeSub || activeSub.models.length === 0) return null;
                        return (
                          <div className="py-2 min-w-[240px] max-h-[400px] overflow-y-auto">
                            <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider border-b">
                              {locale === 'en' ? activeSub.nameEn : activeSub.name}
                            </div>
                            {activeSub.models.map((model) => (
                              <Link
                                key={model.slug}
                                href={`/products?brand=${brand.slug}&sub=${activeSub.slug}&model=${model.slug}`}
                                className="block px-4 py-1.5 text-sm hover:bg-gray-50 hover:text-primary-600 transition-colors"
                                onClick={() => setOpenDropdown(null)}
                              >
                                {model.name}
                              </Link>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              ))}
              {moreBrands.length > 0 && (
                <div
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter('more')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button className="px-3 py-2 hover:bg-primary-600 transition-colors text-sm font-medium whitespace-nowrap flex items-center gap-1">
                    {locale === 'nl' ? 'Meer' : 'More'}
                    <ChevronDown size={12} />
                  </button>
                  {openDropdown === 'more' && (
                    <div className="absolute top-full right-0 bg-white text-gray-800 rounded-b-lg shadow-xl py-2 z-50 border-t-2 border-accent-500 max-h-[70vh] overflow-y-auto grid grid-cols-2 min-w-[400px]">
                      {moreBrands.map((brand) => (
                        <Link
                          key={brand.slug}
                          href={`/products?brand=${brand.slug}`}
                          className="block px-4 py-2 text-sm hover:bg-gray-50 hover:text-primary-600 transition-colors flex items-center justify-between"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {locale === 'en' ? brand.nameEn : brand.name}
                          <ChevronRight size={14} className="text-gray-400" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <Link
                href="/about"
                className={`px-3 py-2 hover:bg-primary-600 transition-colors text-sm font-medium whitespace-nowrap ml-auto ${pathname === '/about' ? 'bg-primary-600 border-b-2 border-white' : ''}`}
              >
                {t('nav.about')}
              </Link>
              <Link
                href="/contact"
                className={`px-3 py-2 hover:bg-primary-600 transition-colors text-sm font-medium whitespace-nowrap ${pathname === '/contact' ? 'bg-primary-600 border-b-2 border-white' : ''}`}
              >
                {t('nav.contact')}
              </Link>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t animate-slide-down max-h-[80vh] overflow-y-auto">
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
              {brandCategories.map((brand) => (
                <div key={brand.slug} className="border-t">
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 font-medium text-left"
                    onClick={() => { setMobileOpenBrand(mobileOpenBrand === brand.slug ? null : brand.slug); setMobileOpenSub(null); }}
                  >
                    {locale === 'en' ? brand.nameEn : brand.name}
                    <ChevronDown size={16} className={`transition-transform ${mobileOpenBrand === brand.slug ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileOpenBrand === brand.slug && (
                    <div className="bg-gray-50">
                      <Link
                        href={`/products?brand=${brand.slug}`}
                        className="block px-8 py-2 text-sm font-semibold text-primary-600 hover:bg-gray-100"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {locale === 'nl' ? `Alle ${brand.name}` : `All ${brand.nameEn}`}
                      </Link>
                      {brand.subcategories.map((sub) => (
                        <div key={sub.slug}>
                          <button
                            className="w-full flex items-center justify-between px-8 py-2 text-sm hover:bg-gray-100 text-gray-700 text-left"
                            onClick={() => {
                              if (sub.models.length > 0) {
                                setMobileOpenSub(mobileOpenSub === sub.slug ? null : sub.slug);
                              } else {
                                window.location.href = `/products?brand=${brand.slug}&sub=${sub.slug}`;
                                setMobileMenuOpen(false);
                              }
                            }}
                          >
                            {locale === 'en' ? sub.nameEn : sub.name}
                            {sub.models.length > 0 && <ChevronDown size={14} className={`transition-transform ${mobileOpenSub === sub.slug ? 'rotate-180' : ''}`} />}
                          </button>
                          {mobileOpenSub === sub.slug && sub.models.length > 0 && (
                            <div className="bg-gray-100">
                              <Link
                                href={`/products?brand=${brand.slug}&sub=${sub.slug}`}
                                className="block px-12 py-1.5 text-xs font-semibold text-primary-600 hover:bg-gray-200"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {locale === 'nl' ? `Alle ${sub.name}` : `All ${sub.nameEn}`}
                              </Link>
                              {sub.models.map((model) => (
                                <Link
                                  key={model.slug}
                                  href={`/products?brand=${brand.slug}&sub=${sub.slug}&model=${model.slug}`}
                                  className="block px-12 py-1.5 text-xs hover:bg-gray-200 text-gray-600"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {model.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
