'use client';

import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, Package, TrendingUp, CheckCircle, AlertCircle, ExternalLink, Play, Settings, ChevronDown, ChevronUp, Search } from 'lucide-react';

interface ImportStats {
  total_imported: number;
  published: number;
  drafts: number;
  synced_last_24h: number;
}

interface ImportedProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: string;
  ms_last_sync: string;
  created_at: string;
}

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
  price: string;
  stock_qty: number;
  is_in_stock: boolean;
  image_url: string;
}

export default function MobileSentrixImport() {
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);
  const [stats, setStats] = useState<ImportStats | null>(null);
  const [recentImports, setRecentImports] = useState<ImportedProduct[]>([]);
  
  // Categories
  const [categories, setCategories] = useState<MSCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  // Products
  const [products, setProducts] = useState<MSProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Import settings
  const [priceMarkup, setPriceMarkup] = useState(20);
  const [autoPublish, setAutoPublish] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [importProgress, setImportProgress] = useState<{current: number; total: number} | null>(null);

  // Load stats and categories on mount
  useEffect(() => {
    loadStats();
    loadCategories();
  }, []);

  const loadStats = async () => {
    try {
      const res = await fetch('/api/mobilesentrix/import');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setRecentImports(data.recentImports);
      }
    } catch (error) {
      console.error('Failed to load import stats:', error);
    }
  };

  const loadCategories = async () => {
    setCategoriesLoading(true);
    try {
      const res = await fetch('/api/mobilesentrix/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
    setCategoriesLoading(false);
  };

  const loadProducts = async (categoryId: string, page: number = 1, append: boolean = false) => {
    setProductsLoading(true);
    try {
      const res = await fetch(`/api/mobilesentrix/products?categoryId=${categoryId}&page=${page}&pageSize=50`);
      if (res.ok) {
        const data = await res.json();
        const newProducts = data.products || [];
        if (append) {
          setProducts(prev => [...prev, ...newProducts]);
        } else {
          setProducts(newProducts);
          setSelectedProducts(new Set()); // Clear selection on new category
        }
        setHasMore(newProducts.length === 50);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    }
    setProductsLoading(false);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      loadProducts(categoryId, 1, false);
    } else {
      setProducts([]);
      setSelectedProducts(new Set());
    }
  };

  const loadMore = () => {
    if (selectedCategory && hasMore && !productsLoading) {
      loadProducts(selectedCategory, currentPage + 1, true);
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

  const selectAll = () => {
    const visibleProducts = filteredProducts.map(p => p.entity_id);
    setSelectedProducts(new Set(visibleProducts));
  };

  const deselectAll = () => {
    setSelectedProducts(new Set());
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

    setLoading(true);
    setImportResult(null);
    setImportProgress({ current: 0, total: selectedProducts.size });
    
    const productsToImport = products.filter(p => selectedProducts.has(p.entity_id));
    const imported = [];
    const errors = [];

    // Import one by one to show progress
    for (let i = 0; i < productsToImport.length; i++) {
      const product = productsToImport[i];
      setImportProgress({ current: i + 1, total: productsToImport.length });
      
      try {
        const res = await fetch('/api/mobilesentrix/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            products: [{
              entity_id: product.entity_id,
              sku: product.sku,
              name: product.name,
              price: product.price,
              stock_qty: product.stock_qty,
              is_in_stock: product.is_in_stock,
              image_url: product.image_url,
            }],
            priceMarkup: priceMarkup,
            autoPublish: autoPublish,
          }),
        });
        
        const data = await res.json();
        if (data.success) {
          imported.push(product);
        } else {
          errors.push({ sku: product.sku, error: data.error });
        }
      } catch (error: any) {
        errors.push({ sku: product.sku, error: error.message });
      }
    }
    
    setImportResult({
      success: errors.length === 0,
      message: `${imported.length} producten geïmporteerd${errors.length > 0 ? ` (${errors.length} fouten)` : ''}`,
      imported: imported.length,
      errors: errors.length,
      errorDetails: errors,
    });
    
    if (imported.length > 0) {
      loadStats();
      // Clear selection after successful import
      setSelectedProducts(new Set());
    }
    
    setLoading(false);
    setImportProgress(null);
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

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Package size={18} />
              <span className="text-sm">Totaal Geïmporteerd</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.total_imported}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <CheckCircle size={18} />
              <span className="text-sm">Gepubliceerd</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.published}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center gap-2 text-orange-600 mb-1">
              <Settings size={18} />
              <span className="text-sm">Drafts</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.drafts}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <RefreshCw size={18} />
              <span className="text-sm">Sync 24u</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.synced_last_24h}</p>
          </div>
        </div>
      )}

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
              <>
                <RefreshCw size={18} className="animate-spin" />
                Verbinden...
              </>
            ) : (
              <>
                <ExternalLink size={18} />
                Test Verbinding
              </>
            )}
          </button>
          {testResult !== null && (
            <div className={`mt-3 p-3 rounded-lg flex items-center gap-2 ${testResult ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {testResult ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span className="text-sm font-medium">
                {testResult ? 'Verbinding succesvol!' : 'Verbinding mislukt. Check je API key.'}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selecteer Categorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                disabled={categoriesLoading}
              >
                <option value="">{categoriesLoading ? 'Laden...' : 'Kies een categorie'}</option>
                {categories.map((cat) => (
                  <option key={cat.entity_id} value={cat.entity_id}>
                    {cat.name} {cat.children_count > 0 && `(${cat.children_count} subcategorieën)`}
                  </option>
                ))}
              </select>
            </div>

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

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoPublish"
                checked={autoPublish}
                onChange={(e) => setAutoPublish(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="autoPublish" className="text-sm text-gray-700">
                Automatisch publiceren (anders als draft importeren)
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Products Selection */}
      {selectedCategory && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Package size={18} />
              Producten ({filteredProducts.length} van {products.length})
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={selectAll}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Selecteer alles
              </button>
              <button
                onClick={deselectAll}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
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

          {/* Selected count */}
          {selectedProducts.size > 0 && (
            <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg">
              <span className="font-medium">{selectedProducts.size}</span> producten geselecteerd voor import
            </div>
          )}

          {/* Products grid */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {productsLoading ? 'Producten laden...' : 'Geen producten gevonden'}
              </p>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.entity_id}
                  onClick={() => toggleProductSelection(product.entity_id)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedProducts.has(product.entity_id)
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedProducts.has(product.entity_id)}
                    onChange={() => toggleProductSelection(product.entity_id)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 object-contain bg-white rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{product.name}</p>
                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">${parseFloat(product.price).toFixed(2)}</p>
                    <p className={`text-sm ${product.is_in_stock ? 'text-green-600' : 'text-red-600'}`}>
                      {product.is_in_stock ? `✓ ${product.stock_qty} op voorraad` : '✗ Niet op voorraad'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Load more */}
          {hasMore && !searchQuery && (
            <button
              onClick={loadMore}
              disabled={productsLoading}
              className="w-full mt-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {productsLoading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Laden...
                </>
              ) : (
                <>
                  <ChevronDown size={18} />
                  Meer producten laden
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Import Button */}
      {selectedCategory && (
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
                Importeer {selectedProducts.size} Producten
              </>
            )}
          </button>

          {importResult && (
            <div className={`mt-4 p-4 rounded-lg ${importResult.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              <div className="flex items-start gap-2">
                {importResult.error ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                <div>
                  <p className="font-medium">
                    {importResult.error ? 'Import Mislukt' : importResult.message}
                  </p>
                  {importResult.imported !== undefined && (
                    <p className="text-sm mt-1">
                      {importResult.imported} producten geïmporteerd
                      {importResult.errors > 0 && ` (${importResult.errors} fouten)`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Imports */}
      {recentImports.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Recent Geïmporteerde Producten</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Naam</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">SKU</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Prijs</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Voorraad</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentImports.slice(0, 10).map((product) => (
                  <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2 px-3 text-sm">{product.name}</td>
                    <td className="py-2 px-3 text-sm font-mono text-gray-500">{product.sku}</td>
                    <td className="py-2 px-3 text-sm">€{product.price}</td>
                    <td className="py-2 px-3 text-sm">{product.stock}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {product.status === 'active' ? 'Gepubliceerd' : 'Draft'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
