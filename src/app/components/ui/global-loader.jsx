'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';

/**
 * GlobalLoader — A visually premium, finance-themed loading animation.
 * Used across the app for data fetching and route transitions.
 * 
 * @param {string} message - Optional loading message text
 * @param {string} size - 'sm' | 'md' | 'lg' — controls overall scale
 * @param {boolean} fullScreen - If true, centers in viewport
 * @param {boolean} overlay - If true, adds a subtle backdrop
 */
export default function GlobalLoader({
    message = 'Cargando...',
    size = 'md',
    fullScreen = false,
    overlay = false,
}) {
    const sizeMap = {
        sm: { icon: 20, ring: 48, text: 'text-xs' },
        md: { icon: 28, ring: 64, text: 'text-sm' },
        lg: { icon: 36, ring: 80, text: 'text-base' },
    };

    const s = sizeMap[size] || sizeMap.md;

    const containerClass = fullScreen
        ? 'fixed inset-0 z-50 flex items-center justify-center'
        : 'flex items-center justify-center py-12';

    return (
        <motion.div
            className={containerClass}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            {overlay && (
                <motion.div
                    className="absolute inset-0 bg-background/60 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                />
            )}

            <div className="relative flex flex-col items-center gap-4 z-10">
                {/* Spinning ring + pulsing icon */}
                <div className="relative flex items-center justify-center" style={{ width: s.ring, height: s.ring }}>
                    {/* Outer rotating ring */}
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-transparent"
                        style={{
                            borderTopColor: 'var(--primary)',
                            borderRightColor: 'color-mix(in oklch, var(--primary) 40%, transparent)',
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    />
                    {/* Inner pulse ring */}
                    <motion.div
                        className="absolute rounded-full bg-primary/10"
                        style={{ width: s.ring * 0.75, height: s.ring * 0.75 }}
                        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.2, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    {/* Center icon */}
                    <motion.div
                        animate={{ scale: [1, 0.9, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <Wallet
                            size={s.icon}
                            className="text-primary"
                            strokeWidth={1.8}
                        />
                    </motion.div>
                </div>

                {/* Animated message */}
                {message && (
                    <div className={`flex items-center gap-1 text-muted-foreground font-medium ${s.text}`}>
                        <span>{message}</span>
                        <span className="flex gap-0.5">
                            {[0, 1, 2].map((i) => (
                                <motion.span
                                    key={i}
                                    className="inline-block w-1 h-1 rounded-full bg-primary"
                                    animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                        ease: 'easeInOut',
                                    }}
                                />
                            ))}
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
