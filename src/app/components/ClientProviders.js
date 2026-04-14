'use client';
import React from 'react';
import { ThemeProvider } from './theme-provider';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import Layout from './common/Layout';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/i18n';

function LanguageUpdater({ children }) {
  const { settings } = useSettings();
  
  React.useEffect(() => {
    if (settings.language && i18n.language !== settings.language) {
      i18n.changeLanguage(settings.language);
    }
  }, [settings.language]);

  return children;
}

export default function ClientProviders({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SettingsProvider>
        <I18nextProvider i18n={i18n}>
          <LanguageUpdater>
            <Layout>
              {children}
            </Layout>
          </LanguageUpdater>
        </I18nextProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}