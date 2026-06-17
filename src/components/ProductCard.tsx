'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/lib/store';
import { normalizeImageUrl } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

// Highlight important model keywords for better distinction
function highlightModelKeywords(name: string) {
  const keywords = [
    { pattern: /\bPro Max\b/gi, className: 'text-primary-600 font-bold' },
    { pattern: /\bPro\b(?! Max)/gi, className: 'text-primary-600 font-semibold' },
    { pattern: /\bPlus\b/gi, className: 'text-blue-600 font-semibold' },
    { pattern: /\bMini\b/gi, className: 'text-green-600 font-semibold' },
    { pattern: /\bUltra\b/gi, className: 'text-purple-600 font-semibold' },
    { pattern: /\bMax\b(?! Pro)/gi, className: 'text-orange-600 font-semibold' },
    { pattern: /\bSE\b/gi, className: 'text-gray-600 font-semibold' },
  ];

  let highlighted = name;
  keywords.forEach(({ pattern, className }) => {
    highlighted = highlighted.replace(pattern, `<span class="${className}">$&</span>`);
  });

  return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t, locale, addToCart, formatPrice, vatMode } = useApp();

  const name = locale === 'nl'
    ? (product.name || product.nameEn || '')
    : (product.nameEn || product.name || '');
  const description = locale === 'nl'
    ? (product.description || product.descriptionEn || '')
    : (product.descriptionEn || product.description || '');

  return (
    <div className="product-card bg-white rounded-xl shadow-md overflow-hidden group border border-gray-100">
      <Link href={`/products/${product.id}`}>
        <div className="relative overflow-hidden aspect-square bg-gray-50">
          <img
            src={normalizeImageUrl(product.image || (product.images && product.images.length > 0 ? product.images[0] : ''))}
            alt={name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo.png';
              (e.target as HTMLImageElement).className = 'w-full h-full object-contain opacity-50 p-4';
            }}
          />
          {product.isNew && (
            <span className="absolute top-2 left-2 bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded">
              {t('products.new')}
            </span>
          )}
          {product.comparePrice && (
            <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{Math.round((1 - product.price / product.comparePrice) * 100)}%
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-gray-800 px-4 py-2 rounded font-semibold">
                {t('products.outOfStock')}
              </span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-800 hover:text-primary-500 transition-colors text-sm leading-tight">
            {highlightModelKeywords(name)}
          </h3>
        </Link>
        <p className="text-gray-600 text-xs mt-1 font-medium">{product.sku}</p>
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-lg font-bold text-primary-500">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <span className="text-sm text-gray-400 line-through ml-2">{formatPrice(product.comparePrice)}</span>
            )}
            <p className="text-xs text-gray-400">
              {vatMode === 'incl'
                ? (locale === 'nl' ? 'incl. BTW' : 'incl. VAT')
                : (locale === 'nl' ? 'excl. BTW' : 'excl. VAT')}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (product.inStock) {
                addToCart(product);
              }
            }}
            disabled={!product.inStock}
            className={`p-2.5 rounded-lg transition-colors active:scale-95 ${
              product.inStock
                ? 'bg-accent-500 text-white hover:bg-accent-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            title={t('products.addToCart')}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
