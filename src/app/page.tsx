'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import ProductCard from '@/components/ProductCard';
import ScrollReveal from '@/components/ScrollReveal';
import { fetchProducts, Product, fetchNews, NewsArticle } from '@/lib/store';
import {
  Truck, Shield, Headphones, CreditCard, ArrowRight, Smartphone, Wrench,
  Package, ChevronRight, Newspaper, Laptop, Monitor, Award, Clock,
  CheckCircle, Star, Zap, HeartHandshake, BadgeCheck, Sparkles,
  ShieldCheck
} from 'lucide-react';
import { brandCategories } from '@/lib/categories';

export default function HomePage() {
  const { t, locale } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    fetchProducts().then(setProducts);
    fetchNews().then(articles => setNewsArticles(articles.filter(a => a.published)));
  }, []);

  // Auto-rotate banner
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const featuredProducts = products.filter((p) => p.featured);
  const newProducts = products.filter((p) => p.isNew);

  const brandLogos: Record<string, string> = {
    apple: '/images/logos/brands/apple.svg',
    samsung: '/images/logos/brands/samsung.svg',
    google: '/images/logos/brands/google.svg',
    huawei: '/images/logos/brands/huawei.svg',
    xiaomi: '/images/logos/brands/xiaomi.svg',
    nokia: '/images/logos/brands/nokia.svg',
    honor: '/images/logos/brands/honor.svg',
    nothing: '/images/logos/brands/nothing.webp',
    realme: '/images/logos/brands/realme.svg',
    vivo: '/images/logos/brands/vivo.svg',
    asus: '/images/logos/brands/asus.svg',
    lenovo: '/images/logos/brands/lenovo.png',
    oneplus: '/images/logos/brands/oneplus.png',
    motorola: '/images/logos/brands/motorola.svg',
    hp: '/images/logos/brands/hp.svg',
    dell: '/images/logos/brands/dell.svg',
    microsoft: '/images/logos/brands/microsoft.svg',
  };

  // Show top brands - mix of phones and computers
  const homeBrands = brandCategories.filter(b => 
    ['apple', 'samsung', 'google', 'huawei', 'xiaomi', 'nokia', 'honor', 'nothing', 'realme', 'vivo', 
     'asus', 'lenovo', 'microsoft', 'hp', 'dell', 'tools', 'accessories'].includes(b.slug)
  ).slice(0, 12);

  // MobileSentrix style hero slides - white/gray background with clean product images
  const heroSlides = [
    {
      badge: locale === 'nl' ? 'Telefoon Onderdelen' : 'Phone Parts',
      badgeIcon: '📱',
      title: locale === 'nl' ? 'Premium Telefoon Onderdelen & Accessoires' : 'Premium Phone Parts & Accessories',
      subtitle: locale === 'nl' ? 'iPhone • Samsung • Huawei • Xiaomi • Schermen • Batterijen • Camera\'s' : 'iPhone • Samsung • Huawei • Xiaomi • Screens • Batteries • Cameras',
      features: [
        { label: locale === 'nl' ? 'Origineel' : 'Genuine', sub: locale === 'nl' ? '& OEM' : '& OEM' },
        { label: locale === 'nl' ? 'Snelle' : 'Fast', sub: locale === 'nl' ? 'Levering' : 'Delivery' },
        { label: locale === 'nl' ? 'Wholesale' : 'Wholesale', sub: locale === 'nl' ? 'Prijzen' : 'Prices' }
      ],
      cta: locale === 'nl' ? 'Bekijk Onderdelen' : 'Shop Parts',
      link: '/products',
      image: '/images/banners/phones-hero.jpg'
    },
    {
      badge: locale === 'nl' ? 'PC & Laptop Onderdelen' : 'PC & Laptop Parts',
      badgeIcon: '💻',
      title: locale === 'nl' ? 'Computer & Laptop Onderdelen' : 'Computer & Laptop Parts',
      subtitle: locale === 'nl' ? 'PC Onderdelen • Laptop Accessoires • Reparatie Tools • Kabels' : 'PC Parts • Laptop Accessories • Repair Tools • Cables',
      features: [
        { label: 'OEM', sub: 'Quality' },
        { label: locale === 'nl' ? 'Getest' : 'Tested', sub: '100%' },
        { label: locale === 'nl' ? 'Garantie' : 'Warranty', sub: 'Incl.' }
      ],
      cta: locale === 'nl' ? 'Bekijk PC Onderdelen' : 'Shop PC Parts',
      link: '/products',
      image: '/images/products/laptop-parts.jpg'
    },
    {
      badge: locale === 'nl' ? 'Reparatie Service' : 'Repair Service',
      badgeIcon: '🔧',
      title: locale === 'nl' ? 'Professionele Reparatie Service' : 'Professional Repair Service',
      subtitle: locale === 'nl' ? 'Smartphones • Tablets • Laptops • Snelle Service' : 'Smartphones • Tablets • Laptops • Fast Service',
      features: [
        { label: locale === 'nl' ? 'Expert' : 'Expert', sub: 'Technici' },
        { label: locale === 'nl' ? 'Snel' : 'Fast', sub: 'Service' },
        { label: locale === 'nl' ? 'Garantie' : 'Warranty', sub: 'Incl.' }
      ],
      cta: locale === 'nl' ? 'Maak Afspraak' : 'Book Appointment',
      link: '/repair',
      image: '/images/banners/tools.jpg'
    }
  ];

  return (
    <div className="bg-gray-50">
      {/* MobileSentrix Style Hero - White Background with Product Images */}
      <section className="bg-gradient-to-br from-gray-100 via-white to-gray-100 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden relative">
            {heroSlides.map((slide, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ease-in-out ${
                  index === activeSlide ? 'opacity-100 translate-x-0 z-10 relative' : 'opacity-0 translate-x-full z-0 pointer-events-none absolute inset-0'
                } ${index < activeSlide && index !== activeSlide ? '-translate-x-full' : ''}`}
              >
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Left Content */}
                  <div className="p-6 md:p-12 lg:p-16 flex flex-col justify-center order-1">
                    <div className="inline-flex items-center gap-2 text-gray-600 text-sm font-medium mb-4">
                      <span className="text-lg">{slide.badgeIcon}</span>
                      <span className="uppercase tracking-wider">{slide.badge}</span>
                    </div>
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-gray-600 text-base md:text-lg mb-6">
                      {slide.subtitle}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-4 md:gap-6 mb-6 md:mb-8">
                      {slide.features.map((feature, i) => (
                        <div key={i} className="text-center">
                          <p className="font-semibold text-gray-900 text-sm">{feature.label}</p>
                          <p className="text-xs text-gray-500">{feature.sub}</p>
                        </div>
                      ))}
                    </div>

                    <Link
                      href={slide.link}
                      className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all w-fit"
                    >
                      {slide.cta} <ArrowRight size={18} />
                    </Link>
                  </div>

                  {/* Right Image - Full coverage */}
                  <div className="relative h-[250px] md:h-full md:min-h-[500px] order-2">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            {/* Slide Indicators */}
            <div className="flex justify-center gap-2 pb-6 relative z-20">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeSlide ? 'bg-gray-900 w-6' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <ScrollReveal animation="fade-up">
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {[
              { icon: <BadgeCheck size={20} />, text: locale === 'nl' ? 'Kwaliteitsgarantie' : 'Quality Guarantee' },
              { icon: <Clock size={20} />, text: locale === 'nl' ? 'Snelle levering 1-3 dagen' : 'Fast delivery 1-3 days' },
              { icon: <HeartHandshake size={20} />, text: locale === 'nl' ? 'Veilige betaling' : 'Secure payment' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-600">
                <span className="text-primary-500">{item.icon}</span>
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* Categories Grid */}
      <ScrollReveal animation="stagger">
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            {locale === 'nl' ? 'Onze Categorieën' : 'Our Categories'}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {locale === 'nl' 
              ? 'Vind de onderdelen die u nodig heeft voor alle grote merken smartphones, tablets en laptops.' 
              : 'Find the parts you need for all major brands of smartphones, tablets and laptops.'}
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {homeBrands.map((brand, i) => {
            const logoPath = brandLogos[brand.slug];
            return (
              <Link
                key={brand.slug}
                href={`/products?brand=${brand.slug}`}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 text-center border border-gray-100 hover:border-primary-200 hover:-translate-y-1"
                style={{ animationDelay: `${(i + 1) * 0.05}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-50 rounded-2xl flex items-center justify-center p-3 group-hover:scale-110 group-hover:bg-primary-100 transition-all duration-300">
                  {logoPath ? (
                    <img
                      src={logoPath}
                      alt={`${brand.name} logo`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Package size={32} className="text-primary-500" />
                  )}
                </div>
                <h3 className="font-bold text-gray-800 text-sm group-hover:text-primary-600 transition-colors">
                  {locale === 'en' ? brand.nameEn : brand.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {brand.subcategories.length} {locale === 'nl' ? 'subcategorieën' : 'subcategories'}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
      </ScrollReveal>

      {/* Quality Standards Section */}
      <ScrollReveal animation="fade-up">
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left Content */}
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <div className="mb-6">
                  {/* Colored Dots */}
                  <div className="flex items-center gap-1 mb-4">
                    <div className="flex gap-1">
                      <span className="w-3 h-3 rounded-full bg-orange-400"></span>
                      <span className="w-3 h-3 rounded-full bg-red-500"></span>
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    </div>
                    <div className="flex gap-1 ml-1">
                      <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                      <span className="w-3 h-3 rounded-full bg-gray-600"></span>
                      <span className="w-3 h-3 rounded-full bg-teal-400"></span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-2">{locale === 'nl' ? 'Ontdek Onze' : 'Discover Our'}</p>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {locale === 'nl' ? 'Kwaliteitsnormen' : 'Quality Standards'}
                  </h2>
                </div>
                <Link href="/products" className="inline-block text-primary-600 hover:text-primary-700 font-medium mb-6 transition-colors">
                  {locale === 'nl' 
                    ? 'Ontdek alle kwaliteiten die ons onderscheiden →' 
                    : 'Discover all the qualities that set us apart →'}
                </Link>
                
                {/* LABFIX Technology Badge */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-cyan-500 font-bold text-lg tracking-wider">AQ7</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-800 font-bold text-lg tracking-wider">TECHNOLOGY</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">
                    {locale === 'nl' ? 'Ongeëvenaarde Kwaliteit en Betrouwbaarheid' : 'Unmatched Quality and Reliability'}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {locale === 'nl' 
                      ? 'Topklasse materialen en strenge kwaliteitscontrole voor betrouwbare prestaties.'
                      : 'Top-tier materials and rigorous Quality control for reliable performance.'}
                  </p>
                </div>
              </div>
              
              {/* Right - Product Images Grid */}
              <div className="bg-gray-50 p-8 md:p-12 flex items-center justify-center">
                <img 
                  src="/images/products/iphone-screen.jpg" 
                  alt="iPhone Parts"
                  className="rounded-2xl shadow-xl w-full max-w-md object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <ScrollReveal animation="stagger">
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-end mb-10">
              <div>
                <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">
                  {locale === 'nl' ? 'Aanbevolen' : 'Featured'}
                </span>
                <h2 className="text-3xl font-bold text-gray-800 mt-1">{t('products.featured')}</h2>
              </div>
              <Link href="/products" className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                {t('nav.allProducts')} <ChevronRight size={18} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {featuredProducts.slice(0, 5).map((product, i) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
        </ScrollReveal>
      )}

      {/* Feature Cards */}
      <ScrollReveal animation="stagger">
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {locale === 'nl' ? 'Waarom LabFix?' : 'Why LabFix?'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {locale === 'nl' 
                ? 'De beste onderdelen voor professionele reparatiebedrijven' 
                : 'The best parts for professional repair businesses'}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Shield size={32} />,
                title: locale === 'nl' ? 'Premium Kwaliteit' : 'Premium Quality',
                desc: locale === 'nl' ? 'Topklasse reparatieonderdelen. Streng gecontroleerd.' : 'Top-tier repair parts. Rigorously tested.',
                image: '/images/products/iphone-screen.jpg',
                bg: 'bg-gradient-to-br from-blue-500 to-blue-600'
              },
              {
                icon: <Package size={32} />,
                title: locale === 'nl' ? 'Retail Ready' : 'Retail Ready',
                desc: locale === 'nl' ? 'Accessoires en onderdelen klaar voor verkoop in uw winkel.' : 'Accessories and parts ready for sale in your store.',
                image: '/images/banners/iphone-parts.jpg',
                bg: 'bg-gradient-to-br from-rose-500 to-pink-600'
              },
              {
                icon: <Wrench size={32} />,
                title: locale === 'nl' ? 'Tools & Supplies' : 'Tools & Supplies',
                desc: locale === 'nl' ? 'Professioneel gereedschap voor elke reparatie.' : 'Professional tools for every repair.',
                image: '/images/banners/repair-tools.jpg',
                bg: 'bg-gradient-to-br from-emerald-500 to-green-600'
              }
            ].map((card, i) => (
              <div key={i} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={card.image} 
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
                <div className="p-6">
                  <div className={`w-14 h-14 ${card.bg} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                  <p className="text-gray-600 text-sm">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* B2B Commercial Section */}
      <ScrollReveal animation="fade-up">
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
              {locale === 'nl' ? 'Waarom LabFix?' : 'Why LabFix?'}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              {locale === 'nl' 
                ? 'Uw Specialist in Reparatie & Onderdelen' 
                : 'Your Repair & Parts Specialist'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {locale === 'nl'
                ? 'Professionele reparatie en onderdelen voor smartphones, tablets en laptops. Voor particulieren en bedrijven.'
                : 'Professional repair and parts for smartphones, tablets and laptops. For individuals and businesses.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { 
                icon: <Wrench size={40} />, 
                stat: '15+', 
                title: locale === 'nl' ? 'Merken' : 'Brands',
                desc: locale === 'nl' ? 'Reparatie voor alle grote merken' : 'Repair for all major brands'
              },
              {
                icon: <Clock size={40} />,
                stat: locale === 'nl' ? 'Snel' : 'Fast',
                title: locale === 'nl' ? 'Verzending' : 'Shipping',
                desc: locale === 'nl' ? 'Snelle verzending door heel Europa' : 'Fast shipping throughout Europe'
              },
              { 
                icon: <ShieldCheck size={40} />, 
                stat: locale === 'nl' ? 'A+' : 'A+',
                title: locale === 'nl' ? 'Kwaliteit' : 'Quality',
                desc: locale === 'nl' ? 'Uitstekende kwaliteit onderdelen' : 'Excellent quality parts'
              },
              { 
                icon: <Headphones size={40} />, 
                stat: locale === 'nl' ? 'Support' : 'Support',
                title: locale === 'nl' ? 'Service' : 'Service',
                desc: locale === 'nl' ? 'Technische ondersteuning via mail' : 'Technical support via email'
              },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow">
                <div className="text-primary-600 mb-4 flex justify-center">{item.icon}</div>
                <p className="text-4xl font-bold text-gray-900 mb-2">{item.stat}</p>
                <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>
      </ScrollReveal>

      {/* New Arrivals */}
      {newProducts.length > 0 && (
        <ScrollReveal animation="stagger">
        <section className="py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-end mb-10">
              <div>
                <span className="text-accent-500 font-semibold text-sm uppercase tracking-wider">
                  {locale === 'nl' ? 'Net Binnen' : 'Just Arrived'}
                </span>
                <h2 className="text-3xl font-bold text-gray-800 mt-1">{t('products.new')}</h2>
              </div>
              <Link href="/products" className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                {t('nav.allProducts')} <ChevronRight size={18} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {newProducts.slice(0, 5).map((product, i) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
        </ScrollReveal>
      )}

      {/* CTA Banner */}
      <ScrollReveal animation="fade-up">
      <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {locale === 'nl' ? 'Klaar om te repareren?' : 'Ready to repair?'}
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            {locale === 'nl'
              ? 'Maak vandaag nog een afspraak voor reparatie of bestel onderdelen voor zelf repareren. Snelle service, garantie inbegrepen!'
              : 'Make an appointment for repair today or order parts for DIY repair. Fast service, warranty included!'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/account/register"
              className="bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all hover:shadow-xl inline-flex items-center gap-2"
            >
              {locale === 'nl' ? 'Gratis Registreren' : 'Register Free'} <ArrowRight size={20} />
            </Link>
            <Link
              href="/products"
              className="bg-white/10 border border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all"
            >
              {t('nav.allProducts')}
            </Link>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* Latest News */}
      {newsArticles.length > 0 && (
        <ScrollReveal animation="stagger">
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">
                {locale === 'nl' ? 'Nieuws & Updates' : 'News & Updates'}
              </span>
              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                {locale === 'nl' ? 'Laatste Nieuws' : 'Latest News'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsArticles.slice(0, 3).map((article, i) => (
                <article key={article.id} className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group">
                  {article.image && (
                    <div className="overflow-hidden">
                      <img 
                        src={article.image} 
                        alt="" 
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-xs text-primary-500 font-medium mb-2">
                      {new Date(article.createdAt).toLocaleDateString(locale === 'nl' ? 'nl-NL' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">
                      {locale === 'nl' ? article.title : (article.titleEn || article.title)}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-3">
                      {locale === 'nl' ? article.summary : (article.summaryEn || article.summary)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        </ScrollReveal>
      )}

      {/* Brands Trust */}
      <ScrollReveal animation="fade-up">
      <section className="py-16 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-gray-500 text-sm uppercase tracking-wider mb-2">
              {locale === 'nl' ? 'Wij leveren onderdelen voor' : 'We supply parts for'}
            </p>
            <h2 className="text-2xl font-bold text-gray-800">
              {locale === 'nl' ? 'Alle Grote Merken' : 'All Major Brands'}
            </h2>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            {[
              { name: 'Apple', logo: brandLogos.apple },
              { name: 'Samsung', logo: brandLogos.samsung },
              { name: 'Google', logo: brandLogos.google },
              { name: 'Huawei', logo: brandLogos.huawei },
              { name: 'Xiaomi', logo: brandLogos.xiaomi },
              { name: 'OnePlus', logo: brandLogos.oneplus },
              { name: 'Motorola', logo: brandLogos.motorola },
              { name: 'ASUS', logo: brandLogos.asus },
              { name: 'Lenovo', logo: brandLogos.lenovo },
              { name: 'HP', logo: brandLogos.hp },
              { name: 'Dell', logo: brandLogos.dell },
              { name: 'Microsoft', logo: brandLogos.microsoft },
            ].map((brand, i) => (
              <div key={brand.name} className="text-center text-gray-400 hover:text-primary-500 transition-colors duration-300 cursor-default group flex flex-col items-center w-16">
                <div className="mx-auto mb-2 w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <img
                    src={brand.logo}
                    alt={`${brand.name}`}
                    className="w-full h-full object-contain opacity-60 group-hover:opacity-100 transition-opacity"
                    loading="eager"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <p className="font-medium text-xs leading-tight">{brand.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </ScrollReveal>
    </div>
  );
}
