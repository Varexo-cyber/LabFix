'use client';

import React, { Suspense, useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import ProductCard from '@/components/ProductCard';
import { fetchProducts, Product } from '@/lib/store';
import { Filter, SlidersHorizontal, ChevronDown, Search, X } from 'lucide-react';
import Link from 'next/link';
import { brandCategories, getBrandName, getSubcategoryName, getModelName, pcPartsCategories, pcAccessoryCategories, accessoryCategories, laptopBrands, laptopPartsCategories } from '@/lib/categories';

function ProductsPageContent() {
  const { t, locale } = useApp();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedSub, setSelectedSub] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 12;
  const [expandedBrands, setExpandedBrands] = useState<string[]>([]);
  const [expandedSubs, setExpandedSubs] = useState<string[]>([]);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    brands: true,
    pcParts: false,
    pcAcc: false,
    accessories: false,
    laptopBrands: false,
    laptopParts: false
  });

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  useEffect(() => {
    const brand = searchParams.get('brand');
    const sub = searchParams.get('sub');
    const model = searchParams.get('model');
    const cat = searchParams.get('category');
    const search = searchParams.get('search');
    const accessory = searchParams.get('accessory');
    const pcpart = searchParams.get('pcpart');
    const pcacc = searchParams.get('pcacc');
    const laptopBrand = searchParams.get('laptopBrand');
    const laptopModel = searchParams.get('laptopModel');
    const laptopPart = searchParams.get('laptopPart');
    if (brand) { setSelectedBrand(brand); setExpandedBrands([brand]); }
    if (sub) setSelectedSub(sub);
    if (model) setSelectedModel(model);
    if (cat) setSelectedBrand(cat);
    if (search) setSearchQuery(search);
    if (accessory) { setSelectedBrand(`acc-${accessory}`); setExpandedBrands([`acc-${accessory}`]); }
    if (pcpart) { setSelectedBrand(`pc-${pcpart}`); setExpandedBrands([`pc-${pcpart}`]); setSelectedSub(sub || ''); }
    if (pcacc) { setSelectedBrand(`pca-${pcacc}`); setExpandedBrands([`pca-${pcacc}`]); setSelectedSub(sub || ''); }
    if (laptopBrand) { setSelectedBrand(`laptop-${laptopBrand}`); setExpandedBrands([`laptop-${laptopBrand}`]); }
    if (laptopModel) setSelectedSub(laptopModel);
    if (laptopPart) { setSelectedBrand(`lp-${laptopPart}`); setExpandedBrands([`lp-${laptopPart}`]); }
  }, [searchParams]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBrand, selectedSub, selectedModel, searchQuery, sortBy]);

  const toggleBrandExpand = (slug: string) => {
    setExpandedBrands(prev => prev.includes(slug) ? prev.filter(b => b !== slug) : [...prev, slug]);
  };

  const toggleSubExpand = (key: string) => {
    setExpandedSubs(prev => prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]);
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedBrand) {
      filtered = filtered.filter((p) => p.category === selectedBrand || p.category.startsWith(selectedBrand + '/'));
    }

    if (selectedSub) {
      filtered = filtered.filter((p) => {
        const parts = p.category.split('/');
        return p.subcategory === selectedSub || parts[1] === selectedSub || p.category.includes('/' + selectedSub + '/');
      });
    }

    if (selectedModel) {
      filtered = filtered.filter((p) => {
        const parts = p.category.split('/');
        return p.model === selectedModel || parts[2] === selectedModel || p.category.endsWith('/' + selectedModel);
      });
    }

    if (searchQuery) {
      const words = searchQuery.toLowerCase().split(/\s+/).filter(w => w.length > 0);
      filtered = filtered.filter((p) => {
        const haystack = `${p.name} ${p.nameEn} ${p.description} ${p.descriptionEn} ${p.sku}`.toLowerCase();
        return words.every(word => haystack.includes(word));
      });
    }

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => (locale === 'nl' ? a.name : a.nameEn).localeCompare(locale === 'nl' ? b.name : b.nameEn));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  }, [products, selectedBrand, selectedSub, selectedModel, searchQuery, sortBy, locale]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 animate-fade-in">
        <Link href="/" className="hover:text-primary-500">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className={`${!selectedBrand ? 'text-gray-800' : 'hover:text-primary-500'}`}>{t('products.title')}</Link>
        {selectedBrand && (
          <>
            <span className="mx-2">/</span>
            <span className={`${!selectedSub ? 'text-gray-800' : 'hover:text-primary-500 cursor-pointer'}`}
              onClick={() => setSelectedSub('')}>
              {getBrandName(selectedBrand, locale)}
            </span>
          </>
        )}
        {selectedSub && (
          <>
            <span className="mx-2">/</span>
            <span className={`${!selectedModel ? 'text-gray-800' : 'hover:text-primary-500 cursor-pointer'}`}
              onClick={() => setSelectedModel('')}>
              {getSubcategoryName(selectedBrand, selectedSub, locale)}
            </span>
          </>
        )}
        {selectedModel && (
          <>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{getModelName(selectedBrand, selectedSub, selectedModel)}</span>
          </>
        )}
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-xl shadow-md p-4 animate-fade-in-left">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Filter size={18} />
              {locale === 'nl' ? 'Categorieën' : 'Categories'}
            </h3>

            {/* Compact Search */}
            <div className="relative mb-3">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                placeholder={locale === 'nl' ? 'Zoek categorie...' : 'Search category...'}
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
              />
              {sidebarSearch && (
                <button onClick={() => setSidebarSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="space-y-1">
              <button
                onClick={() => { setSelectedBrand(''); setSelectedSub(''); setSidebarSearch(''); }}
                className={`block w-full text-left px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                  !selectedBrand ? 'bg-primary-500 text-white' : 'hover:bg-gray-100'
                }`}
              >
                {t('products.all')} ({products.length})
              </button>

              {/* Section: Phone Brands */}
              <div className="mt-2">
                <button
                  onClick={() => setExpandedSections(p => ({ ...p, brands: !p.brands }))}
                  className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold text-gray-500 uppercase hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {locale === 'nl' ? '📱 Telefoon Merken' : '📱 Phone Brands'}
                  <ChevronDown size={14} className={`transition-transform ${expandedSections.brands ? 'rotate-180' : ''}`} />
                </button>
                {expandedSections.brands && (
                  <div className="max-h-[280px] overflow-y-auto space-y-0.5 mt-1">
                    {brandCategories.filter(b => !sidebarSearch || b.name.toLowerCase().includes(sidebarSearch.toLowerCase())).map((brand) => {
                      const brandCount = products.filter(p => p.category === brand.slug || p.category.startsWith(brand.slug + '/')).length;
                      const isExpanded = expandedBrands.includes(brand.slug);
                      const hasMatch = !sidebarSearch || brand.subcategories?.some(s => s.name.toLowerCase().includes(sidebarSearch.toLowerCase()));
                      return (
                        <div key={brand.slug}>
                          <div className="flex items-center">
                            <button
                              onClick={() => { setSelectedBrand(brand.slug); setSelectedSub(''); }}
                              className={`flex-1 text-left px-3 py-1.5 rounded-l transition-colors text-sm ${
                                selectedBrand === brand.slug ? 'bg-primary-100 text-primary-700 font-medium' : 'hover:bg-gray-50'
                              }`}
                            >
                              {locale === 'en' ? brand.nameEn : brand.name}
                              {brandCount > 0 && <span className="text-xs text-gray-400 ml-1">({brandCount})</span>}
                            </button>
                            <button
                              onClick={() => toggleBrandExpand(brand.slug)}
                              className="px-2 py-1.5 hover:bg-gray-100 rounded-r transition-colors"
                            >
                              <ChevronDown size={12} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          </div>
                          {isExpanded && (
                            <div className="ml-2 border-l border-gray-200 pl-2 space-y-0.5">
                              {brand.subcategories?.filter(s => !sidebarSearch || s.name.toLowerCase().includes(sidebarSearch.toLowerCase()) || s.models?.some(m => m.name.toLowerCase().includes(sidebarSearch.toLowerCase()))).map((sub) => {
                                const subKey = `${brand.slug}/${sub.slug}`;
                                const isSubExpanded = expandedSubs.includes(subKey);
                                const hasModels = sub.models && sub.models.length > 0;
                                return (
                                  <div key={sub.slug}>
                                    <div className="flex items-center">
                                      <button
                                        onClick={() => { setSelectedBrand(brand.slug); setSelectedSub(sub.slug); setSelectedModel(''); }}
                                        className={`flex-1 text-left px-2 py-1 rounded-l transition-colors text-xs ${
                                          selectedBrand === brand.slug && selectedSub === sub.slug && !selectedModel ? 'bg-primary-500 text-white' : 'hover:bg-gray-100 text-gray-600'
                                        }`}
                                      >
                                        {locale === 'en' ? sub.nameEn : sub.name}
                                      </button>
                                      {hasModels && (
                                        <button
                                          onClick={() => toggleSubExpand(subKey)}
                                          className="px-1.5 py-1 hover:bg-gray-100 rounded-r transition-colors"
                                        >
                                          <ChevronDown size={10} className={`transition-transform text-gray-400 ${isSubExpanded ? 'rotate-180' : ''}`} />
                                        </button>
                                      )}
                                    </div>
                                    {isSubExpanded && hasModels && (
                                      <div className="ml-2 border-l border-gray-100 pl-2 space-y-0.5">
                                        {sub.models.filter(m => !sidebarSearch || m.name.toLowerCase().includes(sidebarSearch.toLowerCase())).map((model) => (
                                          <button
                                            key={model.slug}
                                            onClick={() => { setSelectedBrand(brand.slug); setSelectedSub(sub.slug); setSelectedModel(model.slug); }}
                                            className={`block w-full text-left px-2 py-0.5 rounded transition-colors text-[11px] ${
                                              selectedModel === model.slug && selectedSub === sub.slug ? 'bg-primary-500 text-white' : 'hover:bg-gray-50 text-gray-500'
                                            }`}
                                          >
                                            {model.name}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Section: Accessories */}
              <div className="mt-2 border-t pt-2">
                <button
                  onClick={() => setExpandedSections(p => ({ ...p, accessories: !p.accessories }))}
                  className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold text-gray-500 uppercase hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {locale === 'nl' ? '🎧 Accessoires' : '🎧 Accessories'}
                  <ChevronDown size={14} className={`transition-transform ${expandedSections.accessories ? 'rotate-180' : ''}`} />
                </button>
                {expandedSections.accessories && (
                  <div className="space-y-0.5 mt-1">
                    {accessoryCategories.filter(c => !sidebarSearch || c.name.toLowerCase().includes(sidebarSearch.toLowerCase()) || c.subcategories?.some(s => s.name.toLowerCase().includes(sidebarSearch.toLowerCase()))).map((cat) => {
                      const catKey = `acc-${cat.slug}`;
                      const isExpanded = expandedBrands.includes(catKey);
                      return (
                        <div key={catKey}>
                          <div className="flex items-center">
                            <button
                              onClick={() => { setSelectedBrand(catKey); setSelectedSub(''); }}
                              className={`flex-1 text-left px-3 py-1.5 rounded-l transition-colors text-sm ${
                                selectedBrand === catKey ? 'bg-primary-100 text-primary-700 font-medium' : 'hover:bg-gray-50'
                              }`}
                            >
                              {locale === 'en' ? cat.nameEn : cat.name}
                            </button>
                            {cat.subcategories && cat.subcategories.length > 0 && (
                              <button
                                onClick={() => toggleBrandExpand(catKey)}
                                className="px-2 py-1.5 hover:bg-gray-100 rounded-r transition-colors"
                              >
                                <ChevronDown size={12} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                              </button>
                            )}
                          </div>
                          {isExpanded && cat.subcategories && (
                            <div className="ml-2 border-l border-gray-200 pl-2 space-y-0.5">
                              {cat.subcategories.filter(s => !sidebarSearch || s.name.toLowerCase().includes(sidebarSearch.toLowerCase())).map((sub) => (
                                <button
                                  key={sub.slug}
                                  onClick={() => { setSelectedBrand(catKey); setSelectedSub(sub.slug); }}
                                  className={`block w-full text-left px-2 py-1 rounded transition-colors text-xs ${
                                    selectedSub === sub.slug && selectedBrand === catKey ? 'bg-primary-500 text-white' : 'hover:bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  {locale === 'en' ? sub.nameEn : sub.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Section: PC Parts */}
              <div className="mt-2 border-t pt-2">
                <button
                  onClick={() => setExpandedSections(p => ({ ...p, pcParts: !p.pcParts }))}
                  className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold text-gray-500 uppercase hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {locale === 'nl' ? '� PC Onderdelen' : '� PC Parts'}
                  <ChevronDown size={14} className={`transition-transform ${expandedSections.pcParts ? 'rotate-180' : ''}`} />
                </button>
                {expandedSections.pcParts && (
                  <div className="space-y-0.5 mt-1">
                    {pcPartsCategories.filter(c => !sidebarSearch || c.name.toLowerCase().includes(sidebarSearch.toLowerCase()) || c.subcategories?.some(s => s.name.toLowerCase().includes(sidebarSearch.toLowerCase()))).map((cat) => {
                      const catKey = `pc-${cat.slug}`;
                      const isExpanded = expandedBrands.includes(catKey);
                      return (
                        <div key={catKey}>
                          <div className="flex items-center">
                            <button
                              onClick={() => { setSelectedBrand(catKey); setSelectedSub(''); }}
                              className={`flex-1 text-left px-3 py-1.5 rounded-l transition-colors text-sm ${
                                selectedBrand === catKey ? 'bg-primary-100 text-primary-700 font-medium' : 'hover:bg-gray-50'
                              }`}
                            >
                              {locale === 'en' ? cat.nameEn : cat.name}
                            </button>
                            {cat.subcategories && cat.subcategories.length > 0 && (
                              <button
                                onClick={() => toggleBrandExpand(catKey)}
                                className="px-2 py-1.5 hover:bg-gray-100 rounded-r transition-colors"
                              >
                                <ChevronDown size={12} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                              </button>
                            )}
                          </div>
                          {isExpanded && cat.subcategories && (
                            <div className="ml-2 border-l border-gray-200 pl-2 space-y-0.5">
                              {cat.subcategories.filter(s => !sidebarSearch || s.name.toLowerCase().includes(sidebarSearch.toLowerCase())).map((sub) => (
                                <button
                                  key={sub.slug}
                                  onClick={() => { setSelectedBrand(catKey); setSelectedSub(sub.slug); }}
                                  className={`block w-full text-left px-2 py-1 rounded transition-colors text-xs ${
                                    selectedSub === sub.slug && selectedBrand === catKey ? 'bg-primary-500 text-white' : 'hover:bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  {locale === 'en' ? sub.nameEn : sub.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Section: PC Accessories */}
              <div className="mt-2 border-t pt-2">
                <button
                  onClick={() => setExpandedSections(p => ({ ...p, pcAcc: !p.pcAcc }))}
                  className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold text-gray-500 uppercase hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {locale === 'nl' ? '🖱️ PC Accessoires' : '🖱️ PC Accessories'}
                  <ChevronDown size={14} className={`transition-transform ${expandedSections.pcAcc ? 'rotate-180' : ''}`} />
                </button>
                {expandedSections.pcAcc && (
                  <div className="space-y-0.5 mt-1">
                    {pcAccessoryCategories.filter(c => !sidebarSearch || c.name.toLowerCase().includes(sidebarSearch.toLowerCase()) || c.subcategories?.some(s => s.name.toLowerCase().includes(sidebarSearch.toLowerCase()))).map((cat) => {
                      const catKey = `pca-${cat.slug}`;
                      const isExpanded = expandedBrands.includes(catKey);
                      return (
                        <div key={catKey}>
                          <div className="flex items-center">
                            <button
                              onClick={() => { setSelectedBrand(catKey); setSelectedSub(''); }}
                              className={`flex-1 text-left px-3 py-1.5 rounded-l transition-colors text-sm ${
                                selectedBrand === catKey ? 'bg-primary-100 text-primary-700 font-medium' : 'hover:bg-gray-50'
                              }`}
                            >
                              {locale === 'en' ? cat.nameEn : cat.name}
                            </button>
                            {cat.subcategories && cat.subcategories.length > 0 && (
                              <button
                                onClick={() => toggleBrandExpand(catKey)}
                                className="px-2 py-1.5 hover:bg-gray-100 rounded-r transition-colors"
                              >
                                <ChevronDown size={12} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                              </button>
                            )}
                          </div>
                          {isExpanded && cat.subcategories && (
                            <div className="ml-2 border-l border-gray-200 pl-2 space-y-0.5">
                              {cat.subcategories.filter(s => !sidebarSearch || s.name.toLowerCase().includes(sidebarSearch.toLowerCase())).map((sub) => (
                                <button
                                  key={sub.slug}
                                  onClick={() => { setSelectedBrand(catKey); setSelectedSub(sub.slug); }}
                                  className={`block w-full text-left px-2 py-1 rounded transition-colors text-xs ${
                                    selectedSub === sub.slug && selectedBrand === catKey ? 'bg-primary-500 text-white' : 'hover:bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  {locale === 'en' ? sub.nameEn : sub.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Section: Laptop Brands */}
              <div className="mt-2 border-t pt-2">
                <button
                  onClick={() => setExpandedSections(p => ({ ...p, laptopBrands: !p.laptopBrands }))}
                  className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold text-gray-500 uppercase hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {locale === 'nl' ? 'Laptop Merken' : 'Laptop Brands'}
                  <ChevronDown size={14} className={`transition-transform ${expandedSections.laptopBrands ? 'rotate-180' : ''}`} />
                </button>
                {expandedSections.laptopBrands && (
                  <div className="space-y-0.5 mt-1">
                    {laptopBrands.filter(b => !sidebarSearch || b.name.toLowerCase().includes(sidebarSearch.toLowerCase()) || b.subcategories?.some(s => s.name.toLowerCase().includes(sidebarSearch.toLowerCase()))).map((brand) => {
                      const brandKey = `laptop-${brand.slug}`;
                      const isExpanded = expandedBrands.includes(brandKey);
                      return (
                        <div key={brandKey}>
                          <div className="flex items-center">
                            <button
                              onClick={() => { setSelectedBrand(brandKey); setSelectedSub(''); }}
                              className={`flex-1 text-left px-3 py-1.5 rounded-l transition-colors text-sm ${
                                selectedBrand === brandKey ? 'bg-primary-100 text-primary-700 font-medium' : 'hover:bg-gray-50'
                              }`}
                            >
                              {brand.name}
                            </button>
                            {brand.subcategories && brand.subcategories.length > 0 && (
                              <button
                                onClick={() => toggleBrandExpand(brandKey)}
                                className="px-2 py-1.5 hover:bg-gray-100 rounded-r transition-colors"
                              >
                                <ChevronDown size={12} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                              </button>
                            )}
                          </div>
                          {isExpanded && brand.subcategories && (
                            <div className="ml-2 border-l border-gray-200 pl-2 space-y-0.5">
                              {brand.subcategories.filter(s => !sidebarSearch || s.name.toLowerCase().includes(sidebarSearch.toLowerCase())).map((sub) => (
                                <button
                                  key={sub.slug}
                                  onClick={() => { setSelectedBrand(brandKey); setSelectedSub(sub.slug); }}
                                  className={`block w-full text-left px-2 py-1 rounded transition-colors text-xs ${
                                    selectedSub === sub.slug && selectedBrand === brandKey ? 'bg-primary-500 text-white' : 'hover:bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  {sub.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Section: Laptop Parts */}
              <div className="mt-2 border-t pt-2">
                <button
                  onClick={() => setExpandedSections(p => ({ ...p, laptopParts: !p.laptopParts }))}
                  className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold text-gray-500 uppercase hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {locale === 'nl' ? 'Laptop Onderdelen' : 'Laptop Parts'}
                  <ChevronDown size={14} className={`transition-transform ${expandedSections.laptopParts ? 'rotate-180' : ''}`} />
                </button>
                {expandedSections.laptopParts && (
                  <div className="space-y-0.5 mt-1">
                    {laptopPartsCategories.filter(c => !sidebarSearch || c.name.toLowerCase().includes(sidebarSearch.toLowerCase()) || c.subcategories?.some(s => s.name.toLowerCase().includes(sidebarSearch.toLowerCase()))).map((cat) => {
                      const catKey = `lp-${cat.slug}`;
                      const isExpanded = expandedBrands.includes(catKey);
                      return (
                        <div key={catKey}>
                          <div className="flex items-center">
                            <button
                              onClick={() => { setSelectedBrand(catKey); setSelectedSub(''); }}
                              className={`flex-1 text-left px-3 py-1.5 rounded-l transition-colors text-sm ${
                                selectedBrand === catKey ? 'bg-primary-100 text-primary-700 font-medium' : 'hover:bg-gray-50'
                              }`}
                            >
                              {locale === 'en' ? cat.nameEn : cat.name}
                            </button>
                            {cat.subcategories && cat.subcategories.length > 0 && (
                              <button
                                onClick={() => toggleBrandExpand(catKey)}
                                className="px-2 py-1.5 hover:bg-gray-100 rounded-r transition-colors"
                              >
                                <ChevronDown size={12} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                              </button>
                            )}
                          </div>
                          {isExpanded && cat.subcategories && (
                            <div className="ml-2 border-l border-gray-200 pl-2 space-y-0.5">
                              {cat.subcategories.filter(s => !sidebarSearch || s.name.toLowerCase().includes(sidebarSearch.toLowerCase())).map((sub) => (
                                <button
                                  key={sub.slug}
                                  onClick={() => { setSelectedBrand(catKey); setSelectedSub(sub.slug); }}
                                  className={`block w-full text-left px-2 py-1 rounded transition-colors text-xs ${
                                    selectedSub === sub.slug && selectedBrand === catKey ? 'bg-primary-500 text-white' : 'hover:bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  {locale === 'en' ? sub.nameEn : sub.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Price filter info */}
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-semibold text-sm mb-2">{t('products.price')}</h4>
              <p className="text-xs text-gray-500">
                {locale === 'nl' ? 'Alle prijzen zijn incl. btw' : 'All prices are incl. VAT'}
              </p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-wrap items-center justify-between gap-4 animate-slide-down">
            <div className="flex items-center gap-2">
              <button
                className="lg:hidden flex items-center gap-1 text-sm text-primary-500"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
              <span className="text-sm text-gray-500">
                {filteredProducts.length} {locale === 'nl' ? 'producten' : 'products'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Search in results */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('nav.search')}
                className="border rounded-lg px-3 py-1.5 text-sm w-48 focus:outline-none focus:border-primary-500"
              />

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary-500"
              >
                <option value="newest">{t('products.sortNewest')}</option>
                <option value="price-asc">{t('products.sortPrice')} ↑</option>
                <option value="price-desc">{t('products.sortPrice')} ↓</option>
                <option value="name">{t('products.sortName')}</option>
              </select>

            </div>
          </div>

          {/* Products Grid */}
          {paginatedProducts.length > 0 ? (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
              {paginatedProducts.map((product, i) => (
                <div key={product.id} className={`animate-fade-in-up`} style={{ animationDelay: `${Math.min(i * 0.05, 0.4)}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center animate-fade-in">
              <p className="text-gray-500 text-lg">{t('products.noProducts')}</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (() => {
            // Build compact page list: 1, 2, ..., current-1, current, current+1, ..., last-1, last
            const pages: (number | '...')[] = [];
            const addPage = (p: number) => { if (p >= 1 && p <= totalPages && !pages.includes(p)) pages.push(p); };
            addPage(1);
            addPage(2);
            for (let i = currentPage - 1; i <= currentPage + 1; i++) addPage(i);
            addPage(totalPages - 1);
            addPage(totalPages);
            // Sort and insert ellipsis
            const sorted = (pages.filter(p => typeof p === 'number') as number[]).sort((a, b) => a - b);
            const withEllipsis: (number | '...')[] = [];
            for (let i = 0; i < sorted.length; i++) {
              if (i > 0 && sorted[i] - sorted[i - 1] > 1) withEllipsis.push('...');
              withEllipsis.push(sorted[i]);
            }
            return (
              <div className="flex items-center justify-center gap-1.5 mt-8">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  ←
                </button>
                {withEllipsis.map((item, idx) =>
                  item === '...' ? (
                    <span key={`dots-${idx}`} className="px-1 py-2 text-sm text-gray-400">...</span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => goToPage(item as number)}
                      className={`min-w-[36px] px-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === item
                          ? 'bg-primary-500 text-white'
                          : 'border hover:bg-gray-50'
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  →
                </button>
              </div>
            );
          })()}

          {filteredProducts.length > 0 && (
            <p className="text-center text-sm text-gray-500 mt-3">
              {locale === 'nl'
                ? `Pagina ${currentPage} van ${totalPages} (${filteredProducts.length} producten)`
                : `Page ${currentPage} of ${totalPages} (${filteredProducts.length} products)`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8"><div className="skeleton h-96 w-full" /></div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
