'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { normalizeImageUrl } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageSlideshowProps {
  images: string[];
  alt: string;
  className?: string;
  autoPlay?: boolean;
  interval?: number;
  showThumbnails?: boolean;
}

export default function ImageSlideshow({
  images,
  alt,
  className = '',
  autoPlay = false,
  interval = 5000,
  showThumbnails = true
}: ImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Filter and normalize images
  const validImages = useMemo(() => {
    return images
      .filter(img => img && img.trim() !== '')
      .map(img => normalizeImageUrl(img));
  }, [images]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % (validImages.length || 1));
  }, [validImages.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + (validImages.length || 1)) % (validImages.length || 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play
  useEffect(() => {
    if (!autoPlay || validImages.length <= 1) return;
    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, nextSlide, validImages.length]);

  // Preload images
  useEffect(() => {
    validImages.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsLoaded(true);
    });
  }, [validImages]);
  
  // If no valid images, show placeholder
  if (validImages.length === 0) {
    return (
      <div className={`bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-400">Geen afbeelding</span>
      </div>
    );
  }

  // If only one image, just show it
  if (validImages.length === 1) {
    return (
      <div className={`relative overflow-hidden rounded-lg ${className}`}>
        <img
          src={validImages[0]}
          alt={alt}
          className="w-full h-full object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/logo.png';
            (e.target as HTMLImageElement).className = 'w-full h-full object-contain opacity-50';
          }}
        />
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full w-full ${className}`}>
      {/* Main Image Container */}
      <div className="relative flex-1 overflow-hidden rounded-lg bg-gray-50 min-h-0">
        {validImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              index === currentIndex
                ? 'opacity-100 translate-x-0'
                : index < currentIndex
                ? 'opacity-0 -translate-x-full'
                : 'opacity-0 translate-x-full'
            }`}
          >
            <img
              src={image}
              alt={`${alt} - ${index + 1}`}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo.png';
                (e.target as HTMLImageElement).className = 'w-full h-full object-contain opacity-50';
              }}
            />
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all hover:scale-110 z-10"
          aria-label="Vorige afbeelding"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all hover:scale-110 z-10"
          aria-label="Volgende afbeelding"
        >
          <ChevronRight size={24} />
        </button>

        {/* Image Counter */}
        <div className="absolute top-2 right-2 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
          {currentIndex + 1} / {validImages.length}
        </div>
      </div>

      {/* Thumbnails */}
      {showThumbnails && validImages.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 max-w-full">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                index === currentIndex
                  ? 'border-primary-500 ring-2 ring-primary-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{ minWidth: '64px' }}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover pointer-events-none"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.png';
                  (e.target as HTMLImageElement).className = 'w-full h-full object-contain opacity-50';
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-3">
        {validImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-primary-500 w-6'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Ga naar afbeelding ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
