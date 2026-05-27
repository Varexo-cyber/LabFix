'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Locale, translations } from '@/lib/translations';
import { CartItem, Product, User, getCart, addToCart as storeAddToCart, removeFromCart as storeRemoveFromCart, updateCartQuantity as storeUpdateCartQuantity, getCartCount, getCartTotal, getCurrentUser, logoutUser as storeLogoutUser, saveCart } from '@/lib/store';

type Currency = 'EUR' | 'USD' | 'GBP';
export type VatMode = 'excl' | 'incl';
export const VAT_RATE = 0.21;

interface AppContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
  // Returns the numeric price for display based on current vat mode.
  // Input price is ALWAYS the gross (incl. BTW) price as stored in the DB.
  displayPrice: (inclPrice: number) => number;
  vatMode: VatMode;
  setVatMode: (mode: VatMode) => void;
  t: (key: string) => string;
  cart: CartItem[];
  cartCount: number;
  cartTotal: number; // sum of incl-BTW prices (what customer pays)
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
  const [vatMode, setVatModeState] = useState<VatMode>('excl'); // default: show prices EXCL BTW
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    // Auto-detect language based on domain: labfix.nl = NL, labfix.eu = EN
    const hostname = window.location.hostname;
    let domainLocale: Locale | null = null;
    if (hostname.endsWith('.eu') || hostname.endsWith('.com')) {
      domainLocale = 'en';
    } else if (hostname.endsWith('.nl')) {
      domainLocale = 'nl';
    }

    // Domain-based locale takes priority; fallback to saved preference
    const savedLocale = localStorage.getItem('labfix_locale') as Locale;
    const effectiveLocale = domainLocale || (savedLocale && (savedLocale === 'nl' || savedLocale === 'en') ? savedLocale : 'nl');
    setLocaleState(effectiveLocale);
    localStorage.setItem('labfix_locale', effectiveLocale);

    const savedCurrency = localStorage.getItem('labfix_currency') as Currency;
    if (savedCurrency && ['EUR', 'USD', 'GBP'].includes(savedCurrency)) {
      setCurrencyState(savedCurrency);
    }
    const savedVatMode = localStorage.getItem('labfix_vat_mode') as VatMode;
    if (savedVatMode === 'excl' || savedVatMode === 'incl') {
      setVatModeState(savedVatMode);
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

  const setVatMode = (mode: VatMode) => {
    setVatModeState(mode);
    localStorage.setItem('labfix_vat_mode', mode);
  };

  // DB stores incl-BTW (gross) prices. Excl mode = gross / 1.21.
  const displayPrice = useCallback((inclPrice: number): number => {
    if (vatMode === 'incl') return inclPrice;
    return inclPrice / (1 + VAT_RATE);
  }, [vatMode]);

  const formatPrice = useCallback((price: number): string => {
    // Input prices are stored as incl-BTW (gross) in EUR.
    // Adjust for current VAT mode first, then convert currency.
    const rates: Record<Currency, number> = {
      EUR: 1,      // EUR base
      USD: 1.09,   // EUR to USD
      GBP: 0.86,   // EUR to GBP
    };
    const symbols: Record<Currency, string> = {
      EUR: '€',
      USD: '$',
      GBP: '£'
    };
    const vatAdjusted = vatMode === 'incl' ? price : price / (1 + VAT_RATE);
    const converted = vatAdjusted * rates[currency];
    const symbol = symbols[currency];
    return `${symbol}${converted.toFixed(2)}`;
  }, [currency, vatMode]);

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
        displayPrice,
        vatMode,
        setVatMode,
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
