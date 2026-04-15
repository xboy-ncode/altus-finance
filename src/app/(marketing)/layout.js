'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { useTranslation } from 'react-i18next';

export default function MarketingLayout({ children }) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/30">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
                <img src="/icon-512.png" alt="Altus Logo" className="h-10 w-10 object-contain dark:invert-[0.1]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">Altus</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">{t('marketing.features')}</Link>
            <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">{t('marketing.pricing')}</Link>
            <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">{t('marketing.about')}</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">{t('marketing.logIn')}</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">{t('marketing.getStarted')}</Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1">{children}</main>
      
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Altus Finance. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
