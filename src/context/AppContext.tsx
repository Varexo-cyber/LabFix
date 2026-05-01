'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Locale, translations } from '@/lib/translations';
import { CartItem, Product, User, getCart, addToCart as storeAddToCart, removeFromCart as storeRemoveFromCart, updateCartQuantity as storeUpdateCartQuantity, getCartCount, getCartTotal, getCurrentUser, logoutUser as storeLogoutUser, saveCart } from '@/lib/store';

type Currency = 'EUR' | 'USD' | 'GBP';

interface AppContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
  t: (key: string) => string;
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  refreshCart: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('nl');
  const [currency, setCurrencyState] = useState<Currency>('EUR');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    const savedLocale = localStorage.getItem('labfix_locale') as Locale;
    const savedCurrency = localStorage.getItem('labfix_currency') as Currency;
    if (savedLocale && (savedLocale === 'nl' || savedLocale === 'en')) {
      setLocaleState(savedLocale);
    }
    if (savedCurrency && ['EUR', 'USD', 'GBP'].includes(savedCurrency)) {
      setCurrencyState(savedCurrency);
    }
    setCart(getCart());
    setUserState(getCurrentUser());
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('labfix_locale', newLocale);
  };

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('labfix_currency', newCurrency);
  };

  const formatPrice = useCallback((price: number): string => {
    // API returns prices in USD - convert to target currency
    const rates: Record<Currency, number> = {
      EUR: 0.92,  // USD to EUR
      USD: 1,     // USD to USD (base)
      GBP: 0.79   // USD to GBP
    };
    const symbols: Record<Currency, string> = {
      EUR: '€',
      USD: '$',
      GBP: '£'
    };
    const converted = price * rates[currency];
    const symbol = symbols[currency];
    return `${symbol}${converted.toFixed(2)}`;
  }, [currency]);

  const t = useCallback((key: string): string => {
    return translations[locale][key] || key;
  }, [locale]);

  const addToCartHandler = (product: Product, quantity: number = 1) => {
    const updated = storeAddToCart(product, quantity);
    setCart([...updated]);
  };

  const removeFromCartHandler = (productId: string) => {
    const updated = storeRemoveFromCart(productId);
    setCart([...updated]);
  };

  const updateQuantityHandler = (productId: string, quantity: number) => {
    const updated = storeUpdateCartQuantity(productId, quantity);
    setCart([...updated]);
  };

  const clearCart = () => {
    saveCart([]);
    setCart([]);
  };

  const refreshCart = () => {
    setCart(getCart());
  };

  const setUser = (u: User | null) => {
    setUserState(u);
  };

  const logout = () => {
    storeLogoutUser();
    setUserState(null);
  };

  return (
    <AppContext.Provider
      value={{
        locale,
        setLocale,
        currency,
        setCurrency,
        formatPrice,
        t,
        cart,
        cartCount: getCartCount(cart),
        cartTotal: getCartTotal(cart),
        addToCart: addToCartHandler,
        removeFromCart: removeFromCartHandler,
        updateQuantity: updateQuantityHandler,
        clearCart,
        refreshCart,
        user,
        setUser,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
