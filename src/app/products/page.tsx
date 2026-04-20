'use client';

import React, { Suspense, useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import ProductCard from '@/components/ProductCard';
import { fetchProducts, fetchCategories, Product, Category } from '@/lib/store';
import { Filter, Grid3X3, List, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';

function ProductsPageContent() {
  const { t, locale } = useApp();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts().then(setProducts);
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    const search = searchParams.get('search');
    if (cat) setSelectedCategory(cat);
    if (search) setSearchQuery(search);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
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
  }, [products, selectedCategory, searchQuery, sortBy, locale]);

  const getCategoryName = (cat: Category) => locale === 'nl' ? cat.name : cat.nameEn;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 animate-fade-in">
        <Link href="/" className="hover:text-primary-500">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{t('products.title')}</span>
        {selectedCategory && (
          <>
            <span className="mx-2">/</span>
            <span className="text-gray-800">
              {categories.find((c) => c.slug === selectedCategory)
                ? getCategoryName(categories.find((c) => c.slug === selectedCategory)!)
                : selectedCategory}
            </span>
          </>
        )}
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-xl shadow-md p-6 animate-fade-in-left">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Filter size={18} />
              {t('products.filterCategory')}
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`block w-full text-left px-3 py-2 rounded transition-colors text-sm ${
                  !selectedCategory ? 'bg-primary-500 text-white' : 'hover:bg-gray-100'
                }`}
              >
                {t('products.all')} ({products.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`block w-full text-left px-3 py-2 rounded transition-colors text-sm ${
                    selectedCategory === cat.slug ? 'bg-primary-500 text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  {getCategoryName(cat)} ({products.filter((p) => p.category === cat.slug).length})
                </button>
              ))}
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
