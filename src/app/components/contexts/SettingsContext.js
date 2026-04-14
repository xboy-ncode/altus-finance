'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// ─── Theme Presets ──────────────────────────────────────────────
export const THEME_PRESETS = {
    emerald: {
        name: 'Emerald',
        label: 'Esmeralda',
        primary: 'oklch(0.648 0.2 131.684)',
        ring: 'oklch(0.841 0.238 128.85)',
        sidebarPrimary: 'oklch(0.648 0.2 131.684)',
        sidebarPrimaryDark: 'oklch(0.768 0.233 130.85)',
        chart1: 'oklch(0.871 0.15 154.449)',
        chart2: 'oklch(0.723 0.219 149.579)',
        chart3: 'oklch(0.627 0.194 149.214)',
        swatch: '#4ade80',
    },
    oceanic: {
        name: 'Oceanic',
        label: 'Oceánico',
        primary: 'oklch(0.588 0.158 241)',
        ring: 'oklch(0.7 0.18 240)',
        sidebarPrimary: 'oklch(0.588 0.158 241)',
        sidebarPrimaryDark: 'oklch(0.7 0.2 240)',
        chart1: 'oklch(0.75 0.14 220)',
        chart2: 'oklch(0.65 0.17 235)',
        chart3: 'oklch(0.55 0.15 250)',
        swatch: '#38bdf8',
    },
    professional: {
        name: 'Professional',
        label: 'Profesional',
        primary: 'oklch(0.533 0.185 262)',
        ring: 'oklch(0.65 0.2 260)',
        sidebarPrimary: 'oklch(0.533 0.185 262)',
        sidebarPrimaryDark: 'oklch(0.65 0.22 260)',
        chart1: 'oklch(0.72 0.15 275)',
        chart2: 'oklch(0.62 0.18 260)',
        chart3: 'oklch(0.52 0.16 250)',
        swatch: '#818cf8',
    },
    sunset: {
        name: 'Sunset',
        label: 'Atardecer',
        primary: 'oklch(0.637 0.237 25)',
        ring: 'oklch(0.75 0.2 30)',
        sidebarPrimary: 'oklch(0.637 0.237 25)',
        sidebarPrimaryDark: 'oklch(0.75 0.22 25)',
        chart1: 'oklch(0.8 0.15 40)',
        chart2: 'oklch(0.7 0.2 25)',
        chart3: 'oklch(0.6 0.22 15)',
        swatch: '#fb923c',
    },
    rose: {
        name: 'Rose',
        label: 'Rosa',
        primary: 'oklch(0.625 0.22 350)',
        ring: 'oklch(0.75 0.2 350)',
        sidebarPrimary: 'oklch(0.625 0.22 350)',
        sidebarPrimaryDark: 'oklch(0.75 0.22 350)',
        chart1: 'oklch(0.8 0.14 0)',
        chart2: 'oklch(0.7 0.19 350)',
        chart3: 'oklch(0.6 0.2 340)',
        swatch: '#fb7185',
    },
    midnight: {
        name: 'Midnight',
        label: 'Medianoche',
        primary: 'oklch(0.55 0.15 280)',
        ring: 'oklch(0.65 0.17 280)',
        sidebarPrimary: 'oklch(0.55 0.15 280)',
        sidebarPrimaryDark: 'oklch(0.65 0.18 280)',
        chart1: 'oklch(0.72 0.12 295)',
        chart2: 'oklch(0.62 0.15 280)',
        chart3: 'oklch(0.52 0.13 270)',
        swatch: '#a78bfa',
    },
};

// ─── Default Settings ───────────────────────────────────────────
const DEFAULT_SETTINGS = {
    currency: 'USD',
    dateFormat: 'DD/MM/YYYY',
    language: 'es',
    showCents: true,
    startOfWeek: 'monday',
    defaultView: 'dashboard',
    colorTheme: 'emerald',
};

// ─── Currency Map ───────────────────────────────────────────────
const CURRENCY_MAP = {
    USD: { code: 'USD', symbol: '$', locale: 'en-US' },
    EUR: { code: 'EUR', symbol: '€', locale: 'es-ES' },
    MXN: { code: 'MXN', symbol: '$', locale: 'es-MX' },
};

// ─── Storage Key ────────────────────────────────────────────────
const STORAGE_KEY = 'altus-settings';

// ─── Context ────────────────────────────────────────────────────
const SettingsContext = createContext(undefined);

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [isLoaded, setIsLoaded] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const debounceRef = useRef(null);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setSettings((prev) => ({ ...prev, ...parsed }));
            }
        } catch (e) {
            console.warn('Failed to load settings from localStorage:', e);
        }
        setIsLoaded(true);
    }, []);

    // Apply theme preset CSS variables whenever colorTheme changes
    useEffect(() => {
        if (!isLoaded) return;
        const preset = THEME_PRESETS[settings.colorTheme];
        if (!preset) return;

        const root = document.documentElement;
        root.style.setProperty('--primary', preset.primary);
        root.style.setProperty('--ring', preset.ring);
        root.style.setProperty('--sidebar-primary', preset.sidebarPrimary);
        root.style.setProperty('--chart-1', preset.chart1);
        root.style.setProperty('--chart-2', preset.chart2);
        root.style.setProperty('--chart-3', preset.chart3);

        // Also update dark mode variant for sidebar
        // (dark sidebar primary is handled via the dark class & CSS variables,
        //  but since we set it inline, we check and apply for the current mode)
        const isDark = root.classList.contains('dark');
        if (isDark) {
            root.style.setProperty('--sidebar-primary', preset.sidebarPrimaryDark);
        }
    }, [settings.colorTheme, isLoaded]);

    // Debounced save to localStorage
    const persistSettings = useCallback((newSettings) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
                setLastSaved(new Date());
            } catch (e) {
                console.warn('Failed to save settings:', e);
            }
        }, 500);
    }, []);

    // Update a single setting
    const updateSetting = useCallback(
        (key, value) => {
            setSettings((prev) => {
                const next = { ...prev, [key]: value };
                persistSettings(next);
                return next;
            });
        },
        [persistSettings]
    );

    // Bulk update
    const updateSettings = useCallback(
        (partial) => {
            setSettings((prev) => {
                const next = { ...prev, ...partial };
                persistSettings(next);
                return next;
            });
        },
        [persistSettings]
    );

    // Format currency using the selected currency setting
    const formatCurrency = useCallback(
        (amount) => {
            if (amount === undefined || amount === null) return `${CURRENCY_MAP[settings.currency]?.symbol || '$'}0.00`;
            const curr = CURRENCY_MAP[settings.currency] || CURRENCY_MAP.USD;
            return new Intl.NumberFormat(curr.locale, {
                style: 'currency',
                currency: curr.code,
                minimumFractionDigits: settings.showCents ? 2 : 0,
                maximumFractionDigits: settings.showCents ? 2 : 0,
            }).format(amount);
        },
        [settings.currency, settings.showCents]
    );

    // Format date using the selected date format
    const formatDate = useCallback(
        (dateStr) => {
            if (!dateStr) return '';
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;

            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();

            if (settings.dateFormat === 'MM/DD/YYYY') return `${month}/${day}/${year}`;
            return `${day}/${month}/${year}`;
        },
        [settings.dateFormat]
    );

    const value = {
        settings,
        isLoaded,
        lastSaved,
        updateSetting,
        updateSettings,
        formatCurrency,
        formatDate,
        THEME_PRESETS,
        CURRENCY_MAP,
    };

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
    const ctx = useContext(SettingsContext);
    if (ctx === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return ctx;
}

export default SettingsContext;
