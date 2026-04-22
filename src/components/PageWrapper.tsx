'use client';

import React, { ReactNode, useEffect } from 'react';
import ScrollReveal from './ScrollReveal';

interface PageWrapperProps {
  children: ReactNode;
  animate?: boolean;
}

export function PageWrapper({ children, animate = true }: PageWrapperProps) {
  useEffect(() => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  if (!animate) {
    return <>{children}</>;
  }

  return (
    <div className="animate-fade-in">
      {children}
    </div>
  );
}

export function Section({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-left' | 'fade-right' | 'scale' | 'stagger';
  delay?: number;
}) {
  return (
    <ScrollReveal animation={animation} delay={delay}>
      <section className={className}>
        {children}
      </section>
    </ScrollReveal>
  );
}

export default PageWrapper;
