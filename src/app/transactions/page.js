"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/app/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/app/components/ui/dialog';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/app/components/ui/sheet';
import {
    ArrowUpDown,
    Search,
    Plus,
    Pencil,
    Trash2,
    Eye,
    TrendingUp,
    TrendingDown,
    ArrowLeftRight,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { mockTransactionsData } from '../components/utils/mockData';
import { useSettings } from '../components/contexts/SettingsContext';
import PageLoader from '../components/ui/page-loader';
import AddTransactionForm from '../components/transactions/AddTransactionForm';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const CATEGORIES = ['Alimentación', 'Transporte', 'Entretenimiento', 'Servicios', 'Compras', 'Salud', 'Educación', 'Vivienda', 'Otros', 'Salario', 'Ingresos Extra', 'Inversiones', 'Impuestos', 'Ahorros'];
const TYPES = ['Ingreso', 'Gasto', 'Transferencia'];
const PAGE_SIZE = 10;

const typeIcons = {
    Ingreso: TrendingUp,
    Gasto: TrendingDown,
    Transferencia: ArrowLeftRight,
};

const typeColors = {
    Ingreso: 'text-emerald-600 dark:text-emerald-400',
    Gasto: 'text-rose-600 dark:text-rose-400',
    Transferencia: 'text-blue-600 dark:text-blue-400',
};

const typeBadge = {
    Ingreso: 'default',
    Gasto: 'destructive',
    Transferencia: 'secondary',
};

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [selectedTx, setSelectedTx] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState('desc'); // 'desc' = newest first
    const { formatCurrency, formatDate } = useSettings();
    const { t } = useTranslation();

    useEffect(() => {
        const timer = setTimeout(() => {
            setTransactions(mockTransactionsData);
            setIsLoading(false);
        }, 400);
        return () => clearTimeout(timer);
    }, []);

    const filteredTransactions = useMemo(() => {
        let result = transactions.filter(tx => {
            const searchMatch = !searchText || tx.description.toLowerCase().includes(searchText.toLowerCase());
            const catMatch = categoryFilter === 'all' || tx.category === categoryFilter;
            const typeMatch = typeFilter === 'all' || tx.type === typeFilter;
            return searchMatch && catMatch && typeMatch;
        });
        result.sort((a, b) => {
            const da = new Date(a.date).getTime();
            const db = new Date(b.date).getTime();
            return sortOrder === 'desc' ? db - da : da - db;
        });
        return result;
    }, [transactions, searchText, categoryFilter, typeFilter, sortOrder]);

    const totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE);
    const paginatedTx = filteredTransactions.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handleDelete = () => {
        if (!deleteTarget) return;
        setTransactions(prev => prev.filter(t => t.id !== deleteTarget.id));
        setDeleteTarget(null);
    };

    const handleAddTransaction = (newTx) => {
        setTransactions(prev => [newTx, ...prev]);
        setShowAddForm(false);
    };

    // Reset page when filters change
    useEffect(() => { setCurrentPage(1); }, [searchText, categoryFilter, typeFilter]);

    return (
        <PageLoader loading={isLoading} message={t('common.loading')}>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/80 to-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                            <ArrowUpDown className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{t('transactions.title')}</h1>
                            <p className="text-sm text-muted-foreground">{filteredTransactions.length} de {transactions.length} registros</p>
                        </div>
                    </div>
                    <Button onClick={() => setShowAddForm(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        {t('transactions.newTransaction')}
                    </Button>
                </div>

                {showAddForm && (
                    <AddTransactionForm
                        onAddTransaction={handleAddTransaction}
                        onCancel={() => setShowAddForm(false)}
                    />
                )}

                {/* Filters */}
                <Card className="shadow-sm">
                    <CardContent className="pt-5 pb-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder={t('transactions.search')}
                                    className="pl-9"
                                    value={searchText}
                                    onChange={e => setSearchText(e.target.value)}
                                />
                            </div>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger><SelectValue placeholder={t('transactions.category')} /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('transactions.filterAllCategories')}</SelectItem>
                                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger><SelectValue placeholder={t('transactions.type')} /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('transactions.filterAllTypes')}</SelectItem>
                                    {TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Transaction List */}
                <Card className="shadow-sm overflow-hidden">
                    {/* Table Header */}
                    <div className="hidden md:grid grid-cols-12 gap-2 px-5 py-3 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b">
                        <div className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-foreground" onClick={() => setSortOrder(o => o === 'desc' ? 'asc' : 'desc')}>
                            {t('transactions.date')} <ArrowUpDown className="h-3 w-3" />
                        </div>
                        <div className="col-span-4">{t('transactions.description')}</div>
                        <div className="col-span-2">{t('transactions.category')}</div>
                        <div className="col-span-2 text-right">{t('transactions.amount')}</div>
                        <div className="col-span-2 text-center">{t('transactions.actions')}</div>
                    </div>

                    {/* Rows */}
                    <div className="divide-y">
                        <AnimatePresence>
                            {paginatedTx.map((tx, i) => {
                                const TypeIcon = typeIcons[tx.type] || ArrowUpDown;
                                return (
                                    <motion.div
                                        key={tx.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="grid grid-cols-1 md:grid-cols-12 gap-2 px-5 py-3.5 hover:bg-muted/30 transition-colors cursor-pointer group"
                                        onClick={() => setSelectedTx(tx)}
                                    >
                                        {/* Date */}
                                        <div className="md:col-span-2 flex items-center gap-2">
                                            <div className={`p-1.5 rounded-lg bg-muted flex-shrink-0 md:hidden`}>
                                                <TypeIcon className={`h-4 w-4 ${typeColors[tx.type]}`} />
                                            </div>
                                            <span className="text-sm text-muted-foreground">{formatDate(tx.date)}</span>
                                        </div>
                                        {/* Description */}
                                        <div className="md:col-span-4 flex items-center gap-2 min-w-0">
                                            <div className={`p-1.5 rounded-lg bg-muted flex-shrink-0 hidden md:flex`}>
                                                <TypeIcon className={`h-4 w-4 ${typeColors[tx.type]}`} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-sm truncate">{tx.description}</p>
                                                <p className="text-xs text-muted-foreground truncate md:hidden">{tx.category}</p>
                                            </div>
                                        </div>
                                        {/* Category */}
                                        <div className="md:col-span-2 hidden md:flex items-center">
                                            <Badge variant="secondary" className="text-xs">{tx.category}</Badge>
                                        </div>
                                        {/* Amount */}
                                        <div className="md:col-span-2 flex items-center md:justify-end">
                                            <span className={`font-semibold text-sm ${typeColors[tx.type]}`}>
                                                {tx.type === 'Gasto' ? '-' : tx.type === 'Ingreso' ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
                                            </span>
                                        </div>
                                        {/* Actions */}
                                        <div className="md:col-span-2 flex items-center justify-end md:justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setSelectedTx(tx); }}>
                                                <Eye className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); setDeleteTarget(tx); }}>
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {paginatedTx.length === 0 && (
                            <div className="py-16 text-center text-muted-foreground">
                                <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
                                <p className="font-medium">{t('transactions.emptyTitle')}</p>
                                <p className="text-sm">{t('transactions.emptySubtitle')}</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-5 py-3 border-t bg-muted/20">
                            <p className="text-xs text-muted-foreground">
                                {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, filteredTransactions.length)} de {filteredTransactions.length}
                            </p>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    const page = i + 1;
                                    return (
                                        <Button
                                            key={page}
                                            variant={currentPage === page ? 'default' : 'ghost'}
                                            size="icon"
                                            className="h-8 w-8 text-xs"
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </Button>
                                    );
                                })}
                                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Transaction Detail Sheet */}
                <Sheet open={!!selectedTx} onOpenChange={(open) => { if (!open) setSelectedTx(null); }}>
                    <SheetContent className="sm:max-w-md overflow-y-auto">
                        <SheetHeader>
                            <SheetTitle>{t('transactions.detailTitle')}</SheetTitle>
                        </SheetHeader>
                        {selectedTx && (
                            <div className="space-y-6 mt-6">
                                <div className="flex items-center justify-between">
                                    <Badge variant={typeBadge[selectedTx.type] || 'secondary'} className="text-sm px-3 py-1">
                                        {selectedTx.type}
                                    </Badge>
                                    <span className={`text-2xl font-bold ${typeColors[selectedTx.type]}`}>
                                        {selectedTx.type === 'Gasto' ? '-' : '+'}{formatCurrency(Math.abs(selectedTx.amount))}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { label: t('transactions.description'), value: selectedTx.description },
                                        { label: t('transactions.date'), value: formatDate(selectedTx.date) },
                                        { label: t('transactions.category'), value: selectedTx.category },
                                        { label: t('transactions.merchant'), value: selectedTx.merchant },
                                        { label: t('transactions.account'), value: selectedTx.account },
                                        { label: t('transactions.notes'), value: selectedTx.notes },
                                    ].filter(item => item.value).map(item => (
                                        <div key={item.label} className="flex justify-between py-2 border-b border-border/50">
                                            <span className="text-sm text-muted-foreground">{item.label}</span>
                                            <span className="text-sm font-medium text-right max-w-[60%]">{item.value}</span>
                                        </div>
                                    ))}

                                    {selectedTx.tags && selectedTx.tags.length > 0 && (
                                        <div className="pt-2">
                                            <p className="text-sm text-muted-foreground mb-2">{t('transactions.tags')}</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {selectedTx.tags.map(tag => (
                                                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </SheetContent>
                </Sheet>

                {/* Delete Confirmation */}
                <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle className="text-destructive">{t('common.delete')}</DialogTitle>
                        </DialogHeader>
                        <p className="text-sm">¿Estás seguro de eliminar <strong>{deleteTarget?.description}</strong>?</p>
                        <p className="text-xs text-muted-foreground">Esta acción no se puede deshacer.</p>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteTarget(null)}>{t('common.cancel')}</Button>
                            <Button variant="destructive" onClick={handleDelete}>{t('common.delete')}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </PageLoader>
    );
}