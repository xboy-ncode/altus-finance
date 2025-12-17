import React, { useState } from 'react';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Plus } from 'lucide-react';

const AddBillForm = ({ onAddBill, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        dueDate: '',
        icon: '📝'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddBill({
            ...formData,
            id: Date.now(),
            amount: parseFloat(formData.amount),
            isPaid: false,
            color: '#e6f7ee'
        });
        onCancel();
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Luz, Gas, Agua..."
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="amount">Cantidad (€)</Label>
                <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="dueDate">Fecha de vencimiento</Label>
                <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
            </div>
            <div className="flex gap-2">
                <Button onClick={handleSubmit} className="flex-1">
                    Añadir
                </Button>
                <Button onClick={onCancel} variant="outline" className="flex-1">
                    Cancelar
                </Button>
            </div>
        </div>
    );
};

const UpcomingBills = ({ bills = [] }) => {
    const [billsList, setBillsList] = useState(bills);
    const [showAddForm, setShowAddForm] = useState(false);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: '2-digit'
        }).format(date);
    };

    const getDaysRemaining = (dueDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);
        const diffTime = due - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getPaymentStatus = (dueDate, isPaid) => {
        if (isPaid) return { status: 'paid', variant: 'success' };
        const daysRemaining = getDaysRemaining(dueDate);
        if (daysRemaining < 0) return { status: 'overdue', variant: 'destructive' };
        if (daysRemaining <= 3) return { status: 'due-soon', variant: 'warning' };
        return { status: 'upcoming', variant: 'secondary' };
    };

    const handleAddBill = (newBill) => {
        setBillsList(prevBills => [...prevBills, newBill]);
    };

    return (
        <div className="space-y-3">
            {billsList.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                    No hay pagos pendientes
                </div>
            ) : (
                billsList.map((bill) => {
                    const { status, variant } = getPaymentStatus(bill.dueDate, bill.isPaid);
                    const daysRemaining = getDaysRemaining(bill.dueDate);

                    const getStatusText = () => {
                        if (status === 'paid') return 'Pagado';
                        if (status === 'overdue') return 'Vencido';
                        return `En ${daysRemaining} días`;
                    };

                    return (
                        <div key={bill.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-base"
                                    style={{ backgroundColor: bill.color || '#e6f7ee' }}
                                >
                                    {bill.icon || '📝'}
                                </div>
                                <div>
                                    <div className="font-medium text-sm">{bill.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                        Vence: {formatDate(bill.dueDate)}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right space-y-1">
                                <div className="font-semibold text-sm">
                                    {formatCurrency(bill.amount)}
                                </div>
                                <Badge variant={variant} className="text-xs">
                                    {getStatusText()}
                                </Badge>
                            </div>
                        </div>
                    );
                })
            )}

            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                <DialogTrigger asChild>
                    <Button className="w-full mt-3" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Añadir Pago
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Añadir Nuevo Pago</DialogTitle>
                        <DialogDescription>
                            Ingresa los detalles del pago que deseas agregar
                        </DialogDescription>
                    </DialogHeader>
                    <AddBillForm
                        onAddBill={handleAddBill}
                        onCancel={() => setShowAddForm(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UpcomingBills;