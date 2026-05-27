'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

/**
 * Small two-button pill that toggles between EXCL BTW / INCL BTW display mode.
 * Selected mode is stored in localStorage via AppContext; all prices on the site
 * automatically respect this toggle (handled inside formatPrice / displayPrice).
 */
export default function VatToggle({ compact = false }: { compact?: boolean }) {
  const { vatMode, setVatMode, locale } = useApp();

  const excl = locale === 'nl' ? 'Excl. BTW' : 'Excl. VAT';
  const incl = locale === 'nl' ? 'Incl. BTW' : 'Incl. VAT';

  const base = compact
    ? 'px-2 py-0.5 text-[11px] font-semibold transition-colors'
    : 'px-2.5 py-1 text-xs font-semibold transition-colors';

  return (
    <div
      className="inline-flex items-center rounded-full bg-white/15 border border-white/30 overflow-hidden"
      role="group"
      aria-label="VAT display mode"
    >
      <button
        type="button"
        onClick={() => setVatMode('excl')}
        className={`${base} ${
          vatMode === 'excl' ? 'bg-white text-primary-600' : 'text-white hover:bg-white/10'
        }`}
        aria-pressed={vatMode === 'excl'}
      >
        {excl}
      </button>
      <button
        type="button"
        onClick={() => setVatMode('incl')}
        className={`${base} ${
          vatMode === 'incl' ? 'bg-white text-primary-600' : 'text-white hover:bg-white/10'
        }`}
        aria-pressed={vatMode === 'incl'}
      >
        {incl}
      </button>
    </div>
  );
}
