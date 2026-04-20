'use client';

import React, { useState, useEffect } from 'react';
import { Product, Category, fetchProducts, fetchCategories, createProduct, updateProduct, deleteProduct, isAdminAuthenticated, adminLogin, adminLogout, fetchOrders, Order, updateOrderStatusApi, OrderStatus, fetchUsers, User, sendEmailApi, initDatabase } from '@/lib/store';
import { Plus, Pencil, Trash2, LogOut, Save, X, Eye, Package, ShoppingCart, Lock, ClipboardList, Users, Mail, Send, ChevronDown, Database, Upload } from 'lucide-react';
import Link from 'next/link';

const emptyProduct: Omit<Product, 'id' | 'createdAt'> = {
  name: '',
  nameEn: '',
  description: '',
  descriptionEn: '',
  price: 0,
  comparePrice: undefined,
  category: 'iphone',
  subcategory: '',
  sku: '',
  image: '',
  images: [],
  inStock: true,
  featured: false,
  isNew: false,
};

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState(emptyProduct);
  const [filterCategory, setFilterCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'customers' | 'newsletter'>('products');
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [emailMessage, setEmailMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [subscribers, setSubscribers] = useState<{id: string, email: string, company_name: string, subscribed_at: string}[]>([]);
  const [newsletterSubject, setNewsletterSubject] = useState('');
  const [newsletterBody, setNewsletterBody] = useState('');
  const [sendingNewsletter, setSendingNewsletter] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    setAuthenticated(isAdminAuthenticated());
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === 'newsletter') {
      fetch('/api/newsletter')
        .then(res => res.ok ? res.json() : [])
        .then(data => setSubscribers(data))
        .catch(() => console.error('Failed to load subscribers'));
    }
  }, [activeTab]);

  const loadData = async () => {
    try {
      const [prods, cats, ords, usrs] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchOrders(),
        fetchUsers(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setOrders(ords);
      setUsers(usrs);
      setDbInitialized(true);
    } catch {
      setDbInitialized(false);
    }
  };

  const handleInitDb = async () => {
    const result = await initDatabase();
    if (result.success) {
      setDbInitialized(true);
      loadData();
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(password)) {
      setAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Verkeerd wachtwoord');
    }
  };

  const handleLogout = () => {
    adminLogout();
    setAuthenticated(false);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.sku) {
      alert('Vul naam, prijs en SKU in');
      return;
    }

    if (editing) {
      await updateProduct({ ...editing, ...formData, price: Number(formData.price), comparePrice: formData.comparePrice ? Number(formData.comparePrice) : undefined });
    } else {
      await createProduct({ ...formData, price: Number(formData.price), comparePrice: formData.comparePrice ? Number(formData.comparePrice) : undefined });
    }

    const prods = await fetchProducts();
    setProducts(prods);
    setEditing(null);
    setCreating(false);
    setFormData(emptyProduct);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je dit product wilt verwijderen?')) return;
    await deleteProduct(id);
    const prods = await fetchProducts();
    setProducts(prods);
  };

  const startEdit = (product: Product) => {
    setEditing(product);
    setCreating(false);
    setFormData({
      name: product.name,
      nameEn: product.nameEn,
      description: product.description,
      descriptionEn: product.descriptionEn,
      price: product.price,
      comparePrice: product.comparePrice,
      category: product.category,
      subcategory: product.subcategory || '',
      sku: product.sku,
      image: product.image,
      images: product.images,
      inStock: product.inStock,
      featured: product.featured,
      isNew: product.isNew,
    });
  };

  const startCreate = () => {
    setCreating(true);
    setEditing(null);
    setFormData(emptyProduct);
  };

  const cancelEdit = () => {
    setEditing(null);
    setCreating(false);
    setFormData(emptyProduct);
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = !filterCategory || p.category === filterCategory;
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <img src="/logo.png" alt="LabFix" className="h-12 w-auto mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-gray-500 text-sm">LabFix Beheer</p>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Wachtwoord"
              className="w-full border rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-primary-500"
              autoFocus
            />
            {loginError && <p className="text-red-500 text-sm mb-4">{loginError}</p>}
            <button type="submit" className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors">
              Inloggen
            </button>
          </form>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatusApi(orderId, status);
    const ords = await fetchOrders();
    setOrders(ords);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status });
    }
  };

  const handleSendEmail = async (order: Order) => {
    if (!emailMessage.trim()) return;
    try {
      await sendEmailApi(order.userEmail, `LabFix - Update bestelling ${order.id}`, emailMessage);
      setEmailSent(true);
      setTimeout(() => { setEmailSent(false); setEmailMessage(''); }, 3000);
    } catch {
      alert('E-mail versturen mislukt');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Weet u zeker dat u deze klant wilt verwijderen? Alle bestellingen van deze klant worden ook verwijderd.')) return;
    try {
      const res = await fetch(`/api/users?id=${userId}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== userId));
        alert('Klant verwijderd');
      } else {
        alert('Verwijderen mislukt');
      }
    } catch {
      alert('Verwijderen mislukt');
    }
  };

  const handleSendNewsletter = async () => {
    if (!newsletterSubject.trim() || !newsletterBody.trim()) {
      alert('Vul onderwerp en bericht in');
      return;
    }
    setSendingNewsletter(true);
    try {
      for (const sub of subscribers) {
        await sendEmailApi(sub.email, newsletterSubject, newsletterBody);
      }
      alert(`Nieuwsbrief verstuurd naar ${subscribers.length} abonnees!`);
      setNewsletterSubject('');
      setNewsletterBody('');
    } catch {
      alert('Nieuwsbrief versturen mislukt');
    } finally {
      setSendingNewsletter(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 animate-fade-in">
      {/* Admin header */}
      <div className="bg-primary-600 text-white animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="LabFix" className="h-8 w-auto brightness-0 invert" />
            <span className="text-sm font-medium text-blue-200">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            {!dbInitialized && (
              <button onClick={handleInitDb} className="flex items-center gap-1 text-sm bg-yellow-500 text-white px-3 py-1.5 rounded-lg hover:bg-yellow-600">
                <Database size={14} /> Database Initialiseren
              </button>
            )}
            <Link href="/" target="_blank" className="flex items-center gap-1 text-sm hover:text-gray-200">
              <Eye size={16} /> Website bekijken
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-1 text-sm hover:text-gray-200">
              <LogOut size={16} /> Uitloggen
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            <button onClick={() => setActiveTab('products')} className={`px-5 py-3 text-sm font-medium rounded-t-lg flex items-center gap-2 transition-colors ${activeTab === 'products' ? 'bg-gray-100 text-gray-800' : 'text-blue-200 hover:text-white'}`}>
              <Package size={16} /> Producten
            </button>
            <button onClick={() => setActiveTab('orders')} className={`px-5 py-3 text-sm font-medium rounded-t-lg flex items-center gap-2 transition-colors ${activeTab === 'orders' ? 'bg-gray-100 text-gray-800' : 'text-blue-200 hover:text-white'}`}>
              <ClipboardList size={16} /> Bestellingen ({orders.length})
            </button>
            <button onClick={() => setActiveTab('customers')} className={`px-5 py-3 text-sm font-medium rounded-t-lg flex items-center gap-2 transition-colors ${activeTab === 'customers' ? 'bg-gray-100 text-gray-800' : 'text-blue-200 hover:text-white'}`}>
              <Users size={16} /> Klanten ({users.length})
            </button>
            <button onClick={() => setActiveTab('newsletter')} className={`px-5 py-3 text-sm font-medium rounded-t-lg flex items-center gap-2 transition-colors ${activeTab === 'newsletter' ? 'bg-gray-100 text-gray-800' : 'text-blue-200 hover:text-white'}`}>
              <Mail size={16} /> Nieuwsbrief
            </button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in-up delay-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
            <Package className="text-primary-500" size={24} />
            <div>
              <p className="text-2xl font-bold">{products.length}</p>
              <p className="text-sm text-gray-500">Producten</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
            <ClipboardList className="text-orange-500" size={24} />
            <div>
              <p className="text-2xl font-bold">{orders.length}</p>
              <p className="text-sm text-gray-500">Bestellingen</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
            <Users className="text-green-500" size={24} />
            <div>
              <p className="text-2xl font-bold">{users.length}</p>
              <p className="text-sm text-gray-500">Klanten</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
            <ShoppingCart className="text-purple-500" size={24} />
            <div>
              <p className="text-2xl font-bold">€{orders.reduce((sum, o) => sum + o.total, 0).toFixed(0)}</p>
              <p className="text-sm text-gray-500">Omzet</p>
            </div>
          </div>
        </div>

        {/* ============= PRODUCTS TAB ============= */}
        {activeTab === 'products' && (<div className="animate-fade-in-up">
        {/* Product Form */}
        {(editing || creating) && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editing ? 'Product Bewerken' : 'Nieuw Product'}</h2>
              <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Naam (NL) *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500" placeholder="iPhone 15 Pro OLED Scherm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Naam (EN)</label>
                  <input type="text" value={formData.nameEn} onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500" placeholder="iPhone 15 Pro OLED Screen" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Beschrijving (NL)</label>
                  <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Beschrijving (EN)</label>
                  <textarea rows={3} value={formData.descriptionEn} onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500 resize-none" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Prijs (€) *</label>
                    <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Vergelijkprijs (€)</label>
                    <input type="number" step="0.01" value={formData.comparePrice || ''} onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Categorie</label>
                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500">
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">SKU *</label>
                    <input type="text" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500" placeholder="LF-IP15P-OLED-001" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Subcategorie</label>
                  <input type="text" value={formData.subcategory} onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500" placeholder="iPhone 15 Pro" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Afbeelding</label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors cursor-pointer">
                      <Upload size={16} />
                      <span>{uploadingImage ? 'Uploaden...' : 'Bestand kiezen'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploadingImage(true);
                          const formData = new FormData();
                          formData.append('file', file);
                          try {
                            const res = await fetch('/api/upload', { method: 'POST', body: formData });
                            const data = await res.json();
                            if (data.success) {
                              setFormData(prev => ({ ...prev, image: data.url }));
                            } else {
                              alert('Upload mislukt: ' + data.error);
                            }
                          } catch {
                            alert('Upload mislukt');
                          } finally {
                            setUploadingImage(false);
                          }
                        }}
                      />
                    </label>
                    <input 
                      type="text" 
                      value={formData.image} 
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500" 
                      placeholder="Of plak een URL..." 
                    />
                  </div>
                  {formData.image && (
                    <img src={formData.image} alt="Preview" className="mt-3 w-32 h-32 object-cover rounded-lg border" />
                  )}
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.inStock} onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })} className="w-4 h-4" />
                    <span className="text-sm">Op voorraad</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4" />
                    <span className="text-sm">Uitgelicht</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isNew} onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })} className="w-4 h-4" />
                    <span className="text-sm">Nieuw</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={cancelEdit} className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors">Annuleren</button>
              <button onClick={handleSave} className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2">
                <Save size={16} /> Opslaan
              </button>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow p-4 mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Zoek producten..." className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500" />
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500">
              <option value="">Alle categorieën</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>
          <button onClick={startCreate} className="bg-accent-500 text-white px-4 py-2 rounded-lg hover:bg-accent-600 transition-colors flex items-center gap-2 text-sm font-semibold">
            <Plus size={16} /> Nieuw Product
          </button>
        </div>

        {/* Products table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Categorie</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Prijs</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Acties</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.image && (
                          <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover" />
                        )}
                        <div>
                          <p className="font-semibold text-sm text-gray-800">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.nameEn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{product.sku}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{product.category}</span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold">€{product.price.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {product.inStock ? (
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        ) : (
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                        <span className="text-xs">{product.inStock ? 'Voorraad' : 'Uitverkocht'}</span>
                        {product.featured && <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">★</span>}
                        {product.isNew && <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">NEW</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => startEdit(product)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors" title="Bewerken">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors" title="Verwijderen">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && (
              <div className="p-8 text-center text-gray-400">Geen producten gevonden</div>
            )}
          </div>
        </div>
        </div>)}

        {/* ============= ORDERS TAB ============= */}
        {activeTab === 'orders' && (
          <div className="animate-fade-in-up">
            {selectedOrder ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Bestelling {selectedOrder.id}</h2>
                  <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-700">Klantgegevens</h3>
                    <div className="text-sm space-y-1">
                      <p><strong>{selectedOrder.companyName}</strong></p>
                      <p>KVK: {selectedOrder.kvkNumber}</p>
                      <p>Contact: {selectedOrder.contactPerson}</p>
                      <p>E-mail: {selectedOrder.userEmail}</p>
                      <p>Telefoon: {selectedOrder.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-700">Verzendadres</h3>
                    <div className="text-sm space-y-1">
                      <p>{selectedOrder.shippingAddress}</p>
                      <p>{selectedOrder.shippingPostalCode} {selectedOrder.shippingCity}</p>
                      <p>{selectedOrder.shippingCountry}</p>
                    </div>
                    <div className="mt-4">
                      <h3 className="font-semibold text-gray-700 mb-2">Status wijzigen</h3>
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                      >
                        <option value="pending">In afwachting</option>
                        <option value="processing">In verwerking</option>
                        <option value="shipped">Verzonden</option>
                        <option value="delivered">Afgeleverd</option>
                        <option value="cancelled">Geannuleerd</option>
                      </select>
                    </div>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-800 text-sm mb-1">Opmerkingen klant:</h3>
                    <p className="text-sm text-yellow-700">{selectedOrder.notes}</p>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-3">Bestelde artikelen</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">Product</th>
                          <th className="px-4 py-2 text-left">SKU</th>
                          <th className="px-4 py-2 text-right">Prijs</th>
                          <th className="px-4 py-2 text-right">Aantal</th>
                          <th className="px-4 py-2 text-right">Totaal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {selectedOrder.items.map((item, i) => (
                          <tr key={i}>
                            <td className="px-4 py-2 flex items-center gap-2">
                              {item.product.image && <img src={item.product.image} alt="" className="w-8 h-8 rounded object-cover" />}
                              {item.product.name}
                            </td>
                            <td className="px-4 py-2">{item.product.sku}</td>
                            <td className="px-4 py-2 text-right">€{item.priceAtPurchase.toFixed(2)}</td>
                            <td className="px-4 py-2 text-right">{item.quantity}</td>
                            <td className="px-4 py-2 text-right font-semibold">€{(item.priceAtPurchase * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-3 text-right space-y-1 text-sm">
                    <p>Subtotaal: €{selectedOrder.subtotal.toFixed(2)}</p>
                    <p>Verzending: {selectedOrder.shippingCost === 0 ? 'Gratis' : `€${selectedOrder.shippingCost.toFixed(2)}`}</p>
                    <p className="text-lg font-bold">Totaal: €{selectedOrder.total.toFixed(2)}</p>
                  </div>
                </div>

                {/* Email section */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><Mail size={18} /> E-mail naar klant</h3>
                  <textarea
                    rows={4}
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    placeholder="Typ hier uw bericht naar de klant..."
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500 resize-none mb-3"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleSendEmail(selectedOrder)}
                      disabled={!emailMessage.trim()}
                      className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={14} /> Verstuur e-mail naar {selectedOrder.userEmail}
                    </button>
                    {emailSent && <span className="text-green-600 text-sm font-medium">✓ E-mail verstuurd!</span>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Bestelling</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Klant</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Datum</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Artikelen</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Totaal</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actie</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-mono font-semibold">{order.id}</td>
                          <td className="px-4 py-3">
                            <p className="text-sm font-semibold">{order.companyName}</p>
                            <p className="text-xs text-gray-400">{order.contactPerson}</p>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString('nl-NL')}</td>
                          <td className="px-4 py-3 text-sm">{order.items.length} artikelen</td>
                          <td className="px-4 py-3 text-sm font-semibold">€{order.total.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                              className={`text-xs px-2 py-1 rounded-full border-0 font-medium ${
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                                order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                'bg-red-100 text-red-700'
                              }`}
                            >
                              <option value="pending">In afwachting</option>
                              <option value="processing">In verwerking</option>
                              <option value="shipped">Verzonden</option>
                              <option value="delivered">Afgeleverd</option>
                              <option value="cancelled">Geannuleerd</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={() => setSelectedOrder(order)} className="text-primary-500 hover:underline text-sm font-medium">
                              Bekijk
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {orders.length === 0 && (
                    <div className="p-8 text-center text-gray-400">Nog geen bestellingen ontvangen</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============= CUSTOMERS TAB ============= */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in-up">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Bedrijf</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">KVK</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">E-mail</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Locatie</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Geregistreerd</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actie</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-sm">{u.companyName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{u.kvkNumber}</td>
                      <td className="px-4 py-3 text-sm">{u.contactPerson}</td>
                      <td className="px-4 py-3 text-sm text-primary-500">{u.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{u.city}, {u.country}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString('nl-NL')}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:text-red-700 p-1">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="p-8 text-center text-gray-400">Nog geen klanten geregistreerd</div>
              )}
            </div>
          </div>
        )}

        {/* Newsletter Tab */}
        {activeTab === 'newsletter' && (
          <div className="max-w-7xl mx-auto px-4 animate-fade-in-up">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Nieuwsbrief</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Subscribers list */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-semibold text-gray-700 mb-4">Abonnees ({subscribers.length})</h3>
                <div className="overflow-y-auto max-h-96">
                  {subscribers.map((sub) => (
                    <div key={sub.id} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium text-sm">{sub.email}</p>
                        <p className="text-xs text-gray-500">{sub.company_name}</p>
                      </div>
                      <span className="text-xs text-gray-400">{new Date(sub.subscribed_at).toLocaleDateString('nl-NL')}</span>
                    </div>
                  ))}
                  {subscribers.length === 0 && (
                    <p className="text-gray-400 text-center py-4">Nog geen abonnees</p>
                  )}
                </div>
              </div>

              {/* Send newsletter form */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-semibold text-gray-700 mb-4">Nieuwsbrief versturen</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Onderwerp</label>
                    <input
                      type="text"
                      value={newsletterSubject}
                      onChange={(e) => setNewsletterSubject(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500"
                      placeholder="Nieuwe producten beschikbaar!"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bericht (HTML)</label>
                    <textarea
                      value={newsletterBody}
                      onChange={(e) => setNewsletterBody(e.target.value)}
                      rows={8}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500"
                      placeholder="<h1>Hallo!</h1><p>We hebben nieuwe producten...</p>"
                    />
                  </div>
                  <button
                    onClick={handleSendNewsletter}
                    disabled={sendingNewsletter || subscribers.length === 0}
                    className="w-full bg-primary-500 text-white py-2 rounded-lg font-semibold hover:bg-primary-600 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Send size={18} />
                    {sendingNewsletter ? 'Versturen...' : `Versturen naar ${subscribers.length} abonnees`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
