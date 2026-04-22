'use client';

import React from 'react';
import { Newspaper } from 'lucide-react';

export default function NewsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Newspaper size={48} className="text-primary-300" />
          <div className="absolute -inset-2 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-500 text-sm animate-pulse">Nieuws laden...</p>
      </div>
    </div>
  );
}
