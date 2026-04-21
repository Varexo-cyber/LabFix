export interface SubCategory {
  slug: string;
  name: string;
  nameEn: string;
}

export interface BrandCategory {
  slug: string;
  name: string;
  nameEn: string;
  subcategories: SubCategory[];
}

export const brandCategories: BrandCategory[] = [
  {
    slug: 'apple',
    name: 'Apple',
    nameEn: 'Apple',
    subcategories: [
      { slug: 'iphone', name: 'iPhone', nameEn: 'iPhone' },
      { slug: 'ipad', name: 'iPad', nameEn: 'iPad' },
      { slug: 'macbook-pro', name: 'MacBook Pro', nameEn: 'MacBook Pro' },
      { slug: 'macbook-air', name: 'MacBook Air', nameEn: 'MacBook Air' },
      { slug: 'macbook', name: 'MacBook', nameEn: 'MacBook' },
      { slug: 'imac', name: 'iMac', nameEn: 'iMac' },
      { slug: 'mac-mini', name: 'Mac Mini', nameEn: 'Mac Mini' },
      { slug: 'mac-pro', name: 'Mac Pro', nameEn: 'Mac Pro' },
      { slug: 'apple-watch', name: 'Apple Watch', nameEn: 'Apple Watch' },
      { slug: 'airpods', name: 'AirPods', nameEn: 'AirPods' },
      { slug: 'ipod', name: 'iPod', nameEn: 'iPod' },
    ],
  },
  {
    slug: 'samsung',
    name: 'Samsung',
    nameEn: 'Samsung',
    subcategories: [
      { slug: 'galaxy-s', name: 'Galaxy S Serie', nameEn: 'Galaxy S Series' },
      { slug: 'galaxy-a', name: 'Galaxy A Serie', nameEn: 'Galaxy A Series' },
      { slug: 'galaxy-z', name: 'Galaxy Z (Fold/Flip)', nameEn: 'Galaxy Z (Fold/Flip)' },
      { slug: 'galaxy-note', name: 'Galaxy Note', nameEn: 'Galaxy Note' },
      { slug: 'galaxy-tab', name: 'Galaxy Tab', nameEn: 'Galaxy Tab' },
      { slug: 'galaxy-m', name: 'Galaxy M Serie', nameEn: 'Galaxy M Series' },
      { slug: 'galaxy-watch', name: 'Galaxy Watch', nameEn: 'Galaxy Watch' },
      { slug: 'galaxy-buds', name: 'Galaxy Buds', nameEn: 'Galaxy Buds' },
    ],
  },
  {
    slug: 'google',
    name: 'Google',
    nameEn: 'Google',
    subcategories: [
      { slug: 'pixel-phone', name: 'Pixel Telefoon', nameEn: 'Pixel Phone' },
      { slug: 'pixel-tablet', name: 'Pixel Tablet', nameEn: 'Pixel Tablet' },
      { slug: 'pixel-watch', name: 'Pixel Watch', nameEn: 'Pixel Watch' },
      { slug: 'pixel-buds', name: 'Pixel Buds', nameEn: 'Pixel Buds' },
    ],
  },
  {
    slug: 'motorola',
    name: 'Motorola',
    nameEn: 'Motorola',
    subcategories: [
      { slug: 'moto-g', name: 'Moto G Serie', nameEn: 'Moto G Series' },
      { slug: 'moto-e', name: 'Moto E Serie', nameEn: 'Moto E Series' },
      { slug: 'moto-edge', name: 'Moto Edge', nameEn: 'Moto Edge' },
      { slug: 'moto-razr', name: 'Moto Razr', nameEn: 'Moto Razr' },
    ],
  },
  {
    slug: 'huawei',
    name: 'Huawei',
    nameEn: 'Huawei',
    subcategories: [
      { slug: 'huawei-p', name: 'P Serie', nameEn: 'P Series' },
      { slug: 'huawei-mate', name: 'Mate Serie', nameEn: 'Mate Series' },
      { slug: 'huawei-nova', name: 'Nova Serie', nameEn: 'Nova Series' },
      { slug: 'huawei-tablet', name: 'MediaPad / MatePad', nameEn: 'MediaPad / MatePad' },
      { slug: 'huawei-watch', name: 'Huawei Watch', nameEn: 'Huawei Watch' },
    ],
  },
  {
    slug: 'xiaomi',
    name: 'Xiaomi',
    nameEn: 'Xiaomi',
    subcategories: [
      { slug: 'xiaomi-phone', name: 'Xiaomi Telefoon', nameEn: 'Xiaomi Phone' },
      { slug: 'redmi', name: 'Redmi', nameEn: 'Redmi' },
      { slug: 'poco', name: 'POCO', nameEn: 'POCO' },
      { slug: 'mi-pad', name: 'Mi Pad', nameEn: 'Mi Pad' },
    ],
  },
  {
    slug: 'oneplus',
    name: 'OnePlus',
    nameEn: 'OnePlus',
    subcategories: [
      { slug: 'oneplus-phone', name: 'OnePlus Telefoon', nameEn: 'OnePlus Phone' },
      { slug: 'oneplus-nord', name: 'OnePlus Nord', nameEn: 'OnePlus Nord' },
      { slug: 'oneplus-buds', name: 'OnePlus Buds', nameEn: 'OnePlus Buds' },
    ],
  },
  {
    slug: 'oppo',
    name: 'OPPO',
    nameEn: 'OPPO',
    subcategories: [
      { slug: 'oppo-find', name: 'Find Serie', nameEn: 'Find Series' },
      { slug: 'oppo-reno', name: 'Reno Serie', nameEn: 'Reno Series' },
      { slug: 'oppo-a', name: 'A Serie', nameEn: 'A Series' },
    ],
  },
  {
    slug: 'sony',
    name: 'Sony',
    nameEn: 'Sony',
    subcategories: [
      { slug: 'sony-xperia', name: 'Xperia', nameEn: 'Xperia' },
    ],
  },
  {
    slug: 'nokia',
    name: 'Nokia',
    nameEn: 'Nokia',
    subcategories: [
      { slug: 'nokia-phone', name: 'Nokia Telefoon', nameEn: 'Nokia Phone' },
    ],
  },
  {
    slug: 'lg',
    name: 'LG',
    nameEn: 'LG',
    subcategories: [
      { slug: 'lg-phone', name: 'LG Telefoon', nameEn: 'LG Phone' },
      { slug: 'lg-tablet', name: 'LG Tablet', nameEn: 'LG Tablet' },
    ],
  },
  {
    slug: 'other-brands',
    name: 'Overige Merken',
    nameEn: 'Other Brands',
    subcategories: [
      { slug: 'amazon', name: 'Amazon (Kindle/Fire)', nameEn: 'Amazon (Kindle/Fire)' },
      { slug: 'asus', name: 'Asus', nameEn: 'Asus' },
      { slug: 'acer', name: 'Acer', nameEn: 'Acer' },
      { slug: 'hp', name: 'HP', nameEn: 'HP' },
      { slug: 'dell', name: 'Dell', nameEn: 'Dell' },
      { slug: 'lenovo', name: 'Lenovo', nameEn: 'Lenovo' },
      { slug: 'microsoft', name: 'Microsoft Surface', nameEn: 'Microsoft Surface' },
      { slug: 'nothing', name: 'Nothing', nameEn: 'Nothing' },
      { slug: 'realme', name: 'Realme', nameEn: 'Realme' },
      { slug: 'vivo', name: 'Vivo', nameEn: 'Vivo' },
      { slug: 'zte', name: 'ZTE', nameEn: 'ZTE' },
      { slug: 'tcl', name: 'TCL', nameEn: 'TCL' },
      { slug: 'honor', name: 'Honor', nameEn: 'Honor' },
    ],
  },
  {
    slug: 'tools',
    name: 'Gereedschap & Supplies',
    nameEn: 'Tools & Supplies',
    subcategories: [
      { slug: 'screwdrivers', name: 'Schroevendraaiers', nameEn: 'Screwdrivers' },
      { slug: 'pry-tools', name: 'Opening Tools', nameEn: 'Pry & Opening Tools' },
      { slug: 'soldering', name: 'Soldeer Gereedschap', nameEn: 'Soldering Tools' },
      { slug: 'adhesives', name: 'Lijm & Tape', nameEn: 'Adhesives & Tape' },
      { slug: 'cleaning', name: 'Reiniging', nameEn: 'Cleaning Supplies' },
      { slug: 'heat-guns', name: 'Heatguns & Stations', nameEn: 'Heat Guns & Stations' },
      { slug: 'microscopes', name: 'Microscopen', nameEn: 'Microscopes' },
      { slug: 'mats', name: 'Werkmatten', nameEn: 'Work Mats' },
      { slug: 'other-tools', name: 'Overig Gereedschap', nameEn: 'Other Tools' },
    ],
  },
  {
    slug: 'accessories',
    name: 'Accessoires',
    nameEn: 'Accessories',
    subcategories: [
      { slug: 'cases', name: 'Hoesjes', nameEn: 'Cases' },
      { slug: 'chargers', name: 'Opladers', nameEn: 'Chargers' },
      { slug: 'cables', name: 'Kabels', nameEn: 'Cables' },
      { slug: 'screen-protectors', name: 'Screenprotectors', nameEn: 'Screen Protectors' },
      { slug: 'power-banks', name: 'Powerbanks', nameEn: 'Power Banks' },
      { slug: 'other-accessories', name: 'Overige Accessoires', nameEn: 'Other Accessories' },
    ],
  },
];

// Helper: get all flat categories for admin dropdown
export function getAllCategoryOptions(): { value: string; label: string; brand: string }[] {
  const options: { value: string; label: string; brand: string }[] = [];
  for (const brand of brandCategories) {
    for (const sub of brand.subcategories) {
      options.push({
        value: `${brand.slug}/${sub.slug}`,
        label: `${brand.name} → ${sub.name}`,
        brand: brand.slug,
      });
    }
  }
  return options;
}

// Helper: get brand from category string like "apple/iphone"
export function parseCategoryPath(categoryPath: string): { brand: string; sub: string } {
  const parts = categoryPath.split('/');
  return { brand: parts[0] || '', sub: parts[1] || '' };
}

// Helper: get brand name
export function getBrandName(slug: string, locale: string = 'nl'): string {
  const brand = brandCategories.find(b => b.slug === slug);
  if (!brand) return slug;
  return locale === 'en' ? brand.nameEn : brand.name;
}

// Helper: get subcategory name
export function getSubcategoryName(brandSlug: string, subSlug: string, locale: string = 'nl'): string {
  const brand = brandCategories.find(b => b.slug === brandSlug);
  if (!brand) return subSlug;
  const sub = brand.subcategories.find(s => s.slug === subSlug);
  if (!sub) return subSlug;
  return locale === 'en' ? sub.nameEn : sub.name;
}
