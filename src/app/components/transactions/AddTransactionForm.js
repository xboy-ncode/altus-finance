import React, { useState, useEffect } from 'react';
import {
    DollarSign,
    Plus,
    Minus,
    ArrowLeftRight,
    ShoppingBag,
    Car,
    Home,
    Pill,
    BookOpen,
    Coffee,
    Lightbulb,
    LayoutGrid,
    X,
    Loader2
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { useTranslation } from 'react-i18next';
import { createTransaction, createTransfer } from '@/app/lib/actions/transactions';
import { getUserAccounts, getUserCategories } from '@/app/lib/actions/data-fetching';

const iconMap = {
    Coffee,
    Car,
    LayoutGrid,
    Lightbulb,
    ShoppingBag,
    Pill,
    BookOpen,
    Home,
    DollarSign
};

export default function AddTransactionForm({ onAddTransaction, onCancel }) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [dbAccounts, setDbAccounts] = useState([]);
    const [dbCategories, setDbCategories] = useState([]);

    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        toAmount: '',
        date: new Date().toISOString().split('T')[0],
        type: 'Gasto',
        categoryId: '',
        merchant: '',
        accountId: '', // For expense/income, and source for transfer
        toAccountId: '', // Destination for transfer
        notes: ''
    });

    useEffect(() => {
        const loadInitialData = async () => {
            const [accs, cats] = await Promise.all([
                getUserAccounts(),
                getUserCategories()
            ]);
            setDbAccounts(accs);
            setDbCategories(cats);

            // Set defaults if available
            if (accs.length > 0) setFormData(prev => ({ ...prev, accountId: accs[0].id }));
            if (cats.length > 0) {
                const firstExpenseCat = cats.find(c => c.type === 'expense');
                if (firstExpenseCat) setFormData(prev => ({ ...prev, categoryId: firstExpenseCat.id }));
            }
        };
        loadInitialData();
    }, []);

    const types = [
        { id: 'income', name: 'Ingreso', icon: Plus, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500' },
        { id: 'expense', name: 'Gasto', icon: Minus, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500' },
        { id: 'transfer', name: 'Transferencia', icon: ArrowLeftRight, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500' }
    ];

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        const isTransfer = formData.type === 'Transferencia';

        if (!formData.description || !formData.date || !formData.accountId) {
            alert(t('transactions.addFieldsRequired', 'Por favor complete todos los campos obligatorios'));
            return;
        }

        if (isTransfer) {
            if (!formData.toAccountId || !formData.amount || !formData.toAmount) {
                alert(t('transactions.addFieldsRequired', 'Por favor complete todos los campos obligatorios para la transferencia (ambas cuentas y montos)'));
                return;
            }
            if (formData.accountId === formData.toAccountId) {
                alert('La cuenta origen y destino deben ser distintas');
                return;
            }
        } else if (!formData.amount) {
            alert(t('transactions.addFieldsRequired', 'Por favor complete todos los campos obligatorios'));
            return;
        }

        setLoading(true);
        try {
            if (isTransfer) {
                const result = await createTransfer({
                    description: formData.description,
                    fromAmount: parseFloat(formData.amount),
                    toAmount: parseFloat(formData.toAmount),
                    date: formData.date,
                    fromAccountId: formData.accountId,
                    toAccountId: formData.toAccountId,
                    categoryId: formData.categoryId || undefined,
                    notes: formData.notes || undefined,
                });

                if (result.success) {
                    onAddTransaction(result.data);
                } else {
                    alert(result.error || 'Error al guardar la transferencia');
                }
            } else {
                const amountNum = parseFloat(formData.amount);
                const finalAmount = formData.type === 'Gasto' ? -Math.abs(amountNum) : Math.abs(amountNum);

                const result = await createTransaction({
                    description: formData.description,
                    amount: finalAmount,
                    date: formData.date,
                    accountId: formData.accountId,
                    categoryId: formData.categoryId || undefined,
                    merchant: formData.merchant || undefined,
                    notes: formData.notes || undefined,
                });

                if (result.success) {
                    onAddTransaction(result.data);
                } else {
                    alert(result.error || 'Error al guardar la transacción');
                }
            }
        } catch (error) {
            console.error(error);
            alert('Error inesperado');
        } finally {
            setLoading(false);
        }
    };

    const currentTypeCategories = dbCategories.filter(c => 
        formData.type === 'Ingreso' ? c.type === 'income' : c.type === 'expense'
    );

    return (
        <Dialog open={true} onOpenChange={(open) => { if (!open && !loading) onCancel(); }}>
            <DialogContent className="sm:max-w-[500px] overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{t('transactions.addTitle', 'Añadir Nueva Transacción')}</DialogTitle>
                </DialogHeader>

                <div className="space-y-5 py-4">
                    {/* Type Selector  */}
                    <div className="space-y-2">
                        <Label>{t('transactions.type', 'Tipo de Transacción')}</Label>
                        <div className="grid grid-cols-3 gap-3">
                            {types.map(type => {
                                const Icon = type.icon;
                                const isSelected = formData.type === type.name;
                                return (
                                    <button
                                        key={type.id}
                                        type="button"
                                        disabled={loading}
                                        onClick={() => setFormData({ ...formData, type: type.name })}
                                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-1.5 ${isSelected ? `${type.border} ${type.bg}` : 'border-transparent hover:bg-muted bg-muted/50'}`}
                                    >
                                        <Icon className={`h-5 w-5 ${isSelected ? type.color : 'text-muted-foreground'}`} />
                                        <span className={`text-xs font-semibold ${isSelected ? type.color : 'text-muted-foreground'}`}>{type.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{t('transactions.description', 'Descripción')}*</Label>
                            <Input
                                disabled={loading}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder={formData.type === 'Transferencia' ? "Ej: Cambio P2P USDT a Bs" : "Ej: Supermercado"}
                            />
                        </div>
                        {formData.type === 'Transferencia' ? (
                            <div className="space-y-2">
                                <Label>Monto Enviado (Origen)*</Label>
                                <Input
                                    disabled={loading}
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Label>{t('transactions.amount', 'Monto')}*</Label>
                                <Input
                                    disabled={loading}
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{t('transactions.date', 'Fecha')}*</Label>
                            <Input
                                disabled={loading}
                                type="date"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{formData.type === 'Transferencia' ? 'Cuenta Origen' : t('transactions.account', 'Cuenta')}*</Label>
                            <Select 
                                disabled={loading}
                                value={formData.accountId} 
                                onValueChange={v => setFormData({ ...formData, accountId: v })}
                            >
                                <SelectTrigger><SelectValue placeholder="Selecciona cuenta" /></SelectTrigger>
                                <SelectContent>
                                    {dbAccounts.map(acc => (
                                        <SelectItem key={acc.id} value={acc.id}>{acc.name} ({acc.currency})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {formData.type === 'Transferencia' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Monto Recibido (Destino)*</Label>
                                <Input
                                    disabled={loading}
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.toAmount}
                                    onChange={e => setFormData({ ...formData, toAmount: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Cuenta Destino*</Label>
                                <Select 
                                    disabled={loading}
                                    value={formData.toAccountId} 
                                    onValueChange={v => setFormData({ ...formData, toAccountId: v })}
                                >
                                    <SelectTrigger><SelectValue placeholder="Selecciona cuenta destino" /></SelectTrigger>
                                    <SelectContent>
                                        {dbAccounts.map(acc => (
                                            <SelectItem key={acc.id} value={acc.id}>{acc.name} ({acc.currency})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>{t('transactions.category', 'Categoría')}*</Label>
                        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                            {currentTypeCategories.map(cat => {
                                const Icon = iconMap[cat.icon] || LayoutGrid;
                                const isSelected = formData.categoryId === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        disabled={loading}
                                        onClick={() => setFormData({ ...formData, categoryId: cat.id })}
                                        className={`flex-shrink-0 flex items-center justify-center p-2.5 rounded-lg border-2 transition-all ${isSelected ? 'border-primary bg-primary/10 text-primary' : 'border-border/50 hover:bg-muted bg-card text-muted-foreground'}`}
                                        title={cat.name}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icon className="h-4 w-4" />
                                            {isSelected && <span className="text-xs font-semibold">{cat.name}</span>}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>{t('transactions.merchant', 'Comercio')}</Label>
                        <Input
                            disabled={loading}
                            value={formData.merchant}
                            onChange={e => setFormData({ ...formData, merchant: e.target.value })}
                            placeholder="Ej: Amazon"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>{t('transactions.notes', 'Notas')}</Label>
                        <Input
                            disabled={loading}
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Opcional..."
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" disabled={loading} onClick={onCancel}>
                        {t('common.cancel', 'Cancelar')}
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('common.save', 'Guardar')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}