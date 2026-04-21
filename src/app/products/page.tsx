'use client';

import React, { Suspense, useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import ProductCard from '@/components/ProductCard';
import { fetchProducts, Product } from '@/lib/store';
import { Filter, Grid3X3, List, SlidersHorizontal, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { brandCategories, getBrandName, getSubcategoryName } from '@/lib/categories';

function ProductsPageContent() {
  const { t, locale } = useApp();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedSub, setSelectedSub] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedBrands, setExpandedBrands] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  useEffect(() => {
    const brand = searchParams.get('brand');
    const sub = searchParams.get('sub');
    const cat = searchParams.get('category');
    const search = searchParams.get('search');
    if (brand) { setSelectedBrand(brand); setExpandedBrands([brand]); }
    if (sub) setSelectedSub(sub);
    if (cat) setSelectedBrand(cat);
    if (search) setSearchQuery(search);
  }, [searchParams]);

  const toggleBrandExpand = (slug: string) => {
    setExpandedBrands(prev => prev.includes(slug) ? prev.filter(b => b !== slug) : [...prev, slug]);
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedBrand) {
      filtered = filtered.filter((p) => p.category === selectedBrand);
    }

    if (selectedSub) {
      filtered = filtered.filter((p) => p.subcategory === selectedSub);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.descriptionEn.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
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
  }, [products, selectedBrand, selectedSub, searchQuery, sortBy, locale]);

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
            <span className="text-gray-800">{getSubcategoryName(selectedBrand, selectedSub, locale)}</span>
          </>
        )}
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-xl shadow-md p-5 animate-fade-in-left">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Filter size={18} />
              {locale === 'nl' ? 'Categorieën' : 'Categories'}
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => { setSelectedBrand(''); setSelectedSub(''); }}
                className={`block w-full text-left px-3 py-2 rounded transition-colors text-sm font-medium ${
                  !selectedBrand ? 'bg-primary-500 text-white' : 'hover:bg-gray-100'
                }`}
              >
                {t('products.all')} ({products.length})
              </button>
              {brandCategories.map((brand) => {
                const brandCount = products.filter(p => p.category === brand.slug).length;
                const isExpanded = expandedBrands.includes(brand.slug);
                return (
                  <div key={brand.slug}>
                    <div className="flex items-center">
                      <button
                        onClick={() => { setSelectedBrand(brand.slug); setSelectedSub(''); }}
                        className={`flex-1 text-left px-3 py-2 rounded-l transition-colors text-sm font-medium ${
                          selectedBrand === brand.slug && !selectedSub ? 'bg-primary-500 text-white' : selectedBrand === brand.slug ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        {locale === 'en' ? brand.nameEn : brand.name} {brandCount > 0 && <span className="text-xs opacity-70">({brandCount})</span>}
                      </button>
                      <button
                        onClick={() => toggleBrandExpand(brand.slug)}
                        className="px-2 py-2 hover:bg-gray-100 rounded-r transition-colors"
                      >
                        <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="ml-3 border-l-2 border-gray-200 pl-2 space-y-0.5 mt-1 mb-1">
                        {brand.subcategories.map((sub) => {
                          const subCount = products.filter(p => p.category === brand.slug && p.subcategory === sub.slug).length;
                          return (
                            <button
                              key={sub.slug}
                              onClick={() => { setSelectedBrand(brand.slug); setSelectedSub(sub.slug); }}
                              className={`block w-full text-left px-3 py-1.5 rounded transition-colors text-xs ${
                                selectedBrand === brand.slug && selectedSub === sub.slug ? 'bg-primary-500 text-white' : 'hover:bg-gray-100 text-gray-600'
                              }`}
                            >
                              {locale === 'en' ? sub.nameEn : sub.name} {subCount > 0 && <span className="opacity-70">({subCount})</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Price filter info */}
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-semibold text-sm mb-2">{t('products.price')}</h4>
              <p className="text-xs text-gray-500">
                {locale === 'nl' ? 'Alle prijzen zijn excl. BTW' : 'All prices are excl. VAT'}
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

              {/* View toggle */}
              <div className="hidden sm:flex items-center gap-1 border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-400'}`}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-400'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                  : 'space-y-4'
              }
            >
              {filteredProducts.map((product, i) => (
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
