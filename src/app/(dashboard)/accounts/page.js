'use client';

import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
    DialogClose,
} from '@/app/components/ui/dialog';
import { Badge } from '@/app/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/app/components/ui/select';
import PageLoader from '@/app/components/ui/page-loader';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/app/components/ui/dropdown-menu';
import {
    Plus,
    Wallet,
    Pencil,
    Trash2,
    TrendingUp,
    TrendingDown,
    Landmark,
    CreditCard,
    PiggyBank,
    Banknote,
    MoreVertical,
    Edit,
    AlertTriangle
} from 'lucide-react';
import { useSettings } from '@/app/components/contexts/SettingsContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const ACCOUNT_TYPES = {
    corriente: { label: 'Corriente', icon: Landmark, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10', badge: 'secondary' },
    ahorros: { label: 'Ahorros', icon: PiggyBank, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', badge: 'default' },
    efectivo: { label: 'Efectivo', icon: Banknote, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-500/10', badge: 'secondary' },
    credito: { label: 'Crédito', icon: CreditCard, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10', badge: 'outline' },
};

export default function AccountsPage() {
    const { formatCurrency } = useSettings();
    const { t } = useTranslation();
    const [accounts, setAccounts] = useState([
        { id: 1, name: 'Cuenta Corriente', balance: 1200, type: 'corriente' },
        { id: 2, name: 'Ahorros', balance: 5000, type: 'ahorros' },
        { id: 3, name: 'Tarjeta Visa', balance: -450, type: 'credito' },
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);

    const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

    const handleDelete = () => {
        if(editingAccount) {
            setAccounts(prev => prev.filter(a => a.id !== editingAccount.id));
            setIsDeleteDialogOpen(false);
            setEditingAccount(null);
        }
    };

    return (
        <PageLoader loading={isLoading} message={t('common.loading')}>
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/80 to-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                            <Landmark className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{t('accounts.title')}</h1>
                            <p className="text-sm text-muted-foreground">{accounts.length} {t('accounts.registered')}</p>
                        </div>
                    </div>
                    <Button onClick={() => { setEditingAccount(null); setIsDialogOpen(true); }}>
                        <Plus className="h-4 w-4 mr-2" />
                        {t('accounts.newAccount')}
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                        <CardContent className="p-6">
                            <p className="text-sm font-medium text-muted-foreground mb-1">{t('accounts.totalBalance')}</p>
                            <h2 className="text-3xl font-bold tracking-tight">{formatCurrency(totalBalance)}</h2>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-sm font-medium text-muted-foreground mb-1">{t('accounts.average')}</p>
                            <h2 className="text-3xl font-bold tracking-tight">{formatCurrency(totalBalance / (accounts.length || 1))}</h2>
                        </CardContent>
                    </Card>
                </div>

                {accounts.length === 0 ? (
                    <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Landmark className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{t('accounts.noAccounts')}</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                            {t('accounts.addFirstAccount')}
                        </p>
                        <Button onClick={() => { setEditingAccount(null); setIsDialogOpen(true); }}>
                            <Plus className="h-4 w-4 mr-2" />
                            {t('accounts.addAccount')}
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {accounts.map((acc) => {
                            const typeConf = ACCOUNT_TYPES[acc.type] || ACCOUNT_TYPES.corriente;
                            const Icon = typeConf.icon;
                            return (
                                <Card key={acc.id} className="group relative overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-0">
                                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-primary/5 to-transparent -translate-y-12 translate-x-12" />
                                    <CardContent className="p-5 relative">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => { setEditingAccount(acc); setIsDialogOpen(true); }}>
                                                    <Edit className="h-4 w-4 mr-2" /> {t('common.edit')}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => {
                                                    setEditingAccount(acc);
                                                    setIsDeleteDialogOpen(true);
                                                }}>
                                                    <Trash2 className="h-4 w-4 mr-2" /> {t('common.delete')}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`p-2.5 rounded-xl ${typeConf.bg}`}>
                                                <Icon className={`h-5 w-5 ${typeConf.color}`} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-base">{acc.name}</h3>
                                                <Badge variant={typeConf.badge} className="text-[10px] mt-0.5">{typeConf.label}</Badge>
                                            </div>
                                        </div>

                                        <p className="text-sm font-medium text-muted-foreground mb-1 mt-4">{t('accounts.currentBalance')}</p>
                                        <h3 className={`text-2xl font-bold tracking-tight ${acc.balance < 0 ? 'text-destructive' : ''}`}>{formatCurrency(acc.balance)}</h3>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingAccount ? t('accounts.editAccount') : t('accounts.newAccount')}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">{t('accounts.accountName')}</Label>
                                <Input id="name" placeholder={t('accounts.accountName')} defaultValue={editingAccount?.name} />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('accounts.accountType')}</Label>
                                <Select defaultValue={editingAccount?.type || 'corriente'}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('accounts.accountType')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(ACCOUNT_TYPES).map(([key, conf]) => {
                                            const TypeIcon = conf.icon;
                                            return (
                                                <SelectItem key={key} value={key}>
                                                    <div className="flex items-center gap-2">
                                                        <TypeIcon className={`h-4 w-4 ${conf.color}`} />
                                                        <span>{conf.label}</span>
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="balance">{t('accounts.initialBalance')}</Label>
                                <Input id="balance" type="number" step="0.01" placeholder="0.00" defaultValue={editingAccount?.balance} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{t('common.cancel')}</Button>
                            <Button onClick={() => setIsDialogOpen(false)}>{t('common.save')}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-destructive">
                                <AlertTriangle className="h-5 w-5" />
                                {t('accounts.deleteAccount')}
                            </DialogTitle>
                            <DialogDescription>
                                {t('accounts.areYouSureDelete')} <span className="font-semibold">{editingAccount?.name}</span>? {t('accounts.cannotUndo')}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4">
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>{t('common.cancel')}</Button>
                            <Button variant="destructive" onClick={handleDelete}>{t('common.delete')}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </PageLoader>
    );
}