'use client';

import React from 'react';
import {
    Card,
    CardContent,
} from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    PiggyBank,
    DollarSign
} from 'lucide-react';
import { useSettings } from '@/app/components/contexts/SettingsContext';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const OverviewCards = ({ data }) => {
    const { formatCurrency } = useSettings();
    const { t } = useTranslation();

    if (!data) return null;

    const { totalBalance = {}, income = {}, expenses = {}, savings = {} } = data;

    const calculatePercentage = (current, previous) => {
        if (!previous || previous === 0) return 0;
        return ((current - previous) / previous) * 100;
    };

    const renderTrend = (current, previous, type = 'default') => {
        const percentage = calculatePercentage(current, previous);
        const isPositive = percentage > 0;
        const isNeutral = percentage === 0;

        let variant = 'secondary';
        if (!isNeutral) {
            if (type === 'expenses') {
                variant = isPositive ? 'destructive' : 'default';
            } else {
                variant = isPositive ? 'default' : 'destructive';
            }
        }

        const TrendIcon = isNeutral ? null : isPositive ? TrendingUp : TrendingDown;

        return (
            <div className="flex items-center gap-1 text-sm">
                <Badge variant={variant} className="gap-1">
                    {TrendIcon && <TrendIcon className="h-3 w-3" />}
                    <span>{Math.abs(percentage).toFixed(1)}%</span>
                </Badge>
            </div>
        );
    };

    const cards = [
        {
            title: t('dashboard.totalBalance'),
            value: totalBalance.current || 0,
            previous: totalBalance.previous || 0,
            icon: Wallet,
            type: 'balance',
            gradient: 'from-blue-500/15 to-blue-600/5 dark:from-blue-500/20 dark:to-blue-600/10',
            iconColor: 'text-blue-600 dark:text-blue-400',
            iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
        },
        {
            title: t('dashboard.incomes'),
            value: income.current || 0,
            previous: income.previous || 0,
            icon: DollarSign,
            type: 'income',
            gradient: 'from-emerald-500/15 to-emerald-600/5 dark:from-emerald-500/20 dark:to-emerald-600/10',
            iconColor: 'text-emerald-600 dark:text-emerald-400',
            iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
        },
        {
            title: t('dashboard.expenses'),
            value: expenses.current || 0,
            previous: expenses.previous || 0,
            icon: TrendingDown,
            type: 'expenses',
            gradient: 'from-rose-500/15 to-rose-600/5 dark:from-rose-500/20 dark:to-rose-600/10',
            iconColor: 'text-rose-600 dark:text-rose-400',
            iconBg: 'bg-rose-500/10 dark:bg-rose-500/20',
        },
        {
            title: t('dashboard.savings'),
            value: savings.current || 0,
            previous: savings.previous || 0,
            icon: PiggyBank,
            type: 'savings',
            gradient: 'from-violet-500/15 to-violet-600/5 dark:from-violet-500/20 dark:to-violet-600/10',
            iconColor: 'text-violet-600 dark:text-violet-400',
            iconBg: 'bg-violet-500/10 dark:bg-violet-500/20',
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                        <Card className={`border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br ${card.gradient} group`}>
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2 flex-1">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {card.title}
                                        </p>
                                        <div className="space-y-1">
                                            <p className="text-2xl font-bold tracking-tight">
                                                {formatCurrency(card.value)}
                                            </p>
                                            {card.previous !== undefined && card.previous !== null && (
                                                renderTrend(card.value, card.previous, card.type)
                                            )}
                                        </div>
                                    </div>
                                    <div className={`p-3 rounded-xl ${card.iconBg} flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className={`h-6 w-6 ${card.iconColor}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default OverviewCards;