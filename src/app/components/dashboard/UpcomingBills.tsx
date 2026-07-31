import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/app/components/ui/dialog';
import { Calendar} from '@/app/components/ui/calendar'
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Plus, Home, Zap, Wifi, Car, FileText, Calendar as CalendarIcon, Trash2, Check, X } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from 'react-i18next';
import { addBill, deleteBill, markBillAsPaid } from '@/lib/actions/bills';

const AddBillForm = ({ onAddBill, onCancel }) => {
    const { t } = useTranslation();

const [date, setDate] = React.useState<Date | undefined>(new Date())

    
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        dueDate: '',
        iconType: 'file'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddBill({
            ...formData,
            id: Date.now(),
            amount: parseFloat(formData.amount),
            isPaid: false,
            color: 'bg-primary/10 text-primary'
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
                <Label htmlFor="amount">Cantidad ($)</Label>
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
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selected) => {
                        setDate(selected);
                        setFormData({ ...formData, dueDate: selected ? selected.toISOString() : '' });
                    }}
                    className="rounded-lg border"
                />
                <Input
                    id="dueDate"
                    readOnly
                    value={formData.dueDate ? new Date(formData.dueDate).toLocaleDateString('es-ES') : ''}
                    placeholder="Selecciona una fecha"
                />
            </div>
            <div className="flex gap-2">
                <Button onClick={handleSubmit} className="flex-1">
                    {t('common.add')}
                </Button>
                <Button onClick={onCancel} variant="outline" className="flex-1">
                    {t('common.cancel')}
                </Button>
            </div>
        </div>
    );
};

const UpcomingBills = ({ bills = [] }) => {
    const [billsList, setBillsList] = useState(bills);
    const [showAddForm, setShowAddForm] = useState(false);
    const { formatCurrency, formatDate } = useSettings();
    const { t } = useTranslation();

    const getDaysRemaining = (dueDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);
        const diffTime = due.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getPaymentStatus = (dueDate: string, isPaid: boolean): { status: string; variant: "default" | "secondary" | "destructive" | "outline" } => {
        if (isPaid) return { status: 'paid', variant: 'default' };
        const daysRemaining = getDaysRemaining(dueDate);
        if (daysRemaining < 0) return { status: 'overdue', variant: 'destructive' };
        if (daysRemaining <= 3) return { status: 'due-soon', variant: 'outline' };
        return { status: 'upcoming', variant: 'secondary' };
    };

    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    // Sincronizar billsList si los bills del servidor cambian
    React.useEffect(() => {
        setBillsList(bills);
    }, [bills]);

    const handleAddBill = async (newBill) => {
        // Optimistic update
        setBillsList(prevBills => [...prevBills, { ...newBill, isPaid: false }]);
        
        const res = await addBill(newBill);
        if (res.success && res.bill) {
            router.refresh();
        } else {
            console.error('Error adding bill:', res.error);
            router.refresh(); // revert
        }
    };

    const handleDeleteBill = async (id: string) => {
        setBillsList(prevBills => prevBills.filter(b => b.id !== id));
        const res = await deleteBill(id);
        if (res.success) {
            router.refresh();
        } else {
            router.refresh();
        }
    };

    const handleTogglePaid = async (id: string, currentIsPaid: boolean) => {
        setBillsList(prevBills => prevBills.map(b => b.id === id ? { ...b, isPaid: !currentIsPaid } : b));
        const res = await markBillAsPaid(id, !currentIsPaid);
        if (res.success) {
            router.refresh();
        } else {
            router.refresh();
        }
    };

    const ICON_MAP = {
        home: Home,
        zap: Zap,
        wifi: Wifi,
        car: Car,
        file: FileText
    };

    return (
        <div className="space-y-3">
            {billsList.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                    {t('dashboard.noUpcomingBills')}
                </div>
            ) : (
                billsList.map((bill) => {
                    const { status, variant } = getPaymentStatus(bill.dueDate, bill.isPaid);
                    const daysRemaining = getDaysRemaining(bill.dueDate);

                    const getStatusText = () => {
                        if (status === 'paid') return t('dashboard.paid');
                        if (status === 'overdue') return t('dashboard.overdue');
                        return t('dashboard.inDays', { count: daysRemaining });
                    };

                    const IconComponent = ICON_MAP[bill.iconType] || FileText;

                    return (
                        <div key={bill.id} className="flex items-center justify-between p-3.5 bg-card border shadow-sm rounded-xl hover:shadow-md transition-all group">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${bill.color || 'bg-muted text-muted-foreground'}`}
                                >
                                    <IconComponent className="h-5 w-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <div className="font-semibold text-sm group-hover:text-primary transition-colors">{bill.name}</div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                                        <CalendarIcon className="h-3 w-3" />
                                        {formatDate(bill.dueDate)}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-right space-y-1">
                                    <div className="font-semibold text-sm">
                                        {formatCurrency(bill.amount)}
                                    </div>
                                    <Badge variant={variant} className="text-xs">
                                        {getStatusText()}
                                    </Badge>
                                </div>
                                <div className="flex flex-col gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-6 w-6 text-green-600 hover:text-green-700 hover:bg-green-100" 
                                        title={bill.isPaid ? 'Marcar como no pagado' : 'Marcar como pagado'}
                                        onClick={() => handleTogglePaid(bill.id, bill.isPaid)}
                                    >
                                        {bill.isPaid ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-6 w-6 text-red-600 hover:text-red-700 hover:bg-red-100" 
                                        title="Eliminar pago"
                                        onClick={() => handleDeleteBill(bill.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}

            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                <DialogTrigger asChild>
                    <Button className="w-full mt-3" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        {t('dashboard.addBill')}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('dashboard.addNewBill')}</DialogTitle>
                        <DialogDescription>
                            {t('dashboard.enterBillDetails')}
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