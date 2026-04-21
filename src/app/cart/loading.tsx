'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';

export default function CartLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <ShoppingCart size={48} className="text-primary-300 animate-bounce" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-500 text-sm animate-pulse">Winkelwagen laden...</p>
      </div>
    </div>
  );
}
