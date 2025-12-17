import React, { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { X } from 'lucide-react';

const AddBillForm = ({ onAddBill, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        dueDate: '',
        icon: '📝',
        color: '#e6f7ee'
    });

    const icons = ['📝', '🏠', '💡', '💧', '📱', '🚗', '💻', '📺', '🔌', '🏥'];
    const colors = ['#e6f7ee', '#e8f4fd', '#fff8e1', '#f5e6ff', '#ffe9e9', '#e6f2ff', '#fff0e6', '#e6ffe6'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();

        // Validate form
        if (!formData.name || !formData.amount || !formData.dueDate) {
            alert('Por favor complete todos los campos obligatorios');
            return;
        }

        // Create new bill object
        const newBill = {
            id: Date.now().toString(),
            name: formData.name,
            amount: parseFloat(formData.amount),
            dueDate: formData.dueDate,
            icon: formData.icon,
            color: formData.color,
            isPaid: false
        };

        onAddBill(newBill);
        onCancel(); // Close form after submit
    };

    // Close form when clicking outside
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={handleOverlayClick}
        >
            <Card className="w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Añadir Nuevo Pago</h3>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onCancel}
                        className="h-8 w-8"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ej: Luz, Agua, Internet..."
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount">Importe (€)</Label>
                        <Input
                            id="amount"
                            name="amount"
                            type="number"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dueDate">Fecha de Vencimiento</Label>
                        <Input
                            id="dueDate"
                            name="dueDate"
                            type="date"
                            value={formData.dueDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Icono</Label>
                        <div className="grid grid-cols-5 gap-2">
                            {icons.map(icon => (
                                <button
                                    key={icon}
                                    type="button"
                                    className={`p-3 rounded-md text-lg hover:bg-accent transition-colors ${
                                        formData.icon === icon ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                    }`}
                                    onClick={() => setFormData(prev => ({ ...prev, icon }))}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Color</Label>
                        <div className="grid grid-cols-4 gap-2">
                            {colors.map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    className={`w-10 h-10 rounded-md border-2 transition-all ${
                                        formData.color === color ? 'border-primary ring-2 ring-primary/20' : 'border-muted-foreground/20'
                                    }`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                        >
                            Guardar
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default AddBillForm;