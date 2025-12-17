import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    PiggyBank,
    DollarSign
} from 'lucide-react';

const OverviewCards = ({ data }) => {
    // Validación de datos
    if (!data) {
        return null;
    }

    const { totalBalance = {}, income = {}, expenses = {}, savings = {} } = data;

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return '€0.00';
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    };

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
            title: 'Balance Total',
            value: totalBalance.current || 0,
            previous: totalBalance.previous || 0,
            icon: Wallet,
            type: 'balance',
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-50'
        },
        {
            title: 'Ingresos',
            value: income.current || 0,
            previous: income.previous || 0,
            icon: DollarSign,
            type: 'income',
            iconColor: 'text-green-600',
            iconBg: 'bg-green-50'
        },
        {
            title: 'Gastos',
            value: expenses.current || 0,
            previous: expenses.previous || 0,
            icon: TrendingDown,
            type: 'expenses',
            iconColor: 'text-red-600',
            iconBg: 'bg-red-50'
        },
        {
            title: 'Ahorros',
            value: savings.current || 0,
            previous: savings.previous || 0,
            icon: PiggyBank,
            type: 'savings',
            iconColor: 'text-purple-600',
            iconBg: 'bg-purple-50'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2 flex-1">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {card.title}
                                    </p>
                                    <div className="space-y-1">
                                        <p className="text-2xl font-bold">
                                            {formatCurrency(card.value)}
                                        </p>
                                        {card.previous !== undefined && card.previous !== null && (
                                            renderTrend(card.value, card.previous, card.type)
                                        )}
                                    </div>
                                </div>
                                <div className={`p-3 rounded-full ${card.iconBg} flex-shrink-0`}>
                                    <Icon className={`h-6 w-6 ${card.iconColor}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default OverviewCards;