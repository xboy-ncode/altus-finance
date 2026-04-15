"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Label } from '@/app/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/app/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import PageLoader from '@/app/components/ui/page-loader';
import { useSettings } from '@/app/components/contexts/SettingsContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, MoreVertical, Edit, Trash2, Heart, Car, MapPin, Laptop, ShieldAlert, Sparkles } from 'lucide-react';

// Reusable animated progress bar
const AnimatedProgress = ({ value, colorClass }) => {
    return (
        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-2.5 rounded-full ${colorClass}`}
            />
        </div>
    );
};

const ICONS = {
    car: { icon: Car, label: 'Vehículo', bg: 'bg-blue-500/10', color: 'text-blue-500', fill: 'bg-blue-500' },
    travel: { icon: MapPin, label: 'Viaje', bg: 'bg-emerald-500/10', color: 'text-emerald-500', fill: 'bg-emerald-500' },
    tech: { icon: Laptop, label: 'Tecnología', bg: 'bg-indigo-500/10', color: 'text-indigo-500', fill: 'bg-indigo-500' },
    emergency: { icon: ShieldAlert, label: 'Emergencia', bg: 'bg-rose-500/10', color: 'text-rose-500', fill: 'bg-rose-500' },
    custom: { icon: Sparkles, label: 'Personalizado', bg: 'bg-amber-500/10', color: 'text-amber-500', fill: 'bg-amber-500' },
};

export default function WishlistsPage() {
    const { formatCurrency } = useSettings();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);

    const [goals, setGoals] = useState([
        { id: 1, name: 'Viaje a Japón', target: 5000, current: 2100, type: 'travel' },
        { id: 2, name: 'Fondo de Emergencia', target: 10000, current: 8500, type: 'emergency' },
        { id: 3, name: 'MacBook Pro', target: 2400, current: 600, type: 'tech' },
        { id: 4, name: 'Enganche Coche', target: 15000, current: 2000, type: 'car' },
    ]);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [formData, setFormData] = useState({ name: '', target: '', current: '', type: 'custom' });

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const openCreate = () => {
        setFormData({ name: '', target: '', current: '', type: 'custom' });
        setEditingGoal(null);
        setIsDialogOpen(true);
    };

    const openEdit = (goal) => {
        setFormData({ name: goal.name, target: goal.target, current: goal.current, type: goal.type });
        setEditingGoal(goal);
        setIsDialogOpen(true);
    };

    const handleSave = () => {
        if (!formData.name || !formData.target) return;
        
        const newGoal = {
            id: editingGoal ? editingGoal.id : Date.now(),
            name: formData.name,
            target: parseFloat(formData.target) || 0,
            current: parseFloat(formData.current) || 0,
            type: formData.type,
        };

        if (editingGoal) {
            setGoals(prev => prev.map(g => g.id === editingGoal.id ? newGoal : g));
        } else {
            setGoals(prev => [...prev, newGoal]);
        }
        setIsDialogOpen(false);
    };

    const handleDelete = () => {
        if (editingGoal) {
            setGoals(prev => prev.filter(g => g.id !== editingGoal.id));
            setIsDeleteDialogOpen(false);
            setEditingGoal(null);
        }
    };

    const totalTarget = goals.reduce((acc, g) => acc + g.target, 0);
    const totalCurrent = goals.reduce((acc, g) => acc + g.current, 0);
    const globalProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

    return (
        <PageLoader loading={isLoading} message={t('common.loading')}>
            <div className="p-6 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/80 to-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                            <Target className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{t('nav.wishlists')}</h1>
                            <p className="text-sm text-muted-foreground">{goals.length} {t('wishlists.activeGoals', 'metas activas')}</p>
                        </div>
                    </div>
                    <Button onClick={openCreate} className="gap-2 shadow-sm relative overflow-hidden group">
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        <Plus className="h-4 w-4 relative z-10" />
                        <span className="relative z-10">{t('wishlists.newGoal', 'Nueva Meta')}</span>
                    </Button>
                </div>

                {/* Overview Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">{t('wishlists.totalSaved', 'Total Ahorrado')}</p>
                                    <h2 className="text-3xl font-bold tracking-tight">{formatCurrency(totalCurrent)}</h2>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">{t('wishlists.of', 'de')} {formatCurrency(totalTarget)}</p>
                                </div>
                            </div>
                            <AnimatedProgress value={globalProgress} colorClass="bg-primary" />
                            <p className="text-xs text-muted-foreground mt-2 font-medium">{globalProgress.toFixed(1)}% {t('wishlists.completed', 'completado')}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Goals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {goals.length === 0 ? (
                            <div className="col-span-full py-20 text-center flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                    <Target className="h-8 w-8 text-muted-foreground/50" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{t('wishlists.noGoals', 'Sin Metas Establecidas')}</h3>
                                <p className="text-muted-foreground mb-6 max-w-sm">
                                    {t('wishlists.emptySubtitle', 'Empieza a planificar tu futuro creando una nueva meta financiera.')}
                                </p>
                                <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />{t('wishlists.newGoal', 'Nueva Meta')}</Button>
                            </div>
                        ) : (
                            goals.map((goal, i) => {
                                const cfg = ICONS[goal.type] || ICONS.custom;
                                const Icon = cfg.icon;
                                const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
                                const isComplete = progress >= 100;

                                return (
                                    <motion.div
                                        key={goal.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Card className={`group relative overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col ${isComplete ? 'border-emerald-500/50' : ''}`}>
                                            {isComplete && (
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full -mr-4 -mt-4 z-0 pointer-events-none" />
                                            )}
                                            <CardContent className="p-6 flex-1 flex flex-col relative z-10">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.bg}`}>
                                                            <Icon className={`h-5 w-5 ${cfg.color}`} />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-base line-clamp-1">{goal.name}</h3>
                                                            {isComplete ? (
                                                                <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-200 bg-emerald-50">{t('wishlists.achieved', 'Logrado')}</Badge>
                                                            ) : (
                                                                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{cfg.label}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-2">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => openEdit(goal)}>
                                                                <Edit className="h-4 w-4 mr-2" /> {t('common.edit')}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => {
                                                                setEditingGoal(goal);
                                                                setIsDeleteDialogOpen(true);
                                                            }}>
                                                                <Trash2 className="h-4 w-4 mr-2" /> {t('common.delete')}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>

                                                <div className="mt-auto space-y-4">
                                                    <div className="flex items-end justify-between">
                                                        <div>
                                                            <p className={`text-2xl font-bold tracking-tight ${isComplete ? 'text-emerald-600' : ''}`}>
                                                                {formatCurrency(goal.current)}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {t('wishlists.target', 'Meta')}: {formatCurrency(goal.target)}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className={`text-xl font-semibold opacity-30 ${isComplete ? 'text-emerald-600' : ''}`}>
                                                                {progress.toFixed(0)}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    <AnimatedProgress 
                                                        value={progress} 
                                                        colorClass={isComplete ? 'bg-emerald-500' : cfg.fill} 
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })
                        )}
                    </AnimatePresence>
                </div>

                {/* Dialog Save Goal */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingGoal ? t('wishlists.editGoal', 'Editar Meta') : t('wishlists.newGoal', 'Nueva Meta')}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>{t('wishlists.goalName', 'Nombre de la Meta')}</Label>
                                <Input 
                                    placeholder="Ej: Viaje a Europa" 
                                    value={formData.name} 
                                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>{t('wishlists.targetAmount', 'Monto Objetivo')}</Label>
                                    <Input 
                                        type="number" 
                                        placeholder="5000" 
                                        value={formData.target} 
                                        onChange={e => setFormData({ ...formData, target: e.target.value })} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('wishlists.currentAmount', 'Monto Actual')}</Label>
                                    <Input 
                                        type="number" 
                                        placeholder="0" 
                                        value={formData.current} 
                                        onChange={e => setFormData({ ...formData, current: e.target.value })} 
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 pt-2">
                                <Label>{t('wishlists.category', 'Categoría Visual')}</Label>
                                <div className="flex gap-2 p-1 overflow-x-auto hide-scrollbar">
                                    {Object.entries(ICONS).map(([key, cfg]) => {
                                        const Icon = cfg.icon;
                                        const isSelected = formData.type === key;
                                        return (
                                            <button
                                                key={key}
                                                onClick={() => setFormData({ ...formData, type: key })}
                                                className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl border-2 transition-all ${isSelected ? `border-${cfg.fill.replace('bg-', '')} ${cfg.bg}` : 'border-transparent hover:bg-muted bg-muted/50'}`}
                                                type="button"
                                                title={cfg.label}
                                            >
                                                <Icon className={`h-5 w-5 ${isSelected ? cfg.color : 'text-muted-foreground'}`} />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{t('common.cancel')}</Button>
                            <Button onClick={handleSave}>{t('common.save')}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Dialog Delete Goal */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-destructive font-semibold">{t('wishlists.deleteGoal', 'Eliminar Meta')}</DialogTitle>
                        </DialogHeader>
                        <p className="text-sm">{t('wishlists.confirmDelete', '¿Eliminar la meta')} <strong>{editingGoal?.name}</strong>?</p>
                        <p className="text-xs text-muted-foreground">{t('common.cannotUndo')}</p>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>{t('common.cancel')}</Button>
                            <Button variant="destructive" onClick={handleDelete}>{t('common.delete')}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </PageLoader>
    );
}
