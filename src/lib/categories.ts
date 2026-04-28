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
        slug: 'mac-studio',
        name: 'Mac Studio',
        nameEn: 'Mac Studio',
        models: [
          { slug: 'mac-studio-2023-m2-ultra', name: 'Mac Studio (2023) M2 Ultra' },
          { slug: 'mac-studio-2023-m2-max', name: 'Mac Studio (2023) M2 Max' },
          { slug: 'mac-studio-2022-m1-ultra', name: 'Mac Studio (2022) M1 Ultra' },
          { slug: 'mac-studio-2022-m1-max', name: 'Mac Studio (2022) M1 Max' },
        ],
      },
      {
        slug: 'studio-display',
        name: 'Studio Display',
        nameEn: 'Studio Display',
        models: [
          { slug: 'studio-display-2022', name: 'Studio Display 27" (2022)' },
        ],
      },
      {
        slug: 'mac-pro',
        name: 'Mac Pro',
        nameEn: 'Mac Pro',
        models: [
          { slug: 'mac-pro-2023', name: 'Mac Pro (2023) M2 Ultra' },
          { slug: 'mac-pro-2019', name: 'Mac Pro (2019) Intel' },
        ],
      },
      {
        slug: 'mac-mini',
        name: 'Mac Mini',
        nameEn: 'Mac Mini',
        models: [
          { slug: 'mac-mini-2024-m4', name: 'Mac Mini (2024) M4' },
          { slug: 'mac-mini-2023-m2', name: 'Mac Mini (2023) M2/M2 Pro' },
          { slug: 'mac-mini-2020-m1', name: 'Mac Mini (2020) M1' },
        ],
      },
      {
        slug: 'imac',
        name: 'iMac',
        nameEn: 'iMac',
        models: [
          { slug: 'imac-24-2024-m4', name: 'iMac 24" (2024) M4' },
          { slug: 'imac-24-2023-m3', name: 'iMac 24" (2023) M3' },
          { slug: 'imac-24-2021-m1', name: 'iMac 24" (2021) M1' },
          { slug: 'imac-27-2020', name: 'iMac 27" (2020) Intel' },
          { slug: 'imac-21-2019', name: 'iMac 21.5" (2019) Intel' },
        ],
      },
      {
        slug: 'macbook-air',
        name: 'MacBook Air',
        nameEn: 'MacBook Air',
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
  // ==================== OTHER BRANDS FROM MOBILE SENTRIX ====================
  {
    slug: 'alcatel',
    name: 'Alcatel',
    nameEn: 'Alcatel',
    subcategories: [
      { slug: 'alcatel-1', name: 'Alcatel 1 Series', nameEn: 'Alcatel 1 Series', models: [{ slug: 'alcatel-1-2021', name: 'Alcatel 1 (2021)' }, { slug: 'alcatel-1x', name: 'Alcatel 1X' }] },
      { slug: 'alcatel-3', name: 'Alcatel 3 Series', nameEn: 'Alcatel 3 Series', models: [{ slug: 'alcatel-3-2020', name: 'Alcatel 3 (2020)' }, { slug: 'alcatel-3x', name: 'Alcatel 3X' }] },
      { slug: 'alcatel-5', name: 'Alcatel 5 Series', nameEn: 'Alcatel 5 Series', models: [{ slug: 'alcatel-5', name: 'Alcatel 5' }] },
    ],
  },
  {
    slug: 'att',
    name: 'AT&T',
    nameEn: 'AT&T',
    subcategories: [
      { slug: 'att-phones', name: 'AT&T Phones', nameEn: 'AT&T Phones', models: [{ slug: 'att-fusion-5g', name: 'AT&T Fusion 5G' }, { slug: 'att-maestro-plus', name: 'AT&T Maestro Plus' }] },
    ],
  },
  {
    slug: 'blackberry',
    name: 'Blackberry',
    nameEn: 'Blackberry',
    subcategories: [
      { slug: 'key-series', name: 'Key Series', nameEn: 'Key Series', models: [{ slug: 'key2', name: 'BlackBerry Key2' }, { slug: 'keyone', name: 'BlackBerry KeyOne' }] },
      { slug: 'motion', name: 'Motion', nameEn: 'Motion', models: [{ slug: 'motion', name: 'BlackBerry Motion' }] },
    ],
  },
  {
    slug: 'blu',
    name: 'Blu',
    nameEn: 'Blu',
    subcategories: [
      { slug: 'g-series', name: 'G Series', nameEn: 'G Series', models: [{ slug: 'g91', name: 'Blu G91' }, { slug: 'g90', name: 'Blu G90' }] },
      { slug: 'v-series', name: 'V Series', nameEn: 'V Series', models: [{ slug: 'v90', name: 'Blu V90' }] },
    ],
  },
  {
    slug: 'cat',
    name: 'CAT',
    nameEn: 'CAT',
    subcategories: [
      { slug: 'cat-s', name: 'S Series', nameEn: 'S Series', models: [{ slug: 'cat-s62', name: 'CAT S62' }, { slug: 'cat-s42', name: 'CAT S42' }, { slug: 'cat-s22', name: 'CAT S22' }] },
    ],
  },
  {
    slug: 'coolpad',
    name: 'Coolpad',
    nameEn: 'Coolpad',
    subcategories: [
      { slug: 'coolpad-legacy', name: 'Legacy', nameEn: 'Legacy', models: [{ slug: 'legacy', name: 'Coolpad Legacy' }, { slug: 'legacy-s', name: 'Coolpad Legacy S' }] },
    ],
  },
  {
    slug: 'cricket',
    name: 'Cricket',
    nameEn: 'Cricket',
    subcategories: [
      { slug: 'cricket-wireless', name: 'Cricket Wireless', nameEn: 'Cricket Wireless', models: [{ slug: 'cricket-debut', name: 'Cricket Debut' }, { slug: 'cricket-wave', name: 'Cricket Wave' }] },
    ],
  },
  {
    slug: 'dji',
    name: 'DJI',
    nameEn: 'DJI',
    subcategories: [
      { slug: 'dji-drones', name: 'DJI Drones', nameEn: 'DJI Drones', models: [{ slug: 'mavic-3', name: 'Mavic 3' }, { slug: 'air-3', name: 'Air 3' }, { slug: 'mini-4', name: 'Mini 4 Pro' }] },
    ],
  },
  {
    slug: 'essential',
    name: 'Essential',
    nameEn: 'Essential',
    subcategories: [
      { slug: 'essential-phone', name: 'Essential Phone', nameEn: 'Essential Phone', models: [{ slug: 'ph-1', name: 'Essential PH-1' }] },
    ],
  },
  {
    slug: 'fitbit',
    name: 'Fitbit',
    nameEn: 'Fitbit',
    subcategories: [
      { slug: 'fitbit-watches', name: 'Fitbit Watches', nameEn: 'Fitbit Watches', models: [{ slug: 'sense-2', name: 'Sense 2' }, { slug: 'versa-4', name: 'Versa 4' }, { slug: 'charge-6', name: 'Charge 6' }] },
    ],
  },
  {
    slug: 'gopro',
    name: 'GoPro',
    nameEn: 'GoPro',
    subcategories: [
      { slug: 'hero', name: 'Hero', nameEn: 'Hero', models: [{ slug: 'hero-13', name: 'Hero 13' }, { slug: 'hero-12', name: 'Hero 12' }, { slug: 'hero-11', name: 'Hero 11' }] },
    ],
  },
  {
    slug: 'htc',
    name: 'HTC',
    nameEn: 'HTC',
    subcategories: [
      { slug: 'u-series', name: 'U Series', nameEn: 'U Series', models: [{ slug: 'u12-plus', name: 'U12+' }, { slug: 'u11', name: 'U11' }] },
      { slug: 'desire', name: 'Desire', nameEn: 'Desire', models: [{ slug: 'desire-21', name: 'Desire 21' }] },
    ],
  },
  {
    slug: 'insta360',
    name: 'Insta360',
    nameEn: 'Insta360',
    subcategories: [
      { slug: 'action-cameras', name: 'Action Cameras', nameEn: 'Action Cameras', models: [{ slug: 'ace-pro', name: 'Ace Pro' }, { slug: 'go-3', name: 'GO 3' }] },
    ],
  },
  {
    slug: 'kyocera',
    name: 'Kyocera',
    nameEn: 'Kyocera',
    subcategories: [
      { slug: 'duraforce', name: 'DuraForce', nameEn: 'DuraForce', models: [{ slug: 'duraforce-pro-3', name: 'DuraForce Pro 3' }, { slug: 'duraforce-ultra', name: 'DuraForce Ultra' }] },
    ],
  },
  {
    slug: 'nexus',
    name: 'Nexus',
    nameEn: 'Nexus',
    subcategories: [
      { slug: 'nexus-phones', name: 'Nexus Phones', nameEn: 'Nexus Phones', models: [{ slug: 'nexus-6p', name: 'Nexus 6P' }, { slug: 'nexus-5x', name: 'Nexus 5X' }, { slug: 'nexus-6', name: 'Nexus 6' }] },
    ],
  },
  {
    slug: 'oukitel',
    name: 'Oukitel',
    nameEn: 'Oukitel',
    subcategories: [
      { slug: 'wp-series', name: 'WP Series', nameEn: 'WP Series', models: [{ slug: 'wp30', name: 'WP30 Pro' }, { slug: 'wp22', name: 'WP22' }] },
      { slug: 'c-series', name: 'C Series', nameEn: 'C Series', models: [{ slug: 'c35', name: 'C35' }] },
    ],
  },
  {
    slug: 'revvl',
    name: 'Revvl',
    nameEn: 'Revvl',
    subcategories: [
      { slug: 'revvl-series', name: 'Revvl Series', nameEn: 'Revvl Series', models: [{ slug: 'revvl-7', name: 'Revvl 7' }, { slug: 'revvl-6', name: 'Revvl 6' }] },
    ],
  },
  {
    slug: 'tecno',
    name: 'Tecno',
    nameEn: 'Tecno',
    subcategories: [
      { slug: 'phantom', name: 'Phantom', nameEn: 'Phantom', models: [{ slug: 'phantom-v2', name: 'Phantom V2' }, { slug: 'phantom-v', name: 'Phantom V' }] },
      { slug: 'camon', name: 'Camon', nameEn: 'Camon', models: [{ slug: 'camon-30', name: 'Camon 30' }, { slug: 'camon-20', name: 'Camon 20' }] },
    ],
  },
  {
    slug: 'zebra',
    name: 'Zebra',
    nameEn: 'Zebra',
    subcategories: [
      { slug: 'tc-series', name: 'TC Series', nameEn: 'TC Series', models: [{ slug: 'tc26', name: 'TC26' }, { slug: 'tc52', name: 'TC52' }] },
    ],
  },
  {
    slug: 'zte',
    name: 'ZTE',
    nameEn: 'ZTE',
    subcategories: [
      { slug: 'axon', name: 'Axon', nameEn: 'Axon', models: [{ slug: 'axon-50', name: 'Axon 50' }, { slug: 'axon-40', name: 'Axon 40' }] },
      { slug: 'blade', name: 'Blade', nameEn: 'Blade', models: [{ slug: 'blade-v50', name: 'Blade V50' }, { slug: 'blade-a73', name: 'Blade A73' }] },
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
          { slug: 'poco-c75', name: 'POCO C75' },
          { slug: 'poco-c65', name: 'POCO C65' },
          { slug: 'poco-c61', name: 'POCO C61' },
          { slug: 'poco-f5-pro', name: 'POCO F5 Pro' },
          { slug: 'poco-f5', name: 'POCO F5' },
          { slug: 'poco-x5-pro', name: 'POCO X5 Pro' },
          { slug: 'poco-x5', name: 'POCO X5' },
        ],
      },
      {
        slug: 'xiaomi-mix', name: 'Xiaomi Mix', nameEn: 'Xiaomi Mix',
        models: [
          { slug: 'mix-fold-4', name: 'Xiaomi Mix Fold 4' },
          { slug: 'mix-fold-3', name: 'Xiaomi Mix Fold 3' },
          { slug: 'mix-fold-2', name: 'Xiaomi Mix Fold 2' },
          { slug: 'mix-fold', name: 'Xiaomi Mix Fold' },
          { slug: 'mix-4', name: 'Xiaomi Mix 4' },
          { slug: 'mix-3', name: 'Xiaomi Mix 3' },
        ],
      },
      {
        slug: 'xiaomi-pad', name: 'Xiaomi Pad', nameEn: 'Xiaomi Pad',
        models: [
          { slug: 'pad-6s-pro', name: 'Xiaomi Pad 6S Pro' },
          { slug: 'pad-6-pro', name: 'Xiaomi Pad 6 Pro' },
          { slug: 'pad-6', name: 'Xiaomi Pad 6' },
          { slug: 'pad-5-pro', name: 'Xiaomi Pad 5 Pro' },
          { slug: 'pad-5', name: 'Xiaomi Pad 5' },
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
      {
        slug: 'moto-e', name: 'Moto E Serie', nameEn: 'Moto E Series',
        models: [
          { slug: 'moto-e14', name: 'Moto E14' },
          { slug: 'moto-e13', name: 'Moto E13' },
          { slug: 'moto-e32', name: 'Moto E32' },
          { slug: 'moto-e22', name: 'Moto E22' },
          { slug: 'moto-e20', name: 'Moto E20' },
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

// Helper: Combine ALL category systems into one unified BrandCategory[] format for admin forms
export function getAllProductCategories(): BrandCategory[] {
  const convertAccessory = (cats: AccessoryCategory[], prefix: string): BrandCategory[] =>
    cats.map(cat => ({
      slug: `${prefix}${cat.slug}`,
      name: cat.name,
      nameEn: cat.nameEn,
      subcategories: cat.subcategories.map(sub => ({
        slug: sub.slug,
        name: sub.name,
        nameEn: sub.nameEn,
        models: [] as ModelItem[],
      })),
    }));

  return [
    ...brandCategories,
    // Accessoires section header
    { slug: '_section_acc', name: '── 🎧 ACCESSOIRES ──', nameEn: '── 🎧 ACCESSORIES ──', subcategories: [] },
    ...convertAccessory(accessoryCategories, 'acc-'),
    // PC Onderdelen section header
    { slug: '_section_pc', name: '── 💻 PC ONDERDELEN ──', nameEn: '── 💻 PC PARTS ──', subcategories: [] },
    ...convertAccessory(pcPartsCategories, 'pc-'),
    // PC Accessoires section header
    { slug: '_section_pca', name: '── 🖱️ PC ACCESSOIRES ──', nameEn: '── 🖱️ PC ACCESSORIES ──', subcategories: [] },
    ...convertAccessory(pcAccessoryCategories, 'pca-'),
  ];
}

// ==================== ACCESSORIES CATEGORY SYSTEM ====================
// Accessories organized by brand and model compatibility

export interface AccessorySubCategory {
  slug: string;
  name: string;
  nameEn: string;
  description?: string;
}

export interface AccessoryCategory {
  slug: string;
  name: string;
  nameEn: string;
  icon?: string;
  description?: string;
  subcategories: AccessorySubCategory[];
}

export const accessoryCategories: AccessoryCategory[] = [
  {
    slug: 'cases-covers',
    name: 'Hoesjes & Cases',
    nameEn: 'Cases & Covers',
    description: 'Beschermhoesjes voor alle telefoonmodellen',
    subcategories: [
      { slug: 'silicone-cases', name: 'Siliconen Hoesjes', nameEn: 'Silicone Cases', description: 'Flexibele siliconen bescherming' },
      { slug: 'leather-cases', name: 'Leren Hoesjes', nameEn: 'Leather Cases', description: 'Premium lederen hoesjes' },
      { slug: 'wallet-cases', name: 'Booktype & Portemonnee', nameEn: 'Wallet & Flip Cases', description: 'Hoesjes met kaarthouders' },
      { slug: 'rugged-cases', name: 'Rugged & Armor', nameEn: 'Rugged & Armor', description: 'Zware bescherming, shockproof' },
      { slug: 'clear-cases', name: 'Transparante Hoesjes', nameEn: 'Clear & Transparent', description: 'Doorzichtige bescherming' },
      { slug: 'magnetic-cases', name: 'MagSafe Hoesjes', nameEn: 'MagSafe Compatible', description: 'Magnetische hoesjes voor iPhone' },
    ]
  },
  {
    slug: 'screen-protectors',
    name: 'Screenprotectors',
    nameEn: 'Screen Protectors',
    description: 'Display bescherming',
    subcategories: [
      { slug: 'tempered-glass', name: 'Gehard Glas', nameEn: 'Tempered Glass', description: '9H gehard glas bescherming' },
      { slug: 'privacy-glass', name: 'Privacy Glass', nameEn: 'Privacy Glass', description: 'Privacy filter, kijkhoek bescherming' },
      { slug: 'matte-glass', name: 'Mat Glas', nameEn: 'Matte Glass', description: 'Anti-glans, anti-vingerafdruk' },
      { slug: 'uv-glass', name: 'UV Liquid Glass', nameEn: 'UV Liquid Glass', description: 'UV licht geharde vloeibare glas' },
      { slug: 'tpu-film', name: 'TPU Flexibele Film', nameEn: 'TPU Flexible Film', description: 'Krasbestendige TPU folie' },
      { slug: 'ceramic-shield', name: 'Ceramic Shield', nameEn: 'Ceramic Shield', description: 'Keramische beschermlaag' },
    ]
  },
  {
    slug: 'chargers-cables',
    name: 'Opladers & Kabels',
    nameEn: 'Chargers & Cables',
    description: 'Power & connectiviteit',
    subcategories: [
      { slug: 'fast-chargers', name: 'Fast Chargers', nameEn: 'Fast Chargers', description: '20W, 25W, 30W snelladers' },
      { slug: 'wireless-chargers', name: 'Draadloze Opladers', nameEn: 'Wireless Chargers', description: 'Qi & MagSafe opladers' },
      { slug: 'usb-c-cables', name: 'USB-C Kabels', nameEn: 'USB-C Cables', description: 'USB-C naar USB-C, USB-C naar Lightning' },
      { slug: 'magsafe-chargers', name: 'MagSafe Opladers', nameEn: 'MagSafe Chargers', description: 'Magnetische draadloze opladers' },
      { slug: 'car-chargers', name: 'Auto Opladers', nameEn: 'Car Chargers', description: '12V/24V auto opladers' },
      { slug: 'charging-stations', name: 'Oplaadstations', nameEn: 'Charging Stations', description: 'Multi-device docking stations' },
    ]
  },
  {
    slug: 'audio',
    name: 'Audio Accessoires',
    nameEn: 'Audio Accessories',
    description: 'Geluid & audio',
    subcategories: [
      { slug: 'wireless-earbuds', name: 'Wireless Earbuds', nameEn: 'Wireless Earbuds', description: 'Bluetooth oordopjes' },
      { slug: 'headphones', name: 'Koptelefoons', nameEn: 'Headphones', description: 'Over-ear & on-ear hoofdtelefoons' },
      { slug: 'audio-adapters', name: 'Audio Adapters', nameEn: 'Audio Adapters', description: '3.5mm jack adapters, DAC' },
      { slug: 'bluetooth-speakers', name: 'Bluetooth Speakers', nameEn: 'Bluetooth Speakers', description: 'Draagbare speakers' },
      { slug: 'microphones', name: 'Microfoons', nameEn: 'Microphones', description: 'Externe telefoon microfoons' },
    ]
  },
  {
    slug: 'batteries-power',
    name: 'Batterijen & Power',
    nameEn: 'Batteries & Power',
    description: 'Energie oplossingen',
    subcategories: [
      { slug: 'replacement-batteries', name: 'Vervangingsbatterijen', nameEn: 'Replacement Batteries', description: 'Originele kwaliteit batterijen' },
      { slug: 'powerbanks', name: 'Powerbanks', nameEn: 'Power Banks', description: 'Draagbare accupacks' },
      { slug: 'battery-cases', name: 'Battery Cases', nameEn: 'Battery Cases', description: 'Hoesjes met ingebouwde accu' },
      { slug: 'solar-chargers', name: 'Solar Chargers', nameEn: 'Solar Chargers', description: 'Zonne-energie opladers' },
    ]
  },
  {
    slug: 'car-mounts',
    name: 'Auto Accessoires',
    nameEn: 'Car Accessories',
    description: 'Voor in de auto',
    subcategories: [
      { slug: 'car-holders', name: 'Telefoonhouders', nameEn: 'Phone Holders', description: 'Dashboard, ventilatie, zuignap' },
      { slug: 'car-mounts-wireless', name: 'Draadloze Auto Opladers', nameEn: 'Wireless Car Chargers', description: 'Auto mounts met Qi opladen' },
      { slug: 'car-adapters', name: 'Auto Adapters', nameEn: 'Car Adapters', description: 'FM transmitters, AUX adapters' },
    ]
  },
  {
    slug: 'photography',
    name: 'Fotografie & Video',
    nameEn: 'Photography & Video',
    description: 'Camera & media',
    subcategories: [
      { slug: 'phone-lenses', name: 'Telefoon Lenzen', nameEn: 'Phone Lenses', description: 'Wide, macro, fisheye lenzen' },
      { slug: 'gimbals', name: 'Stabilisatoren', nameEn: 'Gimbals & Stabilizers', description: '3-axis gimbals voor video' },
      { slug: 'tripods', name: 'Statieven & Tripods', nameEn: 'Tripods & Stands', description: 'Flexibele en statische statieven' },
      { slug: 'selfie-sticks', name: 'Selfie Sticks', nameEn: 'Selfie Sticks', description: 'Verlengbare selfie sticks' },
      { slug: 'ring-lights', name: 'Ring Lights', nameEn: 'Ring Lights', description: 'LED ring verlichting' },
    ]
  },
  {
    slug: 'protection-care',
    name: 'Bescherming & Onderhoud',
    nameEn: 'Protection & Care',
    description: 'Onderhoud & reiniging',
    subcategories: [
      { slug: 'cleaning-kits', name: 'Reinigingssets', nameEn: 'Cleaning Kits', description: 'Schermreinigers, microvezel' },
      { slug: 'waterproof-cases', name: 'Waterdichte Hoesjes', nameEn: 'Waterproof Cases', description: 'IP68 waterdichte bescherming' },
      { slug: 'dust-plugs', name: 'Stofplugjes', nameEn: 'Dust Plugs', description: 'Bescherming voor poorten' },
      { slug: 'camera-protectors', name: 'Camera Bescherming', nameEn: 'Camera Protectors', description: 'Camera lens beschermers' },
      { slug: 'skins-decals', name: 'Skins & Stickers', nameEn: 'Skins & Decals', description: 'Decoratieve telefoon skins' },
    ]
  },
  {
    slug: 'storage-memory',
    name: 'Opslag & Geheugen',
    nameEn: 'Storage & Memory',
    description: 'Data opslag',
    subcategories: [
      { slug: 'sd-cards', name: 'Micro SD Kaarten', nameEn: 'Micro SD Cards', description: 'Geheugenkaarten alle formaten' },
      { slug: 'card-readers', name: 'Kaartlezers', nameEn: 'Card Readers', description: 'USB-C, Lightning card readers' },
      { slug: 'usb-flash-drives', name: 'USB Sticks', nameEn: 'USB Flash Drives', description: 'OTG USB drives voor telefoon' },
      { slug: 'external-ssd', name: 'Externe SSD', nameEn: 'External SSD', description: 'Draagbare externe opslag' },
    ]
  },
  {
    slug: 'gaming',
    name: 'Gaming Accessoires',
    nameEn: 'Gaming Accessories',
    description: 'Voor mobiele gamers',
    subcategories: [
      { slug: 'game-controllers', name: 'Game Controllers', nameEn: 'Game Controllers', description: 'Bluetooth gamepads' },
      { slug: 'cooling-fans', name: 'Cooling Fans', nameEn: 'Cooling Fans', description: 'Telefoon koelventilatoren' },
      { slug: 'gaming-triggers', name: 'Gaming Triggers', nameEn: 'Gaming Triggers', description: 'L1R1 schietknoppen' },
      { slug: 'mobile-gaming-grips', name: 'Gaming Grips', nameEn: 'Gaming Grips', description: 'Ergonomische telefoon grips' },
    ]
  },
  {
    slug: 'smart-gadgets',
    name: 'Smart Gadgets',
    nameEn: 'Smart Gadgets',
    description: 'Slimme accessoires',
    subcategories: [
      { slug: 'smart-watches', name: 'Smartwatches', nameEn: 'Smart Watches', description: 'Horloges, bandjes, opladers' },
      { slug: 'fitness-trackers', name: 'Fitness Trackers', nameEn: 'Fitness Trackers', description: 'Activity trackers accessoires' },
      { slug: 'smart-tags', name: 'Smart Tags', nameEn: 'Smart Tags', description: 'AirTag, SmartTag, trackers' },
      { slug: 'stylus-pens', name: 'Stylus Pennen', nameEn: 'Stylus Pens', description: 'Actieve en passieve pennen' },
    ]
  },
  {
    slug: 'repair-tools-essentials',
    name: 'Tools - Essentials',
    nameEn: 'Tools - Essentials',
    description: 'Essentiële gereedschappen voor reparatie',
    subcategories: [
      { slug: 'screwdrivers', name: 'Schroevendraaiers', nameEn: 'Screwdrivers', description: 'Precisie schroevendraaiers' },
      { slug: 'tweezers', name: 'Pincetten', nameEn: 'Tweezers', description: 'ESD pincetten' },
      { slug: 'tool-kits', name: 'Gereedschapssets', nameEn: 'Tool Kits', description: 'Complete tool sets' },
      { slug: 'adhesive-tapes', name: 'Adhesive Tapes', nameEn: 'Adhesive Tapes', description: 'Tape voor montage' },
      { slug: 'pry-tools', name: 'Pry Tools', nameEn: 'Pry Tools', description: 'Openingsgereedschap' },
      { slug: 'work-mats', name: 'Werkmatten', nameEn: 'Work Mats', description: 'Antistatische matten' },
      { slug: 'clamps-holders', name: 'Klemmen & Houders', nameEn: 'Clamps & Holders', description: 'Bevestigingsgereedschap' },
      { slug: 'pliers-cutters', name: 'Tangen & Knippers', nameEn: 'Pliers & Cutters', description: 'Knip en grijptangen' },
      { slug: 'repair-fixtures', name: 'Repair Fixtures', nameEn: 'Repair Fixtures', description: 'Reparatiehouders' },
      { slug: 'display-comparison', name: 'Display Comparison', nameEn: 'Display Comparison Devices', description: 'Display testers' },
      { slug: 'repair-guides', name: 'Repair Guides', nameEn: 'Repair Guides', description: 'Handleidingen' },
      { slug: 'dremels-grinders', name: 'Dremels & Grinders', nameEn: 'Dremels & Grinders', description: 'Slijpmachines' },
      { slug: 'heat-mats', name: 'Heat Mats', nameEn: 'Heat Mats', description: 'Verwarmingsmatten' },
      { slug: 'disassembly-tools', name: 'Disassembly Tools', nameEn: 'Disassembly Tools', description: 'Demontage tools' },
    ]
  },
  {
    slug: 'repair-tools-oem',
    name: 'Tools - OEM Service',
    nameEn: 'Tools - OEM Service',
    description: 'Originele service tools',
    subcategories: [
      { slug: 'oem-disassembly', name: 'OEM Disassembly', nameEn: 'Disassembly Tools', description: 'Originele demontage' },
      { slug: 'oem-fixtures', name: 'OEM Repair Fixtures', nameEn: 'Repair Fixtures', description: 'Originele houders' },
      { slug: 'oem-clamps', name: 'OEM Clamps', nameEn: 'Clamps & Holders', description: 'Originele klemmen' },
      { slug: 'oem-pliers', name: 'OEM Pliers', nameEn: 'Pliers & Cutters', description: 'Originele tangen' },
      { slug: 'oem-cleaning', name: 'OEM Cleaning', nameEn: 'Cleaning Supplies', description: 'Originele schoonmaak' },
      { slug: 'oem-pry', name: 'OEM Pry Tools', nameEn: 'Pry Tools', description: 'Originele pry tools' },
      { slug: 'oem-screwdrivers', name: 'OEM Screwdrivers', nameEn: 'Screwdrivers', description: 'Originele schroevendraaiers' },
      { slug: 'oem-heated-plates', name: 'Heated Display Plates', nameEn: 'Heated Display Plates', description: 'Verwarmde platen' },
    ]
  },
  {
    slug: 'repair-tools-supplies',
    name: 'Tools - Supplies',
    nameEn: 'Tools - Supplies',
    description: 'Werkplaats benodigdheden',
    subcategories: [
      { slug: 'cleaning-supplies', name: 'Schoonmaakmiddelen', nameEn: 'Cleaning Supplies', description: 'Reinigingsmiddelen' },
      { slug: 'safety-supplies', name: 'Veiligheidsmiddelen', nameEn: 'Safety Supplies', description: 'Beschermingsmiddelen' },
      { slug: 'work-desk-supplies', name: 'Werkplek Supplies', nameEn: 'Work Desk Supplies', description: 'Bureaubenodigdheden' },
      { slug: 'shop-supplies', name: 'Werkplaats Supplies', nameEn: 'Shop Supplies', description: 'Werkplaats artikelen' },
      { slug: 'device-accessories', name: 'Device Accessories', nameEn: 'Device Accessories', description: 'Toestel accessoires' },
      { slug: 'back-cover-repair', name: 'Back Cover Repair', nameEn: 'Back Cover Repair', description: 'Achterkant reparatie' },
      { slug: 'glues', name: 'Lijmen', nameEn: 'Glues', description: 'Speciale lijmen' },
      { slug: 'cosmetic-repair', name: 'Cosmetische Reparatie', nameEn: 'Cosmetic Repair', description: 'Oppervlakte reparatie' },
      { slug: 'glue-removers', name: 'Lijmverwijderaars', nameEn: 'Glue Removers', description: 'Lijmoplossers' },
    ]
  },
  {
    slug: 'repair-tools-organization',
    name: 'Tools - Organization',
    nameEn: 'Tools - Organization',
    description: 'Organisatie & opbergen',
    subcategories: [
      { slug: 'tool-holders', name: 'Tool Holders', nameEn: 'Tool Holders', description: 'Gereedschaphouders' },
      { slug: 'screw-mats', name: 'Screw Mats', nameEn: 'Screw Mats', description: 'Schroef organizers' },
      { slug: 'storage-boxes', name: 'Opbergdozen', nameEn: 'Storage Boxes', description: 'Bewaarboxen' },
      { slug: 'parts-storage', name: 'Parts Storage', nameEn: 'Parts Storage', description: 'Onderdelen opslag' },
      { slug: 'screen-holders', name: 'Screen Holders', nameEn: 'Screen Holders', description: 'Display houders' },
      { slug: 'screwbox', name: 'ScrewBox', nameEn: 'ScrewBox', description: 'Schroef organizers' },
      { slug: 'tape-dispensers', name: 'Tape Dispensers', nameEn: 'Tape Dispensers', description: 'Tape afrollers' },
      { slug: 'workstations', name: 'Workstations', nameEn: 'Work Stations', description: 'Werkstations' },
    ]
  },
  {
    slug: 'repair-tools-programmers',
    name: 'Tools - Programmers',
    nameEn: 'Tools - Programmers',
    description: 'Programmeer apparaten',
    subcategories: [
      { slug: 'screen-programmers', name: 'Screen Programmers', nameEn: 'Screen Programmers', description: 'Display programmeurs' },
      { slug: 'battery-programmers', name: 'Battery Programmers', nameEn: 'Battery Programmers', description: 'Batterij programmeurs' },
      { slug: 'calibrators', name: 'Calibrators', nameEn: 'Calibrators', description: 'Kalibratie apparaten' },
      { slug: 'face-id-programmers', name: 'Face ID Programmers', nameEn: 'Face ID Programmers', description: 'Face ID reparatie' },
      { slug: 'ic-programmers', name: 'IC Programmers', nameEn: 'IC Programmers', description: 'Chip programmeurs' },
      { slug: 'watch-programmers', name: 'Watch Programmers', nameEn: 'Watch Programmers', description: 'Smartwatch programmeurs' },
    ]
  },
  {
    slug: 'repair-tools-testing',
    name: 'Tools - Testing',
    nameEn: 'Tools - Testing Devices',
    description: 'Test apparatuur',
    subcategories: [
      { slug: 'screen-testers', name: 'Screen Testers', nameEn: 'Screen Tester', description: 'Display testers' },
      { slug: 'battery-testers', name: 'Battery Testers', nameEn: 'Battery Tester', description: 'Batterij testers' },
      { slug: 'tristar-testers', name: 'Tristar Testers', nameEn: 'Tristar Tester', description: 'Tristar/MFI testers' },
      { slug: 'mfi-testers', name: 'MFI Testers', nameEn: 'MFI Tester', description: 'MFI testers' },
      { slug: 'test-cables', name: 'Test Cables', nameEn: 'Test Cables', description: 'Test kabels' },
      { slug: 'sim-testers', name: 'SIM Testers', nameEn: 'Sim Tester', description: 'SIM testers' },
      { slug: 'external-chargers', name: 'External Chargers', nameEn: 'External Chargers', description: 'Externe opladers' },
      { slug: 'cable-testers', name: 'Cable Testers', nameEn: 'Cable Testers', description: 'Kabel testers' },
      { slug: 'power-testers', name: 'Power Testers', nameEn: 'Power Testers', description: 'Stroom testers' },
      { slug: 'motherboard-testers', name: 'Motherboard Testers', nameEn: 'Motherboard Testers', description: 'Moederbord testers' },
      { slug: 'port-testers', name: 'Port Testers', nameEn: 'Port Testers', description: 'Poort testers' },
    ]
  },
  {
    slug: 'repair-tools-microsoldering',
    name: 'Tools - Microsoldering',
    nameEn: 'Tools - Microsoldering',
    description: 'Microsoldering apparatuur',
    subcategories: [
      { slug: 'hot-air-stations', name: 'Hot Air Stations', nameEn: 'Hot Air Stations', description: 'Hetelucht stations' },
      { slug: 'soldering-stations', name: 'Soldering Stations', nameEn: 'Soldering Stations', description: 'Soldeer stations' },
      { slug: 'board-holders', name: 'Board Holders', nameEn: 'Board Holders & Preheaters', description: 'Bord houders & voorverwarmers' },
      { slug: 'power-supply-units', name: 'Power Supply Units', nameEn: 'Power Supply Units', description: 'Voedingen' },
      { slug: 'thermal-cameras', name: 'Thermal Cameras', nameEn: 'Thermal Cameras', description: 'Warmtecamera\'s' },
      { slug: 'microscopes', name: 'Microscopen', nameEn: 'Microscopes', description: 'Reparatie microscopen' },
      { slug: 'laser-stations', name: 'Laser Stations', nameEn: 'Laser Stations', description: 'Laser stations' },
      { slug: 'microsoldering-testers', name: 'Testing Devices', nameEn: 'Motherboard Testers', description: 'Test apparaten' },
      { slug: 'microsoldering-power', name: 'Power Testers', nameEn: 'Power Testers', description: 'Stroom testers' },
      { slug: 'multimeters', name: 'Multimeters', nameEn: 'Multimeters', description: 'Meetapparatuur' },
      { slug: 'spot-welders', name: 'Spot Welders', nameEn: 'Spot Welders', description: 'Puntlassers' },
      { slug: 'fume-extractors', name: 'Fume Extractors', nameEn: 'Fume Extractors', description: 'Dampafzuigers' },
    ]
  },
  {
    slug: 'repair-tools-soldering-supplies',
    name: 'Tools - Soldering Supplies',
    nameEn: 'Tools - Soldering Supplies',
    description: 'Soldering benodigdheden',
    subcategories: [
      { slug: 'solder-wires', name: 'Solder Wires', nameEn: 'Solder Wires', description: 'Soldeerdraad' },
      { slug: 'solder-paste', name: 'Solder Paste', nameEn: 'Solder Paste', description: 'Soldeerpasta' },
      { slug: 'flux', name: 'Flux', nameEn: 'Flux', description: 'Flux middelen' },
      { slug: 'solder-mask', name: 'Solder Mask', nameEn: 'Solder Mask', description: 'Solder masker' },
      { slug: 'solder-wick', name: 'Solder Wick', nameEn: 'Solder Wick', description: 'Ontsoldeerlont' },
      { slug: 'solder-balls', name: 'Solder Balls', nameEn: 'Solder balls', description: 'Soldeer ballen' },
      { slug: 'replacement-tips', name: 'Replacement Tips', nameEn: 'Replacement Tips', description: 'Soldeerpunten' },
      { slug: 'alcohol-dispensers', name: 'Alcohol Dispensers', nameEn: 'Alcohol Dispensers', description: 'Alcohol dispensers' },
      { slug: 'stencils', name: 'Stencils', nameEn: 'Stencils', description: 'Reballing stencils' },
      { slug: 'soldering-glue-removers', name: 'Glue Removers', nameEn: 'Glue Removers', description: 'Lijmverwijderaars' },
      { slug: 'tip-cleaners', name: 'Tip Cleaners', nameEn: 'Tip Cleaners', description: 'Punt reinigers' },
      { slug: 'other-supplies', name: 'Other Supplies', nameEn: 'Other Supplies', description: 'Overige benodigdheden' },
      { slug: 'soldering-glues', name: 'Glues', nameEn: 'Glues', description: 'Lijmen' },
      { slug: 'blades', name: 'Blades', nameEn: 'Blades', description: 'Mesjes' },
    ]
  },
  {
    slug: 'repair-tools-refurbishing',
    name: 'Tools - Refurbishing',
    nameEn: 'Tools - Refurbishing',
    description: 'Display refurbishing tools',
    subcategories: [
      { slug: 'glass-separation', name: 'Glass Separation', nameEn: 'Glass Separation', description: 'Glass scheiding' },
      { slug: 'cutting-wire', name: 'Cutting Wire', nameEn: 'Cutting Wire', description: 'Snijdraad' },
      { slug: 'glue-removal', name: 'Glue Removal', nameEn: 'Glue Removal', description: 'Lijm verwijdering' },
      { slug: 'alignment-moulds', name: 'Alignment Moulds', nameEn: 'Alignment Moulds', description: 'Uitlijning mallen' },
      { slug: 'lamination-tools', name: 'Lamination Tools', nameEn: 'Lamination Tools', description: 'Laminatie tools' },
      { slug: 'loca-oca-films', name: 'LOCA/OCA Films', nameEn: 'LOCA/OCA films', description: 'OCA/LOCA films' },
      { slug: 'pre-cut-adhesives', name: 'Pre-Cut Adhesives', nameEn: 'Pre-Cut Adhesives', description: 'Pre-cut tapes' },
      { slug: 'refurbishing-alcohol', name: 'Alcohol Dispensers', nameEn: 'Alcohol Dispensers', description: 'Alcohol dispensers' },
      { slug: 'glass-frames', name: 'Glass & Frames', nameEn: 'Glass & Frames', description: 'Glass en frames' },
      { slug: 'refurbishing-pliers', name: 'Pliers & Cutters', nameEn: 'Pliers & Cutters', description: 'Tangen' },
      { slug: 'refurbishing-tweezers', name: 'Tweezers', nameEn: 'Tweezers', description: 'Pincetten' },
      { slug: 'refurbishing-testers', name: 'Testers', nameEn: 'Testers', description: 'Testers' },
      { slug: 'refurbishing-kits', name: 'Refurbishing Kits', nameEn: 'Refurbishing Kits', description: 'Refurbish kits' },
      { slug: 'refurbishing-glues', name: 'Glues', nameEn: 'Glues', description: 'Lijmen' },
      { slug: 'lcd-separator', name: 'LCD Separator', nameEn: 'LCD Separator', description: 'LCD separators' },
      { slug: 'refurbishing-clamps', name: 'Refurbishing Clamps', nameEn: 'Refurbishing Clamps & Holders', description: 'Klemmen' },
      { slug: 'refurbishing-blades', name: 'Refurbishing Blades', nameEn: 'Blades', description: 'Mesjes' },
    ]
  },
  {
    slug: 'repair-tools-back-glass',
    name: 'Tools - Back Glass Repair',
    nameEn: 'Tools - Back Glass Repair',
    description: 'Back glass reparatie tools',
    subcategories: [
      { slug: 'laser-machines', name: 'Laser Machines', nameEn: 'Laser Machines', description: 'Laser machines' },
      { slug: 'back-glass-fume', name: 'Fume Extractors', nameEn: 'Fume Extractors', description: 'Dampafzuigers' },
      { slug: 'laser-moulds', name: 'Laser Moulds', nameEn: 'Laser Moulds', description: 'Laser mallen' },
      { slug: 'back-glass-adhesives', name: 'Pre-Cut Adhesives', nameEn: 'Pre-Cut Adhesives', description: 'Pre-cut tapes' },
      { slug: 'back-glass-glues', name: 'Back Glass Glues', nameEn: 'Glues', description: 'Speciale lijmen' },
      { slug: 'glass-removal', name: 'Glass Removal', nameEn: 'Glass Removal', description: 'Glass verwijdering' },
      { slug: 'glue-cleaning', name: 'Glue Cleaning', nameEn: 'Glue Cleaning', description: 'Lijm reiniging' },
      { slug: 'back-glass-clamps', name: 'Back Glass Clamps', nameEn: 'Clamps and Holders', description: 'Klemmen en houders' },
    ]
  },
  {
    slug: 'universal-components',
    name: 'Universal Components',
    nameEn: 'Universal Components',
    description: 'Universele onderdelen',
    subcategories: [
      { slug: 'clicker-switches', name: 'Clicker Switches', nameEn: 'Clicker Switches', description: 'Click switches' },
      { slug: 'universal-board-components', name: 'Universal Board Components', nameEn: 'Universal Board Components', description: 'Universele bord componenten' },
    ]
  },
  {
    slug: 'tool-brands',
    name: 'Tool Brands',
    nameEn: 'Tool Brands',
    description: 'Bekende tool merken',
    subcategories: [
      { slug: 'aixun', name: 'Aixun', nameEn: 'Aixun', description: 'Aixun tools' },
      { slug: 'amaoe', name: 'Amaoe', nameEn: 'Amaoe', description: 'Amaoe tools' },
      { slug: 'amtech', name: 'Amtech', nameEn: 'Amtech', description: 'Amtech tools' },
      { slug: 'arctic', name: 'Arctic', nameEn: 'Arctic', description: 'Arctic products' },
      { slug: 'ay', name: 'AY', nameEn: 'AY', description: 'AY tools' },
      { slug: 'bnr', name: 'B&R', nameEn: 'B&R', description: 'B&R tools' },
      { slug: 'baiyi', name: 'Baiyi', nameEn: 'Baiyi', description: 'Baiyi tools' },
      { slug: 'best', name: 'Best', nameEn: 'Best', description: 'Best tools' },
      { slug: 'cpb', name: 'CPB', nameEn: 'CPB', description: 'CPB tools' },
      { slug: 'dl', name: 'DL', nameEn: 'DL', description: 'DL tools' },
      { slug: 'dlzwin', name: 'DLZ Win', nameEn: 'DLZ Win', description: 'DLZ Win tools' },
      { slug: 'dobe', name: 'Dobe', nameEn: 'Dobe', description: 'Dobe tools' },
      { slug: 'dottorpodx', name: 'Dottorpodx', nameEn: 'Dottorpodx', description: 'Dottorpodx tools' },
      { slug: 'falcon', name: 'Falcon', nameEn: 'Falcon', description: 'Falcon tools' },
      { slug: 'ifixit', name: 'IFixIt', nameEn: 'IFixIt', description: 'IFixIt tools' },
      { slug: 'itestbox', name: 'iTestBox', nameEn: 'iTestBox', description: 'iTestBox testers' },
      { slug: 'i2c', name: 'i2C', nameEn: 'i2C', description: 'i2C tools' },
      { slug: 'jakemy', name: 'Jakemy', nameEn: 'Jakemy', description: 'Jakemy tools' },
      { slug: 'jbc', name: 'JBC', nameEn: 'JBC', description: 'JBC soldeer' },
      { slug: 'jcid', name: 'JCID', nameEn: 'JCID', description: 'JCID programmers' },
      { slug: 'jetclean', name: 'JetClean', nameEn: 'JetClean', description: 'JetClean products' },
      { slug: 'kaisi', name: 'Kaisi', nameEn: 'Kaisi', description: 'Kaisi tools' },
      { slug: 'laserpod', name: 'LaserPod', nameEn: 'LaserPod', description: 'LaserPod' },
      { slug: 'lb-tool', name: 'LB Tool', nameEn: 'LB Tool', description: 'LB Tool' },
      { slug: 'maant', name: 'MaAnt', nameEn: 'MaAnt', description: 'MaAnt tools' },
      { slug: 'mechanic', name: 'Mechanic', nameEn: 'Mechanic', description: 'Mechanic tools' },
      { slug: 'mijing', name: 'Mijing', nameEn: 'Mijing', description: 'Mijing tools' },
      { slug: 'm-triangel', name: 'M-Triangel', nameEn: 'M-Triangel', description: 'M-Triangel' },
      { slug: 'nanch', name: 'Nanch', nameEn: 'Nanch', description: 'Nanch tools' },
      { slug: 'niceseem', name: 'Niceseem', nameEn: 'Niceseem', description: 'Niceseem' },
      { slug: 'oca-master', name: 'OCA Master', nameEn: 'OCA Master', description: 'OCA Master' },
      { slug: 'polartronix', name: 'PolarTronix', nameEn: 'PolarTronix', description: 'PolarTronix' },
      { slug: 'ppd', name: 'PPD', nameEn: 'PPD', description: 'PPD tools' },
      { slug: 'qianli', name: 'Qianli', nameEn: 'Qianli', description: 'Qianli tools' },
      { slug: 'quick', name: 'Quick', nameEn: 'Quick', description: 'Quick stations' },
      { slug: 'refox', name: 'Refox', nameEn: 'Refox', description: 'Refox tools' },
      { slug: 'relife', name: 'Relife', nameEn: 'Relife', description: 'Relife tools' },
      { slug: 'rogers', name: 'Rogers', nameEn: 'Rogers', description: 'Rogers' },
      { slug: 'smartmod', name: 'Smartmod', nameEn: 'Smartmod', description: 'Smartmod' },
      { slug: 'ssgp', name: 'SSGP', nameEn: 'SSGP', description: 'SSGP' },
      { slug: 'sunshine', name: 'Sunshine', nameEn: 'Sunshine', description: 'Sunshine tools' },
      { slug: 'tapebase', name: 'Tapebase', nameEn: 'Tapebase', description: 'Tapebase' },
      { slug: 'tbk', name: 'TBK', nameEn: 'TBK', description: 'TBK laminators' },
      { slug: 'techspray', name: 'TechSpray', nameEn: 'TechSpray', description: 'TechSpray' },
      { slug: 'tesa', name: 'Tesa', nameEn: 'Tesa', description: 'Tesa tapes' },
      { slug: 'wera', name: 'Wera', nameEn: 'Wera', description: 'Wera tools' },
      { slug: 'wiha', name: 'Wiha', nameEn: 'Wiha', description: 'Wiha tools' },
      { slug: 'wlxy', name: 'WLXY', nameEn: 'WLXY', description: 'WLXY' },
      { slug: 'wolve', name: 'Wolve', nameEn: 'Wolve', description: 'Wolve' },
      { slug: 'wowstick', name: 'Wowstick', nameEn: 'Wowstick', description: 'Wowstick' },
      { slug: 'wrepair', name: 'Wrepair', nameEn: 'Wrepair', description: 'Wrepair' },
      { slug: 'wylie', name: 'Wylie', nameEn: 'Wylie', description: 'Wylie' },
      { slug: 'xinzhizao', name: 'XinZhiZao', nameEn: 'XinZhiZao', description: 'XinZhiZao' },
      { slug: 'ycs', name: 'YCS', nameEn: 'YCS', description: 'YCS' },
      { slug: 'zhanlida', name: 'Zhanlida', nameEn: 'Zhanlida', description: 'Zhanlida' },
      { slug: '2uul', name: '2uul', nameEn: '2uul', description: '2uul' },
      { slug: '3m', name: '3M', nameEn: '3M', description: '3M products' },
    ]
  },
];

// ==================== PC PARTS CATEGORY SYSTEM ====================
export const pcPartsCategories: AccessoryCategory[] = [
  {
    slug: 'pc-components',
    name: 'PC Componenten',
    nameEn: 'PC Components',
    description: 'Interne PC componenten',
    subcategories: [
      { slug: 'processors', name: 'Processoren (CPU)', nameEn: 'Processors', description: 'Intel & AMD processors' },
      { slug: 'motherboards', name: 'Moederborden', nameEn: 'Motherboards', description: 'ATX, Micro-ATX, Mini-ITX' },
      { slug: 'graphics-cards', name: 'Grafische Kaarten (GPU)', nameEn: 'Graphics Cards', description: 'NVIDIA & AMD videokaarten' },
      { slug: 'memory-ram', name: 'Geheugen (RAM)', nameEn: 'Memory', description: 'DDR4 & DDR5 RAM' },
      { slug: 'storage', name: 'Opslag (HDD/SSD)', nameEn: 'Storage', description: 'SSD, NVMe, Harde schijven' },
      { slug: 'power-supplies', name: 'Voedingen (PSU)', nameEn: 'Power Supplies', description: 'ATX voedingen' },
      { slug: 'cases', name: 'PC Behuizingen', nameEn: 'PC Cases', description: 'Tower, Mini-ITX, Micro-ATX' },
      { slug: 'cpu-coolers', name: 'CPU Koelers', nameEn: 'CPU Coolers', description: 'Air & Liquid cooling' },
    ]
  },
  {
    slug: 'pc-internal',
    name: 'Interne Onderdelen',
    nameEn: 'Internal Parts',
    description: 'Overige interne componenten',
    subcategories: [
      { slug: 'case-fans', name: 'Case Fans', nameEn: 'Case Fans', description: '120mm, 140mm fans' },
      { slug: 'thermal-paste', name: 'Koelpasta', nameEn: 'Thermal Paste', description: 'Thermische compound' },
      { slug: 'cables-internal', name: 'Interne Kabels', nameEn: 'Internal Cables', description: 'SATA, power, fan kabels' },
      { slug: 'network-cards', name: 'Netwerkkaarten', nameEn: 'Network Cards', description: 'WiFi & Ethernet kaarten' },
    ]
  },
];

// ==================== PC ACCESSORIES CATEGORY SYSTEM ====================
export const pcAccessoryCategories: AccessoryCategory[] = [
  {
    slug: 'drawing-tablets',
    name: 'Tekentablets',
    nameEn: 'Drawing Tablets',
    description: 'Wacom, Huion, XP-Pen',
    subcategories: [
      { slug: 'wacom', name: 'Wacom', nameEn: 'Wacom', description: 'Wacom tablets' },
      { slug: 'huion', name: 'Huion', nameEn: 'Huion', description: 'Huion tablets' },
      { slug: 'xp-pen', name: 'XP-Pen', nameEn: 'XP-Pen', description: 'XP-Pen tablets' },
    ],
  },
  {
    slug: 'pc-monitors',
    name: 'Monitoren',
    nameEn: 'Monitors',
    description: 'Beeldschermen',
    subcategories: [
      { slug: 'gaming-monitors', name: 'Gaming Monitoren', nameEn: 'Gaming Monitors', description: '144Hz, 240Hz, 1ms' },
      { slug: '4k-monitors', name: '4K Monitoren', nameEn: '4K Monitors', description: 'Ultra HD beeldschermen' },
      { slug: 'ultrawide', name: 'Ultrawide', nameEn: 'Ultrawide', description: '21:9 & 32:9 monitoren' },
      { slug: 'monitor-arms', name: 'Monitor Armen', nameEn: 'Monitor Arms', description: 'Beeldscherm steunen' },
    ]
  },
  {
    slug: 'pc-audio',
    name: 'PC Audio',
    nameEn: 'PC Audio',
    description: 'Geluid voor PC',
    subcategories: [
      { slug: 'pc-speakers', name: 'PC Speakers', nameEn: 'PC Speakers', description: '2.0, 2.1, 5.1 sets' },
      { slug: 'gaming-headsets', name: 'Gaming Headsets', nameEn: 'Gaming Headsets', description: 'USB & 3.5mm headsets' },
      { slug: 'sound-cards', name: 'Geluidskaarten', nameEn: 'Sound Cards', description: 'Interne & externe' },
    ]
  },
  {
    slug: 'pc-connectivity',
    name: 'PC Connectiviteit',
    nameEn: 'PC Connectivity',
    description: 'Kabels & adapters',
    subcategories: [
      { slug: 'hdmi-cables', name: 'HDMI Kabels', nameEn: 'HDMI Cables', description: 'HDMI 2.0, 2.1' },
      { slug: 'displayport', name: 'DisplayPort Kabels', nameEn: 'DisplayPort Cables', description: 'DP 1.4, DP 2.0' },
      { slug: 'usb-cables', name: 'USB Kabels', nameEn: 'USB Cables', description: 'USB-A, USB-C hubs' },
      { slug: 'ethernet-cables', name: 'Ethernet Kabels', nameEn: 'Ethernet Cables', description: 'Cat5e, Cat6, Cat6a' },
    ]
  },
];

// Compatibility mapping: which accessory categories work with which brands/models
export const accessoryCompatibility = {
  'apple': ['iphone', 'ipad', 'apple-watch', 'airpods'],
  'samsung': ['galaxy-s', 'galaxy-a', 'galaxy-z', 'galaxy-tab'],
  'google': ['pixel'],
  'huawei': ['huawei-phones', 'huawei-tablets'],
  'xiaomi': ['xiaomi-phones', 'redmi', 'poco'],
  'motorola': ['moto-g', 'moto-edge', 'moto-razr'],
  'oneplus': ['oneplus-phones'],
  'oppo': ['oppo-phones', 'oppo-find', 'oppo-reno'],
};
