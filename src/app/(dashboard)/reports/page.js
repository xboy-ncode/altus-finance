"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/app/components/ui/select';
import {
    ClipboardList,
    RefreshCw,
    Download,
    TrendingUp,
    TrendingDown,
    ArrowUpDown,
    BarChart3,
    PieChart as PieChartIcon,
    Activity,
} from 'lucide-react';
import { mockTransactionsData } from '../components/utils/mockData';
import { useSettings } from '../components/contexts/SettingsContext';
import PageLoader from '../components/ui/page-loader';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function ReportsPage() {
    const { t } = useTranslation();
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [timeFrame, setTimeFrame] = useState('month');
    const [activeTab, setActiveTab] = useState('overview');
    const { formatCurrency, formatDate } = useSettings();

    const COLORS = [
        '#34d399', '#38bdf8', '#fbbf24', '#fb923c', '#a78bfa',
        '#fb7185', '#2dd4bf', '#a3e635', '#6ee7b7', '#f87171'
    ];

    const timeFrameOptions = [
        { value: 'week', label: t('reports.thisWeek') },
        { value: 'month', label: t('reports.thisMonth') },
        { value: 'quarter', label: t('reports.thisQuarter') },
        { value: 'year', label: t('reports.thisYear') },
    ];

    const tabs = [
        { id: 'overview', label: t('reports.tabOverview'), icon: PieChartIcon },
        { id: 'expenses', label: t('reports.tabExpenses'), icon: BarChart3 },
        { id: 'trends', label: t('reports.tabTrends'), icon: Activity },
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            setTransactions(mockTransactionsData);
            setIsLoading(false);
        }, 400);
        return () => clearTimeout(timer);
    }, []);

    // Process data
    const { categoryData, monthlyData, balanceData, topExpenses, summary } = useMemo(() => {
        if (!transactions.length) return { categoryData: [], monthlyData: [], balanceData: [], topExpenses: [], summary: { incomes: 0, expenses: 0, balance: 0, transactionCount: 0 } };

        // Category data
        const categoryMap = {};
        transactions.filter(tx => tx.type === 'Gasto').forEach(tx => {
            categoryMap[tx.category] = (categoryMap[tx.category] || 0) + Math.abs(tx.amount);
        });
        const catData = Object.entries(categoryMap)
            .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
            .sort((a, b) => b.value - a.value);

        // Monthly data
        const timeMap = {};
        transactions.forEach(tx => {
            const d = new Date(tx.date);
            const key = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
            if (!timeMap[key]) timeMap[key] = { name: key, ingresos: 0, gastos: 0 };
            if (tx.type === 'Ingreso') timeMap[key].ingresos += tx.amount;
            else if (tx.type === 'Gasto') timeMap[key].gastos += Math.abs(tx.amount);
        });
        const mData = Object.values(timeMap).map(item => ({
            ...item,
            balance: Math.round((item.ingresos - item.gastos) * 100) / 100,
        }));

        // Balance data
        const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
        let bal = 0;
        const bData = sorted.map(tx => {
            const amt = tx.type === 'Ingreso' ? tx.amount : -Math.abs(tx.amount);
            bal += amt;
            const d = new Date(tx.date);
            return {
                date: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`,
                balance: Math.round(bal * 100) / 100,
            };
        });

        // Top expenses
        const tExpenses = transactions
            .filter(tx => tx.type === 'Gasto')
            .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
            .slice(0, 8);

        // Summary
        const incomes = transactions.filter(tx => tx.type === 'Ingreso').reduce((s, tx) => s + tx.amount, 0);
        const expenses = transactions.filter(tx => tx.type === 'Gasto').reduce((s, tx) => s + Math.abs(tx.amount), 0);

        return {
            categoryData: catData,
            monthlyData: mData,
            balanceData: bData,
            topExpenses: tExpenses,
            summary: {
                incomes: Math.round(incomes * 100) / 100,
                expenses: Math.round(expenses * 100) / 100,
                balance: Math.round((incomes - expenses) * 100) / 100,
                transactionCount: transactions.length,
            },
        };
    }, [transactions, timeFrame]);

    return (
        <PageLoader loading={isLoading} message={t('reports.loading')}>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/80 to-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                            <ClipboardList className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{t('reports.title')}</h1>
                            <p className="text-sm text-muted-foreground">{transactions.length} {t('reports.analyzed')}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Select value={timeFrame} onValueChange={setTimeFrame}>
                            <SelectTrigger className="w-44">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {timeFrameOptions.map(o => (
                                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon">
                            <Download className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Summary Cards — 2x2 grid prioritizing Income vs Expense */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        {
                            label: t('reports.totalIncomes'),
                            value: summary.incomes,
                            icon: TrendingUp,
                            color: 'text-emerald-600 dark:text-emerald-400',
                            bg: 'from-emerald-500/15 to-emerald-600/5',
                        },
                        {
                            label: t('reports.totalExpenses'),
                            value: summary.expenses,
                            icon: TrendingDown,
                            color: 'text-rose-600 dark:text-rose-400',
                            bg: 'from-rose-500/15 to-rose-600/5',
                        },
                        {
                            label: t('reports.balance'),
                            value: summary.balance,
                            icon: ArrowUpDown,
                            color: summary.balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400',
                            bg: summary.balance >= 0 ? 'from-emerald-500/15 to-emerald-600/5' : 'from-rose-500/15 to-rose-600/5',
                        },
                        {
                            label: t('reports.transactionCount'),
                            value: summary.transactionCount,
                            icon: BarChart3,
                            color: 'text-blue-600 dark:text-blue-400',
                            bg: 'from-blue-500/15 to-blue-600/5',
                            isCurrency: false,
                        },
                    ].map((card, i) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={card.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                            >
                                <Card className={`border-0 shadow-md bg-gradient-to-br ${card.bg}`}>
                                    <CardContent className="p-5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-muted-foreground font-medium">{card.label}</p>
                                                <p className={`text-2xl font-bold mt-1 ${card.color}`}>
                                                    {card.isCurrency === false ? card.value : formatCurrency(card.value)}
                                                </p>
                                            </div>
                                            <Icon className={`h-8 w-8 ${card.color} opacity-40`} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Tab Navigation */}
                <Card className="shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex gap-1 mb-6 border-b pb-3">
                            {tabs.map(tab => {
                                const Icon = tab.icon;
                                return (
                                    <Button
                                        key={tab.id}
                                        variant={activeTab === tab.id ? 'default' : 'ghost'}
                                        onClick={() => setActiveTab(tab.id)}
                                        className="gap-2"
                                    >
                                        <Icon className="h-4 w-4" />
                                        {tab.label}
                                    </Button>
                                );
                            })}
                        </div>

                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card className="border shadow-none">
                                    <CardHeader><CardTitle className="text-base">{t('reports.incomeVsExpense')}</CardTitle></CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                                <XAxis dataKey="name" className="text-xs" tick={{ fill: 'currentColor' }} />
                                                <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
                                                <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }} />
                                                <Legend />
                                                <Bar dataKey="ingresos" name="Ingresos" fill="#34d399" radius={[4, 4, 0, 0]} />
                                                <Bar dataKey="gastos" name="Gastos" fill="#fb7185" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                <Card className="border shadow-none">
                                    <CardHeader><CardTitle className="text-base">{t('reports.expensesByCategory')}</CardTitle></CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={categoryData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={90}
                                                    innerRadius={50}
                                                    paddingAngle={3}
                                                    dataKey="value"
                                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {categoryData.map((_, i) => (
                                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                <Card className="border shadow-none lg:col-span-2">
                                    <CardHeader><CardTitle className="text-base">{t('reports.balanceEvolution')}</CardTitle></CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={balanceData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                                <XAxis dataKey="date" className="text-xs" tick={{ fill: 'currentColor' }} />
                                                <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
                                                <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }} />
                                                <Line type="monotone" dataKey="balance" name="Balance" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Expenses Tab */}
                        {activeTab === 'expenses' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card className="border shadow-none">
                                    <CardHeader><CardTitle className="text-base">{t('reports.topExpenses')}</CardTitle></CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {topExpenses.map((tx, i) => (
                                                <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
                                                        <div className="min-w-0">
                                                            <p className="font-medium text-sm truncate">{tx.description}</p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <Badge variant="secondary" className="text-[10px]">{tx.category}</Badge>
                                                                <span className="text-xs text-muted-foreground">{formatDate(tx.date)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm font-semibold text-rose-600 dark:text-rose-400 flex-shrink-0 ml-3">
                                                        -{formatCurrency(Math.abs(tx.amount))}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border shadow-none">
                                    <CardHeader><CardTitle className="text-base">{t('reports.categoryDistribution')}</CardTitle></CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <PieChart>
                                                <Pie
                                                    data={categoryData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={65}
                                                    outerRadius={90}
                                                    paddingAngle={4}
                                                    dataKey="value"
                                                >
                                                    {categoryData.map((_, i) => (
                                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }} />
                                                <Legend layout="vertical" verticalAlign="middle" align="right" />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Trends Tab */}
                        {activeTab === 'trends' && (
                            <div className="space-y-6">
                                <Card className="border shadow-none">
                                    <CardHeader><CardTitle className="text-base">{t('reports.accumulatedBalance')}</CardTitle></CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <LineChart data={balanceData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                                <XAxis dataKey="date" className="text-xs" tick={{ fill: 'currentColor' }} />
                                                <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
                                                <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }} />
                                                <Line type="monotone" dataKey="balance" name="Balance" stroke="#38bdf8" strokeWidth={2.5} fill="url(#balanceGradient)" dot={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                {/* Category breakdown */}
                                <Card className="border shadow-none">
                                    <CardHeader><CardTitle className="text-base">{t('reports.categoryBreakdown')}</CardTitle></CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {categoryData.map((cat, i) => {
                                                const total = categoryData.reduce((s, c) => s + c.value, 0);
                                                const pct = total > 0 ? (cat.value / total * 100) : 0;
                                                return (
                                                    <div key={cat.name} className="space-y-1.5">
                                                        <div className="flex items-center justify-between text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                                                <span className="font-medium">{cat.name}</span>
                                                            </div>
                                                            <span className="text-muted-foreground">{formatCurrency(cat.value)} ({pct.toFixed(1)}%)</span>
                                                        </div>
                                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                            <motion.div
                                                                className="h-full rounded-full"
                                                                style={{ backgroundColor: COLORS[i % COLORS.length] }}
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${pct}%` }}
                                                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </PageLoader>
    );
}