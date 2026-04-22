'use client';

import React, { useEffect, useRef, useState, ReactNode } from 'react';

type AnimationType = 'fade-up' | 'fade-left' | 'fade-right' | 'scale' | 'stagger';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  animation?: AnimationType;
  delay?: number;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

const animationClasses: Record<AnimationType, string> = {
  'fade-up': 'scroll-reveal',
  'fade-left': 'scroll-reveal-left',
  'fade-right': 'scroll-reveal-right',
  'scale': 'scroll-reveal-scale',
  'stagger': 'scroll-reveal-stagger',
};

export function ScrollReveal({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add delay if specified
          if (delay > 0) {
            setTimeout(() => setIsVisible(true), delay * 1000);
          } else {
            setIsVisible(true);
          }
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay, once, threshold, rootMargin]);

  const baseClass = animationClasses[animation];
  const visibleClass = isVisible ? 'visible' : '';

  return (
    <div
      ref={ref}
      className={`${baseClass} ${visibleClass} ${className}`}
    >
      {children}
    </div>
  );
}

// Hook for use in other components
export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

export default ScrollReveal;
