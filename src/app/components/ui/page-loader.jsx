'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import GlobalLoader from './global-loader';

/**
 * PageLoader — Wraps a page and shows a consistent loading state.
 *
 * Usage:
 *   <PageLoader loading={isLoading} message="Cargando reportes...">
 *     <YourPageContent />
 *   </PageLoader>
 */
export default function PageLoader({
    loading,
    message = 'Cargando...',
    children,
    className = '',
    minHeight = 'min-h-[400px]',
}) {
    return (
        <AnimatePresence mode="wait">
            {loading ? (
                <div key="loader" className={`${minHeight} ${className}`}>
                    <GlobalLoader message={message} size="md" />
                </div>
            ) : (
                <div key="content">
                    {children}
                </div>
            )}
        </AnimatePresence>
    );
}
