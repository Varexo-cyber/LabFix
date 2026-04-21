// ==================== 3-LEVEL CATEGORY SYSTEM ====================
// Level 1: Brand (Apple, Samsung, etc.)
// Level 2: Product Line (iPhone, Galaxy S, etc.)
// Level 3: Specific Model (iPhone 16 Pro Max, Galaxy S25 Ultra, etc.)

export interface ModelItem {
  slug: string;
  name: string;
}

export interface SubCategory {
  slug: string;
  name: string;
  nameEn: string;
  models: ModelItem[];
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
      {
        slug: 'iphone', name: 'iPhone', nameEn: 'iPhone',
        models: [
          { slug: 'iphone-air', name: 'iPhone Air' },
          { slug: 'iphone-17-pro-max', name: 'iPhone 17 Pro Max' },
          { slug: 'iphone-17-pro', name: 'iPhone 17 Pro' },
          { slug: 'iphone-17', name: 'iPhone 17' },
          { slug: 'iphone-17e', name: 'iPhone 17e' },
          { slug: 'iphone-16-pro-max', name: 'iPhone 16 Pro Max' },
          { slug: 'iphone-16-pro', name: 'iPhone 16 Pro' },
          { slug: 'iphone-16-plus', name: 'iPhone 16 Plus' },
          { slug: 'iphone-16', name: 'iPhone 16' },
          { slug: 'iphone-16e', name: 'iPhone 16e' },
          { slug: 'iphone-15-pro-max', name: 'iPhone 15 Pro Max' },
          { slug: 'iphone-15-pro', name: 'iPhone 15 Pro' },
          { slug: 'iphone-15-plus', name: 'iPhone 15 Plus' },
          { slug: 'iphone-15', name: 'iPhone 15' },
          { slug: 'iphone-14-pro-max', name: 'iPhone 14 Pro Max' },
          { slug: 'iphone-14-pro', name: 'iPhone 14 Pro' },
          { slug: 'iphone-14-plus', name: 'iPhone 14 Plus' },
          { slug: 'iphone-14', name: 'iPhone 14' },
          { slug: 'iphone-13-pro-max', name: 'iPhone 13 Pro Max' },
          { slug: 'iphone-13-pro', name: 'iPhone 13 Pro' },
          { slug: 'iphone-13', name: 'iPhone 13' },
          { slug: 'iphone-13-mini', name: 'iPhone 13 Mini' },
          { slug: 'iphone-se-2022', name: 'iPhone SE (2022)' },
          { slug: 'iphone-12-pro-max', name: 'iPhone 12 Pro Max' },
          { slug: 'iphone-12-pro', name: 'iPhone 12 Pro' },
          { slug: 'iphone-12', name: 'iPhone 12' },
          { slug: 'iphone-12-mini', name: 'iPhone 12 Mini' },
          { slug: 'iphone-11-pro-max', name: 'iPhone 11 Pro Max' },
          { slug: 'iphone-11-pro', name: 'iPhone 11 Pro' },
          { slug: 'iphone-11', name: 'iPhone 11' },
          { slug: 'iphone-xs-max', name: 'iPhone XS Max' },
          { slug: 'iphone-xs', name: 'iPhone XS' },
          { slug: 'iphone-xr', name: 'iPhone XR' },
          { slug: 'iphone-x', name: 'iPhone X' },
          { slug: 'iphone-se-2020', name: 'iPhone SE (2020)' },
          { slug: 'iphone-8-plus', name: 'iPhone 8 Plus' },
          { slug: 'iphone-8', name: 'iPhone 8' },
          { slug: 'iphone-7-plus', name: 'iPhone 7 Plus' },
          { slug: 'iphone-7', name: 'iPhone 7' },
          { slug: 'iphone-6s-plus', name: 'iPhone 6S Plus' },
          { slug: 'iphone-6s', name: 'iPhone 6S' },
          { slug: 'iphone-6-plus', name: 'iPhone 6 Plus' },
          { slug: 'iphone-6', name: 'iPhone 6' },
          { slug: 'iphone-se-2016', name: 'iPhone SE (2016)' },
          { slug: 'iphone-5s', name: 'iPhone 5S' },
          { slug: 'iphone-5c', name: 'iPhone 5C' },
          { slug: 'iphone-5', name: 'iPhone 5' },
        ],
      },
      {
        slug: 'ipad', name: 'iPad', nameEn: 'iPad',
        models: [
          { slug: 'ipad-pro-13-2025', name: 'iPad Pro 13" (2025)' },
          { slug: 'ipad-pro-11-2025', name: 'iPad Pro 11" (2025)' },
          { slug: 'ipad-pro-13-2024', name: 'iPad Pro 13" (2024)' },
          { slug: 'ipad-pro-11-2024', name: 'iPad Pro 11" (2024)' },
          { slug: 'ipad-pro-129-2022', name: 'iPad Pro 12.9" (2022)' },
          { slug: 'ipad-pro-129-2021', name: 'iPad Pro 12.9" (2021)' },
          { slug: 'ipad-pro-129-2020', name: 'iPad Pro 12.9" (2020)' },
          { slug: 'ipad-pro-129-2018', name: 'iPad Pro 12.9" (2018)' },
          { slug: 'ipad-pro-11-2022', name: 'iPad Pro 11" (2022)' },
          { slug: 'ipad-pro-11-2021', name: 'iPad Pro 11" (2021)' },
          { slug: 'ipad-pro-11-2020', name: 'iPad Pro 11" (2020)' },
          { slug: 'ipad-pro-11-2018', name: 'iPad Pro 11" (2018)' },
          { slug: 'ipad-pro-105', name: 'iPad Pro 10.5" (2017)' },
          { slug: 'ipad-pro-97', name: 'iPad Pro 9.7" (2016)' },
          { slug: 'ipad-air-13-2024', name: 'iPad Air 13" (2024)' },
          { slug: 'ipad-air-11-2024', name: 'iPad Air 11" (2024)' },
          { slug: 'ipad-air-5', name: 'iPad Air 5 (2022)' },
          { slug: 'ipad-air-4', name: 'iPad Air 4 (2020)' },
          { slug: 'ipad-air-3', name: 'iPad Air 3 (2019)' },
          { slug: 'ipad-air-2', name: 'iPad Air 2 (2014)' },
          { slug: 'ipad-11-2025', name: 'iPad 11 (2025)' },
          { slug: 'ipad-10', name: 'iPad 10 (2022)' },
          { slug: 'ipad-9', name: 'iPad 9 (2021)' },
          { slug: 'ipad-8', name: 'iPad 8 (2020)' },
          { slug: 'ipad-7', name: 'iPad 7 (2019)' },
          { slug: 'ipad-6', name: 'iPad 6 (2018)' },
          { slug: 'ipad-mini-7', name: 'iPad Mini 7 (2024)' },
          { slug: 'ipad-mini-6', name: 'iPad Mini 6 (2021)' },
          { slug: 'ipad-mini-5', name: 'iPad Mini 5 (2019)' },
          { slug: 'ipad-mini-4', name: 'iPad Mini 4 (2015)' },
        ],
      },
      {
        slug: 'apple-watch', name: 'Apple Watch', nameEn: 'Apple Watch',
        models: [
          { slug: 'watch-ultra-3', name: 'Ultra 3 (49MM)' },
          { slug: 'watch-series-10-46', name: 'Series 10 (46MM)' },
          { slug: 'watch-series-10-42', name: 'Series 10 (42MM)' },
          { slug: 'watch-se3-44', name: 'SE 3rd Gen (44MM)' },
          { slug: 'watch-se3-40', name: 'SE 3rd Gen (40MM)' },
          { slug: 'watch-series-9-45', name: 'Series 9 (45MM)' },
          { slug: 'watch-series-9-41', name: 'Series 9 (41MM)' },
          { slug: 'watch-ultra-2', name: 'Ultra 2 (49MM)' },
          { slug: 'watch-ultra-1', name: 'Ultra 1 (49MM)' },
          { slug: 'watch-series-8-45', name: 'Series 8 (45MM)' },
          { slug: 'watch-series-8-41', name: 'Series 8 (41MM)' },
          { slug: 'watch-se2-44', name: 'SE 2nd Gen (44MM)' },
          { slug: 'watch-se2-40', name: 'SE 2nd Gen (40MM)' },
          { slug: 'watch-series-7-45', name: 'Series 7 (45MM)' },
          { slug: 'watch-series-7-41', name: 'Series 7 (41MM)' },
          { slug: 'watch-series-6-44', name: 'Series 6 (44MM)' },
          { slug: 'watch-series-6-40', name: 'Series 6 (40MM)' },
          { slug: 'watch-series-5-44', name: 'Series 5 (44MM)' },
          { slug: 'watch-series-5-40', name: 'Series 5 (40MM)' },
          { slug: 'watch-series-4-44', name: 'Series 4 (44MM)' },
          { slug: 'watch-series-4-40', name: 'Series 4 (40MM)' },
          { slug: 'watch-series-3-42', name: 'Series 3 (42MM)' },
          { slug: 'watch-series-3-38', name: 'Series 3 (38MM)' },
        ],
      },
      {
        slug: 'airpods', name: 'AirPods', nameEn: 'AirPods',
        models: [
          { slug: 'airpods-max-2', name: 'AirPods Max 2nd Gen' },
          { slug: 'airpods-max-1', name: 'AirPods Max 1st Gen' },
          { slug: 'airpods-pro-2', name: 'AirPods Pro 2nd Gen (2022)' },
          { slug: 'airpods-pro-1', name: 'AirPods Pro 1st Gen (2019)' },
          { slug: 'airpods-3', name: 'AirPods 3rd Gen (2021)' },
          { slug: 'airpods-2', name: 'AirPods 2nd Gen (2019)' },
          { slug: 'airpods-1', name: 'AirPods 1st Gen (2016)' },
        ],
      },
      {
        slug: 'macbook-pro', name: 'MacBook Pro', nameEn: 'MacBook Pro',
        models: [
          { slug: 'mbp-16-2024-m4', name: 'MacBook Pro 16" (2024) M4' },
          { slug: 'mbp-14-2024-m4', name: 'MacBook Pro 14" (2024) M4' },
          { slug: 'mbp-16-2023-m3', name: 'MacBook Pro 16" (2023) M3' },
          { slug: 'mbp-14-2023-m3', name: 'MacBook Pro 14" (2023) M3' },
          { slug: 'mbp-16-2023-m2', name: 'MacBook Pro 16" (2023) M2' },
          { slug: 'mbp-14-2023-m2', name: 'MacBook Pro 14" (2023) M2' },
          { slug: 'mbp-16-2021-m1', name: 'MacBook Pro 16" (2021) M1' },
          { slug: 'mbp-14-2021-m1', name: 'MacBook Pro 14" (2021) M1' },
          { slug: 'mbp-16-2019', name: 'MacBook Pro 16" (2019)' },
          { slug: 'mbp-13-2020-m1', name: 'MacBook Pro 13" (2020) M1/M2' },
          { slug: 'mbp-13-2020', name: 'MacBook Pro 13" (2020)' },
          { slug: 'mbp-13-2018', name: 'MacBook Pro 13" (2018-2019)' },
          { slug: 'mbp-13-2016', name: 'MacBook Pro 13" (2016-2017)' },
          { slug: 'mbp-15-2018', name: 'MacBook Pro 15" (2018-2019)' },
          { slug: 'mbp-15-2016', name: 'MacBook Pro 15" (2016-2017)' },
          { slug: 'mbp-15-2012-retina', name: 'MacBook Pro 15" Retina (2012-2015)' },
        ],
      },
      {
        slug: 'macbook-air', name: 'MacBook Air', nameEn: 'MacBook Air',
        models: [
          { slug: 'mba-15-2025-m4', name: 'MacBook Air 15" (2025) M4' },
          { slug: 'mba-13-2025-m4', name: 'MacBook Air 13" (2025) M4' },
          { slug: 'mba-15-2024-m3', name: 'MacBook Air 15" (2024) M3' },
          { slug: 'mba-13-2024-m3', name: 'MacBook Air 13" (2024) M3' },
          { slug: 'mba-15-2023-m2', name: 'MacBook Air 15" (2023) M2' },
          { slug: 'mba-13-2022-m2', name: 'MacBook Air 13" (2022) M2' },
          { slug: 'mba-13-2020-m1', name: 'MacBook Air 13" (2020) M1' },
          { slug: 'mba-13-2020', name: 'MacBook Air 13" (2020)' },
          { slug: 'mba-13-2019', name: 'MacBook Air 13" (2019)' },
          { slug: 'mba-13-2018', name: 'MacBook Air 13" (2018)' },
          { slug: 'mba-13-2017', name: 'MacBook Air 13" (2017)' },
        ],
      },
      {
        slug: 'imac', name: 'iMac', nameEn: 'iMac',
        models: [
          { slug: 'imac-24-2024-m4', name: 'iMac 24" (2024) M4' },
          { slug: 'imac-24-2023-m3', name: 'iMac 24" (2023) M3' },
          { slug: 'imac-24-2021-m1', name: 'iMac 24" (2021) M1' },
          { slug: 'imac-27-2020', name: 'iMac 27" (2019-2020)' },
          { slug: 'imac-27-2017', name: 'iMac 27" (2017)' },
          { slug: 'imac-215-2017', name: 'iMac 21.5" (2017)' },
        ],
      },
      {
        slug: 'mac-mini', name: 'Mac Mini', nameEn: 'Mac Mini',
        models: [
          { slug: 'mac-mini-2024-m4', name: 'Mac Mini (2024) M4' },
          { slug: 'mac-mini-2023-m2', name: 'Mac Mini (2023) M2' },
          { slug: 'mac-mini-2020-m1', name: 'Mac Mini (2020) M1' },
        ],
      },
      {
        slug: 'ipod', name: 'iPod', nameEn: 'iPod',
        models: [
          { slug: 'ipod-touch-7', name: 'iPod Touch 7' },
          { slug: 'ipod-touch-6', name: 'iPod Touch 6' },
          { slug: 'ipod-touch-5', name: 'iPod Touch 5' },
          { slug: 'ipod-nano-7', name: 'iPod Nano 7' },
          { slug: 'ipod-classic', name: 'iPod Classic' },
        ],
      },
    ],
  },
  {
    slug: 'samsung',
    name: 'Samsung',
    nameEn: 'Samsung',
    subcategories: [
      {
        slug: 'galaxy-s', name: 'Galaxy S Serie', nameEn: 'Galaxy S Series',
        models: [
          { slug: 'galaxy-s26-ultra', name: 'Galaxy S26 Ultra' },
          { slug: 'galaxy-s26-plus', name: 'Galaxy S26+' },
          { slug: 'galaxy-s26', name: 'Galaxy S26' },
          { slug: 'galaxy-s25-ultra', name: 'Galaxy S25 Ultra' },
          { slug: 'galaxy-s25-plus', name: 'Galaxy S25+' },
          { slug: 'galaxy-s25', name: 'Galaxy S25' },
          { slug: 'galaxy-s24-ultra', name: 'Galaxy S24 Ultra' },
          { slug: 'galaxy-s24-plus', name: 'Galaxy S24+' },
          { slug: 'galaxy-s24', name: 'Galaxy S24' },
          { slug: 'galaxy-s24-fe', name: 'Galaxy S24 FE' },
          { slug: 'galaxy-s23-ultra', name: 'Galaxy S23 Ultra' },
          { slug: 'galaxy-s23-plus', name: 'Galaxy S23+' },
          { slug: 'galaxy-s23', name: 'Galaxy S23' },
          { slug: 'galaxy-s23-fe', name: 'Galaxy S23 FE' },
          { slug: 'galaxy-s22-ultra', name: 'Galaxy S22 Ultra' },
          { slug: 'galaxy-s22-plus', name: 'Galaxy S22+' },
          { slug: 'galaxy-s22', name: 'Galaxy S22' },
          { slug: 'galaxy-s21-fe', name: 'Galaxy S21 FE' },
          { slug: 'galaxy-s21-ultra', name: 'Galaxy S21 Ultra' },
          { slug: 'galaxy-s21-plus', name: 'Galaxy S21+' },
          { slug: 'galaxy-s21', name: 'Galaxy S21' },
          { slug: 'galaxy-s20-fe', name: 'Galaxy S20 FE' },
          { slug: 'galaxy-s20-ultra', name: 'Galaxy S20 Ultra' },
          { slug: 'galaxy-s20-plus', name: 'Galaxy S20+' },
          { slug: 'galaxy-s20', name: 'Galaxy S20' },
          { slug: 'galaxy-s10-plus', name: 'Galaxy S10+' },
          { slug: 'galaxy-s10', name: 'Galaxy S10' },
          { slug: 'galaxy-s10e', name: 'Galaxy S10e' },
          { slug: 'galaxy-s9-plus', name: 'Galaxy S9+' },
          { slug: 'galaxy-s9', name: 'Galaxy S9' },
          { slug: 'galaxy-s8-plus', name: 'Galaxy S8+' },
          { slug: 'galaxy-s8', name: 'Galaxy S8' },
          { slug: 'galaxy-s7-edge', name: 'Galaxy S7 Edge' },
          { slug: 'galaxy-s7', name: 'Galaxy S7' },
          { slug: 'galaxy-s6-edge-plus', name: 'Galaxy S6 Edge+' },
          { slug: 'galaxy-s6-edge', name: 'Galaxy S6 Edge' },
          { slug: 'galaxy-s6', name: 'Galaxy S6' },
          { slug: 'galaxy-s5', name: 'Galaxy S5' },
        ],
      },
      {
        slug: 'galaxy-a', name: 'Galaxy A Serie', nameEn: 'Galaxy A Series',
        models: [
          { slug: 'galaxy-a56', name: 'Galaxy A56 5G' },
          { slug: 'galaxy-a55', name: 'Galaxy A55' },
          { slug: 'galaxy-a54', name: 'Galaxy A54 5G' },
          { slug: 'galaxy-a53', name: 'Galaxy A53 5G' },
          { slug: 'galaxy-a52', name: 'Galaxy A52' },
          { slug: 'galaxy-a51', name: 'Galaxy A51' },
          { slug: 'galaxy-a50', name: 'Galaxy A50' },
          { slug: 'galaxy-a36', name: 'Galaxy A36 5G' },
          { slug: 'galaxy-a35', name: 'Galaxy A35 5G' },
          { slug: 'galaxy-a34', name: 'Galaxy A34 5G' },
          { slug: 'galaxy-a33', name: 'Galaxy A33 5G' },
          { slug: 'galaxy-a32', name: 'Galaxy A32' },
          { slug: 'galaxy-a31', name: 'Galaxy A31' },
          { slug: 'galaxy-a26', name: 'Galaxy A26 5G' },
          { slug: 'galaxy-a25', name: 'Galaxy A25 5G' },
          { slug: 'galaxy-a24', name: 'Galaxy A24' },
          { slug: 'galaxy-a23', name: 'Galaxy A23' },
          { slug: 'galaxy-a22', name: 'Galaxy A22' },
          { slug: 'galaxy-a21s', name: 'Galaxy A21s' },
          { slug: 'galaxy-a16', name: 'Galaxy A16' },
          { slug: 'galaxy-a15', name: 'Galaxy A15' },
          { slug: 'galaxy-a14', name: 'Galaxy A14' },
          { slug: 'galaxy-a13', name: 'Galaxy A13' },
          { slug: 'galaxy-a12', name: 'Galaxy A12' },
          { slug: 'galaxy-a06', name: 'Galaxy A06' },
          { slug: 'galaxy-a05s', name: 'Galaxy A05s' },
          { slug: 'galaxy-a05', name: 'Galaxy A05' },
          { slug: 'galaxy-a04', name: 'Galaxy A04' },
          { slug: 'galaxy-a03s', name: 'Galaxy A03s' },
        ],
      },
      {
        slug: 'galaxy-z', name: 'Galaxy Z Serie', nameEn: 'Galaxy Z Series',
        models: [
          { slug: 'galaxy-z-fold-7', name: 'Galaxy Z Fold 7' },
          { slug: 'galaxy-z-fold-6', name: 'Galaxy Z Fold 6' },
          { slug: 'galaxy-z-fold-5', name: 'Galaxy Z Fold 5' },
          { slug: 'galaxy-z-fold-4', name: 'Galaxy Z Fold 4' },
          { slug: 'galaxy-z-fold-3', name: 'Galaxy Z Fold 3' },
          { slug: 'galaxy-z-fold-2', name: 'Galaxy Z Fold 2' },
          { slug: 'galaxy-z-fold', name: 'Galaxy Z Fold' },
          { slug: 'galaxy-z-flip-7', name: 'Galaxy Z Flip 7' },
          { slug: 'galaxy-z-flip-6', name: 'Galaxy Z Flip 6' },
          { slug: 'galaxy-z-flip-5', name: 'Galaxy Z Flip 5' },
          { slug: 'galaxy-z-flip-4', name: 'Galaxy Z Flip 4' },
          { slug: 'galaxy-z-flip-3', name: 'Galaxy Z Flip 3' },
          { slug: 'galaxy-z-flip', name: 'Galaxy Z Flip' },
        ],
      },
      {
        slug: 'galaxy-note', name: 'Galaxy Note', nameEn: 'Galaxy Note',
        models: [
          { slug: 'galaxy-note-20-ultra', name: 'Galaxy Note 20 Ultra' },
          { slug: 'galaxy-note-20', name: 'Galaxy Note 20' },
          { slug: 'galaxy-note-10-plus', name: 'Galaxy Note 10+' },
          { slug: 'galaxy-note-10', name: 'Galaxy Note 10' },
          { slug: 'galaxy-note-9', name: 'Galaxy Note 9' },
          { slug: 'galaxy-note-8', name: 'Galaxy Note 8' },
        ],
      },
      {
        slug: 'galaxy-tab', name: 'Galaxy Tab', nameEn: 'Galaxy Tab',
        models: [
          { slug: 'tab-s10-ultra', name: 'Tab S10 Ultra' },
          { slug: 'tab-s10-plus', name: 'Tab S10+' },
          { slug: 'tab-s10', name: 'Tab S10' },
          { slug: 'tab-s9-ultra', name: 'Tab S9 Ultra' },
          { slug: 'tab-s9-plus', name: 'Tab S9+' },
          { slug: 'tab-s9', name: 'Tab S9' },
          { slug: 'tab-s9-fe', name: 'Tab S9 FE' },
          { slug: 'tab-s8-ultra', name: 'Tab S8 Ultra' },
          { slug: 'tab-s8-plus', name: 'Tab S8+' },
          { slug: 'tab-s8', name: 'Tab S8' },
          { slug: 'tab-s7-plus', name: 'Tab S7+' },
          { slug: 'tab-s7', name: 'Tab S7' },
          { slug: 'tab-s6-lite', name: 'Tab S6 Lite' },
          { slug: 'tab-a9', name: 'Tab A9' },
          { slug: 'tab-a8', name: 'Tab A8' },
          { slug: 'tab-a7', name: 'Tab A7' },
        ],
      },
      {
        slug: 'galaxy-watch', name: 'Galaxy Watch', nameEn: 'Galaxy Watch',
        models: [
          { slug: 'watch-8-44', name: 'Watch 8 (44mm)' },
          { slug: 'watch-8-40', name: 'Watch 8 (40mm)' },
          { slug: 'watch-ultra-47', name: 'Watch Ultra (47mm)' },
          { slug: 'watch-7-44', name: 'Watch 7 (44mm)' },
          { slug: 'watch-7-40', name: 'Watch 7 (40mm)' },
          { slug: 'watch-6-44', name: 'Watch 6 (44mm)' },
          { slug: 'watch-6-40', name: 'Watch 6 (40mm)' },
          { slug: 'watch-5-pro', name: 'Watch 5 Pro (45mm)' },
          { slug: 'watch-5-44', name: 'Watch 5 (44mm)' },
          { slug: 'watch-5-40', name: 'Watch 5 (40mm)' },
          { slug: 'watch-4-44', name: 'Watch 4 (44mm)' },
          { slug: 'watch-4-40', name: 'Watch 4 (40mm)' },
        ],
      },
      {
        slug: 'galaxy-buds', name: 'Galaxy Buds', nameEn: 'Galaxy Buds',
        models: [
          { slug: 'buds-3-pro', name: 'Galaxy Buds 3 Pro' },
          { slug: 'buds-3', name: 'Galaxy Buds 3' },
          { slug: 'buds-2-pro', name: 'Galaxy Buds 2 Pro' },
          { slug: 'buds-2', name: 'Galaxy Buds 2' },
          { slug: 'buds-pro', name: 'Galaxy Buds Pro' },
          { slug: 'buds-live', name: 'Galaxy Buds Live' },
          { slug: 'buds-plus', name: 'Galaxy Buds+' },
        ],
      },
      {
        slug: 'galaxy-m', name: 'Galaxy M Serie', nameEn: 'Galaxy M Series',
        models: [
          { slug: 'galaxy-m54', name: 'Galaxy M54' },
          { slug: 'galaxy-m53', name: 'Galaxy M53' },
          { slug: 'galaxy-m35', name: 'Galaxy M35' },
          { slug: 'galaxy-m34', name: 'Galaxy M34' },
          { slug: 'galaxy-m33', name: 'Galaxy M33' },
          { slug: 'galaxy-m15', name: 'Galaxy M15' },
          { slug: 'galaxy-m14', name: 'Galaxy M14' },
        ],
      },
      {
        slug: 'galaxy-xcover', name: 'Galaxy XCover', nameEn: 'Galaxy XCover',
        models: [
          { slug: 'xcover-7-pro', name: 'XCover 7 Pro' },
          { slug: 'xcover-7', name: 'XCover 7' },
          { slug: 'xcover-6-pro', name: 'XCover 6 Pro' },
          { slug: 'xcover-5', name: 'XCover 5' },
        ],
      },
    ],
  },
  {
    slug: 'google',
    name: 'Google',
    nameEn: 'Google',
    subcategories: [
      {
        slug: 'pixel-phone', name: 'Pixel Telefoon', nameEn: 'Pixel Phone',
        models: [
          { slug: 'pixel-9-pro-xl', name: 'Pixel 9 Pro XL' },
          { slug: 'pixel-9-pro', name: 'Pixel 9 Pro' },
          { slug: 'pixel-9', name: 'Pixel 9' },
          { slug: 'pixel-9a', name: 'Pixel 9a' },
          { slug: 'pixel-8-pro', name: 'Pixel 8 Pro' },
          { slug: 'pixel-8', name: 'Pixel 8' },
          { slug: 'pixel-8a', name: 'Pixel 8a' },
          { slug: 'pixel-7-pro', name: 'Pixel 7 Pro' },
          { slug: 'pixel-7', name: 'Pixel 7' },
          { slug: 'pixel-7a', name: 'Pixel 7a' },
          { slug: 'pixel-6-pro', name: 'Pixel 6 Pro' },
          { slug: 'pixel-6', name: 'Pixel 6' },
          { slug: 'pixel-6a', name: 'Pixel 6a' },
          { slug: 'pixel-5', name: 'Pixel 5' },
          { slug: 'pixel-4a', name: 'Pixel 4a' },
          { slug: 'pixel-4-xl', name: 'Pixel 4 XL' },
          { slug: 'pixel-4', name: 'Pixel 4' },
          { slug: 'pixel-3a-xl', name: 'Pixel 3a XL' },
          { slug: 'pixel-3a', name: 'Pixel 3a' },
        ],
      },
      {
        slug: 'pixel-tablet', name: 'Pixel Tablet', nameEn: 'Pixel Tablet',
        models: [
          { slug: 'pixel-tablet-2023', name: 'Pixel Tablet (2023)' },
        ],
      },
      {
        slug: 'pixel-watch', name: 'Pixel Watch', nameEn: 'Pixel Watch',
        models: [
          { slug: 'pixel-watch-3', name: 'Pixel Watch 3' },
          { slug: 'pixel-watch-2', name: 'Pixel Watch 2' },
          { slug: 'pixel-watch-1', name: 'Pixel Watch' },
        ],
      },
    ],
  },
  {
    slug: 'huawei',
    name: 'Huawei',
    nameEn: 'Huawei',
    subcategories: [
      {
        slug: 'huawei-p', name: 'P Serie', nameEn: 'P Series',
        models: [
          { slug: 'p60-pro', name: 'P60 Pro' },
          { slug: 'p50-pro', name: 'P50 Pro' },
          { slug: 'p50', name: 'P50' },
          { slug: 'p40-pro-plus', name: 'P40 Pro+' },
          { slug: 'p40-pro', name: 'P40 Pro' },
          { slug: 'p40', name: 'P40' },
          { slug: 'p40-lite', name: 'P40 Lite' },
          { slug: 'p30-pro', name: 'P30 Pro' },
          { slug: 'p30', name: 'P30' },
          { slug: 'p30-lite', name: 'P30 Lite' },
          { slug: 'p20-pro', name: 'P20 Pro' },
          { slug: 'p20', name: 'P20' },
          { slug: 'p20-lite', name: 'P20 Lite' },
        ],
      },
      {
        slug: 'huawei-mate', name: 'Mate Serie', nameEn: 'Mate Series',
        models: [
          { slug: 'mate-60-pro', name: 'Mate 60 Pro' },
          { slug: 'mate-50-pro', name: 'Mate 50 Pro' },
          { slug: 'mate-40-pro', name: 'Mate 40 Pro' },
          { slug: 'mate-30-pro', name: 'Mate 30 Pro' },
          { slug: 'mate-20-pro', name: 'Mate 20 Pro' },
          { slug: 'mate-20', name: 'Mate 20' },
          { slug: 'mate-20-lite', name: 'Mate 20 Lite' },
        ],
      },
      {
        slug: 'huawei-nova', name: 'Nova Serie', nameEn: 'Nova Series',
        models: [
          { slug: 'nova-12', name: 'Nova 12' },
          { slug: 'nova-11', name: 'Nova 11' },
          { slug: 'nova-10', name: 'Nova 10' },
          { slug: 'nova-9', name: 'Nova 9' },
        ],
      },
    ],
  },
  {
    slug: 'xiaomi',
    name: 'Xiaomi',
    nameEn: 'Xiaomi',
    subcategories: [
      {
        slug: 'xiaomi-phone', name: 'Xiaomi Telefoon', nameEn: 'Xiaomi Phone',
        models: [
          { slug: 'xiaomi-15-pro', name: 'Xiaomi 15 Pro' },
          { slug: 'xiaomi-15', name: 'Xiaomi 15' },
          { slug: 'xiaomi-14-ultra', name: 'Xiaomi 14 Ultra' },
          { slug: 'xiaomi-14-pro', name: 'Xiaomi 14 Pro' },
          { slug: 'xiaomi-14', name: 'Xiaomi 14' },
          { slug: 'xiaomi-13-pro', name: 'Xiaomi 13 Pro' },
          { slug: 'xiaomi-13', name: 'Xiaomi 13' },
          { slug: 'xiaomi-12-pro', name: 'Xiaomi 12 Pro' },
          { slug: 'xiaomi-12', name: 'Xiaomi 12' },
        ],
      },
      {
        slug: 'redmi', name: 'Redmi', nameEn: 'Redmi',
        models: [
          { slug: 'redmi-note-14-pro-plus', name: 'Redmi Note 14 Pro+' },
          { slug: 'redmi-note-14-pro', name: 'Redmi Note 14 Pro' },
          { slug: 'redmi-note-14', name: 'Redmi Note 14' },
          { slug: 'redmi-note-13-pro-plus', name: 'Redmi Note 13 Pro+' },
          { slug: 'redmi-note-13-pro', name: 'Redmi Note 13 Pro' },
          { slug: 'redmi-note-13', name: 'Redmi Note 13' },
          { slug: 'redmi-note-12-pro', name: 'Redmi Note 12 Pro' },
          { slug: 'redmi-note-12', name: 'Redmi Note 12' },
          { slug: 'redmi-14c', name: 'Redmi 14C' },
          { slug: 'redmi-13c', name: 'Redmi 13C' },
          { slug: 'redmi-a3', name: 'Redmi A3' },
          { slug: 'redmi-a2', name: 'Redmi A2' },
        ],
      },
      {
        slug: 'poco', name: 'POCO', nameEn: 'POCO',
        models: [
          { slug: 'poco-f6-pro', name: 'POCO F6 Pro' },
          { slug: 'poco-f6', name: 'POCO F6' },
          { slug: 'poco-x6-pro', name: 'POCO X6 Pro' },
          { slug: 'poco-x6', name: 'POCO X6' },
          { slug: 'poco-m6-pro', name: 'POCO M6 Pro' },
          { slug: 'poco-m6', name: 'POCO M6' },
        ],
      },
    ],
  },
  {
    slug: 'motorola',
    name: 'Motorola',
    nameEn: 'Motorola',
    subcategories: [
      {
        slug: 'moto-g', name: 'Moto G Serie', nameEn: 'Moto G Series',
        models: [
          { slug: 'moto-g85', name: 'Moto G85' },
          { slug: 'moto-g84', name: 'Moto G84' },
          { slug: 'moto-g73', name: 'Moto G73' },
          { slug: 'moto-g54', name: 'Moto G54' },
          { slug: 'moto-g34', name: 'Moto G34' },
          { slug: 'moto-g24', name: 'Moto G24' },
          { slug: 'moto-g-power', name: 'Moto G Power' },
          { slug: 'moto-g-stylus', name: 'Moto G Stylus' },
        ],
      },
      {
        slug: 'moto-edge', name: 'Moto Edge', nameEn: 'Moto Edge',
        models: [
          { slug: 'edge-50-ultra', name: 'Edge 50 Ultra' },
          { slug: 'edge-50-pro', name: 'Edge 50 Pro' },
          { slug: 'edge-50-fusion', name: 'Edge 50 Fusion' },
          { slug: 'edge-40-pro', name: 'Edge 40 Pro' },
          { slug: 'edge-40', name: 'Edge 40' },
        ],
      },
      {
        slug: 'moto-razr', name: 'Moto Razr', nameEn: 'Moto Razr',
        models: [
          { slug: 'razr-50-ultra', name: 'Razr 50 Ultra' },
          { slug: 'razr-50', name: 'Razr 50' },
          { slug: 'razr-40-ultra', name: 'Razr 40 Ultra' },
          { slug: 'razr-40', name: 'Razr 40' },
        ],
      },
    ],
  },
  {
    slug: 'oneplus',
    name: 'OnePlus',
    nameEn: 'OnePlus',
    subcategories: [
      {
        slug: 'oneplus-phone', name: 'OnePlus Telefoon', nameEn: 'OnePlus Phone',
        models: [
          { slug: 'oneplus-13', name: 'OnePlus 13' },
          { slug: 'oneplus-12', name: 'OnePlus 12' },
          { slug: 'oneplus-11', name: 'OnePlus 11' },
          { slug: 'oneplus-10-pro', name: 'OnePlus 10 Pro' },
          { slug: 'oneplus-10t', name: 'OnePlus 10T' },
          { slug: 'oneplus-9-pro', name: 'OnePlus 9 Pro' },
          { slug: 'oneplus-9', name: 'OnePlus 9' },
        ],
      },
      {
        slug: 'oneplus-nord', name: 'OnePlus Nord', nameEn: 'OnePlus Nord',
        models: [
          { slug: 'nord-4', name: 'Nord 4' },
          { slug: 'nord-3', name: 'Nord 3' },
          { slug: 'nord-ce-4', name: 'Nord CE 4' },
          { slug: 'nord-ce-3', name: 'Nord CE 3' },
          { slug: 'nord-n30', name: 'Nord N30' },
        ],
      },
    ],
  },
  {
    slug: 'oppo',
    name: 'OPPO',
    nameEn: 'OPPO',
    subcategories: [
      {
        slug: 'oppo-find', name: 'Find Serie', nameEn: 'Find Series',
        models: [
          { slug: 'find-x8-pro', name: 'Find X8 Pro' },
          { slug: 'find-x8', name: 'Find X8' },
          { slug: 'find-x7-ultra', name: 'Find X7 Ultra' },
          { slug: 'find-x6-pro', name: 'Find X6 Pro' },
          { slug: 'find-n3-flip', name: 'Find N3 Flip' },
        ],
      },
      {
        slug: 'oppo-reno', name: 'Reno Serie', nameEn: 'Reno Series',
        models: [
          { slug: 'reno-12-pro', name: 'Reno 12 Pro' },
          { slug: 'reno-12', name: 'Reno 12' },
          { slug: 'reno-11-pro', name: 'Reno 11 Pro' },
          { slug: 'reno-11', name: 'Reno 11' },
          { slug: 'reno-10-pro', name: 'Reno 10 Pro' },
        ],
      },
      {
        slug: 'oppo-a', name: 'A Serie', nameEn: 'A Series',
        models: [
          { slug: 'oppo-a80', name: 'A80' },
          { slug: 'oppo-a60', name: 'A60' },
          { slug: 'oppo-a38', name: 'A38' },
          { slug: 'oppo-a18', name: 'A18' },
          { slug: 'oppo-a17', name: 'A17' },
        ],
      },
    ],
  },
  {
    slug: 'nokia',
    name: 'Nokia',
    nameEn: 'Nokia',
    subcategories: [
      {
        slug: 'nokia-g', name: 'G Serie', nameEn: 'G Series',
        models: [
          { slug: 'nokia-g60', name: 'Nokia G60' },
          { slug: 'nokia-g50', name: 'Nokia G50' },
          { slug: 'nokia-g42', name: 'Nokia G42' },
          { slug: 'nokia-g400', name: 'Nokia G400' },
          { slug: 'nokia-g300', name: 'Nokia G300' },
          { slug: 'nokia-g22', name: 'Nokia G22' },
          { slug: 'nokia-g21', name: 'Nokia G21' },
          { slug: 'nokia-g20', name: 'Nokia G20' },
          { slug: 'nokia-g11', name: 'Nokia G11' },
          { slug: 'nokia-g10', name: 'Nokia G10' },
        ],
      },
      {
        slug: 'nokia-x', name: 'X Serie', nameEn: 'X Series',
        models: [
          { slug: 'nokia-xr21', name: 'Nokia XR21' },
          { slug: 'nokia-xr20', name: 'Nokia XR20' },
          { slug: 'nokia-x30', name: 'Nokia X30' },
          { slug: 'nokia-x100', name: 'Nokia X100' },
          { slug: 'nokia-x20', name: 'Nokia X20' },
          { slug: 'nokia-x10', name: 'Nokia X10' },
        ],
      },
      {
        slug: 'nokia-number', name: 'Nummer Serie', nameEn: 'Number Series',
        models: [
          { slug: 'nokia-8-3-5g', name: 'Nokia 8.3 5G' },
          { slug: 'nokia-8-1', name: 'Nokia 8.1' },
          { slug: 'nokia-8-sirocco', name: 'Nokia 8 Sirocco' },
          { slug: 'nokia-7-2', name: 'Nokia 7.2' },
          { slug: 'nokia-7-plus', name: 'Nokia 7 Plus' },
          { slug: 'nokia-6-2', name: 'Nokia 6.2' },
          { slug: 'nokia-6-1', name: 'Nokia 6.1' },
          { slug: 'nokia-5-4', name: 'Nokia 5.4' },
          { slug: 'nokia-5-3', name: 'Nokia 5.3' },
          { slug: 'nokia-3-4', name: 'Nokia 3.4' },
        ],
      },
      {
        slug: 'nokia-c', name: 'C Serie', nameEn: 'C Series',
        models: [
          { slug: 'nokia-c32', name: 'Nokia C32' },
          { slug: 'nokia-c12', name: 'Nokia C12' },
        ],
      },
      {
        slug: 'nokia-lumia', name: 'Lumia', nameEn: 'Lumia',
        models: [
          { slug: 'nokia-lumia-1520', name: 'Lumia 1520' },
          { slug: 'nokia-lumia-1020', name: 'Lumia 1020' },
          { slug: 'nokia-lumia-925', name: 'Lumia 925' },
          { slug: 'nokia-lumia-920', name: 'Lumia 920' },
          { slug: 'nokia-lumia-820', name: 'Lumia 820' },
          { slug: 'nokia-lumia-635', name: 'Lumia 635' },
          { slug: 'nokia-lumia-520', name: 'Lumia 520' },
        ],
      },
    ],
  },
  {
    slug: 'sony',
    name: 'Sony',
    nameEn: 'Sony',
    subcategories: [
      {
        slug: 'sony-xperia', name: 'Xperia', nameEn: 'Xperia',
        models: [
          { slug: 'xperia-1-vi', name: 'Xperia 1 VI' },
          { slug: 'xperia-5-v', name: 'Xperia 5 V' },
          { slug: 'xperia-10-vi', name: 'Xperia 10 VI' },
          { slug: 'xperia-1-v', name: 'Xperia 1 V' },
        ],
      },
    ],
  },
  {
    slug: 'lg',
    name: 'LG',
    nameEn: 'LG',
    subcategories: [
      {
        slug: 'lg-phone', name: 'LG Telefoon', nameEn: 'LG Phone',
        models: [
          { slug: 'lg-velvet', name: 'LG Velvet' },
          { slug: 'lg-v60', name: 'LG V60 ThinQ' },
          { slug: 'lg-g8', name: 'LG G8 ThinQ' },
          { slug: 'lg-stylo-6', name: 'LG Stylo 6' },
          { slug: 'lg-k92', name: 'LG K92' },
        ],
      },
    ],
  },
  {
    slug: 'honor',
    name: 'Honor',
    nameEn: 'Honor',
    subcategories: [
      {
        slug: 'honor-magic', name: 'Magic Serie', nameEn: 'Magic Series',
        models: [
          { slug: 'honor-magic-7-pro', name: 'Magic 7 Pro' },
          { slug: 'honor-magic-6-pro', name: 'Magic 6 Pro' },
          { slug: 'honor-magic-6', name: 'Magic 6' },
          { slug: 'honor-magic-5-pro', name: 'Magic 5 Pro' },
          { slug: 'honor-magic-v3', name: 'Magic V3' },
          { slug: 'honor-magic-v2', name: 'Magic V2' },
          { slug: 'honor-magic-vs', name: 'Magic Vs' },
        ],
      },
      {
        slug: 'honor-number', name: 'Honor Serie', nameEn: 'Honor Series',
        models: [
          { slug: 'honor-200-pro', name: 'Honor 200 Pro' },
          { slug: 'honor-200', name: 'Honor 200' },
          { slug: 'honor-90', name: 'Honor 90' },
          { slug: 'honor-90-lite', name: 'Honor 90 Lite' },
          { slug: 'honor-70', name: 'Honor 70' },
          { slug: 'honor-50', name: 'Honor 50' },
        ],
      },
      {
        slug: 'honor-x', name: 'X Serie', nameEn: 'X Series',
        models: [
          { slug: 'honor-x8b', name: 'Honor X8b' },
          { slug: 'honor-x8a', name: 'Honor X8a' },
          { slug: 'honor-x7b', name: 'Honor X7b' },
          { slug: 'honor-x6a', name: 'Honor X6a' },
        ],
      },
    ],
  },
  {
    slug: 'nothing',
    name: 'Nothing',
    nameEn: 'Nothing',
    subcategories: [
      {
        slug: 'nothing-phone', name: 'Nothing Phone', nameEn: 'Nothing Phone',
        models: [
          { slug: 'nothing-phone-2a-plus', name: 'Phone (2a) Plus' },
          { slug: 'nothing-phone-2a', name: 'Phone (2a)' },
          { slug: 'nothing-phone-2', name: 'Phone (2)' },
          { slug: 'nothing-phone-1', name: 'Phone (1)' },
          { slug: 'cmf-phone-1', name: 'CMF Phone 1' },
        ],
      },
    ],
  },
  {
    slug: 'realme',
    name: 'Realme',
    nameEn: 'Realme',
    subcategories: [
      {
        slug: 'realme-number', name: 'Realme Serie', nameEn: 'Realme Series',
        models: [
          { slug: 'realme-13-plus', name: 'Realme 13+' },
          { slug: 'realme-13-5g', name: 'Realme 13 5G' },
          { slug: 'realme-12-pro-plus', name: 'Realme 12 Pro+' },
          { slug: 'realme-12-pro', name: 'Realme 12 Pro' },
          { slug: 'realme-12', name: 'Realme 12' },
          { slug: 'realme-11-pro-plus', name: 'Realme 11 Pro+' },
          { slug: 'realme-11-pro', name: 'Realme 11 Pro' },
          { slug: 'realme-10-pro-plus', name: 'Realme 10 Pro+' },
          { slug: 'realme-9-pro-plus', name: 'Realme 9 Pro+' },
          { slug: 'realme-8-pro', name: 'Realme 8 Pro' },
        ],
      },
      {
        slug: 'realme-gt', name: 'GT Serie', nameEn: 'GT Series',
        models: [
          { slug: 'realme-gt-6', name: 'GT 6' },
          { slug: 'realme-gt-5-pro', name: 'GT 5 Pro' },
          { slug: 'realme-gt-neo-6', name: 'GT Neo 6' },
          { slug: 'realme-gt-neo-3', name: 'GT Neo 3' },
          { slug: 'realme-gt-master', name: 'GT Master' },
        ],
      },
      {
        slug: 'realme-c', name: 'C Serie', nameEn: 'C Series',
        models: [
          { slug: 'realme-c75', name: 'C75' },
          { slug: 'realme-c67', name: 'C67' },
          { slug: 'realme-c63', name: 'C63' },
          { slug: 'realme-c55', name: 'C55' },
          { slug: 'realme-c33', name: 'C33' },
          { slug: 'realme-c31', name: 'C31' },
        ],
      },
      {
        slug: 'realme-narzo', name: 'Narzo Serie', nameEn: 'Narzo Series',
        models: [
          { slug: 'realme-narzo-50-pro', name: 'Narzo 50 Pro' },
          { slug: 'realme-narzo-50', name: 'Narzo 50' },
          { slug: 'realme-narzo-30-pro', name: 'Narzo 30 Pro' },
        ],
      },
    ],
  },
  {
    slug: 'vivo',
    name: 'Vivo',
    nameEn: 'Vivo',
    subcategories: [
      {
        slug: 'vivo-x', name: 'X Serie', nameEn: 'X Series',
        models: [
          { slug: 'vivo-x200-pro', name: 'X200 Pro' },
          { slug: 'vivo-x200', name: 'X200' },
          { slug: 'vivo-x100-pro', name: 'X100 Pro' },
          { slug: 'vivo-x100', name: 'X100' },
        ],
      },
      {
        slug: 'vivo-v', name: 'V Serie', nameEn: 'V Series',
        models: [
          { slug: 'vivo-v30', name: 'V30' },
          { slug: 'vivo-v27-pro', name: 'V27 Pro' },
          { slug: 'vivo-v23-5g', name: 'V23 5G' },
          { slug: 'vivo-v20', name: 'V20' },
        ],
      },
      {
        slug: 'vivo-y', name: 'Y Serie', nameEn: 'Y Series',
        models: [
          { slug: 'vivo-y300i', name: 'Y300i' },
          { slug: 'vivo-y200-plus', name: 'Y200 Plus' },
          { slug: 'vivo-y77-5g', name: 'Y77 5G' },
          { slug: 'vivo-y55-5g', name: 'Y55 5G' },
          { slug: 'vivo-y39-5g', name: 'Y39 5G' },
          { slug: 'vivo-y28-5g', name: 'Y28 5G' },
          { slug: 'vivo-y22', name: 'Y22' },
          { slug: 'vivo-y21', name: 'Y21' },
          { slug: 'vivo-y03', name: 'Y03' },
        ],
      },
      {
        slug: 'vivo-s', name: 'S Serie', nameEn: 'S Series',
        models: [
          { slug: 'vivo-s19-pro', name: 'S19 Pro' },
          { slug: 'vivo-s18-pro', name: 'S18 Pro' },
          { slug: 'vivo-s18', name: 'S18' },
        ],
      },
    ],
  },
  {
    slug: 'tcl',
    name: 'TCL',
    nameEn: 'TCL',
    subcategories: [
      {
        slug: 'tcl-phone', name: 'TCL Telefoon', nameEn: 'TCL Phone',
        models: [
          { slug: 'tcl-50-le', name: 'TCL 50 LE' },
          { slug: 'tcl-50-xl-5g', name: 'TCL 50 XL 5G' },
          { slug: 'tcl-50-5g', name: 'TCL 50 5G' },
          { slug: 'tcl-40-se', name: 'TCL 40 SE' },
          { slug: 'tcl-40-xl', name: 'TCL 40 XL' },
          { slug: 'tcl-stylus-5g', name: 'TCL Stylus 5G' },
          { slug: 'tcl-30-xl', name: 'TCL 30 XL' },
          { slug: 'tcl-30-se', name: 'TCL 30 SE' },
          { slug: 'tcl-30', name: 'TCL 30' },
          { slug: 'tcl-20-se', name: 'TCL 20 SE' },
          { slug: 'tcl-10-pro', name: 'TCL 10 Pro' },
          { slug: 'tcl-10l', name: 'TCL 10L' },
        ],
      },
      {
        slug: 'tcl-tab', name: 'TCL Tablet', nameEn: 'TCL Tablet',
        models: [
          { slug: 'tcl-tab-pro-5g', name: 'Tab Pro 5G' },
          { slug: 'tcl-tab-10s', name: 'Tab 10S' },
          { slug: 'tcl-tab-10-5g', name: 'Tab 10 5G' },
          { slug: 'tcl-tab-8-4g', name: 'Tab 8 4G' },
        ],
      },
    ],
  },
  {
    slug: 'zte',
    name: 'ZTE',
    nameEn: 'ZTE',
    subcategories: [
      {
        slug: 'zte-blade', name: 'Blade Serie', nameEn: 'Blade Series',
        models: [
          { slug: 'zte-blade-v60', name: 'Blade V60 Smart' },
          { slug: 'zte-blade-a75-5g', name: 'Blade A75 5G' },
          { slug: 'zte-blade-a75', name: 'Blade A75 4G' },
          { slug: 'zte-blade-a72', name: 'Blade A72' },
          { slug: 'zte-blade-a71', name: 'Blade A71' },
          { slug: 'zte-blade-a52', name: 'Blade A52' },
          { slug: 'zte-blade-a51', name: 'Blade A51' },
          { slug: 'zte-blade-v40', name: 'Blade V40 Smart' },
        ],
      },
      {
        slug: 'zte-axon', name: 'Axon Serie', nameEn: 'Axon Series',
        models: [
          { slug: 'zte-axon-60-lite', name: 'Axon 60 Lite' },
          { slug: 'zte-axon-30-ultra', name: 'Axon 30 Ultra 5G' },
          { slug: 'zte-axon-30', name: 'Axon 30 5G' },
        ],
      },
    ],
  },
  {
    slug: 'asus',
    name: 'ASUS',
    nameEn: 'ASUS',
    subcategories: [
      {
        slug: 'asus-rog-phone', name: 'ROG Phone', nameEn: 'ROG Phone',
        models: [
          { slug: 'rog-phone-9-pro', name: 'ROG Phone 9 Pro' },
          { slug: 'rog-phone-9', name: 'ROG Phone 9' },
          { slug: 'rog-phone-8-pro', name: 'ROG Phone 8 Pro' },
          { slug: 'rog-phone-8', name: 'ROG Phone 8' },
          { slug: 'rog-phone-7-pro', name: 'ROG Phone 7 Pro' },
          { slug: 'rog-phone-7', name: 'ROG Phone 7' },
          { slug: 'rog-phone-6-pro', name: 'ROG Phone 6 Pro' },
          { slug: 'rog-phone-6', name: 'ROG Phone 6' },
          { slug: 'rog-phone-5', name: 'ROG Phone 5' },
        ],
      },
      {
        slug: 'asus-zenfone', name: 'Zenfone', nameEn: 'Zenfone',
        models: [
          { slug: 'zenfone-11-ultra', name: 'Zenfone 11 Ultra' },
          { slug: 'zenfone-10', name: 'Zenfone 10' },
          { slug: 'zenfone-9', name: 'Zenfone 9' },
          { slug: 'zenfone-8-flip', name: 'Zenfone 8 Flip' },
          { slug: 'zenfone-8', name: 'Zenfone 8' },
        ],
      },
      {
        slug: 'asus-laptop', name: 'ASUS Laptop', nameEn: 'ASUS Laptop',
        models: [
          { slug: 'asus-rog-strix-g16', name: 'ROG Strix G16' },
          { slug: 'asus-rog-strix-g15', name: 'ROG Strix G15' },
          { slug: 'asus-rog-zephyrus-g14', name: 'ROG Zephyrus G14' },
          { slug: 'asus-rog-zephyrus-g16', name: 'ROG Zephyrus G16' },
          { slug: 'asus-vivobook-15', name: 'VivoBook 15' },
          { slug: 'asus-vivobook-16', name: 'VivoBook 16' },
          { slug: 'asus-zenbook-14', name: 'ZenBook 14' },
          { slug: 'asus-zenbook-15', name: 'ZenBook 15' },
          { slug: 'asus-tuf-gaming', name: 'TUF Gaming' },
          { slug: 'asus-chromebook', name: 'Chromebook' },
        ],
      },
    ],
  },
  {
    slug: 'lenovo',
    name: 'Lenovo',
    nameEn: 'Lenovo',
    subcategories: [
      {
        slug: 'lenovo-tab-m', name: 'Tab M Serie', nameEn: 'Tab M Series',
        models: [
          { slug: 'lenovo-tab-m11', name: 'Tab M11 (TB-330)' },
          { slug: 'lenovo-tab-m10-plus-3', name: 'Tab M10 Plus 3rd Gen' },
          { slug: 'lenovo-tab-m10-3', name: 'Tab M10 3rd Gen' },
          { slug: 'lenovo-tab-m10-2-fhd', name: 'Tab M10 2nd Gen FHD+' },
          { slug: 'lenovo-tab-m10-fhd', name: 'Tab M10 FHD' },
          { slug: 'lenovo-tab-m10-hd', name: 'Tab M10 HD' },
          { slug: 'lenovo-tab-m8-3', name: 'Tab M8 3rd Gen' },
        ],
      },
      {
        slug: 'lenovo-tab-p', name: 'Tab P Serie', nameEn: 'Tab P Series',
        models: [
          { slug: 'lenovo-tab-p12-pro', name: 'Tab P12 Pro' },
          { slug: 'lenovo-tab-p12', name: 'Tab P12' },
          { slug: 'lenovo-tab-p11-pro-2', name: 'Tab P11 Pro 2nd Gen' },
          { slug: 'lenovo-tab-p11-plus', name: 'Tab P11 Plus' },
        ],
      },
      {
        slug: 'lenovo-thinkpad', name: 'ThinkPad', nameEn: 'ThinkPad',
        models: [
          { slug: 'thinkpad-x1-carbon-g12', name: 'X1 Carbon Gen 12' },
          { slug: 'thinkpad-x1-carbon-g11', name: 'X1 Carbon Gen 11' },
          { slug: 'thinkpad-x1-carbon-g10', name: 'X1 Carbon Gen 10' },
          { slug: 'thinkpad-t14s-g5', name: 'T14s Gen 5' },
          { slug: 'thinkpad-t14-g5', name: 'T14 Gen 5' },
          { slug: 'thinkpad-t16-g3', name: 'T16 Gen 3' },
          { slug: 'thinkpad-l14-g4', name: 'L14 Gen 4' },
          { slug: 'thinkpad-e16-g2', name: 'E16 Gen 2' },
        ],
      },
      {
        slug: 'lenovo-ideapad', name: 'IdeaPad', nameEn: 'IdeaPad',
        models: [
          { slug: 'ideapad-5-16', name: 'IdeaPad 5 16"' },
          { slug: 'ideapad-5-14', name: 'IdeaPad 5 14"' },
          { slug: 'ideapad-3-15', name: 'IdeaPad 3 15"' },
          { slug: 'ideapad-slim-5', name: 'IdeaPad Slim 5' },
          { slug: 'ideapad-flex-5', name: 'IdeaPad Flex 5' },
        ],
      },
      {
        slug: 'lenovo-yoga', name: 'Yoga', nameEn: 'Yoga',
        models: [
          { slug: 'yoga-9i-14', name: 'Yoga 9i 14"' },
          { slug: 'yoga-7-16', name: 'Yoga 7 16"' },
          { slug: 'yoga-slim-7-14', name: 'Yoga Slim 7 14"' },
          { slug: 'yoga-tab-smart', name: 'Yoga Smart Tab' },
        ],
      },
      {
        slug: 'lenovo-legion', name: 'Legion', nameEn: 'Legion',
        models: [
          { slug: 'legion-pro-7-16', name: 'Legion Pro 7 16"' },
          { slug: 'legion-pro-5-16', name: 'Legion Pro 5 16"' },
          { slug: 'legion-5-15', name: 'Legion 5 15"' },
          { slug: 'legion-slim-5-14', name: 'Legion Slim 5 14"' },
        ],
      },
      {
        slug: 'lenovo-chromebook', name: 'Chromebook', nameEn: 'Chromebook',
        models: [
          { slug: 'lenovo-chromebook-300e', name: 'Chromebook 300e' },
          { slug: 'lenovo-chromebook-100e', name: 'Chromebook 100e' },
        ],
      },
    ],
  },
  {
    slug: 'microsoft',
    name: 'Microsoft',
    nameEn: 'Microsoft',
    subcategories: [
      {
        slug: 'surface-pro', name: 'Surface Pro', nameEn: 'Surface Pro',
        models: [
          { slug: 'surface-pro-11', name: 'Surface Pro 11 (2024)' },
          { slug: 'surface-pro-10', name: 'Surface Pro 10 (2024)' },
          { slug: 'surface-pro-9', name: 'Surface Pro 9 (2022)' },
          { slug: 'surface-pro-8', name: 'Surface Pro 8 (2021)' },
          { slug: 'surface-pro-7-plus', name: 'Surface Pro 7+ (2021)' },
          { slug: 'surface-pro-x', name: 'Surface Pro X (2020)' },
          { slug: 'surface-pro-7', name: 'Surface Pro 7 (2019)' },
          { slug: 'surface-pro-6', name: 'Surface Pro 6 (2018)' },
          { slug: 'surface-pro-5', name: 'Surface Pro 5 (2017)' },
          { slug: 'surface-pro-4', name: 'Surface Pro 4 (2015)' },
          { slug: 'surface-pro-3', name: 'Surface Pro 3 (2014)' },
        ],
      },
      {
        slug: 'surface-laptop', name: 'Surface Laptop', nameEn: 'Surface Laptop',
        models: [
          { slug: 'surface-laptop-7-15', name: 'Laptop 7 15"' },
          { slug: 'surface-laptop-7-13', name: 'Laptop 7 13.8"' },
          { slug: 'surface-laptop-6-15', name: 'Laptop 6 15"' },
          { slug: 'surface-laptop-5-15', name: 'Laptop 5 15"' },
          { slug: 'surface-laptop-5-13', name: 'Laptop 5 13.5"' },
          { slug: 'surface-laptop-4-15', name: 'Laptop 4 15"' },
          { slug: 'surface-laptop-4-13', name: 'Laptop 4 13.5"' },
          { slug: 'surface-laptop-3-15', name: 'Laptop 3 15"' },
          { slug: 'surface-laptop-3-13', name: 'Laptop 3 13.5"' },
        ],
      },
      {
        slug: 'surface-go', name: 'Surface Go', nameEn: 'Surface Go',
        models: [
          { slug: 'surface-go-4', name: 'Surface Go 4 (2023)' },
          { slug: 'surface-go-3', name: 'Surface Go 3 (2021)' },
          { slug: 'surface-go-2', name: 'Surface Go 2 (2020)' },
          { slug: 'surface-go-1', name: 'Surface Go (2018)' },
        ],
      },
      {
        slug: 'surface-book', name: 'Surface Book', nameEn: 'Surface Book',
        models: [
          { slug: 'surface-book-3-15', name: 'Book 3 15"' },
          { slug: 'surface-book-3-13', name: 'Book 3 13.5"' },
          { slug: 'surface-book-2-15', name: 'Book 2 15"' },
          { slug: 'surface-book-2-13', name: 'Book 2 13.5"' },
        ],
      },
      {
        slug: 'surface-laptop-go', name: 'Surface Laptop Go', nameEn: 'Surface Laptop Go',
        models: [
          { slug: 'surface-laptop-go-4', name: 'Laptop Go 4' },
          { slug: 'surface-laptop-go-3', name: 'Laptop Go 3' },
          { slug: 'surface-laptop-go-2', name: 'Laptop Go 2' },
          { slug: 'surface-laptop-go-1', name: 'Laptop Go 1' },
        ],
      },
    ],
  },
  {
    slug: 'hp',
    name: 'HP',
    nameEn: 'HP',
    subcategories: [
      {
        slug: 'hp-pavilion', name: 'Pavilion', nameEn: 'Pavilion',
        models: [
          { slug: 'hp-pavilion-16', name: 'Pavilion 16"' },
          { slug: 'hp-pavilion-15', name: 'Pavilion 15"' },
          { slug: 'hp-pavilion-14', name: 'Pavilion 14"' },
          { slug: 'hp-pavilion-x360-14', name: 'Pavilion x360 14"' },
          { slug: 'hp-pavilion-x360-15', name: 'Pavilion x360 15"' },
        ],
      },
      {
        slug: 'hp-envy', name: 'Envy', nameEn: 'Envy',
        models: [
          { slug: 'hp-envy-16', name: 'Envy 16"' },
          { slug: 'hp-envy-15', name: 'Envy 15"' },
          { slug: 'hp-envy-14', name: 'Envy 14"' },
          { slug: 'hp-envy-x360-15', name: 'Envy x360 15"' },
          { slug: 'hp-envy-x360-13', name: 'Envy x360 13"' },
        ],
      },
      {
        slug: 'hp-spectre', name: 'Spectre', nameEn: 'Spectre',
        models: [
          { slug: 'hp-spectre-x360-16', name: 'Spectre x360 16"' },
          { slug: 'hp-spectre-x360-14', name: 'Spectre x360 14"' },
          { slug: 'hp-spectre-x360-13', name: 'Spectre x360 13"' },
        ],
      },
      {
        slug: 'hp-elitebook', name: 'EliteBook', nameEn: 'EliteBook',
        models: [
          { slug: 'hp-elitebook-860-g11', name: 'EliteBook 860 G11' },
          { slug: 'hp-elitebook-840-g11', name: 'EliteBook 840 G11' },
          { slug: 'hp-elitebook-640-g11', name: 'EliteBook 640 G11' },
          { slug: 'hp-elitebook-x360-1040', name: 'EliteBook x360 1040' },
        ],
      },
      {
        slug: 'hp-probook', name: 'ProBook', nameEn: 'ProBook',
        models: [
          { slug: 'hp-probook-450-g11', name: 'ProBook 450 G11' },
          { slug: 'hp-probook-440-g11', name: 'ProBook 440 G11' },
          { slug: 'hp-probook-640-g9', name: 'ProBook 640 G9' },
        ],
      },
      {
        slug: 'hp-omen', name: 'OMEN', nameEn: 'OMEN',
        models: [
          { slug: 'hp-omen-16', name: 'OMEN 16"' },
          { slug: 'hp-omen-17', name: 'OMEN 17"' },
          { slug: 'hp-omen-transcend-16', name: 'OMEN Transcend 16"' },
        ],
      },
    ],
  },
  {
    slug: 'dell',
    name: 'Dell',
    nameEn: 'Dell',
    subcategories: [
      {
        slug: 'dell-xps', name: 'XPS', nameEn: 'XPS',
        models: [
          { slug: 'dell-xps-16-9640', name: 'XPS 16 (9640)' },
          { slug: 'dell-xps-14-9440', name: 'XPS 14 (9440)' },
          { slug: 'dell-xps-13-9340', name: 'XPS 13 (9340)' },
          { slug: 'dell-xps-15-9530', name: 'XPS 15 (9530)' },
          { slug: 'dell-xps-13-plus', name: 'XPS 13 Plus (9320)' },
        ],
      },
      {
        slug: 'dell-inspiron', name: 'Inspiron', nameEn: 'Inspiron',
        models: [
          { slug: 'dell-inspiron-16-7640', name: 'Inspiron 16 (7640)' },
          { slug: 'dell-inspiron-15-3530', name: 'Inspiron 15 (3530)' },
          { slug: 'dell-inspiron-14-5440', name: 'Inspiron 14 (5440)' },
          { slug: 'dell-inspiron-14-2in1', name: 'Inspiron 14 2-in-1' },
        ],
      },
      {
        slug: 'dell-latitude', name: 'Latitude', nameEn: 'Latitude',
        models: [
          { slug: 'dell-latitude-7450', name: 'Latitude 7450' },
          { slug: 'dell-latitude-5540', name: 'Latitude 5540' },
          { slug: 'dell-latitude-5440', name: 'Latitude 5440' },
          { slug: 'dell-latitude-3440', name: 'Latitude 3440' },
        ],
      },
      {
        slug: 'dell-alienware', name: 'Alienware', nameEn: 'Alienware',
        models: [
          { slug: 'alienware-m18-r2', name: 'Alienware m18 R2' },
          { slug: 'alienware-m16-r2', name: 'Alienware m16 R2' },
          { slug: 'alienware-x16-r2', name: 'Alienware x16 R2' },
          { slug: 'alienware-x14-r2', name: 'Alienware x14 R2' },
        ],
      },
    ],
  },
  {
    slug: 'acer',
    name: 'Acer',
    nameEn: 'Acer',
    subcategories: [
      {
        slug: 'acer-swift', name: 'Swift', nameEn: 'Swift',
        models: [
          { slug: 'acer-swift-go-16', name: 'Swift Go 16' },
          { slug: 'acer-swift-go-14', name: 'Swift Go 14' },
          { slug: 'acer-swift-14-ai', name: 'Swift 14 AI' },
          { slug: 'acer-swift-edge-16', name: 'Swift Edge 16' },
          { slug: 'acer-swift-x-14', name: 'Swift X 14' },
        ],
      },
      {
        slug: 'acer-aspire', name: 'Aspire', nameEn: 'Aspire',
        models: [
          { slug: 'acer-aspire-5-15', name: 'Aspire 5 15"' },
          { slug: 'acer-aspire-5-14', name: 'Aspire 5 14"' },
          { slug: 'acer-aspire-3-15', name: 'Aspire 3 15"' },
          { slug: 'acer-aspire-vero-15', name: 'Aspire Vero 15"' },
        ],
      },
      {
        slug: 'acer-nitro', name: 'Nitro', nameEn: 'Nitro',
        models: [
          { slug: 'acer-nitro-v-16', name: 'Nitro V 16"' },
          { slug: 'acer-nitro-v-15', name: 'Nitro V 15"' },
          { slug: 'acer-nitro-5-17', name: 'Nitro 5 17"' },
        ],
      },
      {
        slug: 'acer-predator', name: 'Predator', nameEn: 'Predator',
        models: [
          { slug: 'acer-predator-helios-18', name: 'Predator Helios 18' },
          { slug: 'acer-predator-helios-16', name: 'Predator Helios 16' },
          { slug: 'acer-predator-triton-17', name: 'Predator Triton 17' },
        ],
      },
      {
        slug: 'acer-chromebook', name: 'Chromebook', nameEn: 'Chromebook',
        models: [
          { slug: 'acer-chromebook-plus-515', name: 'Chromebook Plus 515' },
          { slug: 'acer-chromebook-314', name: 'Chromebook 314' },
          { slug: 'acer-chromebook-spin-513', name: 'Chromebook Spin 513' },
        ],
      },
    ],
  },
  {
    slug: 'amazon',
    name: 'Amazon',
    nameEn: 'Amazon',
    subcategories: [
      {
        slug: 'kindle', name: 'Kindle', nameEn: 'Kindle',
        models: [
          { slug: 'kindle-paperwhite-2024', name: 'Kindle Paperwhite (2024)' },
          { slug: 'kindle-scribe-2022', name: 'Kindle Scribe (2022)' },
          { slug: 'kindle-2022', name: 'Kindle (2022)' },
        ],
      },
      {
        slug: 'fire-tablet', name: 'Fire Tablet', nameEn: 'Fire Tablet',
        models: [
          { slug: 'fire-hd-10-2023', name: 'Fire HD 10 (2023)' },
          { slug: 'fire-hd-10-2021', name: 'Fire HD 10 (2021)' },
          { slug: 'fire-hd-8-plus-2022', name: 'Fire HD 8 Plus (2022)' },
          { slug: 'fire-hd-8-2022', name: 'Fire HD 8 (2022)' },
          { slug: 'fire-hd-8-2020', name: 'Fire HD 8 (2020)' },
          { slug: 'fire-7-2022', name: 'Fire 7 (2022)' },
        ],
      },
    ],
  },
  {
    slug: 'infinix',
    name: 'Infinix',
    nameEn: 'Infinix',
    subcategories: [
      {
        slug: 'infinix-hot', name: 'Hot Serie', nameEn: 'Hot Series',
        models: [
          { slug: 'infinix-hot-40-pro', name: 'Hot 40 Pro' },
          { slug: 'infinix-hot-40', name: 'Hot 40' },
          { slug: 'infinix-hot-30', name: 'Hot 30' },
          { slug: 'infinix-hot-20', name: 'Hot 20' },
        ],
      },
      {
        slug: 'infinix-note', name: 'Note Serie', nameEn: 'Note Series',
        models: [
          { slug: 'infinix-note-40-pro', name: 'Note 40 Pro' },
          { slug: 'infinix-note-40', name: 'Note 40' },
          { slug: 'infinix-note-30-pro', name: 'Note 30 Pro' },
          { slug: 'infinix-note-30', name: 'Note 30' },
        ],
      },
      {
        slug: 'infinix-zero', name: 'Zero Serie', nameEn: 'Zero Series',
        models: [
          { slug: 'infinix-zero-30', name: 'Zero 30 5G' },
          { slug: 'infinix-zero-ultra', name: 'Zero Ultra' },
        ],
      },
    ],
  },
  {
    slug: 'tools',
    name: 'Gereedschap & Supplies',
    nameEn: 'Tools & Supplies',
    subcategories: [
      { slug: 'screwdrivers', name: 'Schroevendraaiers', nameEn: 'Screwdrivers', models: [] },
      { slug: 'pry-tools', name: 'Opening Tools', nameEn: 'Pry & Opening Tools', models: [] },
      { slug: 'soldering', name: 'Soldeer Gereedschap', nameEn: 'Soldering Tools', models: [] },
      { slug: 'adhesives', name: 'Lijm & Tape', nameEn: 'Adhesives & Tape', models: [] },
      { slug: 'cleaning', name: 'Reiniging', nameEn: 'Cleaning Supplies', models: [] },
      { slug: 'heat-guns', name: 'Heatguns & Stations', nameEn: 'Heat Guns & Stations', models: [] },
      { slug: 'microscopes', name: 'Microscopen', nameEn: 'Microscopes', models: [] },
      { slug: 'mats', name: 'Werkmatten', nameEn: 'Work Mats', models: [] },
      { slug: 'other-tools', name: 'Overig Gereedschap', nameEn: 'Other Tools', models: [] },
    ],
  },
  {
    slug: 'accessories',
    name: 'Accessoires',
    nameEn: 'Accessories',
    subcategories: [
      { slug: 'cases', name: 'Hoesjes', nameEn: 'Cases', models: [] },
      { slug: 'chargers', name: 'Opladers', nameEn: 'Chargers', models: [] },
      { slug: 'cables', name: 'Kabels', nameEn: 'Cables', models: [] },
      { slug: 'screen-protectors', name: 'Screenprotectors', nameEn: 'Screen Protectors', models: [] },
      { slug: 'power-banks', name: 'Powerbanks', nameEn: 'Power Banks', models: [] },
      { slug: 'other-accessories', name: 'Overige Accessoires', nameEn: 'Other Accessories', models: [] },
    ],
  },
];

// ==================== HELPER FUNCTIONS ====================

export function getBrandName(slug: string, locale: string = 'nl'): string {
  const brand = brandCategories.find(b => b.slug === slug);
  if (!brand) return slug;
  return locale === 'en' ? brand.nameEn : brand.name;
}

export function getSubcategoryName(brandSlug: string, subSlug: string, locale: string = 'nl'): string {
  const brand = brandCategories.find(b => b.slug === brandSlug);
  if (!brand) return subSlug;
  const sub = brand.subcategories.find(s => s.slug === subSlug);
  if (!sub) return subSlug;
  return locale === 'en' ? sub.nameEn : sub.name;
}

export function getModelName(brandSlug: string, subSlug: string, modelSlug: string): string {
  const brand = brandCategories.find(b => b.slug === brandSlug);
  if (!brand) return modelSlug;
  const sub = brand.subcategories.find(s => s.slug === subSlug);
  if (!sub) return modelSlug;
  const model = sub.models.find(m => m.slug === modelSlug);
  return model ? model.name : modelSlug;
}

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
