'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Download, RefreshCw, Package, TrendingUp, CheckCircle, AlertCircle, ExternalLink, Play, Settings, Search, Edit3 } from 'lucide-react';
import { brandCategories } from '@/lib/categories';

interface MSCategory {
  entity_id: string;
  name: string;
  children_count: number;
  level: number;
}

interface MSProduct {
  entity_id: string;
  sku: string;
  name: string;
  price: number;
  stock_qty: number;
  is_in_stock: boolean;
  image_url: string;
  brand: string;
  description: string;
}

// Build flat list of ALL categories from hierarchical brandCategories
function buildCategoryOptions(): { value: string; label: string; depth: number }[] {
  const options: { value: string; label: string; depth: number }[] = [];
  for (const brand of brandCategories) {
    options.push({ value: brand.slug, label: brand.name, depth: 0 });
    for (const sub of brand.subcategories) {
      options.push({ value: `${brand.slug}/${sub.slug}`, label: `${brand.name} > ${sub.name}`, depth: 1 });
      for (const model of sub.models) {
        options.push({ value: `${brand.slug}/${sub.slug}/${model.slug}`, label: `${brand.name} > ${sub.name} > ${model.name}`, depth: 2 });
      }
    }
  }
  return options;
}

export default function MobileSentrixImport() {
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);
  
  // MS Categories (source)
  const [msCategories, setMsCategories] = useState<MSCategory[]>([]);
  const [msCategoriesLoading, setMsCategoriesLoading] = useState(false);
  const [selectedMsCategory, setSelectedMsCategory] = useState<string>('');
  
  // Target LabFix category
  const [targetCategory, setTargetCategory] = useState<string>('');
  const [categorySearch, setCategorySearch] = useState('');
  const allCategoryOptions = useMemo(() => buildCategoryOptions(), []);
  
  // Products
  const [products, setProducts] = useState<MSProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [customNames, setCustomNames] = useState<Record<string, string>>({});
  const [customPrices, setCustomPrices] = useState<Record<string, string>>({});
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadedPages, setLoadedPages] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  
  // Import settings
  const [priceMarkup, setPriceMarkup] = useState(20);
  const [importResult, setImportResult] = useState<any>(null);
  const [importProgress, setImportProgress] = useState<{current: number; total: number} | null>(null);

  useEffect(() => {
    loadMsCategories();
  }, []);

  const loadMsCategories = async () => {
    setMsCategoriesLoading(true);
    try {
      const res = await fetch('/api/mobilesentrix/categories');
      if (res.ok) {
        const data = await res.json();
        setMsCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
    setMsCategoriesLoading(false);
  };

  const loadProducts = async (categoryId: string, page: number = 1, append: boolean = false) => {
    setProductsLoading(true);
    if (!append) {
      setProducts([]);
      setSelectedProducts(new Set());
      setCustomNames({});
      setCustomPrices({});
    }
    try {
      const catParam = categoryId === 'all' ? '' : `&categoryId=${categoryId}`;
      const res = await fetch(`/api/mobilesentrix/products?page=${page}&pageSize=100${catParam}`);
      if (res.ok) {
        const data = await res.json();
        const newProducts = Array.isArray(data.products) ? data.products : [];
        if (append) {
          setProducts(prev => [...prev, ...newProducts]);
        } else {
          setProducts(newProducts);
        }
        setLoadedPages(page);
        setHasMore(newProducts.length >= 100);
      } else {
        const err = await res.json().catch(() => ({ error: 'Onbekende fout' }));
        console.error('Products API error:', err);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      setHasMore(false);
    }
    setProductsLoading(false);
  };

  const loadAllProducts = async (categoryId: string) => {
    setProductsLoading(true);
    setProducts([]);
    setSelectedProducts(new Set());
    setCustomNames({});
    setCustomPrices({});
    
    let page = 1;
    let allProducts: MSProduct[] = [];
    let keepGoing = true;
    
    while (keepGoing) {
      try {
        const catParam = categoryId === 'all' ? '' : `&categoryId=${categoryId}`;
        const res = await fetch(`/api/mobilesentrix/products?page=${page}&pageSize=100${catParam}`);
        if (res.ok) {
          const data = await res.json();
          const newProducts = Array.isArray(data.products) ? data.products : [];
          if (newProducts.length === 0) {
            keepGoing = false;
          } else {
            allProducts = [...allProducts, ...newProducts];
            setProducts([...allProducts]);
            setLoadedPages(page);
            page++;
            if (newProducts.length < 100) keepGoing = false;
          }
        } else {
          keepGoing = false;
        }
      } catch {
        keepGoing = false;
      }
    }
    
    setHasMore(false);
    setProductsLoading(false);
  };

  const handleMsCategoryChange = (categoryId: string) => {
    setSelectedMsCategory(categoryId);
    if (categoryId) {
      loadProducts(categoryId);
    } else {
      setProducts([]);
      setSelectedProducts(new Set());
    }
  };

  const toggleProductSelection = (entityId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(entityId)) {
        newSet.delete(entityId);
      } else {
        newSet.add(entityId);
      }
      return newSet;
    });
  };

  const safeProducts = Array.isArray(products) ? products : [];
  const filteredProducts = safeProducts.filter(p => 
    (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.sku || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectAll = () => {
    setSelectedProducts(new Set(filteredProducts.map(p => p.entity_id)));
  };

  const deselectAll = () => {
    setSelectedProducts(new Set());
  };

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/mobilesentrix/test');
      const data = await res.json();
      setTestResult(data.success);
    } catch {
      setTestResult(false);
    }
    setTesting(false);
  };

  const startImport = async () => {
    if (selectedProducts.size === 0) {
      setImportResult({ error: 'Selecteer minimaal 1 product om te importeren' });
      return;
    }
    if (!targetCategory) {
      setImportResult({ error: 'Kies een LabFix categorie voor de import' });
      return;
    }

    setLoading(true);
    setImportResult(null);
    
    const productsToImport = safeProducts
      .filter(p => selectedProducts.has(p.entity_id))
      .map(p => ({
        ...p,
        customName: customNames[p.entity_id] || p.name,
        price: customPrices[p.entity_id] ? parseFloat(customPrices[p.entity_id]) : p.price,
        targetCategory,
      }));

    setImportProgress({ current: 0, total: productsToImport.length });

    // Import in batches of 5
    const batchSize = 5;
    let totalImported = 0;
    let totalErrors = 0;
    const allErrors: any[] = [];

    for (let i = 0; i < productsToImport.length; i += batchSize) {
      const batch = productsToImport.slice(i, i + batchSize);
      setImportProgress({ current: Math.min(i + batchSize, productsToImport.length), total: productsToImport.length });

      try {
        const res = await fetch('/api/mobilesentrix/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            products: batch,
            priceMarkup,
            targetCategory,
          }),
        });
        
        const data = await res.json();
        totalImported += data.imported || 0;
        totalErrors += data.errors || 0;
        if (data.errorDetails) allErrors.push(...data.errorDetails);
      } catch (error: any) {
        totalErrors += batch.length;
        allErrors.push({ error: error.message });
      }
    }
    
    setImportResult({
      success: totalErrors === 0,
      message: `${totalImported} producten geïmporteerd${totalErrors > 0 ? ` (${totalErrors} fouten)` : ''}`,
      imported: totalImported,
      errors: totalErrors,
      errorDetails: allErrors,
    });
    
    if (totalImported > 0) {
      setSelectedProducts(new Set());
    }
    
    setLoading(false);
    setImportProgress(null);
  };

  const formatPrice = (price: number | string) => {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(num) || num === 0) return '—';
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Download size={28} />
              Mobile Sentrix Import
            </h2>
            <p className="text-blue-100 mt-1">
              Importeer producten automatisch van Mobile Sentrix naar LabFix
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100">Consumer</p>
            <p className="font-semibold">LabFix</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Connection Test */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ExternalLink size={18} />
            API Verbinding Testen
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Test eerst of de verbinding met Mobile Sentrix werkt voordat je producten importeert.
          </p>
          <button
            onClick={testConnection}
            disabled={testing}
            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {testing ? (
              <><RefreshCw size={18} className="animate-spin" /> Verbinden...</>
            ) : (
              <><ExternalLink size={18} /> Test Verbinding</>
            )}
          </button>
          {testResult !== null && (
            <div className={`mt-3 p-3 rounded-lg flex items-center gap-2 ${testResult ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {testResult ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span className="text-sm font-medium">
                {testResult ? 'Verbinding succesvol!' : 'Verbinding mislukt. Check je API credentials.'}
              </span>
            </div>
          )}
        </div>

        {/* Import Settings */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Settings size={18} />
            Import Instellingen
          </h3>
          
          <div className="space-y-4">
            {/* MS Source Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bron Categorie (MobileSentrix)
              </label>
              <select
                value={selectedMsCategory}
                onChange={(e) => handleMsCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                disabled={msCategoriesLoading}
              >
                <option value="">{msCategoriesLoading ? 'Laden...' : 'Kies een MS categorie'}</option>
                <option value="all">📦 ALLE PRODUCTEN (volledig assortiment)</option>
                {msCategories.map((cat) => (
                  <option key={cat.entity_id} value={cat.entity_id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Target LabFix Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Doel Categorie (LabFix webshop)
              </label>
              <input
                type="text"
                placeholder="Zoek categorie..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 mb-1 text-sm"
              />
              <select
                value={targetCategory}
                onChange={(e) => setTargetCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                size={6}
              >
                <option value="">-- Kies een categorie --</option>
                {allCategoryOptions
                  .filter(cat => !categorySearch || cat.label.toLowerCase().includes(categorySearch.toLowerCase()))
                  .map((cat) => (
                  <option key={cat.value} value={cat.value} style={{ paddingLeft: cat.depth * 16 }}>
                    {cat.depth === 0 ? `📁 ${cat.label}` : cat.depth === 1 ? `  📂 ${cat.label.split(' > ').pop()}` : `    📄 ${cat.label.split(' > ').pop()}`}
                  </option>
                ))}
              </select>
              {targetCategory && (
                <p className="text-xs text-blue-600 mt-1">Gekozen: <strong>{allCategoryOptions.find(c => c.value === targetCategory)?.label || targetCategory}</strong></p>
              )}
            </div>

            {/* Price Markup */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prijs Marge (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceMarkup}
                  onChange={(e) => setPriceMarkup(parseInt(e.target.value) || 0)}
                  className="w-24 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
                <TrendingUp size={18} className="text-green-600" />
                <span className="text-sm text-gray-500">Winstmarge bovenop inkoopprijs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Selection */}
      {selectedMsCategory && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Package size={18} />
              Producten ({filteredProducts.length} van {safeProducts.length})
            </h3>
            <div className="flex items-center gap-2">
              <button onClick={selectAll} className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                Selecteer alles
              </button>
              <button onClick={deselectAll} className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                Deselecteer alles
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Zoek op naam of SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {selectedProducts.size > 0 && (
            <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg flex items-center justify-between">
              <span><span className="font-medium">{selectedProducts.size}</span> producten geselecteerd</span>
              <span className="text-sm">Categorie: <strong>{allCategoryOptions.find(c => c.value === targetCategory)?.label || targetCategory}</strong></span>
            </div>
          )}

          {productsLoading && safeProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <RefreshCw size={32} className="animate-spin text-blue-600 mb-3" />
              <span className="text-gray-700 font-medium">Alle producten laden van MobileSentrix...</span>
              <span className="text-gray-500 text-sm mt-1">Dit kan even duren (alle pagina's worden opgehaald)</span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  <strong>{safeProducts.length}</strong> producten geladen
                  {searchQuery && ` — ${filteredProducts.length} resultaten`}
                </span>
                <button
                  onClick={() => {
                    const all = new Set(filteredProducts.map((p: MSProduct) => p.entity_id));
                    setSelectedProducts(prev => prev.size === all.size ? new Set() : all);
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {selectedProducts.size === filteredProducts.length ? 'Deselecteer alles' : 'Selecteer alles'}
                </button>
              </div>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredProducts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Geen producten gevonden</p>
                ) : (
                  filteredProducts.map((product) => (
                    <div
                      key={product.entity_id}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        selectedProducts.has(product.entity_id)
                          ? 'bg-blue-50 border border-blue-200'
                          : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(product.entity_id)}
                        onChange={() => toggleProductSelection(product.entity_id)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      {product.image_url && (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-12 h-12 object-contain bg-white rounded"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        {editingName === product.entity_id ? (
                          <input
                            type="text"
                            value={customNames[product.entity_id] ?? product.name}
                            onChange={(e) => setCustomNames(prev => ({ ...prev, [product.entity_id]: e.target.value }))}
                            onBlur={() => setEditingName(null)}
                            onKeyDown={(e) => e.key === 'Enter' && setEditingName(null)}
                            autoFocus
                            className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:border-blue-500"
                          />
                        ) : (
                          <p 
                            className="font-medium text-gray-800 truncate cursor-pointer hover:text-blue-600 flex items-center gap-1"
                            onClick={(e) => { e.stopPropagation(); setEditingName(product.entity_id); }}
                            title="Klik om naam aan te passen"
                          >
                            {customNames[product.entity_id] || product.name}
                            <Edit3 size={12} className="text-gray-400 flex-shrink-0" />
                          </p>
                        )}
                        <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {editingPrice === product.entity_id ? (
                          <input
                            type="number"
                            step="0.01"
                            value={customPrices[product.entity_id] ?? product.price}
                            onChange={(e) => setCustomPrices(prev => ({ ...prev, [product.entity_id]: e.target.value }))}
                            onBlur={() => setEditingPrice(null)}
                            onKeyDown={(e) => e.key === 'Enter' && setEditingPrice(null)}
                            autoFocus
                            className="w-24 px-2 py-1 border rounded text-sm text-right focus:outline-none focus:border-blue-500"
                          />
                        ) : (
                          <p 
                            className="font-medium text-gray-800 cursor-pointer hover:text-blue-600"
                            onClick={(e) => { e.stopPropagation(); setEditingPrice(product.entity_id); }}
                            title="Klik om prijs aan te passen"
                          >
                            {formatPrice(customPrices[product.entity_id] ? parseFloat(customPrices[product.entity_id]) : product.price)}
                            <Edit3 size={10} className="inline ml-1 text-gray-400" />
                          </p>
                        )}
                        <p className={`text-sm ${product.is_in_stock ? 'text-green-600' : 'text-red-600'}`}>
                          {product.is_in_stock 
                            ? `${product.stock_qty > 0 ? product.stock_qty + ' op voorraad' : 'Op voorraad'}` 
                            : 'Niet op voorraad'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination buttons */}
              {hasMore && !productsLoading && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => loadProducts(selectedMsCategory, loadedPages + 1, true)}
                    className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Download size={16} /> Volgende 100 laden (pagina {loadedPages + 1})
                  </button>
                  <button
                    onClick={() => loadAllProducts(selectedMsCategory)}
                    className="flex-1 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Package size={16} /> ALLES laden
                  </button>
                </div>
              )}
              {productsLoading && safeProducts.length > 0 && (
                <div className="flex items-center justify-center py-4 gap-2">
                  <RefreshCw size={18} className="animate-spin text-blue-600" />
                  <span className="text-gray-600">Meer producten laden... (pagina {loadedPages + 1}, {safeProducts.length} geladen)</span>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Import Button */}
      {selectedMsCategory && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <button
            onClick={startImport}
            disabled={loading || selectedProducts.size === 0}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <RefreshCw size={24} className="animate-spin" />
                {importProgress ? `Importeren... ${importProgress.current}/${importProgress.total}` : 'Producten Importeren...'}
              </>
            ) : (
              <>
                <Play size={24} />
                Importeer {selectedProducts.size} Producten naar {allCategoryOptions.find(c => c.value === targetCategory)?.label || 'categorie'}
              </>
            )}
          </button>

          {importResult && (
            <div className={`mt-4 p-4 rounded-lg ${importResult.errors > 0 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              <div className="flex items-start gap-2">
                {importResult.errors > 0 ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                <div>
                  <p className="font-medium">{importResult.message}</p>
                  {importResult.errorDetails?.length > 0 && (
                    <ul className="text-sm mt-2 space-y-1">
                      {importResult.errorDetails.slice(0, 5).map((e: any, i: number) => (
                        <li key={i}>{e.sku}: {e.error}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
