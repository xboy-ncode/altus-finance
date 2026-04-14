import React, { useState } from 'react';
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
    X
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
import { Badge } from '@/app/components/ui/badge';
import { useTranslation } from 'react-i18next';

export default function AddTransactionForm({ onAddTransaction, onCancel }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        type: 'Gasto',
        category: 'Otros',
        merchant: '',
        account: 'Efectivo',
        notes: '',
        tags: []
    });

    const [tagInput, setTagInput] = useState('');

    const categories = [
        { name: 'Alimentación', icon: Coffee },
        { name: 'Transporte', icon: Car },
        { name: 'Entretenimiento', icon: LayoutGrid },
        { name: 'Servicios', icon: Lightbulb },
        { name: 'Compras', icon: ShoppingBag },
        { name: 'Salud', icon: Pill },
        { name: 'Educación', icon: BookOpen },
        { name: 'Vivienda', icon: Home },
        { name: 'Otros', icon: LayoutGrid }
    ];

    const types = [
        { name: 'Ingreso', icon: Plus, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500' },
        { name: 'Gasto', icon: Minus, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500' },
        { name: 'Transferencia', icon: ArrowLeftRight, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500' }
    ];

    const accounts = ['Efectivo', 'Tarjeta de Crédito', 'Tarjeta de Débito', 'Cuenta Bancaria', 'Otro'];

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        
        if (!formData.description || !formData.amount || !formData.date || !formData.type || !formData.category) {
            alert(t('transactions.addFieldsRequired', 'Por favor complete todos los campos obligatorios'));
            return;
        }

        const newTransaction = {
            id: Date.now().toString(),
            description: formData.description,
            amount: parseFloat(formData.amount) * (formData.type === 'Gasto' ? -1 : 1),
            date: formData.date,
            type: formData.type,
            category: formData.category,
            merchant: formData.merchant || null,
            account: formData.account,
            notes: formData.notes || null,
            tags: formData.tags.length > 0 ? formData.tags : null
        };

        onAddTransaction(newTransaction);
    };

    return (
        <Dialog open={true} onOpenChange={(open) => { if (!open) onCancel(); }}>
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
                                        key={type.name}
                                        type="button"
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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{t('transactions.description', 'Descripción')}*</Label>
                            <Input
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Ej: Supermercado"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('transactions.amount', 'Monto')}*</Label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{t('transactions.date', 'Fecha')}*</Label>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('transactions.account', 'Cuenta')}*</Label>
                            <Select value={formData.account} onValueChange={v => setFormData({ ...formData, account: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {accounts.map(acc => <SelectItem key={acc} value={acc}>{acc}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>{t('transactions.category', 'Categoría')}*</Label>
                        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                            {categories.map(cat => {
                                const Icon = cat.icon;
                                const isSelected = formData.category === cat.name;
                                return (
                                    <button
                                        key={cat.name}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, category: cat.name })}
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
                            value={formData.merchant}
                            onChange={e => setFormData({ ...formData, merchant: e.target.value })}
                            placeholder="Ej: Amazon"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>{t('transactions.notes', 'Notas')}</Label>
                        <Input
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Opcional..."
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onCancel}>{t('common.cancel', 'Cancelar')}</Button>
                    <Button onClick={handleSubmit}>{t('common.save', 'Guardar')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}