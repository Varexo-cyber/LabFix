'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import ProductCard from '@/components/ProductCard';
import { fetchProducts, Product } from '@/lib/store';
import { Truck, Shield, Headphones, CreditCard, ArrowRight, Smartphone, Wrench, Package, ChevronRight } from 'lucide-react';
import { brandCategories } from '@/lib/categories';

export default function HomePage() {
  const { t, locale } = useApp();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const featuredProducts = products.filter((p) => p.featured);
  const newProducts = products.filter((p) => p.isNew);

  const brandIcons: Record<string, React.ReactNode> = {
    apple: <Smartphone size={36} />,
    samsung: <Smartphone size={36} />,
    google: <Smartphone size={36} />,
    motorola: <Smartphone size={36} />,
    huawei: <Smartphone size={36} />,
    xiaomi: <Smartphone size={36} />,
    oneplus: <Smartphone size={36} />,
    oppo: <Smartphone size={36} />,
    tools: <Wrench size={36} />,
    accessories: <Package size={36} />,
  };

  const homeBrands = brandCategories.filter(b => ['apple', 'samsung', 'google', 'huawei', 'xiaomi', 'tools', 'accessories', 'other-brands'].includes(b.slug));

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white overflow-hidden min-h-[520px] md:min-h-[600px] flex items-center">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-400/15 rounded-full blur-[80px] animate-float"></div>
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-accent-500/10 rounded-full blur-[100px]" style={{ animation: 'float 4s ease-in-out 1s infinite' }}></div>
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-[60px]" style={{ animation: 'float 5s ease-in-out 0.5s infinite' }}></div>
          <div className="absolute -bottom-10 left-1/2 w-80 h-80 bg-primary-300/10 rounded-full blur-[90px]" style={{ animation: 'float 3.5s ease-in-out 1.5s infinite' }}></div>
        </div>

        {/* Grid dots pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 relative z-10 w-full">
          <div className="text-center max-w-3xl mx-auto">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-blue-200 text-sm font-medium px-5 py-2 rounded-full mb-8 border border-white/15">
                <Truck size={14} />
                {locale === 'nl' ? 'B2B Groothandel • Levering heel Europa' : 'B2B Wholesale • Delivery across Europe'}
              </span>
            </div>
            <h1 className="animate-fade-in-up delay-100 text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="animate-fade-in-up delay-200 text-lg md:text-xl mb-10 text-blue-200/80 leading-relaxed max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <div className="animate-fade-in-up delay-300 flex flex-wrap gap-4 justify-center">
              <Link
                href="/products"
                className="bg-accent-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-accent-600 transition-all hover:shadow-xl hover:shadow-accent-500/25 hover:-translate-y-0.5 inline-flex items-center gap-2 text-lg"
              >
                {t('hero.cta')} <ArrowRight size={20} />
              </Link>
              <Link
                href="/contact"
                className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-700 transition-all text-lg backdrop-blur-sm"
              >
                {t('hero.secondary')}
              </Link>
            </div>

            {/* Floating icon pills */}
            <div className="animate-fade-in-up delay-500 mt-14 flex flex-wrap justify-center gap-4">
              {[
                { icon: <Shield size={18} />, label: locale === 'nl' ? 'Hoge Kwaliteit' : 'High Quality' },
                { icon: <Headphones size={18} />, label: locale === 'nl' ? 'Professionele Ondersteuning' : 'Professional Support' },
                { icon: <CreditCard size={18} />, label: locale === 'nl' ? 'Veilig Betalen' : 'Secure Payment' },
                { icon: <Truck size={18} />, label: locale === 'nl' ? 'Verzending Europa' : 'European Shipping' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-white/[0.08] backdrop-blur-sm border border-white/10 text-blue-200 text-sm px-4 py-2.5 rounded-full"
                  style={{ animation: `float ${3 + i * 0.5}s ease-in-out ${i * 0.3}s infinite` }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Truck className="text-primary-500" size={24} />, title: t('features.shipping'), desc: t('features.shippingDesc') },
              { icon: <Shield className="text-primary-500" size={24} />, title: t('features.quality'), desc: t('features.qualityDesc') },
              { icon: <Headphones className="text-primary-500" size={24} />, title: t('features.support'), desc: t('features.supportDesc') },
              { icon: <CreditCard className="text-primary-500" size={24} />, title: t('features.secure'), desc: t('features.secureDesc') },
            ].map((feat, i) => (
              <div key={i} className={`flex items-center gap-3 animate-fade-in-up delay-${(i + 1) * 100}`}>
                <div className="p-2.5 bg-primary-50 rounded-xl">{feat.icon}</div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{feat.title}</p>
                  <p className="text-gray-500 text-xs">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('cat.title')}</h2>
          <p className="text-gray-500">{t('cat.subtitle')}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {homeBrands.map((brand, i) => (
            <Link
              key={brand.slug}
              href={`/products?brand=${brand.slug}`}
              className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center group border border-gray-100 hover:border-primary-200 hover:-translate-y-1 animate-fade-in-up`}
              style={{ animationDelay: `${(i + 1) * 0.1}s` }}
            >
              <div className="text-primary-500 mb-3 flex justify-center group-hover:scale-110 transition-transform duration-300">
                {brandIcons[brand.slug] || <Package size={36} />}
              </div>
              <h3 className="font-semibold text-gray-800 text-sm group-hover:text-primary-500 transition-colors">
                {locale === 'en' ? brand.nameEn : brand.name}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {brand.subcategories.length} {locale === 'nl' ? 'subcategorieën' : 'subcategories'}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8 animate-fade-in-up">
              <h2 className="text-3xl font-bold text-gray-800">{t('products.featured')}</h2>
              <Link href="/products" className="text-primary-500 hover:text-primary-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                {t('nav.allProducts')} <ChevronRight size={18} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {featuredProducts.slice(0, 5).map((product, i) => (
                <div key={product.id} className={`animate-fade-in-up delay-${(i + 1) * 100}`}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Banner */}
      <section className="bg-gradient-to-r from-accent-600 via-accent-500 to-accent-600 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {locale === 'nl' ? 'Professionele Reparatieonderdelen' : 'Professional Repair Parts'}
          </h2>
          <p className="text-lg mb-8 text-red-100 max-w-2xl mx-auto">
            {locale === 'nl'
              ? 'Kwalitatieve onderdelen voor uw reparatiebedrijf. Levering door heel Europa.'
              : 'Quality parts for your repair business. Delivery across Europe.'}
          </p>
          <Link
            href="/products"
            className="bg-white text-accent-500 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all hover:shadow-xl hover:-translate-y-0.5 inline-flex items-center gap-2 text-lg"
          >
            {t('hero.cta')} <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      {newProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex justify-between items-center mb-8 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-800">{t('products.new')}</h2>
            <Link href="/products" className="text-primary-500 hover:text-primary-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              {t('nav.allProducts')} <ChevronRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {newProducts.slice(0, 5).map((product, i) => (
              <div key={product.id} className={`animate-fade-in-up delay-${(i + 1) * 100}`}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Brands / Trust */}
      <section className="bg-white py-16 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {locale === 'nl' ? 'Wij leveren onderdelen voor' : 'We supply parts for'}
            </h2>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
            {['Apple', 'Samsung', 'Huawei', 'Motorola', 'Google', 'OnePlus'].map((brand, i) => (
              <div key={brand} className={`text-center text-gray-400 hover:text-primary-500 transition-colors duration-300 cursor-default animate-fade-in-up delay-${(i + 1) * 100}`}>
                <Smartphone size={36} className="mx-auto mb-1.5" />
                <p className="font-semibold text-sm">{brand}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
