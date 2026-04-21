export interface Product {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  comparePrice?: number;
  category: string;
  subcategory?: string;
  model?: string;
  sku: string;
  image: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
  isNew: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  image: string;
  description: string;
  descriptionEn: string;
}

export interface User {
  id: string;
  email: string;
  companyName: string;
  kvkNumber: string;
  contactPerson: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  createdAt: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  product: Product;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  companyName: string;
  kvkNumber: string;
  contactPerson: string;
  phone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  content: string;
  contentEn: string;
  image: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==================== API HELPERS ====================

const API_BASE = typeof window !== 'undefined' ? '' : '';

export async function fetchProducts(params?: Record<string, string>): Promise<Product[]> {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  const res = await fetch(`${API_BASE}/api/products${qs}`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/api/categories`);
  if (!res.ok) return [];
  return res.json();
}

export async function createProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<{ success: boolean; id?: string }> {
  const res = await fetch(`${API_BASE}/api/products`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(product) });
  return res.json();
}

export async function updateProduct(product: Product): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/api/products`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(product) });
  return res.json();
}

export async function deleteProduct(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/api/products?id=${id}`, { method: 'DELETE' });
  return res.json();
}

export async function fetchOrders(userId?: string): Promise<Order[]> {
  const qs = userId ? `?userId=${userId}` : '';
  const res = await fetch(`${API_BASE}/api/orders${qs}`);
  if (!res.ok) return [];
  return res.json();
}

export async function createOrderApi(orderData: any): Promise<{ success: boolean; id?: string }> {
  const res = await fetch(`${API_BASE}/api/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData) });
  return res.json();
}

export async function updateOrderStatusApi(id: string, status: OrderStatus): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/api/orders`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
  return res.json();
}

export async function registerUserApi(userData: any): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/api/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(userData) });
  return res.json();
}

export async function loginUserApi(email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
  const res = await fetch(`${API_BASE}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
  return res.json();
}

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/api/users`);
  if (!res.ok) return [];
  return res.json();
}

export async function sendEmailApi(to: string, subject: string, message: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/api/send-email`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to, subject, message }) });
  return res.json();
}

export async function initDatabase(): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/api/init-db`, { method: 'POST' });
  return res.json();
}

// ==================== NEWS ====================

export async function fetchNews(): Promise<NewsArticle[]> {
  const res = await fetch(`${API_BASE}/api/news`);
  if (!res.ok) return [];
  return res.json();
}

export async function createNews(article: Omit<NewsArticle, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; id?: string }> {
  const res = await fetch(`${API_BASE}/api/news`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(article) });
  return res.json();
}

export async function updateNews(article: NewsArticle): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/api/news`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(article) });
  return res.json();
}

export async function deleteNews(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/api/news?id=${id}`, { method: 'DELETE' });
  return res.json();
}

// ==================== CART (client-side localStorage) ====================

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('labfix_cart');
  if (!stored) return [];
  return JSON.parse(stored);
}

export function saveCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('labfix_cart', JSON.stringify(cart));
}

export function addToCart(product: Product, quantity: number = 1): CartItem[] {
  const cart = getCart();
  const existing = cart.find(item => item.product.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }
  saveCart(cart);
  return cart;
}

export function removeFromCart(productId: string): CartItem[] {
  const cart = getCart().filter(item => item.product.id !== productId);
  saveCart(cart);
  return cart;
}

export function updateCartQuantity(productId: string, quantity: number): CartItem[] {
  const cart = getCart();
  const item = cart.find(item => item.product.id === productId);
  if (item) {
    item.quantity = quantity;
    if (item.quantity <= 0) {
      return removeFromCart(productId);
    }
  }
  saveCart(cart);
  return cart;
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
}

export function getCartCount(cart: CartItem[]): number {
  return cart.reduce((count, item) => count + item.quantity, 0);
}

// ==================== USER SESSION (client-side) ====================

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem('labfix_user');
  if (!stored) return null;
  return JSON.parse(stored);
}

export function setCurrentUser(user: User): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('labfix_user', JSON.stringify(user));
}

export function logoutUser(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('labfix_user');
}

// ==================== ADMIN AUTH ====================

const ADMIN_PASSWORD = 'labfix2026admin';

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem('labfix_admin') === 'true';
}

export function adminLogin(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem('labfix_admin', 'true');
    return true;
  }
  return false;
}

export function adminLogout(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('labfix_admin');
}
