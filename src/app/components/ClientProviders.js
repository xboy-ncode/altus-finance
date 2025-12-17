'use client';
import React from 'react';
import { ThemeProvider } from './theme-provider';
import Layout from './common/Layout'; // Corregida la ruta relativa
import { showToast } from 'nextjs-toast-notify';

export default function ClientProviders({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Layout>

        {children}
           <showToast position="top-right" />
      </Layout>
    </ThemeProvider>
  );
}