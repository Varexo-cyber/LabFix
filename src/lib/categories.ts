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
        slug: 'nokia-phone', name: 'Nokia Telefoon', nameEn: 'Nokia Phone',
        models: [
          { slug: 'nokia-g42', name: 'Nokia G42' },
          { slug: 'nokia-g22', name: 'Nokia G22' },
          { slug: 'nokia-g21', name: 'Nokia G21' },
          { slug: 'nokia-xr21', name: 'Nokia XR21' },
          { slug: 'nokia-x30', name: 'Nokia X30' },
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
    slug: 'other-brands',
    name: 'Overige Merken',
    nameEn: 'Other Brands',
    subcategories: [
      { slug: 'honor', name: 'Honor', nameEn: 'Honor', models: [{ slug: 'honor-magic-6-pro', name: 'Magic 6 Pro' }, { slug: 'honor-magic-v2', name: 'Magic V2' }, { slug: 'honor-200-pro', name: 'Honor 200 Pro' }, { slug: 'honor-90', name: 'Honor 90' }] },
      { slug: 'nothing', name: 'Nothing', nameEn: 'Nothing', models: [{ slug: 'nothing-phone-2a', name: 'Phone (2a)' }, { slug: 'nothing-phone-2', name: 'Phone (2)' }, { slug: 'nothing-phone-1', name: 'Phone (1)' }] },
      { slug: 'realme', name: 'Realme', nameEn: 'Realme', models: [{ slug: 'realme-gt-6', name: 'GT 6' }, { slug: 'realme-12-pro', name: '12 Pro+' }, { slug: 'realme-c55', name: 'C55' }] },
      { slug: 'vivo', name: 'Vivo', nameEn: 'Vivo', models: [{ slug: 'vivo-x200-pro', name: 'X200 Pro' }, { slug: 'vivo-x100-pro', name: 'X100 Pro' }, { slug: 'vivo-v30', name: 'V30' }] },
      { slug: 'tcl', name: 'TCL', nameEn: 'TCL', models: [{ slug: 'tcl-50', name: 'TCL 50 SE' }, { slug: 'tcl-40', name: 'TCL 40 SE' }] },
      { slug: 'zte', name: 'ZTE', nameEn: 'ZTE', models: [{ slug: 'zte-blade-v50', name: 'Blade V50' }, { slug: 'zte-blade-a73', name: 'Blade A73' }] },
      { slug: 'microsoft', name: 'Microsoft Surface', nameEn: 'Microsoft Surface', models: [{ slug: 'surface-pro-10', name: 'Surface Pro 10' }, { slug: 'surface-laptop-6', name: 'Surface Laptop 6' }, { slug: 'surface-go-4', name: 'Surface Go 4' }] },
      { slug: 'lenovo', name: 'Lenovo', nameEn: 'Lenovo', models: [{ slug: 'lenovo-tab-p12', name: 'Tab P12' }, { slug: 'lenovo-tab-m11', name: 'Tab M11' }] },
      { slug: 'amazon', name: 'Amazon', nameEn: 'Amazon', models: [{ slug: 'kindle-paperwhite', name: 'Kindle Paperwhite' }, { slug: 'fire-hd-10', name: 'Fire HD 10' }] },
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
