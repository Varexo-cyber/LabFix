'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ShoppingCart, Menu, X, Search, User, Globe, ChevronDown, ChevronRight, Phone, Mail, Wrench, Coins, LayoutGrid } from 'lucide-react';
import { brandCategories, accessoryCategories, pcPartsCategories, pcAccessoryCategories, laptopBrands, laptopPartsCategories } from '@/lib/categories';

interface Brand {
  id: number;
  slug: string;
  name: string;
  nameEn: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: number;
  slug: string;
  name: string;
  nameEn: string;
  sortOrder: number;
  models: Model[];
}

interface Model {
  id: number;
  slug: string;
  name: string;
  sortOrder: number;
}

export default function Header() {
  const { t, locale, setLocale, currency, setCurrency, cartCount, user, logout } = useApp();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{type: string; label: string; sublabel?: string; url: string}[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenBrand, setMobileOpenBrand] = useState<string | null>(null);
  const [mobileOpenSub, setMobileOpenSub] = useState<string | null>(null);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [mobileMoreBrand, setMobileMoreBrand] = useState<string | null>(null);
  const [mobileMoreSub, setMobileMoreSub] = useState<string | null>(null);
  const [hoveredSub, setHoveredSub] = useState<string | null>(null);
  const [hoveredMegaBrand, setHoveredMegaBrand] = useState<string | null>(null);
  const [hoveredMegaSub, setHoveredMegaSub] = useState<string | null>(null);
  const [megaSearch, setMegaSearch] = useState('');
  const [hoveredMoreBrand, setHoveredMoreBrand] = useState<string | null>(null);
  const [hoveredMoreSub, setHoveredMoreSub] = useState<string | null>(null);
  const [hoveredAccessoryCat, setHoveredAccessoryCat] = useState<string | null>(null);
  const [hoveredAccessorySub, setHoveredAccessorySub] = useState<string | null>(null);
  const [hoveredPcPartsCat, setHoveredPcPartsCat] = useState<string | null>(null);
  const [hoveredPcPartsSub, setHoveredPcPartsSub] = useState<string | null>(null);
  const [hoveredPcAccessoryCat, setHoveredPcAccessoryCat] = useState<string | null>(null);
  const [hoveredPcAccessorySub, setHoveredPcAccessorySub] = useState<string | null>(null);
  const [pcDropdownSection, setPcDropdownSection] = useState<'parts' | 'accessories' | null>(null);
  const [hoveredLaptopBrand, setHoveredLaptopBrand] = useState<string | null>(null);
  const [hoveredLaptopSub, setHoveredLaptopSub] = useState<string | null>(null);
  const [laptopDropdownSection, setLaptopDropdownSection] = useState<'parts' | 'refurbished' | null>(null);
  const [hoveredLaptopPartsCat, setHoveredLaptopPartsCat] = useState<string | null>(null);
  const [hoveredLaptopPartsSub, setHoveredLaptopPartsSub] = useState<string | null>(null);
  const [laptopWizardBrand, setLaptopWizardBrand] = useState<string | null>(null);
  const [laptopWizardModel, setLaptopWizardModel] = useState<string | null>(null);
  const [laptopWizardPart, setLaptopWizardPart] = useState<string | null>(null);
  const [moreSearch, setMoreSearch] = useState('');
  const [accessorySearch, setAccessorySearch] = useState('');
  const [dbCategories, setDbCategories] = useState<Brand[] | null>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch('/api/brands');
        const data = await res.json();
        if (data.success && data.brands.length > 0) {
          setDbCategories(data.brands);
        }
      } catch (error) {
        console.log('Using fallback categories');
      }
    };
    loadCategories();
  }, []);

  const categories = useMemo(() => {
    const hardcoded = brandCategories.filter(b => b.slug !== 'tje');
    if (!dbCategories) return hardcoded;
    const hardcodedSlugs = new Set(hardcoded.map(b => b.slug));
    const newDbBrands = dbCategories.filter(b => !hardcodedSlugs.has(b.slug) && b.slug !== 'tje');
    return [...hardcoded, ...newDbBrands];
  }, [dbCategories]);

  const navBrands = categories.filter(b => b.slug === 'apple' || b.slug === 'samsung');
  const moreBrands = categories;

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideDesktop = searchRef.current?.contains(target);
      const insideMobile = mobileSearchRef.current?.contains(target);
      if (!insideDesktop && !insideMobile) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const q = searchQuery.toLowerCase().trim();
    if (q.length < 2) { setSearchResults([]); setShowSearchDropdown(false); return; }
    const results: {type: string; label: string; sublabel?: string; url: string}[] = [];
    for (const brand of categories) {
      if (brand.name.toLowerCase().includes(q) || brand.nameEn.toLowerCase().includes(q)) {
        results.push({ type: 'Merk', label: brand.name, url: `/products?brand=${brand.slug}` });
      }
      for (const sub of brand.subcategories || []) {
        if (sub.name.toLowerCase().includes(q) || sub.nameEn.toLowerCase().includes(q)) {
          results.push({ type: 'Categorie', label: sub.name, sublabel: brand.name, url: `/products?brand=${brand.slug}&sub=${sub.slug}` });
        }
        for (const model of sub.models || []) {
          if (model.name.toLowerCase().includes(q)) {
            results.push({ type: 'Model', label: model.name, sublabel: `${brand.name} - ${sub.name}`, url: `/products?brand=${brand.slug}&sub=${sub.slug}&model=${model.slug}` });
          }
        }
      }
    }
    for (const cat of pcPartsCategories) {
      if (cat.name.toLowerCase().includes(q) || cat.nameEn.toLowerCase().includes(q)) {
        results.push({ type: 'PC Onderdeel', label: cat.name, url: `/products?pcpart=${cat.slug}` });
      }
    }
    for (const cat of accessoryCategories) {
      if (cat.name.toLowerCase().includes(q) || cat.nameEn.toLowerCase().includes(q)) {
        results.push({ type: 'Accessoire', label: cat.name, url: `/products?accessory=${cat.slug}` });
      }
    }
    setSearchResults(results.slice(0, 12));
    setShowSearchDropdown(results.length > 0);
  }, [searchQuery, categories]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="relative">
      {/* Top bar */}
      <div className="bg-primary-600 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
          <span className="font-medium hidden sm:inline">
            {locale === 'nl' ? 'NL verzending €6,95 • Gratis boven €150 • EU €18,95' : 'NL shipping €6.95 • Free above €150 • EU €18.95'}
          </span>
          <div className="flex items-center gap-4">
            <a href="mailto:info@labfix.nl" className="flex items-center gap-1 hover:text-gray-200">
              <Mail size={14} />
              info@labfix.nl
            </a>
            <a href="tel:+31651131133" className="hidden sm:flex items-center gap-1 hover:text-gray-200">
              <Phone size={14} />
              +31 6 5113 1133
            </a>
            <div className="relative">
              <button onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)} className="flex items-center gap-1 hover:text-gray-200">
                <Coins size={14} />
                {currency}
                <ChevronDown size={12} />
              </button>
              {showCurrencyDropdown && (
                <div className="absolute right-0 top-full bg-white text-gray-800 rounded-md shadow-lg z-50 min-w-[100px]">
                  <button onClick={() => { setCurrency('EUR'); setShowCurrencyDropdown(false); }} className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${currency === 'EUR' ? 'bg-primary-50 text-primary-600' : ''}`}>EUR</button>
                  <button onClick={() => { setCurrency('USD'); setShowCurrencyDropdown(false); }} className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${currency === 'USD' ? 'bg-primary-50 text-primary-600' : ''}`}>USD</button>
                </div>
              )}
            </div>
            <div className="relative">
              <button onClick={() => setShowLangDropdown(!showLangDropdown)} className="flex items-center gap-1 hover:text-gray-200">
                <Globe size={14} />
                {locale === 'nl' ? 'NL' : 'EN'}
                <ChevronDown size={12} />
              </button>
              {showLangDropdown && (
                <div className="absolute right-0 top-full bg-white text-gray-800 rounded-md shadow-lg z-50 min-w-[100px]">
                  <button onClick={() => { setLocale('nl'); setShowLangDropdown(false); }} className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${locale === 'nl' ? 'bg-primary-50 text-primary-600' : ''}`}>Nederlands</button>
                  <button onClick={() => { setLocale('en'); setShowLangDropdown(false); }} className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${locale === 'en' ? 'bg-primary-50 text-primary-600' : ''}`}>English</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main header with logo + search + actions */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            <Link href="/" className="flex-shrink-0">
              <img src="/logo.png" alt="LabFix" className="h-12 sm:h-20 md:h-24 w-auto" />
            </Link>

            {/* Search - desktop */}
            <div ref={searchRef} className="hidden md:block flex-1 max-w-xl relative">
              <form onSubmit={handleSearch} className="flex w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('nav.search')}
                  className="flex-1 border-2 border-r-0 border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                />
                <button type="submit" className="bg-red-500 text-white px-6 rounded-r-lg hover:bg-red-600">
                  <Search size={20} />
                </button>
              </form>
              {showSearchDropdown && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto mt-1">
                  {searchResults.map((result, idx) => (
                    <Link key={idx} href={result.url} className="block px-4 py-3 hover:bg-gray-50 border-b last:border-b-0" onClick={() => { setShowSearchDropdown(false); setSearchQuery(''); }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{result.label}</div>
                          {result.sublabel && <div className="text-xs text-gray-500">{result.sublabel}</div>}
                        </div>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{result.type}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              {/* Account - desktop label, mobile icon-only */}
              <Link href="/account" className="hidden md:flex flex-col items-center text-gray-700 hover:text-primary-600 transition-colors">
                <User size={22} />
                <span className="text-xs mt-0.5">{user ? t('nav.myAccount') : (locale === 'nl' ? 'Inloggen' : 'Login')}</span>
              </Link>
              <Link href="/account" aria-label={locale === 'nl' ? 'Inloggen' : 'Login'} className="md:hidden p-2 rounded-full hover:bg-gray-100 text-gray-700">
                <User size={22} />
              </Link>

              {/* Reparatie - compact on mobile */}
              <Link href="/repair" className="hidden md:flex flex-col items-center bg-red-500 hover:bg-red-600 text-white rounded-lg px-3 py-2 transition-colors glow-red-static">
                <Wrench size={22} />
                <span className="text-xs mt-0.5 font-semibold">{locale === 'nl' ? 'Reparatie' : 'Repair'}</span>
              </Link>
              <Link href="/repair" aria-label={locale === 'nl' ? 'Reparatie' : 'Repair'} className="md:hidden flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg w-10 h-10 transition-colors glow-red-static">
                <Wrench size={20} />
              </Link>

              {/* Cart - desktop label, mobile icon-only */}
              <Link href="/cart" className="hidden md:flex flex-col items-center text-gray-700 hover:text-primary-600 transition-colors relative">
                <ShoppingCart size={22} />
                <span className="text-xs mt-0.5">{locale === 'nl' ? 'Winkelwagen' : 'Cart'}</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>
                )}
              </Link>
              <Link href="/cart" aria-label={locale === 'nl' ? 'Winkelwagen' : 'Cart'} className="md:hidden relative p-2 rounded-full hover:bg-gray-100 text-gray-700">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold">{cartCount}</span>
                )}
              </Link>

              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu" className="lg:hidden p-2 rounded-full hover:bg-gray-100 text-gray-700">
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Search - mobile (full width below) */}
          <div ref={mobileSearchRef} className="md:hidden mt-3 relative">
            <form onSubmit={handleSearch} className="flex w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('nav.search')}
                className="flex-1 border-2 border-r-0 border-gray-300 rounded-l-lg px-4 py-2 text-sm focus:outline-none focus:border-primary-500"
              />
              <button type="submit" className="bg-red-500 text-white px-5 rounded-r-lg hover:bg-red-600">
                <Search size={18} />
              </button>
            </form>
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto mt-1">
                {searchResults.map((result, idx) => (
                  <Link key={idx} href={result.url} className="block px-4 py-3 hover:bg-gray-50 border-b last:border-b-0" onClick={() => { setShowSearchDropdown(false); setSearchQuery(''); }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{result.label}</div>
                        {result.sublabel && <div className="text-xs text-gray-500">{result.sublabel}</div>}
                      </div>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{result.type}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <nav className="bg-primary-500 text-white relative hidden lg:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1">
            {/* All Products Dropdown - Alleen Alle Merken */}
            <div className="relative" onMouseEnter={() => handleDropdownEnter('all-products')} onMouseLeave={handleDropdownLeave}>
              <Link href="/products" className={`px-4 py-3 font-semibold hover:bg-primary-600 transition-colors flex items-center gap-1 ${pathname === '/products' ? 'bg-primary-600' : ''}`}>
                <Menu size={16} />
                {t('nav.allProducts')}
                <ChevronDown size={12} />
              </Link>
              {openDropdown === 'all-products' && (
                <div className="absolute top-full left-0 bg-white text-gray-800 rounded-b-lg shadow-xl min-w-[780px] z-50 border-t-2 border-accent-500 max-h-[85vh] overflow-hidden">
                  <div className="flex border-b border-gray-200 bg-gray-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary-600">
                      <LayoutGrid size={16} />
                      {locale === 'nl' ? 'Alle merken' : 'All brands'}
                    </div>
                  </div>
                  <div className="h-[500px] flex">
                    <div className="w-[200px] border-r border-gray-100 overflow-y-auto">
                      <div className="p-3 bg-gray-50 border-b text-xs font-bold text-gray-500 uppercase">{locale === 'nl' ? 'Merken' : 'Brands'}</div>
                      <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                          <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input type="text" placeholder={locale === 'nl' ? 'Zoek merk...' : 'Search brand...'} value={megaSearch} onChange={(e) => setMegaSearch(e.target.value)} onClick={(e) => e.stopPropagation()} className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>
                      </div>
                      {categories.filter(b => !megaSearch || b.name.toLowerCase().includes(megaSearch.toLowerCase())).map((brand) => (
                        <div key={brand.slug} onMouseEnter={() => { setHoveredMegaBrand(brand.slug); setHoveredMegaSub(null); }}>
                          <Link href={`/products?brand=${brand.slug}`} className={`flex items-center justify-between px-3 py-2 text-sm transition-colors text-gray-900 ${hoveredMegaBrand === brand.slug ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'}`} onClick={() => setOpenDropdown(null)}>
                            {locale === 'en' ? brand.nameEn : brand.name}
                            <ChevronRight size={14} className="text-gray-400" />
                          </Link>
                        </div>
                      ))}
                    </div>
                    <div className="w-[240px] border-r border-gray-100 overflow-y-auto">
                      {hoveredMegaBrand && (() => {
                        const activeBrand = categories.find(b => b.slug === hoveredMegaBrand);
                        if (!activeBrand) return null;
                        return (
                          <>
                            <div className="p-3 bg-gray-50 border-b">
                              <Link href={`/products?brand=${activeBrand.slug}`} className="text-sm font-bold text-primary-600 hover:underline" onClick={() => setOpenDropdown(null)}>
                                {locale === 'nl' ? `Alle ${activeBrand.name}` : `All ${activeBrand.nameEn}`}
                              </Link>
                            </div>
                            {activeBrand.subcategories?.map((sub) => (
                              <div key={sub.slug} onMouseEnter={() => setHoveredMegaSub(sub.slug)}>
                                <Link href={`/products?brand=${activeBrand.slug}&sub=${sub.slug}`} className={`flex items-center justify-between px-3 py-2 text-sm transition-colors text-gray-900 ${hoveredMegaSub === sub.slug ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'}`} onClick={() => setOpenDropdown(null)}>
                                  {locale === 'en' ? sub.nameEn : sub.name}
                                  {sub.models.length > 0 && <ChevronRight size={14} className="text-gray-400" />}
                                </Link>
                              </div>
                            ))}
                          </>
                        );
                      })()}
                      {!hoveredMegaBrand && (
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm p-4 text-center">{locale === 'nl' ? 'Hover over een merk' : 'Hover over a brand'}</div>
                      )}
                    </div>
                    <div className="w-[340px] overflow-y-auto">
                      {hoveredMegaBrand && hoveredMegaSub && (() => {
                        const activeBrand = categories.find(b => b.slug === hoveredMegaBrand);
                        const activeSub = activeBrand?.subcategories.find(s => s.slug === hoveredMegaSub);
                        if (!activeSub || activeSub.models.length === 0) return null;
                        return (
                          <>
                            <div className="p-3 bg-gray-50 border-b">
                              <div className="text-xs font-bold text-gray-500 uppercase mb-1">{locale === 'en' ? activeSub.nameEn : activeSub.name}</div>
                            </div>
                            <div className="p-2 grid grid-cols-2 gap-1">
                              {activeSub.models.map((model) => (
                                <Link key={model.slug} href={`/products?brand=${activeBrand?.slug}&sub=${activeSub.slug}&model=${model.slug}`} className="block px-3 py-2 text-sm hover:bg-gray-50 hover:text-primary-600 rounded-md" onClick={() => setOpenDropdown(null)}>{model.name}</Link>
                              ))}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Brand nav items */}
            {navBrands.map((navBrand) => {
              const fullBrand = brandCategories.find(b => b.slug === navBrand.slug) || navBrand;
              return (
                <div key={navBrand.slug} className="relative" onMouseEnter={() => { handleDropdownEnter(navBrand.slug); setHoveredSub(null); }} onMouseLeave={handleDropdownLeave}>
                  <Link href={`/products?brand=${navBrand.slug}`} className={`px-3 py-3 hover:bg-primary-600 text-sm font-medium flex items-center gap-1 ${pathname.includes(navBrand.slug) ? 'bg-primary-600' : ''}`}>
                    {locale === 'en' ? navBrand.nameEn : navBrand.name}
                    <ChevronDown size={12} />
                  </Link>
                  {openDropdown === navBrand.slug && (
                    <div className="absolute top-full left-0 bg-white text-gray-800 rounded-b-lg shadow-xl min-w-[240px] z-50 border-t-2 border-accent-500 flex">
                      <div className="py-2 min-w-[240px] border-r border-gray-100">
                        <Link href={`/products?brand=${navBrand.slug}`} className="block px-4 py-2 text-sm font-semibold text-primary-600 hover:bg-gray-50 border-b" onClick={() => setOpenDropdown(null)}>
                          {locale === 'nl' ? `Alle ${navBrand.name}` : `All ${navBrand.nameEn}`}
                        </Link>
                        {fullBrand.subcategories?.map((sub) => (
                          <div key={sub.slug} onMouseEnter={() => setHoveredSub(sub.slug)}>
                            <Link href={`/products?brand=${navBrand.slug}&sub=${sub.slug}`} className={`flex items-center justify-between px-4 py-2 text-sm ${hoveredSub === sub.slug ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'}`} onClick={() => setOpenDropdown(null)}>
                              {locale === 'en' ? sub.nameEn : sub.name}
                              {sub.models.length > 0 && <ChevronRight size={14} className="text-gray-400" />}
                            </Link>
                          </div>
                        ))}
                      </div>
                      {hoveredSub && (() => {
                        const activeSub = fullBrand.subcategories?.find(s => s.slug === hoveredSub);
                        if (!activeSub || activeSub.models.length === 0) return null;
                        return (
                          <div className="py-2 min-w-[240px] max-h-[400px] overflow-y-auto">
                            <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase border-b">{locale === 'en' ? activeSub.nameEn : activeSub.name}</div>
                            {activeSub.models.map((model) => (
                              <Link key={model.slug} href={`/products?brand=${navBrand.slug}&sub=${activeSub.slug}&model=${model.slug}`} className="block px-4 py-1.5 text-sm hover:bg-gray-50 hover:text-primary-600" onClick={() => setOpenDropdown(null)}>{model.name}</Link>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              );
            })}

            {/* More brands */}
            {moreBrands.length > 0 && (
              <div className="relative" onMouseEnter={() => { handleDropdownEnter('more'); setHoveredMoreBrand(null); setHoveredMoreSub(null); }} onMouseLeave={handleDropdownLeave}>
                <button className="px-3 py-3 hover:bg-primary-600 text-sm font-medium flex items-center gap-1">
                  {locale === 'nl' ? 'Meer' : 'More'}
                  <ChevronDown size={12} />
                </button>
                {openDropdown === 'more' && (
                  <div className="absolute top-full left-0 bg-white text-gray-800 rounded-b-lg shadow-xl w-[480px] z-50 border-t-2 border-accent-500 flex h-[500px]">
                    <div className="w-[160px] border-r border-gray-100 overflow-y-auto">
                      <div className="p-3 bg-gray-50 border-b text-xs font-bold text-gray-500 uppercase">{locale === 'nl' ? 'Merken' : 'Brands'}</div>
                      <div className="p-2 border-b">
                        <input type="text" placeholder={locale === 'nl' ? 'Zoek...' : 'Search...'} value={moreSearch} onChange={(e) => setMoreSearch(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none" />
                      </div>
                      {moreBrands.filter(b => !moreSearch || b.name.toLowerCase().includes(moreSearch.toLowerCase())).map((brand) => (
                        <div key={brand.slug} onMouseEnter={() => { setHoveredMoreBrand(brand.slug); setHoveredMoreSub(null); }} className={`px-3 py-2 text-sm cursor-pointer ${hoveredMoreBrand === brand.slug ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'}`}>
                          {locale === 'en' ? brand.nameEn : brand.name}
                        </div>
                      ))}
                    </div>
                    <div className="w-[180px] border-r border-gray-100 overflow-y-auto">
                      {hoveredMoreBrand && (() => {
                        const brand = moreBrands.find(b => b.slug === hoveredMoreBrand);
                        if (!brand) return null;
                        return (
                          <>
                            <div className="p-3 bg-gray-50 border-b">
                              <Link href={`/products?brand=${brand.slug}`} className="text-sm font-bold text-primary-600 hover:underline" onClick={() => setOpenDropdown(null)}>{locale === 'nl' ? `Alle ${brand.name}` : `All ${brand.nameEn}`}</Link>
                            </div>
                            {brand.subcategories?.map((sub) => (
                              <div key={sub.slug} onMouseEnter={() => setHoveredMoreSub(sub.slug)} className={`px-3 py-2 text-sm cursor-pointer ${hoveredMoreSub === sub.slug ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'}`}>
                                {locale === 'en' ? sub.nameEn : sub.name}
                              </div>
                            ))}
                          </>
                        );
                      })()}
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      {hoveredMoreBrand && hoveredMoreSub && (() => {
                        const brand = moreBrands.find(b => b.slug === hoveredMoreBrand);
                        const sub = brand?.subcategories?.find(s => s.slug === hoveredMoreSub);
                        if (!sub || sub.models?.length === 0) return null;
                        return (
                          <>
                            <div className="p-3 bg-gray-50 border-b">
                              <div className="text-xs font-bold text-gray-500 uppercase">{locale === 'en' ? sub.nameEn : sub.name}</div>
                            </div>
                            <div className="p-2 grid grid-cols-2 gap-1">
                              {sub.models.map((model) => (
                                <Link key={model.slug} href={`/products?brand=${brand?.slug}&sub=${sub.slug}&model=${model.slug}`} className="block px-3 py-2 text-sm hover:bg-gray-50 hover:text-primary-600 rounded-md" onClick={() => setOpenDropdown(null)}>{model.name}</Link>
                              ))}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PC Dropdown */}
            <div className="relative" onMouseEnter={() => { handleDropdownEnter('pc'); setPcDropdownSection('parts'); setHoveredPcPartsCat(null); }} onMouseLeave={handleDropdownLeave}>
              <button className="px-3 py-3 hover:bg-primary-600 text-sm font-medium flex items-center gap-1">
                PC
                <ChevronDown size={12} />
              </button>
              {openDropdown === 'pc' && (
                <div className="absolute top-full left-0 bg-white text-gray-800 rounded-b-lg shadow-xl w-[640px] z-50 border-t-2 border-accent-500 flex h-[500px]">
                  <div className="w-[220px] border-r border-gray-100 overflow-y-auto">
                    <div className="flex border-b">
                      <div onMouseEnter={() => setPcDropdownSection('parts')} className={`flex-1 px-3 py-2 text-sm cursor-pointer font-semibold whitespace-nowrap ${pcDropdownSection === 'parts' ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'}`}>
                        {locale === 'nl' ? 'Onderdelen' : 'Parts'}
                      </div>
                      <div onMouseEnter={() => { setPcDropdownSection('accessories'); setHoveredPcPartsCat(null); }} className={`flex-1 px-3 py-2 text-sm cursor-pointer font-semibold whitespace-nowrap ${pcDropdownSection === 'accessories' ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'}`}>
                        {locale === 'nl' ? 'Accessoires' : 'Accessories'}
                      </div>
                    </div>
                    {pcDropdownSection === 'parts' && pcPartsCategories.map((cat) => (
                      <div key={cat.slug} onMouseEnter={() => setHoveredPcPartsCat(cat.slug)} className={`px-3 py-2 text-sm cursor-pointer ${hoveredPcPartsCat === cat.slug ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'}`}>
                        {locale === 'en' ? cat.nameEn : cat.name}
                      </div>
                    ))}
                    {pcDropdownSection === 'accessories' && pcAccessoryCategories.map((cat) => (
                      <div key={cat.slug} onMouseEnter={() => setHoveredPcAccessoryCat(cat.slug)} className={`px-3 py-2 text-sm cursor-pointer ${hoveredPcAccessoryCat === cat.slug ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'}`}>
                        {locale === 'en' ? cat.nameEn : cat.name}
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 overflow-y-auto p-3">
                    {pcDropdownSection === 'parts' && hoveredPcPartsCat && (() => {
                      const cat = pcPartsCategories.find(c => c.slug === hoveredPcPartsCat);
                      if (!cat) return null;
                      return (
                        <>
                          <div className="text-sm font-bold text-primary-600 mb-2">{locale === 'en' ? cat.nameEn : cat.name}</div>
                          {cat.subcategories?.map((sub) => (
                            <Link key={sub.slug} href={`/products?pcpart=${cat.slug}&sub=${sub.slug}`} className="block px-2 py-1.5 text-sm hover:bg-gray-50" onClick={() => setOpenDropdown(null)}>
                              {locale === 'nl' ? sub.name : sub.nameEn}
                            </Link>
                          ))}
                        </>
                      );
                    })()}
                    {pcDropdownSection === 'accessories' && hoveredPcAccessoryCat && (() => {
                      const cat = pcAccessoryCategories.find(c => c.slug === hoveredPcAccessoryCat);
                      if (!cat) return null;
                      return (
                        <>
                          <div className="text-sm font-bold text-primary-600 mb-2">{locale === 'en' ? cat.nameEn : cat.name}</div>
                          {cat.subcategories?.map((sub) => (
                            <Link key={sub.slug} href={`/products?pcacc=${cat.slug}&sub=${sub.slug}`} className="block px-2 py-1.5 text-sm hover:bg-gray-50" onClick={() => setOpenDropdown(null)}>
                              {locale === 'nl' ? sub.name : sub.nameEn}
                            </Link>
                          ))}
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>

            {/* Laptop Dropdown */}
            <div className="relative" onMouseEnter={() => { handleDropdownEnter('laptop'); setLaptopWizardBrand(null); setLaptopWizardModel(null); setLaptopWizardPart(null); }} onMouseLeave={handleDropdownLeave}>
              <button className="px-3 py-3 hover:bg-primary-600 text-sm font-medium flex items-center gap-1">
                Laptop
                <ChevronDown size={12} />
              </button>
              {openDropdown === 'laptop' && (() => {
                const wizardBrand = laptopBrands.find(b => b.slug === laptopWizardBrand);
                const wizardModels = wizardBrand?.subcategories || [];
                const wizardParts = laptopPartsCategories;
                return (
                  <div className="absolute top-full left-0 bg-white text-gray-800 rounded-b-lg shadow-xl z-50 border-t-2 border-accent-500 p-4" style={{width: '340px'}}>
                    <div className="text-xs font-bold text-gray-400 uppercase mb-3">{locale === 'nl' ? 'Zoek laptop onderdeel' : 'Find laptop part'}</div>
                    {/* Step 1: Kies Merk */}
                    <div className="mb-3">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">{locale === 'nl' ? '1. Kies Merk' : '1. Choose Brand'}</label>
                      <select
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                        value={laptopWizardBrand || ''}
                        onChange={e => { setLaptopWizardBrand(e.target.value || null); setLaptopWizardModel(null); setLaptopWizardPart(null); }}
                      >
                        <option value="">{locale === 'nl' ? '-- Selecteer merk --' : '-- Select brand --'}</option>
                        {laptopBrands.map(b => <option key={b.slug} value={b.slug}>{b.name}</option>)}
                      </select>
                    </div>
                    {/* Step 2: Kies Model */}
                    <div className="mb-3">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">{locale === 'nl' ? '2. Kies Model' : '2. Choose Model'}</label>
                      <select
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-400"
                        value={laptopWizardModel || ''}
                        onChange={e => { setLaptopWizardModel(e.target.value || null); setLaptopWizardPart(null); }}
                        disabled={!laptopWizardBrand}
                      >
                        <option value="">{locale === 'nl' ? '-- Selecteer model --' : '-- Select model --'}</option>
                        {wizardModels.map(s => <option key={s.slug} value={s.slug}>{s.name}</option>)}
                      </select>
                    </div>
                    {/* Step 3: Kies Onderdeel */}
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">{locale === 'nl' ? '3. Kies Onderdeel' : '3. Choose Part'}</label>
                      <select
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-400"
                        value={laptopWizardPart || ''}
                        onChange={e => setLaptopWizardPart(e.target.value || null)}
                        disabled={!laptopWizardModel}
                      >
                        <option value="">{locale === 'nl' ? '-- Selecteer onderdeel --' : '-- Select part --'}</option>
                        {wizardParts.map(p => <option key={p.slug} value={p.slug}>{locale === 'nl' ? p.name : p.nameEn}</option>)}
                      </select>
                    </div>
                    {/* Search button */}
                    <Link
                      href={laptopWizardBrand ? `/products?laptop=${laptopWizardBrand}${laptopWizardModel ? `&sub=${laptopWizardModel}` : ''}${laptopWizardPart ? `&part=${laptopWizardPart}` : ''}` : '/products?category=laptop'}
                      onClick={() => { setOpenDropdown(null); setLaptopWizardBrand(null); setLaptopWizardModel(null); setLaptopWizardPart(null); }}
                      className="block w-full bg-red-500 hover:bg-red-600 text-white text-center py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      {locale === 'nl' ? 'Zoeken' : 'Search'}
                    </Link>
                  </div>
                );
              })()}
            </div>

            {/* Accessories Dropdown */}
            <div className="relative" onMouseEnter={() => { handleDropdownEnter('accessories'); setHoveredAccessoryCat(null); }} onMouseLeave={handleDropdownLeave}>
              <button className="px-3 py-3 hover:bg-primary-600 text-sm font-medium flex items-center gap-1">
                {locale === 'nl' ? 'Accessoires' : 'Accessories'}
                <ChevronDown size={12} />
              </button>
              {openDropdown === 'accessories' && (
                <div className="absolute top-full left-0 bg-white text-gray-800 rounded-b-lg shadow-xl w-[560px] z-50 border-t-2 border-accent-500 flex h-[500px]">
                  <div className="w-[200px] border-r border-gray-100 overflow-y-auto">
                    <div className="p-3 bg-gray-50 border-b text-xs font-bold text-gray-500 uppercase">{locale === 'nl' ? 'Categorieën' : 'Categories'}</div>
                    {accessoryCategories.map((cat) => (
                      <div key={cat.slug} onMouseEnter={() => setHoveredAccessoryCat(cat.slug)} className={`px-3 py-2 text-sm cursor-pointer ${hoveredAccessoryCat === cat.slug ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'}`}>
                        {locale === 'nl' ? cat.name : cat.nameEn}
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 overflow-y-auto p-3">
                    {hoveredAccessoryCat && (() => {
                      const cat = accessoryCategories.find(c => c.slug === hoveredAccessoryCat);
                      if (!cat) return null;
                      return (
                        <>
                          <div className="text-sm font-bold text-primary-600 mb-2">{locale === 'nl' ? cat.name : cat.nameEn}</div>
                          {cat.subcategories?.map((sub) => (
                            <Link key={sub.slug} href={`/products?accessory=${cat.slug}&sub=${sub.slug}`} className="block px-2 py-1.5 text-sm hover:bg-gray-50" onClick={() => setOpenDropdown(null)}>
                              {locale === 'nl' ? sub.name : sub.nameEn}
                            </Link>
                          ))}
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1" />

            <Link href="/about" className={`px-3 py-3 hover:bg-primary-600 text-sm font-medium ${pathname === '/about' ? 'bg-primary-600' : ''}`}>{t('nav.about')}</Link>
            <Link href="/contact" className={`px-3 py-3 hover:bg-primary-600 text-sm font-medium ${pathname === '/contact' ? 'bg-primary-600' : ''}`}>{t('nav.contact')}</Link>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t max-h-[85vh] overflow-y-auto shadow-lg">
          {/* Account quick link */}
          <Link href="/account" className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
            <User size={20} className="text-primary-600" />
            <span className="font-medium text-sm">{user ? t('nav.myAccount') : (locale === 'nl' ? 'Inloggen / Mijn Account' : 'Login / My Account')}</span>
          </Link>

          <div>
            <Link href="/products" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 border-b font-semibold text-sm" onClick={() => setMobileMenuOpen(false)}>
              <LayoutGrid size={18} className="text-primary-600" />
              {t('nav.allProducts')}
            </Link>

            {/* Alle merken */}
            <div className="border-b">
              <button onClick={() => setMobileMoreOpen(!mobileMoreOpen)} className="w-full px-4 py-3 hover:bg-gray-50 flex items-center justify-between font-semibold text-sm">
                <span>{locale === 'nl' ? 'Alle Merken' : 'All Brands'}</span>
                <ChevronDown size={16} className={`transition-transform ${mobileMoreOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileMoreOpen && (
                <div className="bg-gray-50">
                  {categories.map((brand) => (
                    <div key={brand.slug}>
                      <button onClick={() => setMobileMoreBrand(mobileMoreBrand === brand.slug ? null : brand.slug)} className={`w-full px-6 py-2 hover:bg-gray-100 flex items-center justify-between text-sm ${mobileMoreBrand === brand.slug ? 'bg-primary-50 text-primary-600' : ''}`}>
                        <span>{locale === 'en' ? brand.nameEn : brand.name}</span>
                        <ChevronDown size={14} className={`transition-transform ${mobileMoreBrand === brand.slug ? 'rotate-180' : ''}`} />
                      </button>
                      {mobileMoreBrand === brand.slug && (
                        <div className="bg-white">
                          <Link href={`/products?brand=${brand.slug}`} className="block px-8 py-2 hover:bg-gray-50 text-sm text-primary-600 font-medium border-b" onClick={() => setMobileMenuOpen(false)}>
                            {locale === 'nl' ? `Alle ${brand.name}` : `All ${brand.nameEn}`}
                          </Link>
                          {brand.subcategories?.map((sub) => (
                            <Link key={sub.slug} href={`/products?brand=${brand.slug}&sub=${sub.slug}`} className="block px-8 py-2 hover:bg-gray-100 text-sm" onClick={() => setMobileMenuOpen(false)}>
                              {locale === 'en' ? sub.nameEn : sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Accessoires */}
            <div className="border-b">
              <button onClick={() => setMobileOpenBrand(mobileOpenBrand === '__acc' ? null : '__acc')} className="w-full px-4 py-3 hover:bg-gray-50 flex items-center justify-between font-semibold text-sm">
                <span>{locale === 'nl' ? 'Accessoires' : 'Accessories'}</span>
                <ChevronDown size={16} className={`transition-transform ${mobileOpenBrand === '__acc' ? 'rotate-180' : ''}`} />
              </button>
              {mobileOpenBrand === '__acc' && (
                <div className="bg-gray-50">
                  {accessoryCategories.map((cat) => (
                    <Link key={cat.slug} href={`/products?accessory=${cat.slug}`} className="block px-6 py-2 hover:bg-gray-100 text-sm" onClick={() => setMobileMenuOpen(false)}>
                      {locale === 'en' ? cat.nameEn : cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* PC */}
            <div className="border-b">
              <button onClick={() => setMobileOpenBrand(mobileOpenBrand === '__pc' ? null : '__pc')} className="w-full px-4 py-3 hover:bg-gray-50 flex items-center justify-between font-semibold text-sm">
                <span>PC</span>
                <ChevronDown size={16} className={`transition-transform ${mobileOpenBrand === '__pc' ? 'rotate-180' : ''}`} />
              </button>
              {mobileOpenBrand === '__pc' && (
                <div className="bg-gray-50">
                  <div className="px-6 py-1.5 text-xs font-bold text-gray-500 uppercase">{locale === 'nl' ? 'Onderdelen' : 'Parts'}</div>
                  {pcPartsCategories.map((cat) => (
                    <Link key={cat.slug} href={`/products?pcpart=${cat.slug}`} className="block px-6 py-2 hover:bg-gray-100 text-sm" onClick={() => setMobileMenuOpen(false)}>
                      {locale === 'en' ? cat.nameEn : cat.name}
                    </Link>
                  ))}
                  <div className="px-6 py-1.5 text-xs font-bold text-gray-500 uppercase">{locale === 'nl' ? 'Accessoires' : 'Accessories'}</div>
                  {pcAccessoryCategories.map((cat) => (
                    <Link key={cat.slug} href={`/products?pcacc=${cat.slug}`} className="block px-6 py-2 hover:bg-gray-100 text-sm" onClick={() => setMobileMenuOpen(false)}>
                      {locale === 'en' ? cat.nameEn : cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Laptop */}
            <div className="border-b">
              <button onClick={() => setMobileOpenBrand(mobileOpenBrand === '__laptop' ? null : '__laptop')} className="w-full px-4 py-3 hover:bg-gray-50 flex items-center justify-between font-semibold text-sm">
                <span>Laptop</span>
                <ChevronDown size={16} className={`transition-transform ${mobileOpenBrand === '__laptop' ? 'rotate-180' : ''}`} />
              </button>
              {mobileOpenBrand === '__laptop' && (
                <div className="bg-gray-50">
                  <div className="px-6 py-1.5 text-xs font-bold text-gray-500 uppercase">Refurbished</div>
                  {laptopBrands.map((b) => (
                    <Link key={b.slug} href={`/products?laptop=${b.slug}`} className="block px-6 py-2 hover:bg-gray-100 text-sm" onClick={() => setMobileMenuOpen(false)}>
                      {locale === 'en' ? b.nameEn : b.name}
                    </Link>
                  ))}
                  <div className="px-6 py-1.5 text-xs font-bold text-gray-500 uppercase">{locale === 'nl' ? 'Onderdelen' : 'Parts'}</div>
                  {laptopPartsCategories.map((c) => (
                    <Link key={c.slug} href={`/products?laptop-parts=${c.slug}`} className="block px-6 py-2 hover:bg-gray-100 text-sm" onClick={() => setMobileMenuOpen(false)}>
                      {locale === 'en' ? c.nameEn : c.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/repair" className="mx-3 my-3 px-4 py-4 bg-red-500 text-white rounded-xl text-center font-bold flex items-center justify-center gap-2 glow-red-static" onClick={() => setMobileMenuOpen(false)}>
              <Wrench size={20} />
              {locale === 'nl' ? 'Reparatie Aanvragen' : 'Repair Request'}
            </Link>

            <Link href="/about" className="block px-4 py-3 hover:bg-gray-50 border-t text-sm" onClick={() => setMobileMenuOpen(false)}>{t('nav.about')}</Link>
            <Link href="/contact" className="block px-4 py-3 hover:bg-gray-50 border-t text-sm" onClick={() => setMobileMenuOpen(false)}>{t('nav.contact')}</Link>
          </div>
        </div>
      )}
    </header>
  );
}
