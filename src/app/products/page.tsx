'use client';

import React, { Suspense, useEffect, useState, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import ProductCard from '@/components/ProductCard';
import { fetchProductsPaginated, Product } from '@/lib/store';
import { Filter, SlidersHorizontal, ChevronDown, Search, X } from 'lucide-react';
import Link from 'next/link';
import { brandCategories, getBrandName, getSubcategoryName, getModelName, pcPartsCategories, pcAccessoryCategories, accessoryCategories, screenProtectorBrands, laptopBrands, laptopPartsCategories } from '@/lib/categories';

function ProductsPageContent() {
  const { t, locale, vatMode } = useApp();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedSub, setSelectedSub] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedAccessoryBrand, setSelectedAccessoryBrand] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState<string>(() => searchParams.get('search') || '');
  const [searchInput, setSearchInput] = useState<string>(() => searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 24;
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchIdRef = useRef(0);
  const isSyncingFromState = useRef(false);
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

  // Stable key that only changes when actual param values change (not object reference)
  const urlParamsKey = useMemo(() => {
    const sp = searchParams;
    return [
      sp.get('brand'), sp.get('sub'), sp.get('model'), sp.get('category'),
      sp.get('search'), sp.get('accessory'), sp.get('pcpart'), sp.get('pcacc'),
      sp.get('laptopBrand'), sp.get('laptopModel'), sp.get('laptopPart'), sp.get('accBrand')
    ].join('|');
  }, [searchParams]);

  // Ref to read latest expandedSections inside effects without stale closure
  const expandedSectionsRef = useRef(expandedSections);
  expandedSectionsRef.current = expandedSections;

  // Fetch products from API with server-side pagination
  useEffect(() => {
    const abortController = new AbortController();
    const currentFetchId = ++fetchIdRef.current;
    setLoadingProducts(true);
    const params: Record<string, string> = {
      page: currentPage.toString(),
      limit: PRODUCTS_PER_PAGE.toString(),
    };
    if (selectedBrand) params.category = selectedBrand;
    if (selectedSub) params.subcategory = selectedSub;
    if (selectedModel) params.model = selectedModel;
    if (selectedAccessoryBrand) params.brand = selectedAccessoryBrand;
    if (searchQuery) params.search = searchQuery;
    if (sortBy && sortBy !== 'newest') params.sort = sortBy;
    fetchProductsPaginated(params, abortController.signal)
      .then((data) => {
        // Ignore stale fetches to prevent overwriting newer results
        if (currentFetchId !== fetchIdRef.current) return;
        setProducts(data.products);
        setTotalCount(data.total);
        // Track grand total (no filter) once we have it
        if (!selectedBrand && !selectedSub && !selectedModel && !searchQuery) setGrandTotal(data.total);
      })
      .catch((err) => {
        // Ignore abort errors (cleanup)
        if (err?.name !== 'AbortError') throw err;
      })
      .finally(() => {
        // Only clear loading state if this is still the most recent fetch
        if (currentFetchId === fetchIdRef.current) {
          setLoadingProducts(false);
        }
      });
    return () => abortController.abort();
  }, [currentPage, selectedBrand, selectedSub, selectedModel, selectedAccessoryBrand, searchQuery, sortBy]);

  // Fetch grand total once on mount (in case page loads with a filter active)
  useEffect(() => {
    if (grandTotal > 0) return;
    fetchProductsPaginated({ page: '1', limit: '1' }).then(d => setGrandTotal(d.total));
  }, []);

  // Debounce search input → update searchQuery (skip if already in sync)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchQuery(prev => {
        if (prev !== searchInput) setCurrentPage(1);
        return searchInput;
      });
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchInput]);

  // Read URL params on mount AND when URL changes via Link navigation
  useEffect(() => {
    // Skip if we just synced state to URL (prevents loop with replaceState)
    if (isSyncingFromState.current) return;

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
    const accessoryBrand = searchParams.get('accBrand');

    // Only update state if URL params differ from current state (prevents overwriting sidebar clicks)
    const targetBrand = cat || brand || (accessory ? `acc-${accessory}` : '') || (pcpart ? `pc-${pcpart}` : '') || (pcacc ? `pca-${pcacc}` : '') || (laptopBrand ? `laptop-${laptopBrand}` : '') || '';
    const targetSub = sub || laptopModel || '';
    const targetModel = model || laptopPart || '';

    if (targetBrand && targetBrand !== selectedBrand) {
      setSelectedBrand(targetBrand);
      setExpandedBrands(prev => prev.includes(targetBrand) ? prev : [...prev, targetBrand]);
    }
    if (!targetBrand && selectedBrand) setSelectedBrand('');

    if (targetSub && targetSub !== selectedSub) setSelectedSub(targetSub);
    if (!targetSub && selectedSub) setSelectedSub('');

    if (targetModel && targetModel !== selectedModel) setSelectedModel(targetModel);
    if (!targetModel && selectedModel) setSelectedModel('');

    if (search && search !== searchQuery) { setSearchQuery(search); setSearchInput(search); }
    if (!search && searchQuery) { setSearchQuery(''); setSearchInput(''); }

    if (accessoryBrand && accessoryBrand !== selectedAccessoryBrand) {
      setSelectedAccessoryBrand(accessoryBrand);
      if (!expandedSectionsRef.current.accessories) {
        setExpandedSections(p => ({ ...p, accessories: true }));
      }
    }
    if (!accessoryBrand && selectedAccessoryBrand) setSelectedAccessoryBrand('');

    if (accessory && !expandedSectionsRef.current.accessories) {
      setExpandedSections(p => ({ ...p, accessories: true }));
    }
    if (pcpart && !expandedSectionsRef.current.pcParts) {
      setExpandedSections(p => ({ ...p, pcParts: true }));
    }
    if (pcacc && !expandedSectionsRef.current.pcAcc) {
      setExpandedSections(p => ({ ...p, pcAcc: true }));
    }
    if (laptopBrand && !expandedSectionsRef.current.laptopBrands) {
      setExpandedSections(p => ({ ...p, laptopBrands: true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlParamsKey]);

  // Reset to page 1 when category/sub/model filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBrand, selectedSub, selectedModel, selectedAccessoryBrand, sortBy, searchQuery]);

  const toggleBrandExpand = (slug: string) => {
    setExpandedBrands(prev => prev.includes(slug) ? prev.filter(b => b !== slug) : [...prev, slug]);
  };

  const toggleSubExpand = (key: string) => {
    setExpandedSubs(prev => prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]);
  };

  // Sync filter state to URL without navigation (so refresh keeps filters)
  useEffect(() => {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    params.delete('category'); params.delete('sub'); params.delete('model'); params.delete('brand');
    params.delete('accessory'); params.delete('pcpart'); params.delete('pcacc');
    params.delete('laptopBrand'); params.delete('laptopModel'); params.delete('laptopPart');
    params.delete('accBrand'); params.delete('search'); params.delete('sort'); params.delete('page');

    if (searchQuery) params.set('search', searchQuery);
    if (sortBy && sortBy !== 'newest') params.set('sort', sortBy);
    if (currentPage > 1) params.set('page', currentPage.toString());

    if (selectedBrand) {
      if (selectedBrand.startsWith('laptop-')) {
        params.set('laptopBrand', selectedBrand.slice(7));
        if (selectedSub) params.set('laptopModel', selectedSub);
        if (selectedModel) params.set('laptopPart', selectedModel);
      } else if (selectedBrand.startsWith('acc-')) {
        params.set('accessory', selectedBrand.slice(4));
        if (selectedSub) params.set('sub', selectedSub);
        if (selectedAccessoryBrand) params.set('accBrand', selectedAccessoryBrand);
        if (selectedModel) params.set('model', selectedModel);
      } else if (selectedBrand.startsWith('pc-')) {
        params.set('pcpart', selectedBrand.slice(3));
        if (selectedSub) params.set('sub', selectedSub);
      } else if (selectedBrand.startsWith('pca-')) {
        params.set('pcacc', selectedBrand.slice(4));
        if (selectedSub) params.set('sub', selectedSub);
      } else {
        params.set('brand', selectedBrand);
        if (selectedSub) params.set('sub', selectedSub);
        if (selectedModel) params.set('model', selectedModel);
      }
    }

    const newUrl = url.toString();
    if (newUrl !== window.location.href) {
      isSyncingFromState.current = true;
      window.history.replaceState({}, '', newUrl);
      // Reset flag after a short delay so URL-reading effects don't fire during the sync
      setTimeout(() => { isSyncingFromState.current = false; }, 150);
    }
  }, [selectedBrand, selectedSub, selectedModel, selectedAccessoryBrand, searchQuery, sortBy, currentPage]);

  // Products come pre-filtered from API; just use them directly
  const filteredProducts = products;
  const paginatedProducts = products;
  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

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
              onClick={() => { setSelectedSub(''); setSelectedAccessoryBrand(''); setSelectedModel(''); }}>
              {getBrandName(selectedBrand, locale)}
            </span>
          </>
        )}
        {selectedSub && (
          <>
            <span className="mx-2">/</span>
            <span className={`${!selectedAccessoryBrand ? 'text-gray-800' : 'hover:text-primary-500 cursor-pointer'}`}
              onClick={() => { setSelectedAccessoryBrand(''); setSelectedModel(''); }}>
              {getSubcategoryName(selectedBrand, selectedSub, locale)}
            </span>
          </>
        )}
        {selectedAccessoryBrand && (
          <>
            <span className="mx-2">/</span>
            <span className={`${!selectedModel ? 'text-gray-800' : 'hover:text-primary-500 cursor-pointer'}`}
              onClick={() => setSelectedModel('')}>
              {selectedAccessoryBrand === 'apple' ? 'Apple' : selectedAccessoryBrand === 'samsung' ? 'Samsung' : selectedAccessoryBrand}
            </span>
          </>
        )}
        {selectedModel && (
          <>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{getModelName(selectedBrand, selectedSub, selectedModel, locale)}</span>
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
              <Link
                href="/products"
                onClick={() => { setSelectedBrand(''); setSelectedSub(''); setSelectedModel(''); setSidebarSearch(''); }}
                className={`block w-full text-left px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                  !selectedBrand ? 'bg-primary-500 text-white' : 'hover:bg-gray-100'
                }`}
              >
                {t('products.all')} ({grandTotal || '...'})
              </Link>

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
                    {brandCategories.filter(b => !sidebarSearch || b.name.toLowerCase().includes(sidebarSearch.toLowerCase()) || b.nameEn.toLowerCase().includes(sidebarSearch.toLowerCase())).map((brand) => {
                      const brandCount = products.filter(p => p.category === brand.slug || p.category.startsWith(brand.slug + '/')).length + 
                        (selectedBrand === brand.slug ? totalCount - products.length : 0);
                      const isExpanded = expandedBrands.includes(brand.slug);
                      const hasMatch = !sidebarSearch || brand.subcategories?.some(s => s.name.toLowerCase().includes(sidebarSearch.toLowerCase()));
                      return (
                        <div key={brand.slug}>
                          <div className="flex items-center">
                            <button
                              onClick={() => { setSelectedBrand(brand.slug); setSelectedSub(''); setSelectedModel(''); setSelectedAccessoryBrand(''); setSidebarSearch(''); setExpandedBrands(prev => prev.includes(brand.slug) ? prev : [...prev, brand.slug]); }}
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
                                        onClick={() => { setSelectedBrand(brand.slug); setSelectedSub(sub.slug); setSelectedModel(''); setSelectedAccessoryBrand(''); setSidebarSearch(''); setExpandedSubs(prev => prev.includes(subKey) ? prev : [...prev, subKey]); }}
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
                                            onClick={() => { setSelectedBrand(brand.slug); setSelectedSub(sub.slug); setSelectedModel(model.slug); setSidebarSearch(''); }}
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
                      const isScreenProtectors = cat.slug === 'screen-protectors';
                      return (
                        <div key={catKey}>
                          <div className="flex items-center">
                            <button
                              onClick={() => { setSelectedBrand(catKey); setSelectedSub(''); setSelectedAccessoryBrand(''); setSelectedModel(''); setSidebarSearch(''); setExpandedBrands(prev => prev.includes(catKey) ? prev : [...prev, catKey]); }}
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
                              {cat.subcategories.filter(s => !sidebarSearch || s.name.toLowerCase().includes(sidebarSearch.toLowerCase())).map((sub) => {
                                const subKey = `${catKey}/${sub.slug}`;
                                const isSubExpanded = expandedSubs.includes(subKey);
                                return (
                                  <div key={sub.slug}>
                                    <div className="flex items-center">
                                      <button
                                        onClick={() => { setSelectedBrand(catKey); setSelectedSub(sub.slug); setSelectedAccessoryBrand(''); setSelectedModel(''); setSidebarSearch(''); setExpandedSubs(prev => prev.includes(subKey) ? prev : [...prev, subKey]); }}
                                        className={`flex-1 text-left px-2 py-1 rounded-l transition-colors text-xs ${
                                          selectedSub === sub.slug && selectedBrand === catKey && !selectedAccessoryBrand ? 'bg-primary-500 text-white' : 'hover:bg-gray-100 text-gray-600'
                                        }`}
                                      >
                                        {locale === 'en' ? sub.nameEn : sub.name}
                                      </button>
                                      {isScreenProtectors && (
                                        <button
                                          onClick={() => toggleSubExpand(subKey)}
                                          className="px-1.5 py-1 hover:bg-gray-100 rounded-r transition-colors"
                                        >
                                          <ChevronDown size={10} className={`transition-transform text-gray-400 ${isSubExpanded ? 'rotate-180' : ''}`} />
                                        </button>
                                      )}
                                    </div>
                                    {/* Screen protector brands (Apple/Samsung) */}
                                    {isSubExpanded && isScreenProtectors && (
                                      <div className="ml-2 border-l border-gray-100 pl-2 space-y-0.5">
                                        {screenProtectorBrands.map((spBrand) => (
                                          <button
                                            key={spBrand.slug}
                                            onClick={() => { setSelectedBrand(catKey); setSelectedSub(sub.slug); setSelectedAccessoryBrand(spBrand.slug); setSelectedModel(''); setSidebarSearch(''); }}
                                            className={`block w-full text-left px-2 py-0.5 rounded transition-colors text-[11px] ${
                                              selectedAccessoryBrand === spBrand.slug && selectedSub === sub.slug && selectedBrand === catKey ? 'bg-primary-500 text-white' : 'hover:bg-gray-50 text-gray-500'
                                            }`}
                                          >
                                            {spBrand.name}
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
                              onClick={() => { setSelectedBrand(catKey); setSelectedSub(''); setSelectedModel(''); setSelectedAccessoryBrand(''); setSidebarSearch(''); setExpandedBrands(prev => prev.includes(catKey) ? prev : [...prev, catKey]); }}
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
                                  onClick={() => { setSelectedBrand(catKey); setSelectedSub(sub.slug); setSelectedModel(''); setSelectedAccessoryBrand(''); setSidebarSearch(''); }}
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
                              onClick={() => { setSelectedBrand(catKey); setSelectedSub(''); setSelectedModel(''); setSelectedAccessoryBrand(''); setSidebarSearch(''); setExpandedBrands(prev => prev.includes(catKey) ? prev : [...prev, catKey]); }}
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
                                  onClick={() => { setSelectedBrand(catKey); setSelectedSub(sub.slug); setSelectedModel(''); setSelectedAccessoryBrand(''); setSidebarSearch(''); }}
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

              {/* Section: Laptops (Merk -> Model -> Onderdeel) */}
              <div className="mt-2 border-t pt-2">
                <button
                  onClick={() => setExpandedSections(p => ({ ...p, laptopBrands: !p.laptopBrands }))}
                  className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold text-gray-500 uppercase hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {locale === 'nl' ? '💻 Laptops' : '💻 Laptops'}
                  <ChevronDown size={14} className={`transition-transform ${expandedSections.laptopBrands ? 'rotate-180' : ''}`} />
                </button>
                {expandedSections.laptopBrands && (
                  <div className="max-h-[280px] overflow-y-auto space-y-0.5 mt-1">
                    {laptopBrands.filter(b => !sidebarSearch || b.name.toLowerCase().includes(sidebarSearch.toLowerCase()) || b.subcategories?.some(s => s.name.toLowerCase().includes(sidebarSearch.toLowerCase()))).map((brand) => {
                      const brandKey = `laptop-${brand.slug}`;
                      const isExpanded = expandedBrands.includes(brandKey);
                      return (
                        <div key={brandKey}>
                          <div className="flex items-center">
                            <button
                              onClick={() => {
                                setSelectedBrand(brandKey);
                                setSelectedSub('');
                                setSelectedModel('');
                                setSelectedAccessoryBrand('');
                                setSidebarSearch('');
                                setExpandedBrands(prev => prev.includes(brandKey) ? prev : [...prev, brandKey]);
                              }}
                              className={`flex-1 text-left px-3 py-1.5 rounded-l transition-colors text-sm ${
                                selectedBrand === brandKey && !selectedSub ? 'bg-primary-100 text-primary-700 font-medium' : 'hover:bg-gray-50'
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
                              {brand.subcategories.filter(s => !sidebarSearch || s.name.toLowerCase().includes(sidebarSearch.toLowerCase())).map((model) => {
                                const modelKey = `${brandKey}/${model.slug}`;
                                const isModelExpanded = expandedSubs.includes(modelKey);
                                return (
                                  <div key={model.slug}>
                                    <div className="flex items-center">
                                      <button
                                        onClick={() => {
                                          setSelectedBrand(brandKey);
                                          setSelectedSub(model.slug);
                                          setSelectedModel('');
                                          setSelectedAccessoryBrand('');
                                          setSidebarSearch('');
                                          setExpandedSubs(prev => prev.includes(modelKey) ? prev : [...prev, modelKey]);
                                        }}
                                        className={`flex-1 text-left px-2 py-1 rounded-l transition-colors text-xs ${
                                          selectedBrand === brandKey && selectedSub === model.slug && !selectedModel ? 'bg-primary-500 text-white' : 'hover:bg-gray-100 text-gray-600'
                                        }`}
                                      >
                                        {model.name}
                                      </button>
                                      <button
                                        onClick={() => toggleSubExpand(modelKey)}
                                        className="px-1.5 py-1 hover:bg-gray-100 rounded-r transition-colors"
                                      >
                                        <ChevronDown size={10} className={`transition-transform text-gray-400 ${isModelExpanded ? 'rotate-180' : ''}`} />
                                      </button>
                                    </div>
                                    {isModelExpanded && (
                                      <div className="ml-2 border-l border-gray-100 pl-2 space-y-0.5">
                                        {laptopPartsCategories.map((part) => (
                                          <button
                                            key={part.slug}
                                            onClick={() => { setSelectedBrand(brandKey); setSelectedSub(model.slug); setSelectedModel(part.slug); setSidebarSearch(''); }}
                                            className={`block w-full text-left px-2 py-0.5 rounded transition-colors text-[11px] ${
                                              selectedBrand === brandKey && selectedSub === model.slug && selectedModel === part.slug ? 'bg-primary-500 text-white' : 'hover:bg-gray-50 text-gray-500'
                                            }`}
                                          >
                                            {locale === 'en' ? part.nameEn : part.name}
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
            </div>

            {/* Price filter info */}
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-semibold text-sm mb-2">{t('products.price')}</h4>
              <p className="text-xs text-gray-500">
                {vatMode === 'incl'
                  ? (locale === 'nl' ? 'Alle prijzen zijn incl. BTW' : 'All prices are incl. VAT')
                  : (locale === 'nl' ? 'Alle prijzen zijn excl. BTW' : 'All prices are excl. VAT')}
              </p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {/* Search query banner */}
          {searchQuery && (
            <div className="bg-primary-50 border border-primary-200 rounded-xl px-4 py-3 mb-4 flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-2 text-sm">
                <Search size={15} className="text-primary-500 flex-shrink-0" />
                <span className="text-gray-600">
                  {locale === 'nl' ? 'Zoekresultaten voor' : 'Search results for'}
                </span>
                <span className="font-semibold text-primary-700">"{searchQuery}"</span>
                {!loadingProducts && (
                  <span className="text-gray-400">— {totalCount} {locale === 'nl' ? 'producten gevonden' : 'products found'}</span>
                )}
              </div>
              <button
                onClick={() => { setSearchInput(''); setSearchQuery(''); }}
                className="text-gray-400 hover:text-gray-600 ml-3 flex-shrink-0"
                title={locale === 'nl' ? 'Zoekopdracht wissen' : 'Clear search'}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Toolbar */}
          <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 mb-6 flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4 animate-slide-down">
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                className="lg:hidden flex items-center gap-1 text-sm text-primary-500"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
              <span className="text-sm text-gray-500 whitespace-nowrap">
                {loadingProducts ? '...' : `${totalCount} ${locale === 'nl' ? 'producten' : 'products'}`}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              {/* Search in results — queries full database with smart NL/EN keyword expansion */}
              <div className="relative flex-1 sm:flex-none">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={locale === 'nl' ? 'Zoek producten...' : 'Search products...'}
                  className="border rounded-lg pl-8 pr-8 py-1.5 text-sm w-full sm:w-64 focus:outline-none focus:border-primary-500"
                />
                {searchInput && (
                  <button onClick={() => { setSearchInput(''); setSearchQuery(''); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-lg px-2 sm:px-3 py-1.5 text-sm focus:outline-none focus:border-primary-500 flex-shrink-0"
              >
                <option value="newest">{t('products.sortNewest')}</option>
                <option value="price-asc">{t('products.sortPrice')} ↑</option>
                <option value="price-desc">{t('products.sortPrice')} ↓</option>
                <option value="name">{t('products.sortName')}</option>
              </select>

            </div>
          </div>

          {/* Products Grid */}
          {loadingProducts ? (
            <div className="bg-white rounded-xl shadow-md p-16 text-center animate-fade-in">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
                <p className="text-gray-600 font-medium">
                  {locale === 'nl' ? 'Producten aan het laden...' : 'Loading products...'}
                </p>
                <p className="text-gray-400 text-sm">
                  {locale === 'nl' ? 'Even geduld a.u.b.' : 'Please wait'}
                </p>
              </div>
            </div>
          ) : paginatedProducts.length > 0 ? (
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

          {totalCount > 0 && (
            <p className="text-center text-sm text-gray-500 mt-3">
              {locale === 'nl'
                ? `Pagina ${currentPage} van ${totalPages} (${totalCount} producten)`
                : `Page ${currentPage} of ${totalPages} (${totalCount} products)`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-16 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
            <p className="text-gray-600 font-medium">Even geduld...</p>
            <p className="text-gray-400 text-sm">Producten worden geladen</p>
          </div>
        </div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
