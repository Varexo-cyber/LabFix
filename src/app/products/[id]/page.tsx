'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { fetchProducts, Product } from '@/lib/store';
import { ShoppingCart, ArrowLeft, Truck, Shield, Check, Minus, Plus } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import ImageSlideshow from '@/components/ImageSlideshow';
import { normalizeImageUrl } from '@/lib/utils';

export default function ProductDetailPage() {
  const { t, locale, formatPrice, addToCart } = useApp();
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetchProducts().then((allProducts: Product[]) => {
      const found = allProducts.find((p: Product) => p.id === params.id);
      if (found) {
        setProduct(found);
        setRelatedProducts(
          allProducts.filter((p: Product) => p.category === found.category && p.id !== found.id).slice(0, 4)
        );
      }
    });
  }, [params.id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-xl">{t('general.loading')}</p>
      </div>
    );
  }

  const name = locale === 'nl' ? product.name : product.nameEn;
  const description = locale === 'nl' ? product.description : product.descriptionEn;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 animate-fade-in">
        <Link href="/" className="hover:text-primary-500">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-primary-500">{t('products.title')}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{name}</span>
      </nav>

      <Link href="/products" className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-600 mb-6">
        <ArrowLeft size={16} /> {t('general.back')}
      </Link>

      {/* Product Detail */}
      <div className="grid md:grid-cols-2 gap-8 bg-white rounded-xl shadow-md p-6 mb-12">
        {/* Images - Show slideshow if multiple images exist */}
        <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden animate-fade-in-left">
          {product.images && product.images.length > 1 ? (
            <ImageSlideshow 
              images={product.images} 
              alt={name}
              className="w-full h-full"
              showThumbnails={true}
            />
          ) : (
            <img 
              src={normalizeImageUrl(product.image)} 
              alt={name} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo.png';
                (e.target as HTMLImageElement).className = 'w-full h-full object-contain opacity-50 p-8';
              }}
            />
          )}
        </div>

        {/* Info */}
        <div className="animate-fade-in-right delay-200">
          <div className="mb-2"></div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{name}</h1>

          <p className="text-sm text-gray-500 mb-4">
            {t('products.sku')}: {product.sku}
          </p>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary-500">{formatPrice(product.price)}</span>
              {product.comparePrice && (
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
              )}
            </div>
            <p className="text-sm text-gray-400">{locale === 'nl' ? 'incl. BTW' : 'incl. VAT'}</p>
          </div>

          {/* Stock */}
          <div className="mb-6">
            {product.inStock ? (
              <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                <Check size={16} /> {t('products.inStock')}
              </span>
            ) : (
              <span className="text-red-500 font-semibold">{t('products.outOfStock')}</span>
            )}
          </div>

          {/* Description */}
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-semibold text-sm mb-2">{t('products.price')}</h4>
            <p className="text-xs text-gray-500">
              {locale === 'nl' ? 'Alle prijzen zijn incl. BTW' : 'All prices are incl. VAT'}
            </p>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">{t('products.description')}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </div>

          {/* Quantity + Add to Cart */}
          {product.inStock && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                  addedToCart
                    ? 'bg-green-500 text-white'
                    : 'bg-accent-500 text-white hover:bg-accent-600'
                }`}
              >
                <ShoppingCart size={20} />
                {addedToCart
                  ? (locale === 'nl' ? 'Toegevoegd!' : 'Added!')
                  : t('products.addToCart')}
              </button>
            </div>
          )}

          {/* Features */}
          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Truck size={16} className="text-primary-500" />
              {t('features.shipping')} - {t('features.shippingDesc')}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield size={16} className="text-primary-500" />
              {t('features.quality')} - {t('features.qualityDesc')}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {locale === 'nl' ? 'Gerelateerde Producten' : 'Related Products'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
