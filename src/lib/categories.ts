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
        slug: 'macbook-pro', name: 'MacBook Pro', nameEn: 'MacBook Pro',
        models: [
          { slug: 'mbp-16-2024-m4', name: 'MacBook Pro 16" (2024) M4 - A2991' },
          { slug: 'mbp-14-2024-m4', name: 'MacBook Pro 14" (2024) M4 - A2992' },
          { slug: 'mbp-16-2023-m3', name: 'MacBook Pro 16" (2023) M3 Pro/Max - A2991' },
          { slug: 'mbp-14-2023-m3', name: 'MacBook Pro 14" (2023) M3 Pro/Max - A2992' },
          { slug: 'mbp-16-2023-m2', name: 'MacBook Pro 16" (2023) M2 Pro/Max - A2780' },
          { slug: 'mbp-14-2023-m2', name: 'MacBook Pro 14" (2023) M2 Pro/Max - A2779' },
          { slug: 'mbp-16-2021-m1', name: 'MacBook Pro 16" (2021) M1 Pro/Max - A2485' },
          { slug: 'mbp-14-2021-m1', name: 'MacBook Pro 14" (2021) M1 Pro/Max - A2442' },
          { slug: 'mbp-16-2019', name: 'MacBook Pro 16" (2019) - A2141' },
          { slug: 'mbp-13-2020-m1', name: 'MacBook Pro 13" (2020) M1 - A2338' },
          { slug: 'mbp-13-2020', name: 'MacBook Pro 13" (2020) Intel - A2289/A2251' },
          { slug: 'mbp-13-2019', name: 'MacBook Pro 13" (2019) - A2159/A1989' },
          { slug: 'mbp-13-2018', name: 'MacBook Pro 13" (2018) - A1989' },
          { slug: 'mbp-13-2017', name: 'MacBook Pro 13" (2017) - A1708/A1706' },
          { slug: 'mbp-13-2016', name: 'MacBook Pro 13" (2016) - A1708/A1706' },
          { slug: 'mbp-15-2019', name: 'MacBook Pro 15" (2019) - A1990' },
          { slug: 'mbp-15-2018', name: 'MacBook Pro 15" (2018) - A1990' },
          { slug: 'mbp-15-2017', name: 'MacBook Pro 15" (2017) - A1707' },
          { slug: 'mbp-15-2016', name: 'MacBook Pro 15" (2016) - A1707' },
          { slug: 'mbp-15-2015', name: 'MacBook Pro 15" (2015) - A1398' },
          { slug: 'mbp-15-2013-retina', name: 'MacBook Pro 15" Retina (2013-2014) - A1398' },
          { slug: 'mbp-15-2012-retina', name: 'MacBook Pro 15" Retina (2012) - A1398' },
          { slug: 'mbp-13-2015', name: 'MacBook Pro 13" (2015) - A1502' },
          { slug: 'mbp-13-2014', name: 'MacBook Pro 13" (2014) - A1502' },
          { slug: 'mbp-13-2013', name: 'MacBook Pro 13" (2013) - A1502' },
          { slug: 'mbp-13-2012-retina', name: 'MacBook Pro 13" Retina (2012) - A1425' },
        ],
      },
      {
        slug: 'macbook-air',
        name: 'MacBook Air',
        nameEn: 'MacBook Air',
        models: [
          { slug: 'mba-15-2025-m4', name: 'MacBook Air 15" (2025) M4 - A3510' },
          { slug: 'mba-13-2025-m4', name: 'MacBook Air 13" (2025) M4 - A3509' },
          { slug: 'mba-15-2024-m3', name: 'MacBook Air 15" (2024) M3 - A3114' },
          { slug: 'mba-13-2024-m3', name: 'MacBook Air 13" (2024) M3 - A3113' },
          { slug: 'mba-15-2023-m2', name: 'MacBook Air 15" (2023) M2 - A2941' },
          { slug: 'mba-13-2022-m2', name: 'MacBook Air 13" (2022) M2 - A2681' },
          { slug: 'mba-13-2020-m1', name: 'MacBook Air 13" (2020) M1 - A2337' },
          { slug: 'mba-13-2020', name: 'MacBook Air 13" (2020) Intel - A2179' },
          { slug: 'mba-13-2019', name: 'MacBook Air 13" (2019) - A1932' },
          { slug: 'mba-13-2018', name: 'MacBook Air 13" (2018) - A1932' },
          { slug: 'mba-13-2017', name: 'MacBook Air 13" (2017) - A1466' },
          { slug: 'mba-13-2015', name: 'MacBook Air 13" (2015) - A1466' },
          { slug: 'mba-13-2014', name: 'MacBook Air 13" (2014) - A1466' },
          { slug: 'mba-13-2013', name: 'MacBook Air 13" (2013) - A1466' },
          { slug: 'mba-11-2015', name: 'MacBook Air 11" (2015) - A1465' },
          { slug: 'mba-11-2014', name: 'MacBook Air 11" (2014) - A1465' },
          { slug: 'mba-11-2013', name: 'MacBook Air 11" (2013) - A1465' },
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
          { slug: 'galaxy-a98', name: 'Galaxy A98 5G (2024)' },
          { slug: 'galaxy-a96', name: 'Galaxy A96 5G (2022)' },
          { slug: 'galaxy-a95', name: 'Galaxy A95 5G (2021)' },
          { slug: 'galaxy-a94', name: 'Galaxy A94 5G (2021)' },
          { slug: 'galaxy-a93', name: 'Galaxy A93 5G (2021)' },
          { slug: 'galaxy-a92', name: 'Galaxy A92 (2020)' },
          { slug: 'galaxy-a91', name: 'Galaxy A91 (2019)' },
          { slug: 'galaxy-a73', name: 'Galaxy A73 5G' },
          { slug: 'galaxy-a72', name: 'Galaxy A72' },
          { slug: 'galaxy-a71', name: 'Galaxy A71' },
          { slug: 'galaxy-a70', name: 'Galaxy A70' },
          { slug: 'galaxy-a70s', name: 'Galaxy A70s' },
          { slug: 'galaxy-a56', name: 'Galaxy A56 5G' },
          { slug: 'galaxy-a55', name: 'Galaxy A55' },
          { slug: 'galaxy-a54', name: 'Galaxy A54 5G' },
          { slug: 'galaxy-a53', name: 'Galaxy A53 5G' },
          { slug: 'galaxy-a52s', name: 'Galaxy A52s 5G' },
          { slug: 'galaxy-a52', name: 'Galaxy A52' },
          { slug: 'galaxy-a51', name: 'Galaxy A51' },
          { slug: 'galaxy-a50s', name: 'Galaxy A50s' },
          { slug: 'galaxy-a50', name: 'Galaxy A50' },
          { slug: 'galaxy-a42', name: 'Galaxy A42 5G' },
          { slug: 'galaxy-a41', name: 'Galaxy A41' },
          { slug: 'galaxy-a40', name: 'Galaxy A40' },
          { slug: 'galaxy-a36', name: 'Galaxy A36 5G' },
          { slug: 'galaxy-a35', name: 'Galaxy A35 5G' },
          { slug: 'galaxy-a34', name: 'Galaxy A34 5G' },
          { slug: 'galaxy-a33', name: 'Galaxy A33 5G' },
          { slug: 'galaxy-a32', name: 'Galaxy A32' },
          { slug: 'galaxy-a31', name: 'Galaxy A31' },
          { slug: 'galaxy-a30s', name: 'Galaxy A30s' },
          { slug: 'galaxy-a30', name: 'Galaxy A30' },
          { slug: 'galaxy-a26', name: 'Galaxy A26 5G' },
          { slug: 'galaxy-a25', name: 'Galaxy A25 5G' },
          { slug: 'galaxy-a24', name: 'Galaxy A24' },
          { slug: 'galaxy-a23', name: 'Galaxy A23' },
          { slug: 'galaxy-a22', name: 'Galaxy A22' },
          { slug: 'galaxy-a21s', name: 'Galaxy A21s' },
          { slug: 'galaxy-a21', name: 'Galaxy A21' },
          { slug: 'galaxy-a20s', name: 'Galaxy A20s' },
          { slug: 'galaxy-a20e', name: 'Galaxy A20e' },
          { slug: 'galaxy-a20', name: 'Galaxy A20' },
          { slug: 'galaxy-a16', name: 'Galaxy A16' },
          { slug: 'galaxy-a15', name: 'Galaxy A15' },
          { slug: 'galaxy-a14', name: 'Galaxy A14' },
          { slug: 'galaxy-a13', name: 'Galaxy A13' },
          { slug: 'galaxy-a12', name: 'Galaxy A12' },
          { slug: 'galaxy-a11', name: 'Galaxy A11' },
          { slug: 'galaxy-a10s', name: 'Galaxy A10s' },
          { slug: 'galaxy-a10e', name: 'Galaxy A10e' },
          { slug: 'galaxy-a10', name: 'Galaxy A10' },
          { slug: 'galaxy-a09', name: 'Galaxy A09' },
          { slug: 'galaxy-a08s', name: 'Galaxy A08s' },
          { slug: 'galaxy-a08', name: 'Galaxy A08' },
          { slug: 'galaxy-a06', name: 'Galaxy A06' },
          { slug: 'galaxy-a05s', name: 'Galaxy A05s' },
          { slug: 'galaxy-a05', name: 'Galaxy A05' },
          { slug: 'galaxy-a04s', name: 'Galaxy A04s' },
          { slug: 'galaxy-a04', name: 'Galaxy A04' },
          { slug: 'galaxy-a03s', name: 'Galaxy A03s' },
          { slug: 'galaxy-a03', name: 'Galaxy A03' },
          { slug: 'galaxy-a02s', name: 'Galaxy A02s' },
          { slug: 'galaxy-a02', name: 'Galaxy A02' },
          { slug: 'galaxy-a01', name: 'Galaxy A01' },
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
    slug: 'blackberry',
    name: 'Blackberry',
    nameEn: 'Blackberry',
    subcategories: [
      { slug: 'key-series', name: 'Key Series', nameEn: 'Key Series', models: [{ slug: 'key2', name: 'BlackBerry Key2' }, { slug: 'keyone', name: 'BlackBerry KeyOne' }] },
      { slug: 'motion', name: 'Motion', nameEn: 'Motion', models: [{ slug: 'motion', name: 'BlackBerry Motion' }] },
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
          { slug: 'xiaomi-15-ultra', name: 'Xiaomi 15 Ultra' },
          { slug: 'xiaomi-15-pro', name: 'Xiaomi 15 Pro' },
          { slug: 'xiaomi-15', name: 'Xiaomi 15' },
          { slug: 'xiaomi-14-ultra', name: 'Xiaomi 14 Ultra' },
          { slug: 'xiaomi-14-pro', name: 'Xiaomi 14 Pro' },
          { slug: 'xiaomi-14', name: 'Xiaomi 14' },
          { slug: 'xiaomi-13-ultra', name: 'Xiaomi 13 Ultra' },
          { slug: 'xiaomi-13-pro', name: 'Xiaomi 13 Pro' },
          { slug: 'xiaomi-13t-pro', name: 'Xiaomi 13T Pro' },
          { slug: 'xiaomi-13t', name: 'Xiaomi 13T' },
          { slug: 'xiaomi-13', name: 'Xiaomi 13' },
          { slug: 'xiaomi-13-lite', name: 'Xiaomi 13 Lite' },
          { slug: 'xiaomi-12s-ultra', name: 'Xiaomi 12S Ultra' },
          { slug: 'xiaomi-12-ultra', name: 'Xiaomi 12 Ultra' },
          { slug: 'xiaomi-12-pro', name: 'Xiaomi 12 Pro' },
          { slug: 'xiaomi-12t-pro', name: 'Xiaomi 12T Pro' },
          { slug: 'xiaomi-12t', name: 'Xiaomi 12T' },
          { slug: 'xiaomi-12', name: 'Xiaomi 12' },
          { slug: 'xiaomi-12-lite', name: 'Xiaomi 12 Lite' },
          { slug: 'xiaomi-12x', name: 'Xiaomi 12X' },
          { slug: 'xiaomi-11-ultra', name: 'Xiaomi 11 Ultra' },
          { slug: 'xiaomi-11-pro', name: 'Xiaomi 11 Pro' },
          { slug: 'xiaomi-11t-pro', name: 'Xiaomi 11T Pro' },
          { slug: 'xiaomi-11t', name: 'Xiaomi 11T' },
          { slug: 'xiaomi-11', name: 'Xiaomi 11' },
          { slug: 'xiaomi-11-lite', name: 'Xiaomi 11 Lite' },
          { slug: 'xiaomi-11i', name: 'Xiaomi 11i' },
          { slug: 'xiaomi-10-ultra', name: 'Xiaomi 10 Ultra' },
          { slug: 'xiaomi-10-pro', name: 'Xiaomi 10 Pro' },
          { slug: 'xiaomi-10t-pro', name: 'Xiaomi 10T Pro' },
          { slug: 'xiaomi-10t', name: 'Xiaomi 10T' },
          { slug: 'xiaomi-10', name: 'Xiaomi 10' },
          { slug: 'xiaomi-10-lite', name: 'Xiaomi 10 Lite' },
          { slug: 'xiaomi-9-pro', name: 'Xiaomi 9 Pro' },
          { slug: 'xiaomi-9t-pro', name: 'Xiaomi 9T Pro' },
          { slug: 'xiaomi-9t', name: 'Xiaomi 9T' },
          { slug: 'xiaomi-9', name: 'Xiaomi 9' },
          { slug: 'xiaomi-9-lite', name: 'Xiaomi 9 Lite' },
          { slug: 'xiaomi-9se', name: 'Xiaomi 9 SE' },
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
          { slug: 'redmi-note-12-pro-plus', name: 'Redmi Note 12 Pro+' },
          { slug: 'redmi-note-12-pro', name: 'Redmi Note 12 Pro' },
          { slug: 'redmi-note-12', name: 'Redmi Note 12' },
          { slug: 'redmi-note-12s', name: 'Redmi Note 12S' },
          { slug: 'redmi-note-11-pro-plus', name: 'Redmi Note 11 Pro+' },
          { slug: 'redmi-note-11-pro', name: 'Redmi Note 11 Pro' },
          { slug: 'redmi-note-11s', name: 'Redmi Note 11S' },
          { slug: 'redmi-note-11', name: 'Redmi Note 11' },
          { slug: 'redmi-note-10-pro-max', name: 'Redmi Note 10 Pro Max' },
          { slug: 'redmi-note-10-pro', name: 'Redmi Note 10 Pro' },
          { slug: 'redmi-note-10s', name: 'Redmi Note 10S' },
          { slug: 'redmi-note-10', name: 'Redmi Note 10' },
          { slug: 'redmi-note-10-5g', name: 'Redmi Note 10 5G' },
          { slug: 'redmi-note-9-pro-max', name: 'Redmi Note 9 Pro Max' },
          { slug: 'redmi-note-9-pro', name: 'Redmi Note 9 Pro' },
          { slug: 'redmi-note-9s', name: 'Redmi Note 9S' },
          { slug: 'redmi-note-9', name: 'Redmi Note 9' },
          { slug: 'redmi-note-8-pro', name: 'Redmi Note 8 Pro' },
          { slug: 'redmi-note-8', name: 'Redmi Note 8' },
          { slug: 'redmi-note-7-pro', name: 'Redmi Note 7 Pro' },
          { slug: 'redmi-note-7', name: 'Redmi Note 7' },
          { slug: 'redmi-14c', name: 'Redmi 14C' },
          { slug: 'redmi-13c', name: 'Redmi 13C' },
          { slug: 'redmi-12c', name: 'Redmi 12C' },
          { slug: 'redmi-12', name: 'Redmi 12' },
          { slug: 'redmi-10c', name: 'Redmi 10C' },
          { slug: 'redmi-10', name: 'Redmi 10' },
          { slug: 'redmi-9c', name: 'Redmi 9C' },
          { slug: 'redmi-9a', name: 'Redmi 9A' },
          { slug: 'redmi-9', name: 'Redmi 9' },
          { slug: 'redmi-a3', name: 'Redmi A3' },
          { slug: 'redmi-a2', name: 'Redmi A2' },
          { slug: 'redmi-a1', name: 'Redmi A1' },
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
          { slug: 'moto-g75', name: 'Moto G75 5G' },
          { slug: 'moto-g73', name: 'Moto G73' },
          { slug: 'moto-g72', name: 'Moto G72' },
          { slug: 'moto-g62', name: 'Moto G62 5G' },
          { slug: 'moto-g60s', name: 'Moto G60s' },
          { slug: 'moto-g60', name: 'Moto G60' },
          { slug: 'moto-g54', name: 'Moto G54 5G' },
          { slug: 'moto-g53', name: 'Moto G53 5G' },
          { slug: 'moto-g52', name: 'Moto G52' },
          { slug: 'moto-g42', name: 'Moto G42' },
          { slug: 'moto-g41', name: 'Moto G41' },
          { slug: 'moto-g34', name: 'Moto G34' },
          { slug: 'moto-g32', name: 'Moto G32' },
          { slug: 'moto-g31', name: 'Moto G31' },
          { slug: 'moto-g24', name: 'Moto G24' },
          { slug: 'moto-g22', name: 'Moto G22' },
          { slug: 'moto-g20', name: 'Moto G20' },
          { slug: 'moto-g14', name: 'Moto G14' },
          { slug: 'moto-g13', name: 'Moto G13' },
          { slug: 'moto-g-power-2024', name: 'Moto G Power 2024' },
          { slug: 'moto-g-power-2023', name: 'Moto G Power 2023' },
          { slug: 'moto-g-power', name: 'Moto G Power' },
          { slug: 'moto-g-stylus-2024', name: 'Moto G Stylus 2024' },
          { slug: 'moto-g-stylus', name: 'Moto G Stylus' },
          { slug: 'moto-g-play', name: 'Moto G Play' },
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
          { slug: 'oneplus-13r', name: 'OnePlus 13R' },
          { slug: 'oneplus-13', name: 'OnePlus 13' },
          { slug: 'oneplus-12r', name: 'OnePlus 12R' },
          { slug: 'oneplus-12', name: 'OnePlus 12' },
          { slug: 'oneplus-11r', name: 'OnePlus 11R' },
          { slug: 'oneplus-11', name: 'OnePlus 11' },
          { slug: 'oneplus-10-pro', name: 'OnePlus 10 Pro' },
          { slug: 'oneplus-10t', name: 'OnePlus 10T' },
          { slug: 'oneplus-10r', name: 'OnePlus 10R' },
          { slug: 'oneplus-9-pro', name: 'OnePlus 9 Pro' },
          { slug: 'oneplus-9r', name: 'OnePlus 9R' },
          { slug: 'oneplus-9', name: 'OnePlus 9' },
          { slug: 'oneplus-8t', name: 'OnePlus 8T' },
          { slug: 'oneplus-8-pro', name: 'OnePlus 8 Pro' },
          { slug: 'oneplus-8', name: 'OnePlus 8' },
          { slug: 'oneplus-7t-pro', name: 'OnePlus 7T Pro' },
          { slug: 'oneplus-7t', name: 'OnePlus 7T' },
          { slug: 'oneplus-7-pro', name: 'OnePlus 7 Pro' },
          { slug: 'oneplus-7', name: 'OnePlus 7' },
          { slug: 'oneplus-6t', name: 'OnePlus 6T' },
          { slug: 'oneplus-6', name: 'OnePlus 6' },
        ],
      },
      {
        slug: 'oneplus-nord', name: 'OnePlus Nord', nameEn: 'OnePlus Nord',
        models: [
          { slug: 'nord-4', name: 'Nord 4' },
          { slug: 'nord-3', name: 'Nord 3' },
          { slug: 'nord-2t', name: 'Nord 2T' },
          { slug: 'nord-2', name: 'Nord 2' },
          { slug: 'nord-ce-4-lite', name: 'Nord CE 4 Lite' },
          { slug: 'nord-ce-4', name: 'Nord CE 4' },
          { slug: 'nord-ce-3-lite', name: 'Nord CE 3 Lite' },
          { slug: 'nord-ce-3', name: 'Nord CE 3' },
          { slug: 'nord-ce-2-lite', name: 'Nord CE 2 Lite' },
          { slug: 'nord-ce-2', name: 'Nord CE 2' },
          { slug: 'nord-ce', name: 'Nord CE' },
          { slug: 'nord-n30', name: 'Nord N30' },
          { slug: 'nord-n20', name: 'Nord N20' },
          { slug: 'nord-n10', name: 'Nord N10' },
          { slug: 'nord', name: 'Nord (Original)' },
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
          { slug: 'find-x8-pro', name: 'Find X8 Pro (2025)' },
          { slug: 'find-x8s-plus', name: 'Find X8s Plus (2025)' },
          { slug: 'find-x8', name: 'Find X8 (2024)' },
          { slug: 'find-x7-ultra', name: 'Find X7 Ultra (2024)' },
          { slug: 'find-x7', name: 'Find X7 (2024)' },
          { slug: 'find-x6-pro', name: 'Find X6 Pro (2023)' },
          { slug: 'find-x6', name: 'Find X6 (2023)' },
          { slug: 'find-x5-pro', name: 'Find X5 Pro (2022)' },
          { slug: 'find-x5-lite', name: 'Find X5 Lite (2022)' },
          { slug: 'find-x5', name: 'Find X5 (2022)' },
          { slug: 'find-x3-pro', name: 'Find X3 Pro (2021)' },
          { slug: 'find-x3-lite', name: 'Find X3 Lite (2021)' },
          { slug: 'find-x3-neo', name: 'Find X3 Neo (2021)' },
          { slug: 'find-x3', name: 'Find X3 (2021)' },
          { slug: 'find-x2-pro', name: 'Find X2 Pro (2020)' },
          { slug: 'find-x2-neo', name: 'Find X2 Neo (2020)' },
          { slug: 'find-x2-lite', name: 'Find X2 Lite (2020)' },
          { slug: 'find-x2', name: 'Find X2 (2020)' },
          { slug: 'find-x', name: 'Find X (2018)' },
          { slug: 'find-n3-flip', name: 'Find N3 Flip (2023)' },
          { slug: 'find-n3', name: 'Find N3 (2023)' },
          { slug: 'find-n2-flip', name: 'Find N2 Flip (2023)' },
        ],
      },
      {
        slug: 'oppo-reno', name: 'Reno Serie', nameEn: 'Reno Series',
        models: [
          { slug: 'reno-14-pro', name: 'Reno 14 Pro (2025)' },
          { slug: 'reno-14', name: 'Reno 14 (2025)' },
          { slug: 'reno-13-f-pro', name: 'Reno13 F Pro (2025)' },
          { slug: 'reno-13-f', name: 'Reno13 F (2025)' },
          { slug: 'reno-12-f-pro', name: 'Reno 12F Pro (2024)' },
          { slug: 'reno-12-pro', name: 'Reno 12 Pro (2024)' },
          { slug: 'reno-12', name: 'Reno 12 (2024)' },
          { slug: 'reno-11-pro', name: 'Reno 11 Pro (2024)' },
          { slug: 'reno-11f', name: 'Reno 11F (2024)' },
          { slug: 'reno-11', name: 'Reno 11 (2024)' },
          { slug: 'reno-10-pro-plus', name: 'Reno 10 Pro+ (2023)' },
          { slug: 'reno-10-pro', name: 'Reno 10 Pro (2023)' },
          { slug: 'reno-10', name: 'Reno 10 (2023)' },
          { slug: 'reno-9-pro-plus', name: 'Reno 9 Pro+ (2022)' },
          { slug: 'reno-9-pro', name: 'Reno 9 Pro (2022)' },
          { slug: 'reno-9', name: 'Reno 9 (2022)' },
          { slug: 'reno-8t', name: 'Reno 8T (2023)' },
          { slug: 'reno-8-pro-plus', name: 'Reno 8 Pro+ (2022)' },
          { slug: 'reno-8-lite', name: 'Reno 8 Lite (2022)' },
          { slug: 'reno-8z', name: 'Reno 8Z (2022)' },
          { slug: 'reno-8', name: 'Reno 8 (2022)' },
          { slug: 'reno-7z', name: 'Reno 7Z (2022)' },
          { slug: 'reno-7-pro', name: 'Reno 7 Pro (2021)' },
          { slug: 'reno-7-se', name: 'Reno 7 SE (2021)' },
          { slug: 'reno-7-5g', name: 'Reno 7 5G (2022)' },
          { slug: 'reno-7', name: 'Reno 7 (2021)' },
          { slug: 'reno-6-lite', name: 'Reno 6 Lite (2022)' },
          { slug: 'reno-6z', name: 'Reno 6Z (2021)' },
          { slug: 'reno-6-pro', name: 'Reno 6 Pro (2021)' },
          { slug: 'reno-6', name: 'Reno 6 (2021)' },
          { slug: 'reno-5-lite', name: 'Reno 5 Lite (2021)' },
          { slug: 'reno-5-pro', name: 'Reno 5 Pro (2020)' },
          { slug: 'reno-5', name: 'Reno 5 (2020)' },
          { slug: 'reno-4-pro', name: 'Reno 4 Pro (2020)' },
          { slug: 'reno-4', name: 'Reno 4 (2020)' },
          { slug: 'reno-3-pro', name: 'Reno 3 Pro (2020)' },
          { slug: 'reno-3', name: 'Reno 3 (2020)' },
        ],
      },
      {
        slug: 'oppo-a', name: 'A Serie', nameEn: 'A Series',
        models: [
          { slug: 'oppo-a98', name: 'A98 (2023)' },
          { slug: 'oppo-a96', name: 'A96 (2022)' },
          { slug: 'oppo-a95', name: 'A95 (2021)' },
          { slug: 'oppo-a94', name: 'A94 (2021)' },
          { slug: 'oppo-a93', name: 'A93 (2021)' },
          { slug: 'oppo-a92', name: 'A92 (2020)' },
          { slug: 'oppo-a91', name: 'A91 (2019)' },
          { slug: 'oppo-a83', name: 'A83 (2018)' },
          { slug: 'oppo-a80', name: 'A80 (2024)' },
          { slug: 'oppo-a79', name: 'A79 5G (2023)' },
          { slug: 'oppo-a78', name: 'A78 5G (2023)' },
          { slug: 'oppo-a77s', name: 'A77s (2022)' },
          { slug: 'oppo-a77', name: 'A77 5G (2022)' },
          { slug: 'oppo-a76', name: 'A76 (2022)' },
          { slug: 'oppo-a74', name: 'A74 5G (2021)' },
          { slug: 'oppo-a73', name: 'A73 (2020)' },
          { slug: 'oppo-a72', name: 'A72 (2020)' },
          { slug: 'oppo-a60', name: 'A60 (2024)' },
          { slug: 'oppo-a58', name: 'A58 (2023)' },
          { slug: 'oppo-a57', name: 'A57 (2022)' },
          { slug: 'oppo-a56', name: 'A56 (2022)' },
          { slug: 'oppo-a55', name: 'A55 (2021)' },
          { slug: 'oppo-a54', name: 'A54 (2021)' },
          { slug: 'oppo-a53s', name: 'A53s (2020)' },
          { slug: 'oppo-a53', name: 'A53 (2020)' },
          { slug: 'oppo-a52', name: 'A52 (2020)' },
          { slug: 'oppo-a38', name: 'A38 (2023)' },
          { slug: 'oppo-a18', name: 'A18 (2023)' },
          { slug: 'oppo-a17', name: 'A17 (2022)' },
          { slug: 'oppo-a16', name: 'A16 (2021)' },
          { slug: 'oppo-a15', name: 'A15 (2020)' },
          { slug: 'oppo-a9', name: 'A9 (2020)' },
          { slug: 'oppo-a8', name: 'A8 (2019)' },
        ],
      },
      {
        slug: 'oppo-f', name: 'F Serie', nameEn: 'F Series',
        models: [
          { slug: 'oppo-f27-pro', name: 'F27 Pro (2024)' },
          { slug: 'oppo-f25-pro', name: 'F25 Pro (2024)' },
          { slug: 'oppo-f23', name: 'F23 (2023)' },
          { slug: 'oppo-f21-pro', name: 'F21 Pro (2022)' },
          { slug: 'oppo-f19s', name: 'F19s (2021)' },
          { slug: 'oppo-f19-pro', name: 'F19 Pro (2021)' },
          { slug: 'oppo-f19', name: 'F19 (2021)' },
          { slug: 'oppo-f17-pro', name: 'F17 Pro (2020)' },
          { slug: 'oppo-f17', name: 'F17 (2020)' },
          { slug: 'oppo-f15', name: 'F15 (2020)' },
          { slug: 'oppo-f11-pro', name: 'F11 Pro (2019)' },
          { slug: 'oppo-f11', name: 'F11 (2019)' },
          { slug: 'oppo-f9-f9pro', name: 'F9 / F9 Pro (2018)' },
          { slug: 'oppo-f7', name: 'F7 (2018)' },
        ],
      },
      {
        slug: 'oppo-k', name: 'K Serie', nameEn: 'K Series',
        models: [
          { slug: 'oppo-k13', name: 'K13 (2025)' },
          { slug: 'oppo-k12', name: 'K12 (2024)' },
          { slug: 'oppo-k11x', name: 'K11X (2023)' },
          { slug: 'oppo-k11', name: 'K11 (2023)' },
          { slug: 'oppo-k10-pro', name: 'K10 Pro (2022)' },
          { slug: 'oppo-k10', name: 'K10 (2022)' },
          { slug: 'oppo-k9s', name: 'K9s (2021)' },
          { slug: 'oppo-k9x', name: 'K9X (2021)' },
          { slug: 'oppo-k7x', name: 'K7X (2020)' },
          { slug: 'oppo-k9', name: 'K9 (2021)' },
          { slug: 'oppo-k7-5g', name: 'K7 5G (2020)' },
          { slug: 'oppo-k3', name: 'K3 (2019)' },
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
];

// ==================== HELPER FUNCTIONS ====================

export function getBrandName(slug: string, locale: string = 'nl'): string {
  const brand = brandCategories.find(b => b.slug === slug);
  if (brand) return locale === 'en' ? brand.nameEn : brand.name;
  // Check PC parts (pc-slug)
  if (slug.startsWith('pc-')) {
    const pc = pcPartsCategories.find(c => c.slug === slug.slice(3));
    if (pc) return locale === 'en' ? pc.nameEn : pc.name;
  }
  // Check PC accessories (pca-slug)
  if (slug.startsWith('pca-')) {
    const pca = pcAccessoryCategories.find(c => c.slug === slug.slice(4));
    if (pca) return locale === 'en' ? pca.nameEn : pca.name;
  }
  // Check laptop brands (laptop-slug)
  if (slug.startsWith('laptop-')) {
    const lb = laptopBrands.find(b => b.slug === slug.slice(7));
    if (lb) return locale === 'en' ? lb.nameEn : lb.name;
  }
  // Check laptop parts (lp-slug)
  if (slug.startsWith('lp-')) {
    const lp = laptopPartsCategories.find(c => c.slug === slug.slice(3));
    if (lp) return locale === 'en' ? lp.nameEn : lp.name;
  }
  // Check accessories (acc-slug)
  if (slug.startsWith('acc-')) {
    const acc = accessoryCategories.find(c => c.slug === slug.slice(4));
    if (acc) return locale === 'en' ? acc.nameEn : acc.name;
  }
  return slug;
}

export function getSubcategoryName(brandSlug: string, subSlug: string, locale: string = 'nl'): string {
  const brand = brandCategories.find(b => b.slug === brandSlug);
  if (brand) {
    const sub = brand.subcategories.find(s => s.slug === subSlug);
    if (sub) return locale === 'en' ? sub.nameEn : sub.name;
    return subSlug;
  }
  // Check PC parts subcategories
  if (brandSlug.startsWith('pc-')) {
    const pc = pcPartsCategories.find(c => c.slug === brandSlug.slice(3));
    if (pc) {
      const sub = pc.subcategories.find(s => s.slug === subSlug);
      if (sub) return locale === 'en' ? sub.nameEn : sub.name;
    }
    return subSlug;
  }
  // Check PC accessories subcategories
  if (brandSlug.startsWith('pca-')) {
    const pca = pcAccessoryCategories.find(c => c.slug === brandSlug.slice(4));
    if (pca) {
      const sub = pca.subcategories.find(s => s.slug === subSlug);
      if (sub) return locale === 'en' ? sub.nameEn : sub.name;
    }
    return subSlug;
  }
  // Check laptop brands subcategories
  if (brandSlug.startsWith('laptop-')) {
    const lb = laptopBrands.find(b => b.slug === brandSlug.slice(7));
    if (lb) {
      const sub = lb.subcategories.find(s => s.slug === subSlug);
      if (sub) return locale === 'en' ? sub.nameEn : sub.name;
    }
    return subSlug;
  }
  // Check accessories subcategories
  if (brandSlug.startsWith('acc-')) {
    const acc = accessoryCategories.find(c => c.slug === brandSlug.slice(4));
    if (acc) {
      const sub = acc.subcategories.find(s => s.slug === subSlug);
      if (sub) return locale === 'en' ? sub.nameEn : sub.name;
    }
    return subSlug;
  }
  return subSlug;
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
    // Laptop Onderdelen section header
    { slug: '_section_lp', name: '── 💻 LAPTOP ONDERDELEN ──', nameEn: '── 💻 LAPTOP PARTS ──', subcategories: [] },
    ...convertAccessory(laptopPartsCategories, 'lp-'),
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
    slug: 'motherboards',
    name: 'Moederborden',
    nameEn: 'Motherboards',
    description: 'ATX, Micro-ATX, Mini-ITX moederborden',
    subcategories: [
      { slug: 'atx', name: 'ATX', nameEn: 'ATX', description: 'Standaard ATX form factor' },
      { slug: 'micro-atx', name: 'Micro-ATX', nameEn: 'Micro-ATX', description: 'Compact Micro-ATX' },
      { slug: 'mini-itx', name: 'Mini-ITX', nameEn: 'Mini-ITX', description: 'Kleine Mini-ITX' },
    ]
  },
  {
    slug: 'processors',
    name: 'Processoren (CPU)',
    nameEn: 'Processors (CPU)',
    description: 'Intel & AMD processors',
    subcategories: [
      { slug: 'intel', name: 'Intel', nameEn: 'Intel', description: 'Intel Core processors' },
      { slug: 'amd', name: 'AMD', nameEn: 'AMD', description: 'AMD Ryzen processors' },
    ]
  },
  {
    slug: 'memory-ram',
    name: 'Geheugen (RAM)',
    nameEn: 'Memory (RAM)',
    description: 'DDR4 & DDR5 RAM modules',
    subcategories: [
      { slug: 'ddr4', name: 'DDR4', nameEn: 'DDR4', description: 'DDR4 geheugen' },
      { slug: 'ddr5', name: 'DDR5', nameEn: 'DDR5', description: 'DDR5 geheugen' },
    ]
  },
  {
    slug: 'graphics-cards',
    name: 'Grafische Kaarten (GPU)',
    nameEn: 'Graphics Cards (GPU)',
    description: 'NVIDIA & AMD videokaarten',
    subcategories: [
      { slug: 'nvidia', name: 'NVIDIA', nameEn: 'NVIDIA', description: 'NVIDIA GeForce kaarten' },
      { slug: 'amd-gpu', name: 'AMD', nameEn: 'AMD', description: 'AMD Radeon kaarten' },
    ]
  },
  {
    slug: 'power-supplies',
    name: 'Voedingen (PSU)',
    nameEn: 'Power Supplies (PSU)',
    description: 'ATX voedingen voor PC',
    subcategories: []
  },
  {
    slug: 'cases',
    name: 'Behuizingen',
    nameEn: 'PC Cases',
    description: 'Tower, Mini-ITX, Micro-ATX behuizingen',
    subcategories: []
  },
  {
    slug: 'monitors',
    name: 'Monitoren / Beeldschermen',
    nameEn: 'Monitors / Displays',
    description: 'Gaming, 4K, Ultrawide monitoren',
    subcategories: [
      { slug: 'gaming-monitors', name: 'Gaming Monitoren', nameEn: 'Gaming Monitors', description: '144Hz, 240Hz, 1ms' },
      { slug: '4k-monitors', name: '4K Monitoren', nameEn: '4K Monitors', description: 'Ultra HD beeldschermen' },
      { slug: 'ultrawide', name: 'Ultrawide', nameEn: 'Ultrawide', description: '21:9 & 32:9 monitoren' },
    ]
  },
];

// ==================== PC ACCESSORIES CATEGORY SYSTEM ====================
export const pcAccessoryCategories: AccessoryCategory[] = [
  {
    slug: 'keyboards',
    name: 'Toetsenborden',
    nameEn: 'Keyboards',
    description: 'Mechanisch, membrane, draadloos',
    subcategories: [
      { slug: 'mechanical', name: 'Mechanisch', nameEn: 'Mechanical', description: 'Mechanische switches' },
      { slug: 'membrane', name: 'Membraan', nameEn: 'Membrane', description: 'Stille membrane toetsenborden' },
      { slug: 'wireless', name: 'Draadloos', nameEn: 'Wireless', description: 'Bluetooth & 2.4GHz' },
    ]
  },
  {
    slug: 'mice',
    name: 'Muizen',
    nameEn: 'Mice',
    description: 'Bedraad, draadloos, gaming',
    subcategories: [
      { slug: 'wired', name: 'Bedraad', nameEn: 'Wired', description: 'USB muizen' },
      { slug: 'wireless', name: 'Draadloos', nameEn: 'Wireless', description: 'Bluetooth & 2.4GHz' },
      { slug: 'gaming', name: 'Gaming', nameEn: 'Gaming', description: 'Hoge DPI gaming muizen' },
    ]
  },
  {
    slug: 'mousepads',
    name: 'Muispaden',
    nameEn: 'Mousepads',
    description: 'Gaming & office muispaden',
    subcategories: []
  },
  {
    slug: 'speakers',
    name: 'Speakers',
    nameEn: 'Speakers',
    description: 'PC speakers & soundbars',
    subcategories: [
      { slug: '2.0', name: '2.0 Speakers', nameEn: '2.0 Speakers', description: 'Stereo speakers' },
      { slug: '2.1', name: '2.1 Speakers', nameEn: '2.1 Speakers', description: 'Met subwoofer' },
      { slug: '5.1', name: '5.1 Speakers', nameEn: '5.1 Speakers', description: 'Surround sound' },
    ]
  },
  {
    slug: 'headphones',
    name: 'Koptelefoons / Headsets',
    nameEn: 'Headphones / Headsets',
    description: 'Bedraad, draadloos, gaming headsets',
    subcategories: [
      { slug: 'wired', name: 'Bedraad', nameEn: 'Wired', description: '3.5mm & USB headsets' },
      { slug: 'wireless', name: 'Draadloos', nameEn: 'Wireless', description: 'Bluetooth headsets' },
      { slug: 'gaming', name: 'Gaming', nameEn: 'Gaming', description: 'Gaming headsets met mic' },
    ]
  },
  {
    slug: 'external-storage',
    name: 'Externe Opslag',
    nameEn: 'External Storage',
    description: 'Externe harde schijven & USB sticks',
    subcategories: [
      { slug: 'external-hdd', name: 'Externe Harde Schijf', nameEn: 'External Hard Drive', description: 'HDD & SSD extern' },
      { slug: 'usb-sticks', name: 'USB Sticks', nameEn: 'USB Sticks', description: 'USB 2.0, 3.0, 3.1 & USB-C' },
    ]
  },
  {
    slug: 'webcams',
    name: "Camera's / Webcams",
    nameEn: 'Cameras / Webcams',
    description: 'Webcams voor PC & laptop',
    subcategories: []
  },
  {
    slug: 'microphones',
    name: 'Microfoons',
    nameEn: 'Microphones',
    description: 'USB & condensator microfoons',
    subcategories: []
  },
  {
    slug: 'cables',
    name: 'Kabels',
    nameEn: 'Cables',
    description: 'Internet, VGA, HDMI, voedingskabels',
    subcategories: [
      { slug: 'ethernet', name: 'Internet / Ethernet', nameEn: 'Internet / Ethernet', description: 'Cat5e, Cat6, Cat6a kabels' },
      { slug: 'vga', name: 'VGA', nameEn: 'VGA', description: 'VGA monitorkabels' },
      { slug: 'hdmi', name: 'HDMI', nameEn: 'HDMI', description: 'HDMI 1.4, 2.0, 2.1 kabels' },
      { slug: 'power', name: 'Voedingskabels', nameEn: 'Power Cables', description: 'PC voedingskabels' },
    ]
  },
  {
    slug: 'networking',
    name: 'Netwerkapparatuur',
    nameEn: 'Networking',
    description: 'Routers, WiFi, Bluetooth, switches',
    subcategories: [
      { slug: 'routers', name: 'Routers', nameEn: 'Routers', description: 'WiFi routers' },
      { slug: 'wifi-usb', name: 'WiFi USB', nameEn: 'WiFi USB', description: 'USB WiFi adapters' },
      { slug: 'wifi-extender', name: 'WiFi Extender', nameEn: 'WiFi Extender', description: 'WiFi versterkers & repeaters' },
      { slug: 'bluetooth', name: 'Bluetooth', nameEn: 'Bluetooth', description: 'Bluetooth adapters & dongles' },
      { slug: 'network-switch', name: 'Netwerk Switch', nameEn: 'Network Switch', description: 'Ethernet switches' },
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

// ==================== LAPTOP BRANDS (for quick search / refurbished) ====================
export interface LaptopSubCategory {
  slug: string;
  name: string;
  nameEn: string;
  description?: string;
}

export interface LaptopBrand {
  slug: string;
  name: string;
  nameEn: string;
  description?: string;
  subcategories: LaptopSubCategory[];
}

export const laptopBrands: LaptopBrand[] = [
  {
    slug: 'dell',
    name: 'Dell',
    nameEn: 'Dell',
    description: 'Dell laptops',
    subcategories: [
      { slug: 'inspiron-14-3000', name: 'Inspiron 14 3000', nameEn: 'Inspiron 14 3000' },
      { slug: 'inspiron-15-3000', name: 'Inspiron 15 3000', nameEn: 'Inspiron 15 3000' },
      { slug: 'inspiron-15-5000', name: 'Inspiron 15 5000', nameEn: 'Inspiron 15 5000' },
      { slug: 'inspiron-16-5000', name: 'Inspiron 16 5000', nameEn: 'Inspiron 16 5000' },
      { slug: 'inspiron-16-7000', name: 'Inspiron 16 7000', nameEn: 'Inspiron 16 7000' },
      { slug: 'latitude-3000', name: 'Latitude 3000', nameEn: 'Latitude 3000' },
      { slug: 'latitude-5000', name: 'Latitude 5000', nameEn: 'Latitude 5000' },
      { slug: 'latitude-7000', name: 'Latitude 7000', nameEn: 'Latitude 7000' },
      { slug: 'latitude-9000', name: 'Latitude 9000', nameEn: 'Latitude 9000' },
      { slug: 'xps-13', name: 'XPS 13', nameEn: 'XPS 13' },
      { slug: 'xps-13-plus', name: 'XPS 13 Plus', nameEn: 'XPS 13 Plus' },
      { slug: 'xps-15', name: 'XPS 15', nameEn: 'XPS 15' },
      { slug: 'xps-17', name: 'XPS 17', nameEn: 'XPS 17' },
      { slug: 'vostro-14', name: 'Vostro 14', nameEn: 'Vostro 14' },
      { slug: 'vostro-15', name: 'Vostro 15', nameEn: 'Vostro 15' },
      { slug: 'g15-gaming', name: 'G15 Gaming', nameEn: 'G15 Gaming' },
      { slug: 'g16-gaming', name: 'G16 Gaming', nameEn: 'G16 Gaming' },
      { slug: 'alienware-m15', name: 'Alienware m15', nameEn: 'Alienware m15' },
      { slug: 'alienware-m16', name: 'Alienware m16', nameEn: 'Alienware m16' },
      { slug: 'alienware-m18', name: 'Alienware m18', nameEn: 'Alienware m18' },
      { slug: 'alienware-x14', name: 'Alienware x14', nameEn: 'Alienware x14' },
      { slug: 'alienware-x16', name: 'Alienware x16', nameEn: 'Alienware x16' },
    ]
  },
  {
    slug: 'hp',
    name: 'HP',
    nameEn: 'HP',
    description: 'HP laptops',
    subcategories: [
      { slug: 'pavilion-14', name: 'Pavilion 14', nameEn: 'Pavilion 14' },
      { slug: 'pavilion-15', name: 'Pavilion 15', nameEn: 'Pavilion 15' },
      { slug: 'pavilion-x360', name: 'Pavilion x360', nameEn: 'Pavilion x360' },
      { slug: 'pavilion-aero-13', name: 'Pavilion Aero 13', nameEn: 'Pavilion Aero 13' },
      { slug: 'envy-13', name: 'Envy 13', nameEn: 'Envy 13' },
      { slug: 'envy-15', name: 'Envy 15', nameEn: 'Envy 15' },
      { slug: 'envy-16', name: 'Envy 16', nameEn: 'Envy 16' },
      { slug: 'envy-x360', name: 'Envy x360', nameEn: 'Envy x360' },
      { slug: 'spectre-x360-14', name: 'Spectre x360 14', nameEn: 'Spectre x360 14' },
      { slug: 'spectre-x360-16', name: 'Spectre x360 16', nameEn: 'Spectre x360 16' },
      { slug: 'elitebook-840', name: 'EliteBook 840', nameEn: 'EliteBook 840' },
      { slug: 'elitebook-850', name: 'EliteBook 850', nameEn: 'EliteBook 850' },
      { slug: 'elitebook-1040', name: 'EliteBook 1040', nameEn: 'EliteBook 1040' },
      { slug: 'probook-440', name: 'ProBook 440', nameEn: 'ProBook 440' },
      { slug: 'probook-450', name: 'ProBook 450', nameEn: 'ProBook 450' },
      { slug: 'probook-455', name: 'ProBook 455', nameEn: 'ProBook 455' },
      { slug: 'omen-16', name: 'OMEN 16', nameEn: 'OMEN 16' },
      { slug: 'omen-17', name: 'OMEN 17', nameEn: 'OMEN 17' },
      { slug: 'victus-15', name: 'Victus 15', nameEn: 'Victus 15' },
      { slug: 'victus-16', name: 'Victus 16', nameEn: 'Victus 16' },
      { slug: 'zbook-firefly', name: 'ZBook Firefly', nameEn: 'ZBook Firefly' },
      { slug: 'zbook-studio', name: 'ZBook Studio', nameEn: 'ZBook Studio' },
      { slug: 'stream-14', name: 'Stream 14', nameEn: 'Stream 14' },
      { slug: 'chromebook-14', name: 'Chromebook 14', nameEn: 'Chromebook 14' },
    ]
  },
  {
    slug: 'lenovo',
    name: 'Lenovo',
    nameEn: 'Lenovo',
    description: 'Lenovo laptops',
    subcategories: [
      { slug: 'ideapad-1', name: 'IdeaPad 1', nameEn: 'IdeaPad 1' },
      { slug: 'ideapad-3', name: 'IdeaPad 3', nameEn: 'IdeaPad 3' },
      { slug: 'ideapad-5', name: 'IdeaPad 5', nameEn: 'IdeaPad 5' },
      { slug: 'ideapad-slim-5', name: 'IdeaPad Slim 5', nameEn: 'IdeaPad Slim 5' },
      { slug: 'ideapad-flex-5', name: 'IdeaPad Flex 5', nameEn: 'IdeaPad Flex 5' },
      { slug: 'ideapad-gaming-3', name: 'IdeaPad Gaming 3', nameEn: 'IdeaPad Gaming 3' },
      { slug: 'thinkpad-x1-carbon', name: 'ThinkPad X1 Carbon', nameEn: 'ThinkPad X1 Carbon' },
      { slug: 'thinkpad-x1-yoga', name: 'ThinkPad X1 Yoga', nameEn: 'ThinkPad X1 Yoga' },
      { slug: 'thinkpad-t14', name: 'ThinkPad T14', nameEn: 'ThinkPad T14' },
      { slug: 'thinkpad-t16', name: 'ThinkPad T16', nameEn: 'ThinkPad T16' },
      { slug: 'thinkpad-e14', name: 'ThinkPad E14', nameEn: 'ThinkPad E14' },
      { slug: 'thinkpad-e16', name: 'ThinkPad E16', nameEn: 'ThinkPad E16' },
      { slug: 'thinkpad-l14', name: 'ThinkPad L14', nameEn: 'ThinkPad L14' },
      { slug: 'thinkpad-p1', name: 'ThinkPad P1', nameEn: 'ThinkPad P1' },
      { slug: 'thinkbook-14', name: 'ThinkBook 14', nameEn: 'ThinkBook 14' },
      { slug: 'thinkbook-16', name: 'ThinkBook 16', nameEn: 'ThinkBook 16' },
      { slug: 'yoga-7i', name: 'Yoga 7i', nameEn: 'Yoga 7i' },
      { slug: 'yoga-9i', name: 'Yoga 9i', nameEn: 'Yoga 9i' },
      { slug: 'yoga-slim-7', name: 'Yoga Slim 7', nameEn: 'Yoga Slim 7' },
      { slug: 'legion-5', name: 'Legion 5', nameEn: 'Legion 5' },
      { slug: 'legion-5-pro', name: 'Legion 5 Pro', nameEn: 'Legion 5 Pro' },
      { slug: 'legion-7', name: 'Legion 7', nameEn: 'Legion 7' },
      { slug: 'legion-slim-5', name: 'Legion Slim 5', nameEn: 'Legion Slim 5' },
      { slug: 'loq-15', name: 'LOQ 15', nameEn: 'LOQ 15' },
    ]
  },
  {
    slug: 'apple',
    name: 'Apple',
    nameEn: 'Apple',
    description: 'Apple MacBooks',
    subcategories: [
      { slug: 'macbook-air-13-m1', name: 'MacBook Air 13" (M1)', nameEn: 'MacBook Air 13" (M1)' },
      { slug: 'macbook-air-13-m2', name: 'MacBook Air 13" (M2)', nameEn: 'MacBook Air 13" (M2)' },
      { slug: 'macbook-air-15-m2', name: 'MacBook Air 15" (M2)', nameEn: 'MacBook Air 15" (M2)' },
      { slug: 'macbook-air-13-m3', name: 'MacBook Air 13" (M3)', nameEn: 'MacBook Air 13" (M3)' },
      { slug: 'macbook-air-15-m3', name: 'MacBook Air 15" (M3)', nameEn: 'MacBook Air 15" (M3)' },
      { slug: 'macbook-pro-13-m1', name: 'MacBook Pro 13" (M1)', nameEn: 'MacBook Pro 13" (M1)' },
      { slug: 'macbook-pro-13-m2', name: 'MacBook Pro 13" (M2)', nameEn: 'MacBook Pro 13" (M2)' },
      { slug: 'macbook-pro-14-m1', name: 'MacBook Pro 14" (M1 Pro/Max)', nameEn: 'MacBook Pro 14" (M1 Pro/Max)' },
      { slug: 'macbook-pro-14-m2', name: 'MacBook Pro 14" (M2 Pro/Max)', nameEn: 'MacBook Pro 14" (M2 Pro/Max)' },
      { slug: 'macbook-pro-14-m3', name: 'MacBook Pro 14" (M3)', nameEn: 'MacBook Pro 14" (M3)' },
      { slug: 'macbook-pro-16-m1', name: 'MacBook Pro 16" (M1 Pro/Max)', nameEn: 'MacBook Pro 16" (M1 Pro/Max)' },
      { slug: 'macbook-pro-16-m2', name: 'MacBook Pro 16" (M2 Pro/Max)', nameEn: 'MacBook Pro 16" (M2 Pro/Max)' },
      { slug: 'macbook-pro-16-m3', name: 'MacBook Pro 16" (M3)', nameEn: 'MacBook Pro 16" (M3)' },
      { slug: 'macbook-air-13-intel', name: 'MacBook Air 13" (Intel)', nameEn: 'MacBook Air 13" (Intel)' },
      { slug: 'macbook-pro-13-intel', name: 'MacBook Pro 13" (Intel)', nameEn: 'MacBook Pro 13" (Intel)' },
      { slug: 'macbook-pro-15-intel', name: 'MacBook Pro 15" (Intel)', nameEn: 'MacBook Pro 15" (Intel)' },
      { slug: 'macbook-pro-16-intel', name: 'MacBook Pro 16" (Intel)', nameEn: 'MacBook Pro 16" (Intel)' },
      { slug: 'macbook-12', name: 'MacBook 12"', nameEn: 'MacBook 12"' },
    ]
  },
  {
    slug: 'asus',
    name: 'ASUS',
    nameEn: 'ASUS',
    description: 'ASUS laptops',
    subcategories: [
      { slug: 'vivobook-14', name: 'VivoBook 14', nameEn: 'VivoBook 14' },
      { slug: 'vivobook-15', name: 'VivoBook 15', nameEn: 'VivoBook 15' },
      { slug: 'vivobook-s14', name: 'VivoBook S14', nameEn: 'VivoBook S14' },
      { slug: 'vivobook-s15', name: 'VivoBook S15', nameEn: 'VivoBook S15' },
      { slug: 'vivobook-pro-15', name: 'VivoBook Pro 15', nameEn: 'VivoBook Pro 15' },
      { slug: 'vivobook-pro-16', name: 'VivoBook Pro 16', nameEn: 'VivoBook Pro 16' },
      { slug: 'zenbook-14', name: 'ZenBook 14', nameEn: 'ZenBook 14' },
      { slug: 'zenbook-14-oled', name: 'ZenBook 14 OLED', nameEn: 'ZenBook 14 OLED' },
      { slug: 'zenbook-15', name: 'ZenBook 15', nameEn: 'ZenBook 15' },
      { slug: 'zenbook-duo', name: 'ZenBook Duo', nameEn: 'ZenBook Duo' },
      { slug: 'zenbook-pro-16', name: 'ZenBook Pro 16', nameEn: 'ZenBook Pro 16' },
      { slug: 'rog-zephyrus-g14', name: 'ROG Zephyrus G14', nameEn: 'ROG Zephyrus G14' },
      { slug: 'rog-zephyrus-g16', name: 'ROG Zephyrus G16', nameEn: 'ROG Zephyrus G16' },
      { slug: 'rog-strix-g15', name: 'ROG Strix G15', nameEn: 'ROG Strix G15' },
      { slug: 'rog-strix-g16', name: 'ROG Strix G16', nameEn: 'ROG Strix G16' },
      { slug: 'rog-strix-scar-17', name: 'ROG Strix SCAR 17', nameEn: 'ROG Strix SCAR 17' },
      { slug: 'rog-flow-x13', name: 'ROG Flow X13', nameEn: 'ROG Flow X13' },
      { slug: 'tuf-gaming-a15', name: 'TUF Gaming A15', nameEn: 'TUF Gaming A15' },
      { slug: 'tuf-gaming-f15', name: 'TUF Gaming F15', nameEn: 'TUF Gaming F15' },
      { slug: 'tuf-gaming-a16', name: 'TUF Gaming A16', nameEn: 'TUF Gaming A16' },
      { slug: 'chromebook-flip', name: 'Chromebook Flip', nameEn: 'Chromebook Flip' },
    ]
  },
  {
    slug: 'acer',
    name: 'Acer',
    nameEn: 'Acer',
    description: 'Acer laptops',
    subcategories: [
      { slug: 'aspire-3', name: 'Aspire 3', nameEn: 'Aspire 3' },
      { slug: 'aspire-5', name: 'Aspire 5', nameEn: 'Aspire 5' },
      { slug: 'aspire-7', name: 'Aspire 7', nameEn: 'Aspire 7' },
      { slug: 'aspire-vero', name: 'Aspire Vero', nameEn: 'Aspire Vero' },
      { slug: 'swift-3', name: 'Swift 3', nameEn: 'Swift 3' },
      { slug: 'swift-5', name: 'Swift 5', nameEn: 'Swift 5' },
      { slug: 'swift-go', name: 'Swift Go', nameEn: 'Swift Go' },
      { slug: 'swift-x', name: 'Swift X', nameEn: 'Swift X' },
      { slug: 'swift-edge', name: 'Swift Edge', nameEn: 'Swift Edge' },
      { slug: 'nitro-5', name: 'Nitro 5', nameEn: 'Nitro 5' },
      { slug: 'nitro-16', name: 'Nitro 16', nameEn: 'Nitro 16' },
      { slug: 'nitro-17', name: 'Nitro 17', nameEn: 'Nitro 17' },
      { slug: 'predator-helios-300', name: 'Predator Helios 300', nameEn: 'Predator Helios 300' },
      { slug: 'predator-helios-16', name: 'Predator Helios 16', nameEn: 'Predator Helios 16' },
      { slug: 'predator-helios-neo-16', name: 'Predator Helios Neo 16', nameEn: 'Predator Helios Neo 16' },
      { slug: 'predator-triton-300', name: 'Predator Triton 300', nameEn: 'Predator Triton 300' },
      { slug: 'predator-triton-500', name: 'Predator Triton 500', nameEn: 'Predator Triton 500' },
      { slug: 'chromebook-spin', name: 'Chromebook Spin', nameEn: 'Chromebook Spin' },
      { slug: 'travelmate-p2', name: 'TravelMate P2', nameEn: 'TravelMate P2' },
    ]
  },
  {
    slug: 'msi',
    name: 'MSI',
    nameEn: 'MSI',
    description: 'MSI laptops',
    subcategories: [
      { slug: 'gf63-thin', name: 'GF63 Thin', nameEn: 'GF63 Thin' },
      { slug: 'gf65-thin', name: 'GF65 Thin', nameEn: 'GF65 Thin' },
      { slug: 'katana-15', name: 'Katana 15', nameEn: 'Katana 15' },
      { slug: 'katana-17', name: 'Katana 17', nameEn: 'Katana 17' },
      { slug: 'cyborg-15', name: 'Cyborg 15', nameEn: 'Cyborg 15' },
      { slug: 'sword-15', name: 'Sword 15', nameEn: 'Sword 15' },
      { slug: 'gs66-stealth', name: 'GS66 Stealth', nameEn: 'GS66 Stealth' },
      { slug: 'stealth-14', name: 'Stealth 14', nameEn: 'Stealth 14' },
      { slug: 'stealth-16', name: 'Stealth 16', nameEn: 'Stealth 16' },
      { slug: 'ge66-raider', name: 'GE66 Raider', nameEn: 'GE66 Raider' },
      { slug: 'ge76-raider', name: 'GE76 Raider', nameEn: 'GE76 Raider' },
      { slug: 'raider-ge78', name: 'Raider GE78', nameEn: 'Raider GE78' },
      { slug: 'vector-gp66', name: 'Vector GP66', nameEn: 'Vector GP66' },
      { slug: 'vector-gp68', name: 'Vector GP68', nameEn: 'Vector GP68' },
      { slug: 'modern-14', name: 'Modern 14', nameEn: 'Modern 14' },
      { slug: 'modern-15', name: 'Modern 15', nameEn: 'Modern 15' },
      { slug: 'prestige-14', name: 'Prestige 14', nameEn: 'Prestige 14' },
      { slug: 'prestige-16', name: 'Prestige 16', nameEn: 'Prestige 16' },
      { slug: 'creator-z16', name: 'Creator Z16', nameEn: 'Creator Z16' },
      { slug: 'creator-m16', name: 'Creator M16', nameEn: 'Creator M16' },
      { slug: 'titan-gt77', name: 'Titan GT77', nameEn: 'Titan GT77' },
    ]
  },
  {
    slug: 'microsoft',
    name: 'Microsoft',
    nameEn: 'Microsoft',
    description: 'Microsoft Surface',
    subcategories: [
      { slug: 'surface-laptop-3', name: 'Surface Laptop 3', nameEn: 'Surface Laptop 3' },
      { slug: 'surface-laptop-4', name: 'Surface Laptop 4', nameEn: 'Surface Laptop 4' },
      { slug: 'surface-laptop-5', name: 'Surface Laptop 5', nameEn: 'Surface Laptop 5' },
      { slug: 'surface-laptop-6', name: 'Surface Laptop 6', nameEn: 'Surface Laptop 6' },
      { slug: 'surface-laptop-go', name: 'Surface Laptop Go', nameEn: 'Surface Laptop Go' },
      { slug: 'surface-laptop-go-2', name: 'Surface Laptop Go 2', nameEn: 'Surface Laptop Go 2' },
      { slug: 'surface-laptop-go-3', name: 'Surface Laptop Go 3', nameEn: 'Surface Laptop Go 3' },
      { slug: 'surface-laptop-studio', name: 'Surface Laptop Studio', nameEn: 'Surface Laptop Studio' },
      { slug: 'surface-laptop-studio-2', name: 'Surface Laptop Studio 2', nameEn: 'Surface Laptop Studio 2' },
      { slug: 'surface-pro-7', name: 'Surface Pro 7', nameEn: 'Surface Pro 7' },
      { slug: 'surface-pro-8', name: 'Surface Pro 8', nameEn: 'Surface Pro 8' },
      { slug: 'surface-pro-9', name: 'Surface Pro 9', nameEn: 'Surface Pro 9' },
      { slug: 'surface-pro-10', name: 'Surface Pro 10', nameEn: 'Surface Pro 10' },
      { slug: 'surface-pro-x', name: 'Surface Pro X', nameEn: 'Surface Pro X' },
      { slug: 'surface-go-2', name: 'Surface Go 2', nameEn: 'Surface Go 2' },
      { slug: 'surface-go-3', name: 'Surface Go 3', nameEn: 'Surface Go 3' },
      { slug: 'surface-book-2', name: 'Surface Book 2', nameEn: 'Surface Book 2' },
      { slug: 'surface-book-3', name: 'Surface Book 3', nameEn: 'Surface Book 3' },
    ]
  },
];

// ==================== LAPTOP PARTS CATEGORY SYSTEM ====================
export const laptopPartsCategories: AccessoryCategory[] = [
  {
    slug: 'laptop-screens',
    name: 'Laptop Schermen',
    nameEn: 'Laptop Screens',
    description: 'LCD / LED displays',
    subcategories: [
      { slug: '14-inch', name: '14 inch', nameEn: '14 inch', description: '14" laptop screens' },
      { slug: '15-6-inch', name: '15.6 inch', nameEn: '15.6 inch', description: '15.6" laptop screens' },
      { slug: '13-3-inch', name: '13.3 inch', nameEn: '13.3 inch', description: '13.3" laptop screens' },
      { slug: '17-3-inch', name: '17.3 inch', nameEn: '17.3 inch', description: '17.3" laptop screens' },
    ]
  },
  {
    slug: 'laptop-batteries',
    name: 'Laptop Accu\'s',
    nameEn: 'Laptop Batteries',
    description: 'Originele & compatibele accu\'s',
    subcategories: [
      { slug: 'dell-batteries', name: 'Dell Accu\'s', nameEn: 'Dell Batteries', description: 'Dell laptop batteries' },
      { slug: 'hp-batteries', name: 'HP Accu\'s', nameEn: 'HP Batteries', description: 'HP laptop batteries' },
      { slug: 'lenovo-batteries', name: 'Lenovo Accu\'s', nameEn: 'Lenovo Batteries', description: 'Lenovo laptop batteries' },
      { slug: 'universal-batteries', name: 'Universeel', nameEn: 'Universal', description: 'Universal batteries' },
    ]
  },
  {
    slug: 'laptop-keyboards',
    name: 'Laptop Toetsenborden',
    nameEn: 'Laptop Keyboards',
    description: 'Vervanging toetsenborden',
    subcategories: [
      { slug: 'dell-keyboards', name: 'Dell', nameEn: 'Dell', description: 'Dell keyboards' },
      { slug: 'hp-keyboards', name: 'HP', nameEn: 'HP', description: 'HP keyboards' },
      { slug: 'lenovo-keyboards', name: 'Lenovo', nameEn: 'Lenovo', description: 'Lenovo keyboards' },
      { slug: 'universal-keyboards', name: 'Universeel', nameEn: 'Universal', description: 'Universal keyboards' },
    ]
  },
  {
    slug: 'laptop-chargers',
    name: 'Laptop Adapters',
    nameEn: 'Laptop Chargers',
    description: 'Voedingen & adapters',
    subcategories: [
      { slug: '45w-65w', name: '45W - 65W', nameEn: '45W - 65W', description: 'Standard chargers' },
      { slug: '90w-135w', name: '90W - 135W', nameEn: '90W - 135W', description: 'High-power chargers' },
      { slug: 'usb-c-pd', name: 'USB-C PD', nameEn: 'USB-C PD', description: 'USB-C Power Delivery' },
      { slug: 'universal-chargers', name: 'Universeel', nameEn: 'Universal', description: 'Universal chargers' },
    ]
  },
  {
    slug: 'laptop-ram',
    name: 'Laptop RAM',
    nameEn: 'Laptop RAM',
    description: 'Geheugen modules',
    subcategories: [
      { slug: 'ddr4-sodimm', name: 'DDR4 SO-DIMM', nameEn: 'DDR4 SO-DIMM', description: 'DDR4 laptop memory' },
      { slug: 'ddr5-sodimm', name: 'DDR5 SO-DIMM', nameEn: 'DDR5 SO-DIMM', description: 'DDR5 laptop memory' },
      { slug: 'ddr3-sodimm', name: 'DDR3 SO-DIMM', nameEn: 'DDR3 SO-DIMM', description: 'DDR3 laptop memory' },
    ]
  },
  {
    slug: 'laptop-storage',
    name: 'Laptop Opslag',
    nameEn: 'Laptop Storage',
    description: 'SSD & HDD upgrades',
    subcategories: [
      { slug: '2-5-inch-ssd', name: '2.5" SSD', nameEn: '2.5" SSD', description: 'SATA SSD drives' },
      { slug: 'm2-ssd', name: 'M.2 SSD', nameEn: 'M.2 SSD', description: 'NVMe & SATA M.2' },
      { slug: '2-5-inch-hdd', name: '2.5" HDD', nameEn: '2.5" HDD', description: 'Laptop hard drives' },
    ]
  },
  {
    slug: 'laptop-motherboards',
    name: 'Laptop Moederborden',
    nameEn: 'Laptop Motherboards',
    description: 'Vervanging moederborden',
    subcategories: [
      { slug: 'dell-motherboards', name: 'Dell', nameEn: 'Dell', description: 'Dell motherboards' },
      { slug: 'hp-motherboards', name: 'HP', nameEn: 'HP', description: 'HP motherboards' },
      { slug: 'lenovo-motherboards', name: 'Lenovo', nameEn: 'Lenovo', description: 'Lenovo motherboards' },
    ]
  },
  {
    slug: 'laptop-cooling',
    name: 'Laptop Koeling',
    nameEn: 'Laptop Cooling',
    description: 'Fans & koelpasta',
    subcategories: [
      { slug: 'cpu-fans', name: 'CPU Fans', nameEn: 'CPU Fans', description: 'Processor fans' },
      { slug: 'gpu-fans', name: 'GPU Fans', nameEn: 'GPU Fans', description: 'Graphics fans' },
      { slug: 'cooling-pads', name: 'Koelpads', nameEn: 'Cooling Pads', description: 'External cooling' },
    ]
  },
  {
    slug: 'laptop-hinges',
    name: 'Laptop Scharnieren',
    nameEn: 'Laptop Hinges',
    description: 'Scherm scharnieren',
    subcategories: [
      { slug: 'left-hinge', name: 'Links', nameEn: 'Left', description: 'Left hinges' },
      { slug: 'right-hinge', name: 'Rechts', nameEn: 'Right', description: 'Right hinges' },
      { slug: 'hinge-set', name: 'Set', nameEn: 'Set', description: 'Hinge sets' },
    ]
  },
  {
    slug: 'laptop-cases',
    name: 'Laptop Behuizingen',
    nameEn: 'Laptop Cases',
    description: 'Top/bottom covers',
    subcategories: [
      { slug: 'palmrest', name: 'Palmrest', nameEn: 'Palmrest', description: 'Palmrest covers' },
      { slug: 'bottom-case', name: 'Bottom Case', nameEn: 'Bottom Case', description: 'Base covers' },
      { slug: 'lcd-back-cover', name: 'LCD Back Cover', nameEn: 'LCD Back Cover', description: 'Screen back covers' },
    ]
  },
];
