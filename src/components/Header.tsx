'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ShoppingCart, Menu, X, Search, User, Globe, ChevronDown, ChevronRight, ChevronLeft, Phone, Mail, Truck, Wrench, Coins, Loader2, LayoutGrid, Smartphone } from 'lucide-react';
import { brandCategories, accessoryCategories, pcPartsCategories, pcAccessoryCategories, laptopBrands, laptopPartsCategories, AccessoryCategory } from '@/lib/categories';

// Type for dynamic brands from database
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
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenBrand, setMobileOpenBrand] = useState<string | null>(null);
  const [mobileOpenSub, setMobileOpenSub] = useState<string | null>(null);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [mobileMoreBrand, setMobileMoreBrand] = useState<string | null>(null);
  const [mobileMoreSub, setMobileMoreSub] = useState<string | null>(null);
  const [mobileMoreTab, setMobileMoreTab] = useState<'brands' | 'accessories' | 'pc' | 'laptop'>('brands');
  const [hoveredSub, setHoveredSub] = useState<string | null>(null);
  const [hoveredMegaBrand, setHoveredMegaBrand] = useState<string | null>(null);
  const [hoveredMegaSub, setHoveredMegaSub] = useState<string | null>(null);
  const [megaTab, setMegaTab] = useState<'selector' | 'brands' | 'accessories'>('selector');
  const [megaSearch, setMegaSearch] = useState('');
  const [hoveredMoreBrand, setHoveredMoreBrand] = useState<string | null>(null);
  const [hoveredMoreSub, setHoveredMoreSub] = useState<string | null>(null);
  const [hoveredAccessoryCat, setHoveredAccessoryCat] = useState<string | null>(null);
  const [hoveredAccessorySub, setHoveredAccessorySub] = useState<string | null>(null);
  const [hoveredPcPartsCat, setHoveredPcPartsCat] = useState<string | null>(null);
  const [hoveredPcPartsSub, setHoveredPcPartsSub] = useState<string | null>(null);
  const [hoveredPcAccessoryCat, setHoveredPcAccessoryCat] = useState<string | null>(null);
  const [hoveredPcAccessorySub, setHoveredPcAccessorySub] = useState<string | null>(null);
  // PC combined dropdown
  const [pcDropdownTab, setPcDropdownTab] = useState<'parts' | 'accessories'>('parts');
  // Laptop dropdown
  const [laptopDropdownTab, setLaptopDropdownTab] = useState<'refurbished' | 'parts'>('refurbished');
  const [laptopSelectedBrand, setLaptopSelectedBrand] = useState<string | null>(null);
  const [laptopSelectedSub, setLaptopSelectedSub] = useState<string | null>(null);
  const [laptopSelectorStep, setLaptopSelectorStep] = useState<number>(1);
  const [laptopSearch, setLaptopSearch] = useState('');
  const [hoveredLaptopBrand, setHoveredLaptopBrand] = useState<string | null>(null);
  const [hoveredLaptopSub, setHoveredLaptopSub] = useState<string | null>(null);
  const [hoveredLaptopPartsCat, setHoveredLaptopPartsCat] = useState<string | null>(null);
  const [hoveredLaptopPartsSub, setHoveredLaptopPartsSub] = useState<string | null>(null);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  // Search states for dropdowns
  const [moreSearch, setMoreSearch] = useState('');
  const [accessorySearch, setAccessorySearch] = useState('');
  const [pcPartsSearch, setPcPartsSearch] = useState('');
  const [pcAccessorySearch, setPcAccessorySearch] = useState('');

  // Multi-step selector state for All Products
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectorStep, setSelectorStep] = useState<number>(1); // 1=brand, 2=subcategory, 3=model
  const [dbCategories, setDbCategories] = useState<Brand[] | null>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load categories from database
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
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Always use hardcoded brandCategories as primary source (has all subcategories & models)
  // Merge with any NEW brands from database that don't exist in hardcoded data
  const categories = useMemo(() => {
    const hardcoded = brandCategories.filter(b => b.slug !== 'tje');
    if (!dbCategories) return hardcoded;
    // Add any db brands not in hardcoded
    const hardcodedSlugs = new Set(hardcoded.map(b => b.slug));
    const newDbBrands = dbCategories.filter(b => !hardcodedSlugs.has(b.slug) && b.slug !== 'tje');
    return [...hardcoded, ...newDbBrands];
  }, [dbCategories]);
  // Only Apple and Samsung in main nav, ALL phone brands go to "Meer"
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

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live search across all categories
  useEffect(() => {
    const q = searchQuery.toLowerCase().trim();
    if (q.length < 2) { setSearchResults([]); setShowSearchDropdown(false); return; }
    
    const results: {type: string; label: string; sublabel?: string; url: string}[] = [];

    // Search phone brands, subcategories, models
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
            results.push({ type: 'Model', label: model.name, sublabel: `${brand.name} › ${sub.name}`, url: `/products?brand=${brand.slug}&sub=${sub.slug}&model=${model.slug}` });
          }
        }
      }
    }

    // Search PC parts
    for (const cat of pcPartsCategories) {
      if (cat.name.toLowerCase().includes(q) || cat.nameEn.toLowerCase().includes(q)) {
        results.push({ type: 'PC Onderdeel', label: cat.name, url: `/products?pcpart=${cat.slug}` });
      }
      for (const sub of cat.subcategories || []) {
        if (sub.name.toLowerCase().includes(q) || sub.nameEn.toLowerCase().includes(q)) {
          results.push({ type: 'PC Onderdeel', label: sub.name, sublabel: cat.name, url: `/products?pcpart=${cat.slug}&sub=${sub.slug}` });
        }
      }
    }

    // Search PC accessories
    for (const cat of pcAccessoryCategories) {
      if (cat.name.toLowerCase().includes(q) || cat.nameEn.toLowerCase().includes(q)) {
        results.push({ type: 'PC Accessoire', label: cat.name, url: `/products?pcacc=${cat.slug}` });
      }
      for (const sub of cat.subcategories || []) {
        if (sub.name.toLowerCase().includes(q) || sub.nameEn.toLowerCase().includes(q)) {
          results.push({ type: 'PC Accessoire', label: sub.name, sublabel: cat.name, url: `/products?pcacc=${cat.slug}&sub=${sub.slug}` });
        }
      }
    }

    // Search accessories
    for (const cat of accessoryCategories) {
      if (cat.name.toLowerCase().includes(q) || cat.nameEn.toLowerCase().includes(q)) {
        results.push({ type: 'Accessoire', label: cat.name, url: `/products?accessory=${cat.slug}` });
      }
      for (const sub of cat.subcategories || []) {
        if (sub.name.toLowerCase().includes(q) || sub.nameEn.toLowerCase().includes(q)) {
          results.push({ type: 'Accessoire', label: sub.name, sublabel: cat.name, url: `/products?accessory=${cat.slug}&sub=${sub.slug}` });
        }
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

  try {
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
          {/* Currency Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
              className="flex items-center gap-1 hover:text-gray-200"
            >
              <Coins size={14} />
              {currency}
              <ChevronDown size={12} />
            </button>
            {showCurrencyDropdown && (
              <div className="absolute right-0 top-full mt-1 bg-white text-gray-800 rounded shadow-lg py-1 min-w-[80px] z-50">
                {['EUR', 'USD', 'GBP'].map((curr) => (
                  <button
                    key={curr}
                    onClick={() => { setCurrency(curr as 'EUR' | 'USD' | 'GBP'); setShowCurrencyDropdown(false); }}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${currency === curr ? 'font-bold text-primary-500' : ''}`}
                  >
                    {curr === 'EUR' && '€ EUR'}
                    {curr === 'USD' && '$ USD'}
                    {curr === 'GBP' && '£ GBP'}
                  </button>
                ))}
              </div>
            )}
          </div>
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
              <img src="/logo.png" alt="LabFix" className="h-28 w-auto" />
            </Link>

            {/* Search Bar with Live Dropdown */}
            <div ref={searchRef} className="hidden md:block flex-1 max-w-xl relative">
              <form onSubmit={handleSearch} className="flex w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowSearchDropdown(true); }}
                  onFocus={() => { if (searchResults.length > 0) setShowSearchDropdown(true); }}
                  placeholder={t('nav.search')}
                  className="flex-1 border-2 border-r-0 border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="bg-accent-500 text-white px-6 py-2 rounded-r-lg hover:bg-accent-600 transition-colors"
                >
                  <Search size={20} />
                </button>
              </form>
              {/* Live Search Dropdown */}
              {showSearchDropdown && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white rounded-b-lg shadow-xl border border-gray-200 z-[100] max-h-[400px] overflow-y-auto mt-0.5">
                  {searchResults.map((result, i) => (
                    <Link
                      key={i}
                      href={result.url}
                      onClick={() => { setShowSearchDropdown(false); setSearchQuery(''); }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors border-b border-gray-50 last:border-b-0"
                    >
                      <span className="text-[10px] font-bold uppercase bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {result.type}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{result.label}</p>
                        {result.sublabel && <p className="text-xs text-gray-400 truncate">{result.sublabel}</p>}
                      </div>
                      <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
                    </Link>
                  ))}
                  <Link
                    href={`/products?search=${encodeURIComponent(searchQuery)}`}
                    onClick={() => { setShowSearchDropdown(false); setSearchQuery(''); }}
                    className="block px-4 py-3 text-center text-sm font-medium text-primary-600 hover:bg-primary-50 border-t border-gray-200"
                  >
                    {locale === 'nl' ? `Alle resultaten voor "${searchQuery}"` : `All results for "${searchQuery}"`} →
                  </Link>
                </div>
              )}
            </div>

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
              <Link href="/repair" className="flex flex-col items-center bg-gradient-to-r from-red-500 to-red-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 border-2 border-red-400 animate-attention animate-glow-red">
                <Wrench size={22} className="animate-pulse" />
                <span className="text-[10px] sm:text-xs font-bold whitespace-nowrap">{locale === 'nl' ? 'Reparatie' : 'Repair'}</span>
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
              {/* All Products Multi-Step Selector Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => { handleDropdownEnter('all-products'); }}
                onMouseLeave={handleDropdownLeave}
              >
                <Link
                  href="/products"
                  className={`px-4 py-2 font-semibold hover:bg-primary-600 transition-colors flex items-center gap-1 whitespace-nowrap ${pathname === '/products' ? 'bg-primary-600 border-b-2 border-white' : ''}`}
                >
                  <Menu size={16} />
                  {t('nav.allProducts')}
                  <ChevronDown size={12} />
                </Link>
                {openDropdown === 'all-products' && (
                  <div className="absolute top-full left-0 bg-white text-gray-800 rounded-b-lg shadow-xl min-w-[780px] z-50 border-t-2 border-accent-500 max-h-[85vh] overflow-hidden">
                    {/* Tabs Header */}
                    <div className="flex border-b border-gray-200 bg-gray-50">
                      <button
                        onClick={() => setMegaTab('selector')}
                        className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                          megaTab === 'selector' 
                            ? 'bg-white text-primary-600 border-b-2 border-primary-600' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <Search size={16} />
                        {locale === 'nl' ? 'Snel zoeken' : 'Quick Search'}
                      </button>
                      <button
                        onClick={() => setMegaTab('brands')}
                        className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                          megaTab === 'brands' 
                            ? 'bg-white text-primary-600 border-b-2 border-primary-600' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <LayoutGrid size={16} />
                        {locale === 'nl' ? 'Alle merken' : 'All brands'}
                      </button>
                      <button
                        onClick={() => setMegaTab('accessories')}
                        className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                          megaTab === 'accessories' 
                            ? 'bg-white text-primary-600 border-b-2 border-primary-600' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <Smartphone size={16} />
                        {locale === 'nl' ? 'Accessoires' : 'Accessories'}
                      </button>
                    </div>

                    {/* Tab Content */}
                    <div className="h-[500px]">
                      {/* TAB 1: Quick Selector */}
                      {megaTab === 'selector' && (
                        <div className="p-6 w-[420px] mx-auto animate-fade-in">
                          <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-primary-600">{locale === 'nl' ? 'Zoek je onderdeel' : 'Find your part'}</h3>
                            <p className="text-sm text-gray-500 mt-1">{locale === 'nl' ? 'Selecteer stap voor stap' : 'Step by step selection'}</p>
                          </div>
                          
                          {/* Step 1: Kies je merk */}
                          <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{locale === 'nl' ? 'Kies je merk' : 'Choose your brand'}</label>
                            <select 
                              value={selectedBrand || ''}
                              onChange={(e) => {
                                const brandSlug = e.target.value;
                                setSelectedBrand(brandSlug || null);
                                setSelectedSubcategory(null);
                                setSelectedModel(null);
                                setSelectorStep(brandSlug ? 2 : 1);
                              }}
                              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer"
                            >
                              <option value="">{locale === 'nl' ? 'Kies je merk' : 'Choose your brand'}</option>
                              {(() => {
                                const popularSlugs = ['apple', 'samsung', 'google', 'huawei', 'xiaomi', 'oneplus'];
                                const allBrands = Array.from(new Map(categories.map(b => [b.slug, b])).values());
                                const popular = popularSlugs.map(s => allBrands.find(b => b.slug === s)).filter(Boolean) as typeof allBrands;
                                const rest = allBrands.filter(b => !popularSlugs.includes(b.slug)).sort((a, b) => a.name.localeCompare(b.name));
                                return (
                                  <>
                                    <optgroup label={locale === 'nl' ? 'POPULAIRE MERKEN' : 'POPULAR BRANDS'}>
                                      {popular.map(brand => (
                                        <option key={brand.slug} value={brand.slug}>{brand.name}</option>
                                      ))}
                                    </optgroup>
                                    <optgroup label={locale === 'nl' ? 'ALLE MERKEN' : 'ALL BRANDS'}>
                                      {rest.map(brand => (
                                        <option key={brand.slug} value={brand.slug}>{brand.name}</option>
                                      ))}
                                    </optgroup>
                                    <optgroup label={locale === 'nl' ? 'PC & LAPTOP ONDERDELEN' : 'PC & LAPTOP PARTS'}>
                                      {pcPartsCategories.map(cat => (
                                        <option key={`pc-${cat.slug}`} value={`pc-parts-${cat.slug}`}>{cat.name}</option>
                                      ))}
                                      {pcAccessoryCategories.map(cat => (
                                        <option key={`pca-${cat.slug}`} value={`pc-acc-${cat.slug}`}>{cat.name}</option>
                                      ))}
                                    </optgroup>
                                  </>
                                );
                              })()}
                            </select>
                          </div>

                          {/* Step 2: Kies je model */}
                          {selectedBrand && (() => {
                            // Check if it's a PC parts/accessory category
                            const isPcParts = selectedBrand.startsWith('pc-parts-');
                            const isPcAcc = selectedBrand.startsWith('pc-acc-');
                            if (isPcParts || isPcAcc) {
                              const catSlug = selectedBrand.replace('pc-parts-', '').replace('pc-acc-', '');
                              const source = isPcParts ? pcPartsCategories : pcAccessoryCategories;
                              const cat = source.find(c => c.slug === catSlug);
                              if (!cat || !cat.subcategories || cat.subcategories.length === 0) return null;
                              return (
                                <div className="mb-4">
                                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{locale === 'nl' ? 'Kies subcategorie' : 'Choose subcategory'}</label>
                                  <select
                                    value={selectedSubcategory || ''}
                                    onChange={(e) => {
                                      setSelectedSubcategory(e.target.value || null);
                                      setSelectedModel(null);
                                      setSelectorStep(e.target.value ? 3 : 2);
                                    }}
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer"
                                  >
                                    <option value="">{locale === 'nl' ? 'Kies subcategorie' : 'Choose subcategory'}</option>
                                    {cat.subcategories.map((sub) => (
                                      <option key={sub.slug} value={sub.slug}>{sub.name}</option>
                                    ))}
                                  </select>
                                </div>
                              );
                            }
                            const brand = categories.find(b => b.slug === selectedBrand);
                            return brand ? (
                              <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{locale === 'nl' ? 'Kies je model' : 'Choose your model'}</label>
                                <select
                                  value={selectedSubcategory || ''}
                                  onChange={(e) => {
                                    const subSlug = e.target.value;
                                    setSelectedSubcategory(subSlug || null);
                                    setSelectedModel(null);
                                    setSelectorStep(subSlug ? 3 : 2);
                                  }}
                                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer"
                                >
                                  <option value="">{locale === 'nl' ? 'Kies je model' : 'Choose your model'}</option>
                                  {brand.subcategories?.map((sub) => (
                                    <option key={sub.slug} value={sub.slug}>
                                      {sub.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ) : null;
                          })()}

                          {/* Step 3: Kies je serie */}
                          {selectedBrand && selectedSubcategory && !selectedBrand.startsWith('pc-parts-') && !selectedBrand.startsWith('pc-acc-') && (() => {
                            const brand = categories.find(b => b.slug === selectedBrand);
                            const subcategory = brand?.subcategories?.find(s => s.slug === selectedSubcategory);
                            return subcategory && subcategory.models.length > 0 ? (
                              <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{locale === 'nl' ? 'Kies je serie' : 'Choose your series'}</label>
                                <select
                                  value={selectedModel || ''}
                                  onChange={(e) => {
                                    const modelSlug = e.target.value;
                                    setSelectedModel(modelSlug || null);
                                    setSelectorStep(modelSlug ? 4 : 3);
                                  }}
                                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer"
                                >
                                  <option value="">{locale === 'nl' ? 'Kies je serie' : 'Choose your series'}</option>
                                  {subcategory.models.map((model) => (
                                    <option key={model.slug} value={model.slug}>
                                      {model.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ) : null;
                          })()}

                          {/* Action Buttons */}
                          <div className="flex gap-2 mt-6">
                            <button
                              onClick={() => {
                                setSelectedBrand(null);
                                setSelectedSubcategory(null);
                                setSelectedModel(null);
                                setSelectorStep(1);
                              }}
                              className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                              {locale === 'nl' ? 'Reset' : 'Reset'}
                            </button>
                            <button
                              onClick={() => {
                                if (selectedBrand) {
                                  let url = '/products';
                                  if (selectedBrand.startsWith('pc-parts-')) {
                                    const catSlug = selectedBrand.replace('pc-parts-', '');
                                    url += `?pcpart=${catSlug}`;
                                    if (selectedSubcategory) url += `&sub=${selectedSubcategory}`;
                                  } else if (selectedBrand.startsWith('pc-acc-')) {
                                    const catSlug = selectedBrand.replace('pc-acc-', '');
                                    url += `?pcacc=${catSlug}`;
                                    if (selectedSubcategory) url += `&sub=${selectedSubcategory}`;
                                  } else {
                                    url += `?brand=${selectedBrand}`;
                                    if (selectedSubcategory) url += `&sub=${selectedSubcategory}`;
                                    if (selectedModel) url += `&model=${selectedModel}`;
                                  }
                                  window.location.href = url;
                                  setOpenDropdown(null);
                                }
                              }}
                              disabled={!selectedBrand}
                              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                selectedBrand 
                                  ? 'bg-primary-600 text-white hover:bg-primary-700' 
                                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              {locale === 'nl' ? 'Zoeken' : 'Search'}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* TAB 2: All Brands Mega Menu */}
                      {megaTab === 'brands' && (
                        <div className="flex h-full animate-fade-in">
                          {/* Column 1: Brands */}
                          <div className="w-[200px] border-r border-gray-100 overflow-y-auto">
                            <div className="p-3 bg-gray-50 border-b text-xs font-bold text-gray-500 uppercase">
                              {locale === 'nl' ? 'Merken' : 'Brands'}
                            </div>
                            <div className="p-2 border-b border-gray-100">
                              <div className="relative">
                                <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                  type="text"
                                  placeholder={locale === 'nl' ? 'Zoek merk...' : 'Search brand...'}
                                  value={megaSearch}
                                  onChange={(e) => setMegaSearch(e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                              </div>
                            </div>
                            {(() => {
                              const searchTerm = megaSearch.toLowerCase();
                              const popularSlugs = ['apple', 'samsung', 'google', 'huawei', 'xiaomi', 'oneplus'];
                              const filtered = categories.filter(brand => {
                                if (!searchTerm) return true;
                                return brand.name.toLowerCase().includes(searchTerm) || 
                                       brand.nameEn.toLowerCase().includes(searchTerm) ||
                                       brand.subcategories?.some(sub => 
                                         sub.name.toLowerCase().includes(searchTerm) ||
                                         sub.models.some(m => m.name.toLowerCase().includes(searchTerm))
                                       );
                              });
                              const popular = popularSlugs.map(s => filtered.find(b => b.slug === s)).filter(Boolean) as typeof filtered;
                              const rest = filtered.filter(b => !popularSlugs.includes(b.slug)).sort((a, b) => a.name.localeCompare(b.name));
                              const sorted = [...popular, ...rest];
                              
                              const pcFiltered = [...pcPartsCategories, ...pcAccessoryCategories].filter(cat => {
                                if (!searchTerm) return true;
                                return cat.name.toLowerCase().includes(searchTerm) || cat.nameEn.toLowerCase().includes(searchTerm) ||
                                  cat.subcategories?.some(sub => sub.name.toLowerCase().includes(searchTerm));
                              });

                              return (
                                <>
                                  {sorted.map((brand) => (
                                    <div
                                      key={brand.slug}
                                      onMouseEnter={() => { setHoveredMegaBrand(brand.slug); setHoveredMegaSub(null); }}
                                      className="relative"
                                    >
                                      <Link
                                        href={`/products?brand=${brand.slug}`}
                                        className={`flex items-center justify-between px-3 py-2 text-sm transition-colors text-gray-900 ${hoveredMegaBrand === brand.slug ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'}`}
                                        onClick={() => setOpenDropdown(null)}
                                      >
                                        {locale === 'en' ? brand.nameEn : brand.name}
                                        <ChevronRight size={14} className="text-gray-400" />
                                      </Link>
                                    </div>
                                  ))}
                                  {pcFiltered.length > 0 && (
                                    <>
                                      <div className="px-3 py-2 bg-gray-100 text-xs font-bold text-gray-500 uppercase border-t border-b border-gray-200">
                                        {locale === 'nl' ? 'PC & Overig' : 'PC & Other'}
                                      </div>
                                      {pcFiltered.map((cat) => (
                                        <div
                                          key={`pc-${cat.slug}`}
                                          onMouseEnter={() => { setHoveredMegaBrand(`pc-${cat.slug}`); setHoveredMegaSub(null); }}
                                          className="relative"
                                        >
                                          <div
                                            className={`flex items-center justify-between px-3 py-2 text-sm transition-colors text-gray-900 cursor-pointer ${hoveredMegaBrand === `pc-${cat.slug}` ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'}`}
                                          >
                                            {locale === 'en' ? cat.nameEn : cat.name}
                                            <ChevronRight size={14} className="text-gray-400" />
                                          </div>
                                        </div>
                                      ))}
                                    </>
                                  )}
                                </>
                              );
                            })()}
                          </div>

                          {/* Column 2: Subcategories */}
                          <div className="w-[240px] border-r border-gray-100 overflow-y-auto">
                            {hoveredMegaBrand && (() => {
                              // Handle PC categories
                              if (hoveredMegaBrand.startsWith('pc-')) {
                                const catSlug = hoveredMegaBrand.replace('pc-', '');
                                const pcCat = [...pcPartsCategories, ...pcAccessoryCategories].find(c => c.slug === catSlug);
                                if (!pcCat) return null;
                                return (
                                  <>
                                    <div className="p-3 bg-gray-50 border-b">
                                      <span className="text-sm font-bold text-primary-600">
                                        {locale === 'en' ? pcCat.nameEn : pcCat.name}
                                      </span>
                                    </div>
                                    {pcCat.subcategories?.map((sub) => (
                                      <div
                                        key={sub.slug}
                                        onMouseEnter={() => setHoveredMegaSub(sub.slug)}
                                        className={`px-3 py-2 text-sm cursor-pointer transition-colors ${hoveredMegaSub === sub.slug ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'}`}
                                      >
                                        {locale === 'en' ? sub.nameEn : sub.name}
                                        {sub.description && <p className="text-xs text-gray-400">{sub.description}</p>}
                                      </div>
                                    ))}
                                  </>
                                );
                              }
                              const activeBrand = categories.find(b => b.slug === hoveredMegaBrand);
                              if (!activeBrand) return null;
                              const searchTerm = megaSearch.toLowerCase();
                              const filteredSubs = searchTerm
                                ? activeBrand.subcategories?.filter(sub =>
                                    sub.name.toLowerCase().includes(searchTerm) ||
                                    sub.models.some(m => m.name.toLowerCase().includes(searchTerm))
                                  )
                                : activeBrand.subcategories;
                              return (
                                <>
                                  <div className="p-3 bg-gray-50 border-b">
                                    <Link
                                      href={`/products?brand=${activeBrand.slug}`}
                                      className="text-sm font-bold text-primary-600 hover:underline"
                                      onClick={() => setOpenDropdown(null)}
                                    >
                                      {locale === 'nl' ? `Alle ${activeBrand.name}` : `All ${activeBrand.nameEn}`} →
                                    </Link>
                                  </div>
                                  {filteredSubs?.map((sub) => (
                                    <div
                                      key={sub.slug}
                                      onMouseEnter={() => setHoveredMegaSub(sub.slug)}
                                      className="relative"
                                    >
                                      <Link
                                        href={`/products?brand=${activeBrand.slug}&sub=${sub.slug}`}
                                        className={`flex items-center justify-between px-3 py-2 text-sm transition-colors text-gray-900 ${hoveredMegaSub === sub.slug ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'}`}
                                        onClick={() => setOpenDropdown(null)}
                                      >
                                        {locale === 'en' ? sub.nameEn : sub.name}
                                        {sub.models.length > 0 && <ChevronRight size={14} className="text-gray-400" />}
                                      </Link>
                                    </div>
                                  ))}
                                </>
                              );
                            })()}
                            {!hoveredMegaBrand && (
                              <div className="flex items-center justify-center h-full text-gray-400 text-sm p-4 text-center">
                                {locale === 'nl' ? 'Hover over een merk' : 'Hover over a brand'}
                              </div>
                            )}
                          </div>

                          {/* Column 3: Models */}
                          <div className="w-[340px] overflow-y-auto">
                            {hoveredMegaBrand && hoveredMegaSub && (() => {
                              const activeBrand = categories.find(b => b.slug === hoveredMegaBrand);
                              const activeSub = activeBrand?.subcategories.find(s => s.slug === hoveredMegaSub);
                              if (!activeSub || activeSub.models.length === 0) return null;
                              return (
                                <>
                                  <div className="p-3 bg-gray-50 border-b">
                                    <div className="text-xs font-bold text-gray-500 uppercase mb-1">
                                      {locale === 'en' ? activeSub.nameEn : activeSub.name}
                                    </div>
                                    <Link
                                      href={`/products?brand=${activeBrand?.slug}&sub=${activeSub.slug}`}
                                      className="text-sm font-semibold text-primary-600 hover:underline"
                                      onClick={() => setOpenDropdown(null)}
                                    >
                                      {locale === 'nl' ? `Alle ${activeSub.name}` : `All ${activeSub.nameEn}`} →
                                    </Link>
                                  </div>
                                  <div className="p-2">
                                    <div className="grid grid-cols-2 gap-1">
                                      {activeSub.models.map((model) => (
                                        <Link
                                          key={model.slug}
                                          href={`/products?brand=${activeBrand?.slug}&sub=${activeSub.slug}&model=${model.slug}`}
                                          className="block px-3 py-2 text-sm hover:bg-gray-50 hover:text-primary-600 transition-colors rounded-md"
                                          onClick={() => setOpenDropdown(null)}
                                        >
                                          {model.name}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                </>
                              );
                            })()}
                            {(!hoveredMegaBrand || !hoveredMegaSub) && (
                              <div className="flex items-center justify-center h-full text-gray-400 text-sm p-4 text-center">
                                {locale === 'nl' ? 'Hover over een categorie' : 'Hover over a category'}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* TAB 3: Accessories */}
                      {megaTab === 'accessories' && (
                        <div className="flex h-full animate-fade-in">
                          {/* Column 1: Categories */}
                          <div className="w-[240px] border-r border-gray-100 overflow-y-auto">
                            <div className="p-3 bg-gray-50 border-b text-xs font-bold text-gray-500 uppercase">
                              {locale === 'nl' ? 'Categorieën' : 'Categories'}
                            </div>
                            <div className="p-2 border-b border-gray-100">
                              <div className="relative">
                                <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                  type="text"
                                  placeholder={locale === 'nl' ? 'Zoek...' : 'Search...'}
                                  value={accessorySearch}
                                  onChange={(e) => setAccessorySearch(e.target.value)}
                                  className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                              </div>
                            </div>
                            {accessoryCategories.filter(cat => {
                              const searchTerm = accessorySearch.toLowerCase();
                              return cat.name.toLowerCase().includes(searchTerm) || 
                                     cat.nameEn.toLowerCase().includes(searchTerm) ||
                                     cat.subcategories?.some(sub => 
                                       sub.name.toLowerCase().includes(searchTerm)
                                     );
                            }).map((cat) => (
                              <div
                                key={cat.slug}
                                onMouseEnter={() => {
                                  setHoveredAccessoryCat(cat.slug);
                                  setHoveredAccessorySub(null);
                                }}
                                className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between text-gray-900 ${hoveredAccessoryCat === cat.slug ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'}`}
                              >
                                <span>{locale === 'nl' ? cat.name : cat.nameEn}</span>
                                <ChevronRight size={14} className="text-gray-400" />
                              </div>
                            ))}
                          </div>

                          {/* Column 2: Subcategories */}
                          <div className="w-[260px] border-r border-gray-100 bg-gray-50/50 overflow-y-auto">
                            {hoveredAccessoryCat && (() => {
                              const cat = accessoryCategories.find(c => c.slug === hoveredAccessoryCat);
                              if (!cat) return null;
                              return (
                                <>
                                  <div className="p-3 bg-white border-b text-xs font-bold text-gray-500 uppercase sticky top-0">
                                    {locale === 'nl' ? cat.name : cat.nameEn}
                                  </div>
                                  {cat.subcategories?.map((sub) => (
                                    <div
                                      key={sub.slug}
                                      className={`px-3 py-2 text-sm cursor-pointer ${hoveredAccessorySub === sub.slug ? 'bg-white text-primary-700 shadow-sm' : 'hover:bg-white'}`}
                                      onMouseEnter={() => setHoveredAccessorySub(sub.slug)}
                                    >
                                      <Link
                                        href={`/products?accessory=${hoveredAccessoryCat}&sub=${sub.slug}`}
                                        className="block"
                                        onClick={() => setOpenDropdown(null)}
                                      >
                                        <div className="font-medium">{locale === 'nl' ? sub.name : sub.nameEn}</div>
                                        <div className="text-xs text-gray-500 truncate">{sub.description}</div>
                                      </Link>
                                    </div>
                                  ))}
                                  <Link
                                    href={`/products?accessory=${hoveredAccessoryCat}`}
                                    className="block mt-3 text-sm text-primary-600 font-semibold hover:underline px-3"
                                    onClick={() => setOpenDropdown(null)}
                                  >
                                    {locale === 'nl' ? 'Alle items →' : 'All items →'}
                                  </Link>
                                </>
                              );
                            })()}
                          </div>

                          {/* Column 3: Featured/Popular */}
                          <div className="flex-1 p-4 bg-gray-50/30 overflow-y-auto">
                            <div className="text-xs font-bold text-gray-500 uppercase mb-3">
                              {locale === 'nl' ? 'Populair' : 'Popular'}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {accessoryCategories.slice(0, 6).map((cat) => (
                                <Link
                                  key={cat.slug}
                                  href={`/products?accessory=${cat.slug}`}
                                  className="flex items-center gap-2 p-2 bg-white rounded-lg hover:bg-primary-50 transition-colors text-sm"
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  <span>{locale === 'nl' ? cat.name : cat.nameEn}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick Links Footer */}
                    <div className="border-t grid grid-cols-3 gap-4 p-4 bg-gray-50">
                      <Link
                        href="/products?filter=featured"
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-600 bg-white p-3 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <span className="text-yellow-500">★</span>
                        {locale === 'nl' ? 'Uitgelichte Producten' : 'Featured Products'}
                      </Link>
                      <Link
                        href="/products?filter=new"
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-600 bg-white p-3 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <span className="text-red-500">●</span>
                        {locale === 'nl' ? 'Nieuw Binnen' : 'New Arrivals'}
                      </Link>
                      <Link
                        href="/repair"
                        className="flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-primary-500 to-primary-600 p-3 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-md"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <Wrench size={16} />
                        {locale === 'nl' ? 'Reparatie Aanvragen' : 'Repair Request'}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              {navBrands.map((navBrand) => {
                // Find full brand data from hardcoded categories (has all subcategories and models)
                const fullBrand = brandCategories.find(b => b.slug === navBrand.slug) || navBrand;
                return (
                <div
                  key={navBrand.slug}
                  className="relative"
                  onMouseEnter={() => { handleDropdownEnter(navBrand.slug); setHoveredSub(null); }}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    href={`/products?brand=${navBrand.slug}`}
                    className={`px-3 py-2 hover:bg-primary-600 transition-colors text-sm font-medium whitespace-nowrap flex items-center gap-1 ${pathname.includes(navBrand.slug) ? 'bg-primary-600' : ''}`}
                  >
                    {locale === 'en' ? navBrand.nameEn : navBrand.name}
                    <ChevronDown size={12} />
                  </Link>
                  {openDropdown === navBrand.slug && (
                    <div className="absolute top-full left-0 bg-white text-gray-800 rounded-b-lg shadow-xl min-w-[240px] z-50 border-t-2 border-accent-500 flex">
                      {/* Subcategories column */}
                      <div className="py-2 min-w-[240px] border-r border-gray-100">
                        <Link
                          href={`/products?brand=${navBrand.slug}`}
                          className="block px-4 py-2 text-sm font-semibold text-primary-600 hover:bg-gray-50 border-b"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {locale === 'nl' ? `Alle ${navBrand.name}` : `All ${navBrand.nameEn}`}
                        </Link>
                        {fullBrand.subcategories?.map((sub) => (
                          <div
                            key={sub.slug}
                            onMouseEnter={() => setHoveredSub(sub.slug)}
                            className="relative"
                          >
                            <Link
                              href={`/products?brand=${navBrand.slug}&sub=${sub.slug}`}
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
                        const activeSub = fullBrand.subcategories?.find(s => s.slug === hoveredSub);
                        if (!activeSub || activeSub.models.length === 0) return null;
                        return (
                          <div className="py-2 min-w-[240px] max-h-[400px] overflow-y-auto">
                            <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider border-b">
                              {locale === 'en' ? activeSub.nameEn : activeSub.name}
                            </div>
                            {activeSub.models.map((model) => (
                              <Link
                                key={model.slug}
                                href={`/products?brand=${navBrand.slug}&sub=${activeSub.slug}&model=${model.slug}`}
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
                );
              })}
              {moreBrands.length > 0 && (
                <div
                  className="relative"
                  onMouseEnter={() => { handleDropdownEnter('more'); setHoveredMoreBrand(null); setHoveredMoreSub(null); }}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button className="px-3 py-2 hover:bg-primary-600 transition-colors text-sm font-medium whitespace-nowrap flex items-center gap-1">
                    {locale === 'nl' ? 'Meer' : 'More'}
                    <ChevronDown size={12} />
                  </button>
                  {openDropdown === 'more' && (
                    <div className="absolute top-full left-0 bg-white text-gray-800 rounded-b-lg shadow-xl min-w-[720px] z-50 border-t-2 border-accent-500 max-h-[80vh] overflow-hidden">
                      <div className="flex h-[500px]">
                        {/* Column 1: All More Brands */}
                        <div className="w-[200px] border-r border-gray-100 overflow-y-auto">
                          <div className="p-3 bg-gray-50 border-b text-xs font-bold text-gray-500 uppercase">
                            {locale === 'nl' ? 'Merken' : 'Brands'}
                          </div>
                          {/* Search input for brands */}
                          <div className="p-2 border-b border-gray-100">
                            <div className="relative">
                              <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input
                                type="text"
                                placeholder={locale === 'nl' ? 'Zoek merk...' : 'Search brand...'}
                                value={moreSearch}
                                onChange={(e) => setMoreSearch(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                          {(() => {
                            const searchTerm = moreSearch.toLowerCase();
                            // Filter brands based on search
                            const filteredBrands = moreBrands.filter(brand => {
                              const brandMatch = brand.name.toLowerCase().includes(searchTerm) || brand.nameEn.toLowerCase().includes(searchTerm);
                              const subcategoryMatch = brand.subcategories?.some(sub => 
                                sub.name.toLowerCase().includes(searchTerm) || 
                                sub.nameEn.toLowerCase().includes(searchTerm)
                              );
                              const modelMatch = brand.subcategories?.some(sub => 
                                sub.models.some(model => 
                                  model.name.toLowerCase().includes(searchTerm)
                                )
                              );
                              return brandMatch || subcategoryMatch || modelMatch;
                            });
                            
                            // Auto-select first brand when searching and only one result
                            if (searchTerm && filteredBrands.length > 0 && !hoveredMoreBrand) {
                              setTimeout(() => {
                                setHoveredMoreBrand(filteredBrands[0].slug);
                              }, 0);
                            }
                            
                            return filteredBrands.map((brand) => (
                              <div
                                key={brand.slug}
                                onMouseEnter={() => { setHoveredMoreBrand(brand.slug); setHoveredMoreSub(null); }}
                                className="relative"
                              >
                                <Link
                                  href={`/products?brand=${brand.slug}`}
                                  className={`flex items-center justify-between px-3 py-2 text-sm transition-colors text-gray-900 ${hoveredMoreBrand === brand.slug ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'}`}
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  <span className="text-gray-900">{locale === 'en' ? brand.nameEn : brand.name}</span>
                                  <ChevronRight size={14} className="text-gray-400" />
                                </Link>
                              </div>
                            ));
                          })()}
                        </div>

                        {/* Column 2: Subcategories of hovered brand */}
                        <div className="w-[240px] border-r border-gray-100 overflow-y-auto">
                          {hoveredMoreBrand && (() => {
                            const activeBrand = moreBrands.find(b => b.slug === hoveredMoreBrand);
                            if (!activeBrand) return null;
                            
                            // Filter subcategories based on search term
                            const searchTerm = moreSearch.toLowerCase();
                            const filteredSubs = searchTerm 
                              ? activeBrand.subcategories?.filter(sub => 
                                  sub.name.toLowerCase().includes(searchTerm) || 
                                  sub.nameEn.toLowerCase().includes(searchTerm) ||
                                  sub.models.some(model => model.name.toLowerCase().includes(searchTerm))
                                )
                              : activeBrand.subcategories;
                            
                            // Auto-select first subcategory when searching
                            if (searchTerm && filteredSubs && filteredSubs.length > 0 && !hoveredMoreSub) {
                              setTimeout(() => {
                                setHoveredMoreSub(filteredSubs[0].slug);
                              }, 0);
                            }
                            
                            return (
                              <>
                                <div className="p-3 bg-gray-50 border-b">
                                  <Link
                                    href={`/products?brand=${activeBrand.slug}`}
                                    className="text-sm font-bold text-primary-600 hover:underline"
                                    onClick={() => setOpenDropdown(null)}
                                  >
                                    {locale === 'nl' ? `Alle ${activeBrand.name}` : `All ${activeBrand.nameEn}`} →
                                  </Link>
                                </div>
                                {filteredSubs?.map((sub) => (
                                  <div
                                    key={sub.slug}
                                    onMouseEnter={() => setHoveredMoreSub(sub.slug)}
                                    className="relative"
                                  >
                                    <Link
                                      href={`/products?brand=${activeBrand.slug}&sub=${sub.slug}`}
                                      className={`flex items-center justify-between px-3 py-2 text-sm transition-colors text-gray-900 ${hoveredMoreSub === sub.slug ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'}`}
                                      onClick={() => setOpenDropdown(null)}
                                    >
                                      <span className="text-gray-900">{locale === 'en' ? sub.nameEn : sub.name}</span>
                                      {sub.models.length > 0 && <ChevronRight size={14} className="text-gray-400" />}
                                    </Link>
                                  </div>
                                ))}
                              </>
                            );
                          })()}
                          {!hoveredMoreBrand && (
                            <div className="flex items-center justify-center h-full text-gray-400 text-sm p-4 text-center">
                              {locale === 'nl' ? 'Hover over een merk' : 'Hover over a brand'}
                            </div>
                          )}
                        </div>

                        {/* Column 3: Models of hovered subcategory */}
                        <div className="w-[280px] overflow-y-auto">
                          {hoveredMoreBrand && hoveredMoreSub && (() => {
                            const activeBrand = moreBrands.find(b => b.slug === hoveredMoreBrand);
                            const activeSub = activeBrand?.subcategories.find(s => s.slug === hoveredMoreSub);
                            if (!activeSub || activeSub.models.length === 0) return null;
                            return (
                              <>
                                <div className="p-3 bg-gray-50 border-b">
                                  <div className="text-xs font-bold text-gray-500 uppercase mb-1">
                                    {locale === 'en' ? activeSub.nameEn : activeSub.name}
                                  </div>
                                  <Link
                                    href={`/products?brand=${activeBrand?.slug}&sub=${activeSub.slug}`}
                                    className="text-sm font-semibold text-primary-600 hover:underline"
                                    onClick={() => setOpenDropdown(null)}
                                  >
                                    {locale === 'nl' ? `Alle ${activeSub.name}` : `All ${activeSub.nameEn}`} →
                                  </Link>
                                </div>
                                {activeSub.models.map((model) => (
                                  <Link
                                    key={model.slug}
                                    href={`/products?brand=${activeBrand?.slug}&sub=${activeSub.slug}&model=${model.slug}`}
                                    className="block px-3 py-1.5 text-sm hover:bg-gray-50 hover:text-primary-600 transition-colors"
                                    onClick={() => setOpenDropdown(null)}
                                  >
                                    {model.name}
                                  </Link>
                                ))}
                              </>
                            );
                          })()}
                          {(!hoveredMoreBrand || !hoveredMoreSub) && (
                            <div className="flex items-center justify-center h-full text-gray-400 text-sm p-4 text-center">
                              {locale === 'nl' ? 'Hover over een categorie' : 'Hover over a category'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* Accessories Mega Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => { handleDropdownEnter('accessories'); setHoveredAccessoryCat(null); setHoveredAccessorySub(null); }}
                onMouseLeave={handleDropdownLeave}
              >
                <button className={`px-3 py-2 hover:bg-primary-600 transition-colors text-sm font-medium whitespace-nowrap flex items-center gap-1 ${pathname.includes('accessories') ? 'bg-primary-600' : ''}`}>
                  {locale === 'nl' ? 'Accessoires' : 'Accessories'}
                  <ChevronDown size={12} />
                </button>
                {openDropdown === 'accessories' && (
                  <div className="absolute top-full left-0 bg-white text-gray-800 rounded-b-lg shadow-xl min-w-[720px] z-50 border-t-2 border-accent-500 max-h-[80vh] overflow-hidden">
                    <div className="flex h-[500px]">
                      {/* Column 1: Accessory Categories */}
                      <div className="w-[240px] border-r border-gray-100 overflow-y-auto">
                        <div className="p-3 bg-gray-50 border-b text-xs font-bold text-gray-500 uppercase">
                          {locale === 'nl' ? 'Categorieën' : 'Categories'}
                        </div>
                        {/* Search input for categories */}
                        <div className="p-2 border-b border-gray-100">
                          <div className="relative">
                            <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              placeholder={locale === 'nl' ? 'Zoek categorie...' : 'Search category...'}
                              value={accessorySearch}
                              onChange={(e) => setAccessorySearch(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        {accessoryCategories.filter(cat => {
                          const searchTerm = accessorySearch.toLowerCase();
                          return cat.name.toLowerCase().includes(searchTerm) || cat.nameEn.toLowerCase().includes(searchTerm);
                        }).map((cat) => (
                          <div
                            key={cat.slug}
                            onMouseEnter={() => { setHoveredAccessoryCat(cat.slug); setHoveredAccessorySub(null); }}
                            className="relative"
                          >
                            <Link
                              href={`/products?category=${cat.slug}`}
                              className={`flex items-center justify-between px-3 py-2 text-sm transition-colors ${hoveredAccessoryCat === cat.slug ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'}`}
                              onClick={() => setOpenDropdown(null)}
                            >
                              {locale === 'en' ? cat.nameEn : cat.name}
                              <ChevronRight size={14} className="text-gray-400" />
                            </Link>
                          </div>
                        ))}
                      </div>

                      {/* Column 2: Subcategories */}
                      <div className="w-[240px] border-r border-gray-100 overflow-y-auto">
                        {hoveredAccessoryCat && (() => {
                          const activeCat = accessoryCategories.find(c => c.slug === hoveredAccessoryCat);
                          if (!activeCat) return null;
                          return (
                            <>
                              <div className="p-3 bg-gray-50 border-b">
                                <Link
                                  href={`/products?category=${activeCat.slug}`}
                                  className="text-sm font-bold text-primary-600 hover:underline"
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  {locale === 'nl' ? `Alle ${activeCat.name}` : `All ${activeCat.nameEn}`} →
                                </Link>
                              </div>
                              {activeCat.subcategories?.map((sub) => (
                                <div
                                  key={sub.slug}
                                  onMouseEnter={() => setHoveredAccessorySub(sub.slug)}
                                  className="relative"
                                >
                                  <Link
                                    href={`/products?category=${activeCat.slug}&sub=${sub.slug}`}
                                    className={`block px-3 py-2 text-sm transition-colors ${hoveredAccessorySub === sub.slug ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'}`}
                                    onClick={() => setOpenDropdown(null)}
                                  >
                                    {locale === 'en' ? sub.nameEn : sub.name}
                                  </Link>
                                </div>
                              ))}
                            </>
                          );
                        })()}
                        {!hoveredAccessoryCat && (
                          <div className="flex items-center justify-center h-full text-gray-400 text-sm p-4 text-center">
                            {locale === 'nl' ? 'Hover over een categorie' : 'Hover over a category'}
                          </div>
                        )}
                      </div>

                      {/* Column 3: Compatible Brands/Models */}
                      <div className="w-[240px] overflow-y-auto bg-gray-50">
                        {hoveredAccessoryCat && (() => {
                          const activeCat = accessoryCategories.find(c => c.slug === hoveredAccessoryCat);
                          const activeSub = hoveredAccessorySub ? activeCat?.subcategories.find(s => s.slug === hoveredAccessorySub) : null;
                          return (
                            <>
                              <div className="p-3 bg-gray-100 border-b">
                                <div className="text-xs font-bold text-gray-500 uppercase">
                                  {locale === 'nl' ? 'Geschikt voor' : 'Compatible with'}
                                </div>
                              </div>
                              <div className="p-3">
                                <div className="text-xs font-semibold text-gray-400 mb-2">
                                  {locale === 'nl' ? 'Kies je merk' : 'Select your brand'}
                                </div>
                                {brandCategories.slice(0, 6).map((brand) => (
                                  <Link
                                    key={brand.slug}
                                    href={`/products?category=${hoveredAccessoryCat}${activeSub ? `&sub=${activeSub.slug}` : ''}&brand=${brand.slug}`}
                                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white hover:shadow-sm rounded-lg transition-all mb-1"
                                    onClick={() => setOpenDropdown(null)}
                                  >
                                    <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold">
                                      {brand.name.charAt(0)}
                                    </span>
                                    {brand.name}
                                  </Link>
                                ))}
                                <Link
                                  href={`/products?category=${hoveredAccessoryCat}${activeSub ? `&sub=${activeSub.slug}` : ''}`}
                                  className="block mt-3 text-sm text-primary-600 font-semibold hover:underline"
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  {locale === 'nl' ? 'Alle merken →' : 'All brands →'}
                                </Link>
                              </div>
                            </>
                          );
                        })()}
                        {!hoveredAccessoryCat && (
                          <div className="flex items-center justify-center h-full text-gray-400 text-sm p-4 text-center">
                            {locale === 'nl' ? 'Selecteer een categorie om compatibele merken te zien' : 'Select a category to see compatible brands'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* PC Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleDropdownEnter('pc')}
                onMouseLeave={handleDropdownLeave}
              >
                <button className={`px-3 py-2 hover:bg-primary-600 transition-colors text-sm font-medium whitespace-nowrap flex items-center gap-1 ${pathname.includes('pc-parts') || pathname.includes('pc-accessories') ? 'bg-primary-600' : ''}`}>
                  PC
                  <ChevronDown size={12} />
                </button>
                {openDropdown === 'pc' && (
                  <div className="absolute top-full left-0 bg-white shadow-xl rounded-b-lg border border-gray-200 py-2 min-w-[700px] z-50">
                    <div className="flex flex-col h-[400px]">
                      {/* Tabs */}
                      <div className="flex border-b border-gray-200">
                        <button
                          onClick={(e) => { e.stopPropagation(); setPcDropdownTab('parts'); }}
                          className={`flex-1 px-4 py-2 text-sm font-semibold ${pcDropdownTab === 'parts' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                          {locale === 'nl' ? 'Onderdelen' : 'Parts'}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setPcDropdownTab('accessories'); }}
                          className={`flex-1 px-4 py-2 text-sm font-semibold ${pcDropdownTab === 'accessories' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                          {locale === 'nl' ? 'Accessoires' : 'Accessories'}
                        </button>
                      </div>
                      {pcDropdownTab === 'parts' && (
                      <div className="flex flex-1">
                        {/* Column 1: PC Parts Categories */}
                      <div className="w-[240px] border-r border-gray-100 overflow-y-auto">
                        <div className="p-3 bg-gray-50 border-b text-xs font-bold text-gray-500 uppercase">
                          {locale === 'nl' ? 'Categorieën' : 'Categories'}
                        </div>
                        {/* Search input */}
                        <div className="p-2 border-b border-gray-100">
                          <div className="relative">
                            <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              placeholder={locale === 'nl' ? 'Zoek categorie...' : 'Search category...'}
                              value={pcPartsSearch}
                              onChange={(e) => setPcPartsSearch(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        {(() => {
                          const searchTerm = pcPartsSearch.toLowerCase();
                          const filteredCats = pcPartsCategories.filter(cat => 
                            cat.name.toLowerCase().includes(searchTerm) || 
                            cat.nameEn.toLowerCase().includes(searchTerm) ||
                            cat.subcategories?.some(sub => 
                              sub.name.toLowerCase().includes(searchTerm) || 
                              sub.nameEn.toLowerCase().includes(searchTerm)
                            )
                          );
                          
                          // Auto-select first category when searching
                          if (searchTerm && filteredCats.length > 0 && !hoveredPcPartsCat) {
                            setTimeout(() => {
                              setHoveredPcPartsCat(filteredCats[0].slug);
                            }, 0);
                          }
                          
                          return filteredCats.map((cat) => (
                            <div
                              key={cat.slug}
                              className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between text-gray-900 ${hoveredPcPartsCat === cat.slug ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'}`}
                              onMouseEnter={() => {
                                setHoveredPcPartsCat(cat.slug);
                                setHoveredPcPartsSub(null);
                              }}
                            >
                              <span className="text-gray-900">{locale === 'nl' ? cat.name : cat.nameEn}</span>
                              <ChevronRight size={14} className="text-gray-400" />
                            </div>
                          ));
                        })()}
                      </div>
                      {/* Column 2: Subcategories */}
                      <div className="w-[220px] border-r border-gray-100 bg-gray-50/50 overflow-y-auto">
                        {hoveredPcPartsCat && (() => {
                          const cat = pcPartsCategories.find(c => c.slug === hoveredPcPartsCat);
                          if (!cat) return null;
                          
                          // Filter subcategories based on search
                          const searchTerm = pcPartsSearch.toLowerCase();
                          const filteredSubs = searchTerm
                            ? cat.subcategories?.filter(sub =>
                                sub.name.toLowerCase().includes(searchTerm) ||
                                sub.nameEn.toLowerCase().includes(searchTerm) ||
                                (sub.description && sub.description.toLowerCase().includes(searchTerm))
                              )
                            : cat.subcategories;
                          
                          return (
                            <>
                              <div className="p-3 bg-white border-b text-xs font-bold text-gray-500 uppercase sticky top-0">
                                {locale === 'nl' ? cat.name : cat.nameEn}
                              </div>
                              {filteredSubs?.map((sub) => (
                                <div
                                  key={sub.slug}
                                  className={`px-3 py-2 text-sm cursor-pointer ${hoveredPcPartsSub === sub.slug ? 'bg-white text-primary-700 shadow-sm' : 'hover:bg-white'}`}
                                  onMouseEnter={() => setHoveredPcPartsSub(sub.slug)}
                                >
                                  <Link
                                    href={`/products?pcpart=${hoveredPcPartsCat}&sub=${sub.slug}`}
                                    className="block"
                                    onClick={() => setOpenDropdown(null)}
                                  >
                                    <div className="font-medium text-gray-900">{locale === 'nl' ? sub.name : sub.nameEn}</div>
                                    <div className="text-xs text-gray-500 truncate">{sub.description}</div>
                                  </Link>
                                </div>
                              ))}
                              <Link
                                href={`/products?pcpart=${hoveredPcPartsCat}`}
                                className="block mt-3 text-sm text-primary-600 font-semibold hover:underline px-3"
                                onClick={() => setOpenDropdown(null)}
                              >
                                {locale === 'nl' ? 'Alle items →' : 'All items →'}
                              </Link>
                            </>
                          );
                        })()}
                        {!hoveredPcPartsCat && (
                          <div className="flex items-center justify-center h-full text-gray-400 text-sm p-4 text-center">
                            {locale === 'nl' ? 'Selecteer een categorie' : 'Select a category'}
                          </div>
                        )}
                      </div>
                      {/* Column 3: Featured/Info */}
                      <div className="flex-1 p-4 bg-gradient-to-br from-gray-50 to-white overflow-y-auto">
                        {hoveredPcPartsSub && (() => {
                          const cat = pcPartsCategories.find(c => c.slug === hoveredPcPartsCat);
                          const sub = cat?.subcategories.find(s => s.slug === hoveredPcPartsSub);
                          if (!sub) return null;
                          return (
                            <div className="h-full flex flex-col">
                              <div className="mb-4">
                                <h4 className="font-bold text-gray-900 mb-1">{locale === 'nl' ? sub.name : sub.nameEn}</h4>
                                <p className="text-sm text-gray-600">{sub.description}</p>
                              </div>
                              <Link
                                href={`/products?pcpart=${hoveredPcPartsCat}&sub=${sub.slug}`}
                                className="mt-auto block w-full py-2 bg-primary-600 text-white text-center rounded-lg font-medium hover:bg-primary-700 transition-colors"
                                onClick={() => setOpenDropdown(null)}
                              >
                                {locale === 'nl' ? 'Bekijk alle items' : 'View all items'}
                              </Link>
                            </div>
                          );
                        })()}
                        {!hoveredPcPartsSub && hoveredPcPartsCat && (
                          <div className="flex items-center justify-center h-full text-gray-400 text-sm text-center">
                            {locale === 'nl' ? 'Selecteer een subcategorie' : 'Select a subcategory'}
                          </div>
                        )}
                        {!hoveredPcPartsCat && (
                          <div className="flex items-center justify-center h-full text-gray-400 text-sm text-center">
                            {locale === 'nl' ? 'Selecteer een categorie om items te zien' : 'Select a category to see items'}
                          </div>
                        )}
                      </div>
                    </div>
                    )}
                    {pcDropdownTab === 'accessories' && (
                    <div className="flex flex-1">
                      {/* Column 1: PC Accessories Categories */}
                      <div className="w-[240px] border-r border-gray-100 overflow-y-auto">
                        <div className="p-3 bg-gray-50 border-b text-xs font-bold text-gray-500 uppercase">
                          {locale === 'nl' ? 'Categorieën' : 'Categories'}
                        </div>
                        <div className="p-2 border-b border-gray-100">
                          <div className="relative">
                            <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              placeholder={locale === 'nl' ? 'Zoek categorie...' : 'Search category...'}
                              value={pcAccessorySearch}
                              onChange={(e) => setPcAccessorySearch(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        {(() => {
                          const searchTerm = pcAccessorySearch.toLowerCase();
                          const filteredCats = pcAccessoryCategories.filter(cat => 
                            cat.name.toLowerCase().includes(searchTerm) || 
                            cat.nameEn.toLowerCase().includes(searchTerm) ||
                            cat.subcategories?.some(sub => 
                              sub.name.toLowerCase().includes(searchTerm) || 
                              sub.nameEn.toLowerCase().includes(searchTerm)
                            )
                          );
                          if (searchTerm && filteredCats.length > 0 && !hoveredPcAccessoryCat) {
                            setTimeout(() => {
                              setHoveredPcAccessoryCat(filteredCats[0].slug);
                            }, 0);
                          }
                          return filteredCats.map((cat) => (
                            <div
                              key={cat.slug}
                              className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between text-gray-900 ${hoveredPcAccessoryCat === cat.slug ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'}`}
                              onMouseEnter={() => {
                                setHoveredPcAccessoryCat(cat.slug);
                                setHoveredPcAccessorySub(null);
                              }}
                            >
                              <span className="text-gray-900">{locale === 'nl' ? cat.name : cat.nameEn}</span>
                              <ChevronRight size={14} className="text-gray-400" />
                            </div>
                          ));
                        })()}
                      </div>
                      {/* Column 2: Subcategories */}
                      <div className="w-[220px] border-r border-gray-100 bg-gray-50/50 overflow-y-auto">
                        {hoveredPcAccessoryCat && (() => {
                          const cat = pcAccessoryCategories.find(c => c.slug === hoveredPcAccessoryCat);
                          if (!cat) return null;
                          const searchTerm = pcAccessorySearch.toLowerCase();
                          const filteredSubs = searchTerm
                            ? cat.subcategories?.filter(sub =>
                                sub.name.toLowerCase().includes(searchTerm) ||
                                sub.nameEn.toLowerCase().includes(searchTerm) ||
                                (sub.description && sub.description.toLowerCase().includes(searchTerm))
                              )
                            : cat.subcategories;
                          return (
                            <>
                              <div className="p-3 bg-white border-b text-xs font-bold text-gray-500 uppercase sticky top-0">
                                {locale === 'nl' ? cat.name : cat.nameEn}
                              </div>
                              {filteredSubs?.map((sub) => (
                                <div
                                  key={sub.slug}
                                  className={`px-3 py-2 text-sm cursor-pointer ${hoveredPcAccessorySub === sub.slug ? 'bg-white text-primary-700 shadow-sm' : 'hover:bg-white'}`}
                                  onMouseEnter={() => setHoveredPcAccessorySub(sub.slug)}
                                >
                                  <Link
                                    href={`/products?pcacc=${hoveredPcAccessoryCat}&sub=${sub.slug}`}
                                    className="block"
                                    onClick={() => setOpenDropdown(null)}
                                  >
                                    <div className="font-medium text-gray-900">{locale === 'nl' ? sub.name : sub.nameEn}</div>
                                    <div className="text-xs text-gray-500 truncate">{sub.description}</div>
                                  </Link>
                                </div>
                              ))}
                              <Link
                                href={`/products?pcacc=${hoveredPcAccessoryCat}`}
                                className="block mt-3 text-sm text-primary-600 font-semibold hover:underline px-3"
                                onClick={() => setOpenDropdown(null)}
                              >
                                {locale === 'nl' ? 'Alle items →' : 'All items →'}
                              </Link>
                            </>
                          );
                        })()}
                        {!hoveredPcAccessoryCat && (
                          <div className="flex items-center justify-center h-full text-gray-400 text-sm p-4 text-center">
                            {locale === 'nl' ? 'Selecteer een categorie' : 'Select a category'}
                          </div>
                        )}
                      </div>
                      {/* Column 3: Featured/Info */}
                      <div className="flex-1 p-4 bg-gradient-to-br from-gray-50 to-white overflow-y-auto">
                        {hoveredPcAccessorySub && (() => {
                          const cat = pcAccessoryCategories.find(c => c.slug === hoveredPcAccessoryCat);
                          const sub = cat?.subcategories.find(s => s.slug === hoveredPcAccessorySub);
                          if (!sub) return null;
                          return (
                            <div className="h-full flex flex-col">
                              <div className="mb-4">
                                <h4 className="font-bold text-gray-900 mb-1">{locale === 'nl' ? sub.name : sub.nameEn}</h4>
                                <p className="text-sm text-gray-600">{sub.description}</p>
                              </div>
                              <Link
                                href={`/products?pcacc=${hoveredPcAccessoryCat}&sub=${sub.slug}`}
                                className="mt-auto block w-full py-2 bg-primary-600 text-white text-center rounded-lg font-medium hover:bg-primary-700 transition-colors"
                                onClick={() => setOpenDropdown(null)}
                              >
                                {locale === 'nl' ? 'Bekijk alle items' : 'View all items'}
                              </Link>
                            </div>
                          );
                        })()}
                        {!hoveredPcAccessorySub && hoveredPcAccessoryCat && (
                          <div className="flex items-center justify-center h-full text-gray-400 text-sm text-center">
                            {locale === 'nl' ? 'Selecteer een subcategorie' : 'Select a subcategory'}
                          </div>
                        )}
                        {!hoveredPcAccessoryCat && (
                          <div className="flex items-center justify-center h-full text-gray-400 text-sm text-center">
                            {locale === 'nl' ? 'Selecteer een categorie om items te zien' : 'Select a category to see items'}
                          </div>
                        )}
                      </div>
                    </div>
                    )}
                  </div>
                  </div>
                )}
              </div>

              {/* Laptop Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleDropdownEnter('laptop')}
                onMouseLeave={handleDropdownLeave}
              >
                <button className={`px-3 py-2 hover:bg-primary-600 transition-colors text-sm font-medium whitespace-nowrap flex items-center gap-1 ${pathname.includes('laptop') ? 'bg-primary-600' : ''}`}>
                  {locale === 'nl' ? 'Laptop' : 'Laptop'}
                  <ChevronDown size={12} />
                </button>
                {openDropdown === 'laptop' && (
                  <div className="absolute top-full left-0 bg-white shadow-xl rounded-b-lg border border-gray-200 py-2 min-w-[700px] z-50">
                    <div className="flex flex-col h-[400px]">
                      {/* Tabs */}
                      <div className="flex border-b border-gray-200">
                        <button
                          onClick={(e) => { e.stopPropagation(); setLaptopDropdownTab('parts'); }}
                          className={`flex-1 px-4 py-2 text-sm font-semibold ${laptopDropdownTab === 'parts' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                          {locale === 'nl' ? 'Onderdelen' : 'Parts'}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setLaptopDropdownTab('refurbished'); }}
                          className={`flex-1 px-4 py-2 text-sm font-semibold ${laptopDropdownTab === 'refurbished' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                          {locale === 'nl' ? 'Refurbished Laptops' : 'Refurbished Laptops'}
                        </button>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        {laptopDropdownTab === 'parts' && (
                          <div className="h-full p-4 overflow-y-auto">
                            {laptopSelectorStep === 1 && (
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">{locale === 'nl' ? 'Kies Merk' : 'Choose Brand'}</h3>
                                <div className="grid grid-cols-2 gap-3">
                                  {laptopBrands.map((brand) => (
                                    <button
                                      key={brand.slug}
                                      onClick={() => { setLaptopSelectedBrand(brand.slug); setLaptopSelectorStep(2); }}
                                      className="p-3 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 text-left transition-colors"
                                    >
                                      <div className="font-semibold text-gray-900">{brand.name}</div>
                                      <div className="text-xs text-gray-500">{brand.subcategories.length} {locale === 'nl' ? 'series' : 'series'}</div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                            {laptopSelectorStep === 2 && laptopSelectedBrand && (
                              <div>
                                <button
                                  onClick={() => { setLaptopSelectorStep(1); setLaptopSelectedBrand(null); }}
                                  className="text-sm text-primary-600 mb-4 flex items-center gap-1 hover:underline"
                                >
                                  <ChevronLeft size={16} />
                                  {locale === 'nl' ? 'Terug naar merken' : 'Back to brands'}
                                </button>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">
                                  {laptopBrands.find(b => b.slug === laptopSelectedBrand)?.name}
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                  {laptopBrands.find(b => b.slug === laptopSelectedBrand)?.subcategories.map((sub) => (
                                    <Link
                                      key={sub.slug}
                                      href={`/products?laptopBrand=${laptopSelectedBrand}&laptopModel=${sub.slug}`}
                                      onClick={() => setOpenDropdown(null)}
                                      className="p-3 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 text-left transition-colors"
                                    >
                                      <div className="font-semibold text-gray-900">{sub.name}</div>
                                      <div className="text-xs text-gray-500">{sub.description}</div>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        {laptopDropdownTab === 'refurbished' && (
                          <div className="h-full flex flex-col items-center justify-center text-center p-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{locale === 'nl' ? 'Refurbished Laptops' : 'Refurbished Laptops'}</h3>
                            <p className="text-gray-500 text-sm mb-4 max-w-md">
                              {locale === 'nl' ? 'Bekijk ons assortiment refurbished laptops van alle grote merken.' : 'View our assortment of refurbished laptops from all major brands.'}
                            </p>
                            <Link
                              href="/products?category=laptop&refurbished=true"
                              onClick={() => setOpenDropdown(null)}
                              className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                            >
                              {locale === 'nl' ? 'Bekijk Refurbished Laptops' : 'View Refurbished Laptops'}
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

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
              {/* Main phone brands: Apple & Samsung only */}
              {brandCategories.filter(b => b.slug === 'apple' || b.slug === 'samsung').map((brand) => (
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
                      {brand.subcategories?.map((sub) => (
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
              
              {/* More dropdown for mobile */}
              <div className="border-t">
                <button
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 font-medium text-left"
                  onClick={() => { setMobileMoreOpen(!mobileMoreOpen); setMobileMoreBrand(null); setMobileMoreSub(null); }}
                >
                  {locale === 'nl' ? 'Meer' : 'More'}
                  <ChevronDown size={16} className={`transition-transform ${mobileMoreOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileMoreOpen && (
                  <div className="bg-gray-50">
                    {/* Tabs */}
                    <div className="flex overflow-x-auto border-b">
                      {[
                        { key: 'brands', label: locale === 'nl' ? 'Merken' : 'Brands' },
                        { key: 'accessories', label: locale === 'nl' ? 'Accessoires' : 'Accessories' },
                        { key: 'pc', label: 'PC' },
                        { key: 'laptop', label: locale === 'nl' ? 'Laptop' : 'Laptop' },
                      ].map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => { setMobileMoreTab(tab.key as any); setMobileMoreBrand(null); setMobileMoreSub(null); }}
                          className={`flex-shrink-0 px-3 py-2 text-xs font-medium ${mobileMoreTab === tab.key ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    
                    {/* Tab Content */}
                    <div className="p-2">
                      {/* Brands Tab - All except Apple/Samsung */}
                      {mobileMoreTab === 'brands' && (
                        <div className="space-y-1">
                          {brandCategories.filter(b => b.slug !== 'apple' && b.slug !== 'samsung').map((brand) => (
                            <div key={brand.slug}>
                              <button
                                className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-gray-100 text-left rounded"
                                onClick={() => { setMobileMoreBrand(mobileMoreBrand === brand.slug ? null : brand.slug); setMobileMoreSub(null); }}
                              >
                                {locale === 'en' ? brand.nameEn : brand.name}
                                {brand.subcategories?.length > 0 && <ChevronDown size={14} className={`transition-transform ${mobileMoreBrand === brand.slug ? 'rotate-180' : ''}`} />}
                              </button>
                              {mobileMoreBrand === brand.slug && brand.subcategories && (
                                <div className="ml-2 border-l-2 border-gray-200 pl-2 mt-1">
                                  <Link
                                    href={`/products?brand=${brand.slug}`}
                                    className="block py-1 text-xs font-semibold text-primary-600"
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {locale === 'nl' ? `Alle ${brand.name}` : `All ${brand.nameEn}`}
                                  </Link>
                                  {brand.subcategories.map((sub) => (
                                    <div key={sub.slug}>
                                      <button
                                        className="w-full flex items-center justify-between py-1 text-xs text-gray-700 text-left"
                                        onClick={() => { setMobileMoreSub(mobileMoreSub === sub.slug ? null : sub.slug); }}
                                      >
                                        {locale === 'en' ? sub.nameEn : sub.name}
                                        {sub.models.length > 0 && <ChevronDown size={12} className={`transition-transform ${mobileMoreSub === sub.slug ? 'rotate-180' : ''}`} />}
                                      </button>
                                      {mobileMoreSub === sub.slug && sub.models.length > 0 && (
                                        <div className="ml-2 border-l border-gray-200 pl-2">
                                          <Link
                                            href={`/products?brand=${brand.slug}&sub=${sub.slug}`}
                                            className="block py-1 text-[10px] font-semibold text-primary-600"
                                            onClick={() => setMobileMenuOpen(false)}
                                          >
                                            {locale === 'nl' ? `Alle ${sub.name}` : `All ${sub.nameEn}`}
                                          </Link>
                                          {sub.models.map((model) => (
                                            <Link
                                              key={model.slug}
                                              href={`/products?brand=${brand.slug}&sub=${sub.slug}&model=${model.slug}`}
                                              className="block py-1 text-[10px] text-gray-600"
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
                        </div>
                      )}
                      
                      {/* Accessories Tab */}
                      {mobileMoreTab === 'accessories' && (
                        <div className="space-y-1">
                          {accessoryCategories.map((cat) => (
                            <Link
                              key={cat.slug}
                              href={`/products?category=${cat.slug}`}
                              className="block px-2 py-2 text-sm hover:bg-gray-100 rounded"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {locale === 'en' ? cat.nameEn : cat.name}
                            </Link>
                          ))}
                        </div>
                      )}
                      
                      {/* PC Tab */}
                      {mobileMoreTab === 'pc' && (
                        <div className="space-y-1">
                          <div className="px-2 py-1 text-xs font-bold text-gray-500 uppercase">{locale === 'nl' ? 'Onderdelen' : 'Parts'}</div>
                          {pcPartsCategories.map((cat) => (
                            <Link
                              key={cat.slug}
                              href={`/products?pcpart=${cat.slug}`}
                              className="block px-2 py-2 text-sm hover:bg-gray-100 rounded"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {locale === 'en' ? cat.nameEn : cat.name}
                            </Link>
                          ))}
                          <div className="px-2 py-1 text-xs font-bold text-gray-500 uppercase border-t mt-2">{locale === 'nl' ? 'Accessoires' : 'Accessories'}</div>
                          {pcAccessoryCategories.map((cat) => (
                            <Link
                              key={cat.slug}
                              href={`/products?pcacc=${cat.slug}`}
                              className="block px-2 py-2 text-sm hover:bg-gray-100 rounded"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {locale === 'en' ? cat.nameEn : cat.name}
                            </Link>
                          ))}
                        </div>
                      )}
                      
                      {/* Laptop Tab */}
                      {mobileMoreTab === 'laptop' && (
                        <div className="space-y-1">
                          <div className="px-2 py-1 text-xs font-bold text-gray-500 uppercase">{locale === 'nl' ? 'Onderdelen' : 'Parts'}</div>
                          {laptopBrands.map((brand) => (
                            <div key={brand.slug}>
                              <button
                                className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-gray-100 text-left rounded"
                                onClick={() => setMobileMoreBrand(mobileMoreBrand === brand.slug ? null : brand.slug)}
                              >
                                {brand.name}
                                {brand.subcategories?.length > 0 && <ChevronDown size={14} className={`transition-transform ${mobileMoreBrand === brand.slug ? 'rotate-180' : ''}`} />}
                              </button>
                              {mobileMoreBrand === brand.slug && (
                                <div className="ml-2 border-l-2 border-gray-200 pl-2">
                                  {brand.subcategories.map((sub) => (
                                    <Link
                                      key={sub.slug}
                                      href={`/products?laptopBrand=${brand.slug}&laptopModel=${sub.slug}`}
                                      className="block py-1 text-xs text-gray-700 hover:text-primary-600"
                                      onClick={() => setMobileMenuOpen(false)}
                                    >
                                      {sub.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                          <div className="px-2 py-1 text-xs font-bold text-gray-500 uppercase border-t mt-2">{locale === 'nl' ? 'Refurbished Laptops' : 'Refurbished Laptops'}</div>
                          <Link
                            href="/products?category=laptop&refurbished=true"
                            className="block px-2 py-2 text-sm font-semibold text-primary-600 hover:bg-gray-100 rounded"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {locale === 'nl' ? 'Bekijk Refurbished Laptops' : 'View Refurbished Laptops'}
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <Link href="/repair" className="block mx-3 my-3 px-4 py-5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-xl flex items-center justify-center gap-3 text-xl font-bold hover:from-red-600 hover:to-red-700 transition-all transform active:scale-95 animate-attention animate-glow-red border-2 border-red-400" onClick={() => setMobileMenuOpen(false)}>
                <Wrench size={28} className="animate-pulse" />
                {locale === 'nl' ? 'Reparatie Aanvragen' : 'Repair Request'}
              </Link>
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
  } catch (error) {
    console.error('Header error:', error);
    return (
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="flex-shrink-0">
            <img src="/logo.png" alt="LabFix" className="h-28 w-auto" />
          </Link>
        </div>
      </header>
    );
  }
}

