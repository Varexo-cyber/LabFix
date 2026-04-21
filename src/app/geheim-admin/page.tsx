'use client';

import React, { useState, useEffect } from 'react';
import { Product, Category, fetchProducts, fetchCategories, createProduct, updateProduct, deleteProduct, isAdminAuthenticated, adminLogin, adminLogout, fetchOrders, Order, updateOrderStatusApi, OrderStatus, fetchUsers, User, sendEmailApi, initDatabase, NewsArticle, fetchNews, createNews, updateNews, deleteNews, ContactMessage, fetchContactMessages, updateContactMessage, deleteContactMessage, RepairAppointment, RepairStatus, fetchRepairAppointments, updateRepairAppointment, deleteRepairAppointment } from '@/lib/store';
import { Plus, Pencil, Trash2, LogOut, Save, X, Eye, Package, ShoppingCart, Lock, ClipboardList, Users, Mail, Send, ChevronDown, Database, Upload, Newspaper, MessageCircle, CheckCircle, Archive, Wrench } from 'lucide-react';
import ImageSlideshow from '@/components/ImageSlideshow';
import Link from 'next/link';
import { brandCategories, getAllCategoryOptions } from '@/lib/categories';

const emptyProduct: Omit<Product, 'id' | 'createdAt'> = {
  name: '',
  nameEn: '',
  description: '',
  descriptionEn: '',
  price: 0,
  comparePrice: undefined,
  category: 'apple',
  subcategory: '',
  model: '',
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
  const [activeTab, setActiveTab] = useState<'products' | 'repairs' | 'orders' | 'customers' | 'newsletter' | 'news' | 'contact'>('products');
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [creatingNews, setCreatingNews] = useState(false);
  const [newsForm, setNewsForm] = useState({ title: '', titleEn: '', summary: '', summaryEn: '', content: '', contentEn: '', image: '', images: [] as string[], published: true });
  const [uploadingNewsImage, setUploadingNewsImage] = useState(false);
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
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [contactFilter, setContactFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [messageNotes, setMessageNotes] = useState('');
  
  // Repair appointments state
  const [repairAppointments, setRepairAppointments] = useState<RepairAppointment[]>([]);
  const [repairFilter, setRepairFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'completed'>('all');
  const [selectedRepair, setSelectedRepair] = useState<RepairAppointment | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [repairStatus, setRepairStatus] = useState<RepairStatus>('pending');

  const loadRepairAppointments = async () => {
    const result = await fetchRepairAppointments(repairFilter === 'all' ? undefined : repairFilter);
    if (result.success) {
      setRepairAppointments(result.appointments);
    }
  };

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
    if (activeTab === 'contact') {
      loadContactMessages();
    }
    if (activeTab === 'repairs') {
      loadRepairAppointments();
    }
  }, [activeTab]);

  const loadContactMessages = async () => {
    const result = await fetchContactMessages(contactFilter === 'all' ? undefined : contactFilter);
    setContactMessages(result.data);
  };

  const loadData = async () => {
    try {
      const [prods, cats, ords, usrs, news] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchOrders(),
        fetchUsers(),
        fetchNews(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setOrders(ords);
      setUsers(usrs);
      setNewsArticles(news);
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

  // Repair appointment handlers
  const handleApproveRepair = async (id: string) => {
    try {
      await updateRepairAppointment(id, { status: 'approved' });
      const result = await fetchRepairAppointments();
      if (result.success) {
        setRepairAppointments(result.appointments);
      }
    } catch {
      alert('Reparatie goedkeuren mislukt');
    }
  };

  const handleRejectRepair = async (id: string) => {
    if (!rejectionReason.trim()) {
      alert('Geef een reden voor afwijzing');
      return;
    }
    try {
      await updateRepairAppointment(id, { status: 'rejected', rejectionReason });
      setRejectionReason('');
      setSelectedRepair(null);
      const result = await fetchRepairAppointments();
      if (result.success) {
        setRepairAppointments(result.appointments);
      }
    } catch {
      alert('Reparatie afwijzen mislukt');
    }
  };

  const handleDeleteRepair = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze reparatie wilt verwijderen?')) return;
    try {
      await deleteRepairAppointment(id);
      const result = await fetchRepairAppointments();
      if (result.success) {
        setRepairAppointments(result.appointments);
      }
    } catch {
      alert('Reparatie verwijderen mislukt');
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
            <button onClick={() => setActiveTab('repairs')} className={`px-5 py-3 text-sm font-medium rounded-t-lg flex items-center gap-2 transition-colors ${activeTab === 'repairs' ? 'bg-gray-100 text-gray-800' : 'text-blue-200 hover:text-white'}`}>
              <Wrench size={16} /> Reparaties
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
            <button onClick={() => setActiveTab('news')} className={`px-5 py-3 text-sm font-medium rounded-t-lg flex items-center gap-2 transition-colors ${activeTab === 'news' ? 'bg-gray-100 text-gray-800' : 'text-blue-200 hover:text-white'}`}>
              <Newspaper size={16} /> Nieuws ({newsArticles.length})
            </button>
            <button onClick={() => setActiveTab('contact')} className={`px-5 py-3 text-sm font-medium rounded-t-lg flex items-center gap-2 transition-colors ${activeTab === 'contact' ? 'bg-gray-100 text-gray-800' : 'text-blue-200 hover:text-white'}`}>
              <MessageCircle size={16} /> Contact ({contactMessages.filter(m => m.status === 'unread').length})
            </button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in-up delay-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3 transition-all duration-500 ease-in-out">
            <Package className="text-primary-500" size={24} />
            <div>
              <p className="text-2xl font-bold">{products.length}</p>
              <p className="text-sm text-gray-500">Producten</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3 transition-all duration-500 ease-in-out">
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Merk *</label>
                    <select 
                      value={formData.category.split('/')[0] || formData.category} 
                      onChange={(e) => {
                        const brand = e.target.value;
                        const firstSub = brandCategories.find(b => b.slug === brand)?.subcategories[0]?.slug || '';
                        setFormData({ ...formData, category: brand, subcategory: firstSub });
                      }}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500">
                      {brandCategories.map((brand) => (
                        <option key={brand.slug} value={brand.slug}>{brand.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Productlijn *</label>
                    <select 
                      value={formData.subcategory || ''} 
                      onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500">
                      <option value="">-- Kies productlijn --</option>
                      {(brandCategories.find(b => b.slug === (formData.category.split('/')[0] || formData.category))?.subcategories || []).map((sub) => (
                        <option key={sub.slug} value={sub.slug}>{sub.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Model</label>
                    <select 
                      value={formData.model || ''} 
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500">
                      <option value="">-- Optioneel --</option>
                      {(() => {
                        const brand = brandCategories.find(b => b.slug === (formData.category.split('/')[0] || formData.category));
                        const sub = brand?.subcategories.find(s => s.slug === formData.subcategory);
                        return (sub?.models || []).map((model) => (
                          <option key={model.slug} value={model.slug}>{model.name}</option>
                        ));
                      })()}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">SKU *</label>
                    <input type="text" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500" placeholder="LF-IP15P-OLED-001" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Product Foto's</label>
                  
                  {/* Slideshow Preview */}
                  {formData.images && formData.images.length > 0 && (
                    <div className="mb-4">
                      <ImageSlideshow 
                        images={formData.images} 
                        alt={formData.name}
                        className="h-64 w-full"
                        showThumbnails={true}
                      />
                    </div>
                  )}
                  
                  {/* Upload Button */}
                  <div className="flex items-center gap-3 mb-3">
                    <label className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors cursor-pointer">
                      <Upload size={16} />
                      <span>{uploadingImage ? 'Uploaden...' : 'Foto toevoegen'}</span>
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
                              // Add new image to images array
                              setFormData(prev => ({
                                ...prev,
                                images: [...(prev.images || []), data.url]
                              }));
                            } else {
                              alert('Upload mislukt: ' + data.error);
                            }
                          } catch {
                            alert('Upload mislukt - Controleer of de upload map bestaat');
                          } finally {
                            setUploadingImage(false);
                          }
                        }}
                      />
                    </label>
                    <span className="text-sm text-gray-500">PNG, JPG, GIF (max 5MB)</span>
                  </div>
                  
                  {/* Manual URL Input */}
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={formData.image || ''}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500 text-sm" 
                      placeholder="Of plak een URL..." 
                    />
                    <button
                      onClick={() => {
                        if (formData.image) {
                          setFormData(prev => ({
                            ...prev,
                            images: [...(prev.images || []), prev.image || ''],
                            image: ''
                          }));
                        }
                      }}
                      className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                      Toevoegen
                    </button>
                  </div>
                  
                  {/* Thumbnail Grid */}
                  {formData.images && formData.images.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">{formData.images.length} foto(s)</p>
                      <div className="flex gap-2 flex-wrap">
                        {formData.images.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <img src={img} alt={`Foto ${idx + 1}`} className="w-20 h-20 object-cover rounded-lg border" />
                            <button
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  images: prev.images?.filter((_, i) => i !== idx) || []
                                }));
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
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
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {u.customerType === 'business' ? (
                          <>
                            {u.companyName}
                            <div className="text-xs text-gray-500">{u.contactPerson}</div>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">Zakelijk</span>
                          </>
                        ) : (
                          <>
                            {u.firstName} {u.lastName}
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">Particulier</span>
                          </>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{u.kvkNumber || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{u.phone || '-'}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Verwijderen
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

        {/* NEWS TAB */}
        {activeTab === 'news' && (
          <div className="max-w-7xl mx-auto px-4 pb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Nieuwsartikelen</h2>
              <button
                onClick={() => { setCreatingNews(true); setEditingNews(null); setNewsForm({ title: '', titleEn: '', summary: '', summaryEn: '', content: '', contentEn: '', image: '', images: [], published: true }); }}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-600"
              >
                <Plus size={18} /> Nieuw Artikel
              </button>
            </div>

            {(creatingNews || editingNews) && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-primary-500">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">{editingNews ? 'Artikel Bewerken' : 'Nieuw Artikel'}</h3>
                  <button onClick={() => { setCreatingNews(false); setEditingNews(null); }} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Titel (NL) *</label>
                      <input type="text" value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500" placeholder="Nieuw product gelanceerd" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Title (EN)</label>
                      <input type="text" value={newsForm.titleEn} onChange={(e) => setNewsForm({ ...newsForm, titleEn: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500" placeholder="New product launched" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Samenvatting (NL)</label>
                      <textarea value={newsForm.summary} onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
                        rows={2} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500" placeholder="Korte samenvatting..." />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Summary (EN)</label>
                      <textarea value={newsForm.summaryEn} onChange={(e) => setNewsForm({ ...newsForm, summaryEn: e.target.value })}
                        rows={2} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500" placeholder="Short summary..." />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Inhoud (NL)</label>
                      <textarea value={newsForm.content} onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                        rows={5} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500" placeholder="Volledige artikelinhoud..." />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Content (EN)</label>
                      <textarea value={newsForm.contentEn} onChange={(e) => setNewsForm({ ...newsForm, contentEn: e.target.value })}
                        rows={5} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500" placeholder="Full article content..." />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Afbeelding URL</label>
                      <input type="text" value={newsForm.image} onChange={(e) => setNewsForm({ ...newsForm, image: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500" placeholder="https://..." />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={newsForm.published} onChange={(e) => setNewsForm({ ...newsForm, published: e.target.checked })}
                          className="w-4 h-4 text-primary-500 rounded" />
                        <span className="text-sm font-semibold">Gepubliceerd</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        if (!newsForm.title) { alert('Vul een titel in'); return; }
                        if (editingNews) {
                          await updateNews({ ...editingNews, ...newsForm });
                        } else {
                          await createNews(newsForm);
                        }
                        const articles = await fetchNews();
                        setNewsArticles(articles);
                        setCreatingNews(false);
                        setEditingNews(null);
                      }}
                      className="bg-primary-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-600 flex items-center gap-2"
                    >
                      <Save size={16} /> {editingNews ? 'Opslaan' : 'Aanmaken'}
                    </button>
                    <button onClick={() => { setCreatingNews(false); setEditingNews(null); }}
                      className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">Annuleren</button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Titel</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Samenvatting</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Datum</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Acties</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {newsArticles.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Geen nieuwsartikelen. Maak je eerste artikel aan!</td></tr>
                  ) : newsArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {article.image && <img src={article.image} alt="" className="w-12 h-8 object-cover rounded" />}
                          <span className="font-medium text-sm">{article.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{article.summary}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${article.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {article.published ? 'Gepubliceerd' : 'Concept'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{new Date(article.createdAt).toLocaleDateString('nl-NL')}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            setEditingNews(article);
                            setCreatingNews(false);
                            setNewsForm({
                              title: article.title, titleEn: article.titleEn,
                              summary: article.summary, summaryEn: article.summaryEn,
                              content: article.content, contentEn: article.contentEn,
                              image: article.image || '', 
                              images: (article as any).images || [],
                              published: article.published,
                            });
                          }}
                          className="text-primary-500 hover:text-primary-700 mr-2"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={async () => {
                            if (!confirm('Weet je zeker dat je dit artikel wilt verwijderen?')) return;
                            await deleteNews(article.id);
                            const articles = await fetchNews();
                            setNewsArticles(articles);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REPAIRS TAB */}
        {activeTab === 'repairs' && (
          <div className="max-w-7xl mx-auto px-4 pb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Wrench className="text-primary-600" /> Reparatie Afspraken
              </h2>
              <div className="flex gap-2">
                {(['all', 'pending', 'approved', 'rejected', 'completed'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setRepairFilter(filter)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      repairFilter === filter
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {filter === 'all' ? 'Alle' : 
                     filter === 'pending' ? 'Nieuw' :
                     filter === 'approved' ? 'Goedgekeurd' :
                     filter === 'rejected' ? 'Afgewezen' : 'Afgerond'}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Repairs Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Datum</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Klant</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Apparaat</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Foto's</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {repairAppointments
                    .filter(r => repairFilter === 'all' || r.status === repairFilter)
                    .map((repair) => (
                    <tr key={repair.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(repair.appointmentDate).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="text-xs text-gray-500">{repair.appointmentTime}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{repair.name}</div>
                        <div className="text-xs text-gray-500">{repair.email}</div>
                        <div className="text-xs text-gray-400">{repair.phone}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">{repair.deviceType} {repair.deviceModel}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">{repair.problemDescription}</div>
                      </td>
                      <td className="px-4 py-3">
                        {repair.attachments && repair.attachments.length > 0 ? (
                          <div className="flex gap-1">
                            {repair.attachments.slice(0, 3).map((url, idx) => (
                              <a 
                                key={idx}
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="relative"
                              >
                                <img 
                                  src={url} 
                                  alt={`Attachment ${idx + 1}`}
                                  className="w-10 h-10 object-cover rounded border hover:opacity-80 transition-opacity"
                                />
                              </a>
                            ))}
                            {repair.attachments.length > 3 && (
                              <span className="text-xs text-gray-500 flex items-center">
                                +{repair.attachments.length - 3}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          repair.serviceType === 'bring_in' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {repair.serviceType === 'bring_in' ? 'Langs brengen' : 'Opsturen'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          repair.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          repair.status === 'approved' ? 'bg-green-100 text-green-800' :
                          repair.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {repair.status === 'pending' ? 'Nieuw' :
                           repair.status === 'approved' ? 'Goedgekeurd' :
                           repair.status === 'rejected' ? 'Afgewezen' : 'Afgerond'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleApproveRepair(repair.id)}
                            disabled={repair.status !== 'pending'}
                            className="p-1 text-green-600 hover:bg-green-50 rounded disabled:text-gray-300 disabled:cursor-not-allowed"
                            title="Goedkeuren"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => handleRejectRepair(repair.id)}
                            disabled={repair.status !== 'pending'}
                            className="p-1 text-red-600 hover:bg-red-50 rounded disabled:text-gray-300 disabled:cursor-not-allowed"
                            title="Afkeuren"
                          >
                            <X size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteRepair(repair.id)}
                            className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                            title="Verwijderen"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {repairAppointments.filter(r => repairFilter === 'all' || r.status === repairFilter).length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Wrench size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Geen reparatie afspraken gevonden</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CONTACT MESSAGES TAB */}
        {activeTab === 'contact' && (
          <div className="max-w-7xl mx-auto px-4 pb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Contact Berichten</h2>
              <div className="flex gap-2">
                {(['all', 'unread', 'read', 'replied'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => { setContactFilter(filter); loadContactMessages(); }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      contactFilter === filter 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filter === 'all' ? 'Alle' : filter === 'unread' ? 'Ongelezen' : filter === 'read' ? 'Gelezen' : 'Beantwoord'}
                  </button>
                ))}
              </div>
            </div>

            {selectedMessage ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{selectedMessage.subject}</h3>
                    <p className="text-sm text-gray-500">
                      Van: {selectedMessage.name} ({selectedMessage.email})
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(selectedMessage.created_at).toLocaleString('nl-NL')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedMessage.status === 'unread' ? 'bg-red-100 text-red-700' :
                      selectedMessage.status === 'read' ? 'bg-blue-100 text-blue-700' :
                      selectedMessage.status === 'replied' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedMessage.status === 'unread' ? 'Ongelezen' :
                       selectedMessage.status === 'read' ? 'Gelezen' :
                       selectedMessage.status === 'replied' ? 'Beantwoord' : 'Gearchiveerd'}
                    </span>
                    <button onClick={() => setSelectedMessage(null)} className="text-gray-400 hover:text-gray-600">
                      <X size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Admin Notities</label>
                  <textarea
                    value={messageNotes}
                    onChange={(e) => setMessageNotes(e.target.value)}
                    rows={3}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500"
                    placeholder="Interne notities over dit bericht..."
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={async () => {
                      await updateContactMessage(selectedMessage.id, { status: 'read', admin_notes: messageNotes });
                      loadContactMessages();
                      setSelectedMessage(null);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
                  >
                    <CheckCircle size={16} /> Markeer als gelezen
                  </button>
                  <button
                    onClick={async () => {
                      await updateContactMessage(selectedMessage.id, { status: 'replied', admin_notes: messageNotes });
                      loadContactMessages();
                      setSelectedMessage(null);
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
                  >
                    <Mail size={16} /> Markeer als beantwoord
                  </button>
                  <button
                    onClick={async () => {
                      await updateContactMessage(selectedMessage.id, { status: 'archived', admin_notes: messageNotes });
                      loadContactMessages();
                      setSelectedMessage(null);
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center gap-2"
                  >
                    <Archive size={16} /> Archiveer
                  </button>
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 flex items-center gap-2"
                  >
                    <Mail size={16} /> Beantwoord via email
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Naam</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Onderwerp</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Bericht</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Datum</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Acties</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {contactMessages.length === 0 ? (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Geen contact berichten.</td></tr>
                    ) : contactMessages.map((message) => (
                      <tr 
                        key={message.id} 
                        className={`hover:bg-gray-50 cursor-pointer ${message.status === 'unread' ? 'bg-red-50/50' : ''}`}
                        onClick={() => { setSelectedMessage(message); setMessageNotes(message.admin_notes || ''); }}
                      >
                        <td className="px-4 py-3">
                          <span className={`inline-block w-2 h-2 rounded-full ${
                            message.status === 'unread' ? 'bg-red-500' :
                            message.status === 'read' ? 'bg-blue-500' :
                            message.status === 'replied' ? 'bg-green-500' :
                            'bg-gray-400'
                          }`}></span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-sm">{message.name}</p>
                          <p className="text-xs text-gray-500">{message.email}</p>
                        </td>
                        <td className="px-4 py-3 text-sm">{message.subject}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{message.message}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{new Date(message.created_at).toLocaleDateString('nl-NL')}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (!confirm('Weet je zeker dat je dit bericht wilt verwijderen?')) return;
                              await deleteContactMessage(message.id);
                              loadContactMessages();
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
