"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/app/components/ui/dialog';
import PageLoader from '@/app/components/ui/page-loader';
import { useSettings } from '@/app/components/contexts/SettingsContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Calendar, MapPin, Wallet, Briefcase, Plus, Check, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

const TRIPS_MOCK = [
    {
        id: 1,
        destination: 'Tokyo, Japón',
        dateStr: '15 Oct - 30 Oct 2026',
        status: 'upcoming',
        budget: 6000,
        spent: 1200,
        expenses: [
            { name: 'Vuelos', amount: 900, category: 'Transport', color: '#8884d8' },
            { name: 'AirBnb Res.', amount: 300, category: 'Lodging', color: '#82ca9d' },
        ]
    },
    {
        id: 2,
        destination: 'París, Francia',
        dateStr: '10 Feb - 20 Feb 2025',
        status: 'past',
        budget: 3500,
        spent: 3450,
        expenses: [
            { name: 'Vuelos', amount: 800, category: 'Transport', color: '#8884d8' },
            { name: 'Hotel', amount: 1200, category: 'Lodging', color: '#82ca9d' },
            { name: 'Comida', amount: 900, category: 'Food', color: '#ffc658' },
            { name: 'Tours', amount: 550, category: 'Activities', color: '#ff8042' },
        ]
    }
];

export default function TravelPlannerPage() {
    const { formatCurrency } = useSettings();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [trips, setTrips] = useState(TRIPS_MOCK);
    
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newTrip, setNewTrip] = useState({ destination: '', dateStr: '', budget: '' });

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleAddTrip = () => {
        if (!newTrip.destination || !newTrip.budget) return;
        setTrips(prev => [{
            id: Date.now(),
            destination: newTrip.destination,
            dateStr: newTrip.dateStr || 'TBD',
            status: 'upcoming',
            budget: parseFloat(newTrip.budget) || 0,
            spent: 0,
            expenses: []
        }, ...prev]);
        setNewTrip({ destination: '', dateStr: '', budget: '' });
        setIsAddOpen(false);
    };

    return (
        <PageLoader loading={isLoading} message={t('common.loading')}>
            <div className="p-6 max-w-7xl mx-auto space-y-8 pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/80 to-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                            <Plane className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{t('nav.travel')}</h1>
                            <p className="text-sm text-muted-foreground">{trips.length} {t('travel.tripsLogged', 'viajes registrados')}</p>
                        </div>
                    </div>
                    <Button onClick={() => setIsAddOpen(true)} className="gap-2 group">
                        <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                        {t('travel.newTrip', 'Nuevo Viaje')}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Trips List Area (Takes up 2 cols on lg) */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-semibold">{t('travel.upcoming', 'Mis Viajes')}</h2>
                        <AnimatePresence>
                            {trips.length === 0 ? (
                                <div className="py-20 text-center border-2 border-dashed rounded-xl">
                                    <Briefcase className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                                    <h3 className="font-semibold text-lg">{t('travel.noTrips', 'Aún no hay viajes')}</h3>
                                    <p className="text-muted-foreground">{t('travel.noTripsSub', 'Planifica tu próxima aventura.')}</p>
                                </div>
                            ) : (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {trips.map((trip, i) => {
                                        const progress = trip.budget > 0 ? (trip.spent / trip.budget) * 100 : 0;
                                        const isOverBudget = progress > 100;
                                        
                                        return (
                                            <motion.div
                                                key={trip.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                            >
                                                <Card className="group hover:border-primary/50 transition-colors cursor-pointer shadow-sm relative overflow-hidden h-full flex flex-col">
                                                    {trip.status === 'past' && <div className="absolute inset-0 bg-muted/20 z-0 pointer-events-none" />}
                                                    <CardContent className="p-5 relative z-10 flex-1 flex flex-col">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div>
                                                                <h3 className="font-semibold text-lg flex items-center gap-1.5">
                                                                    <MapPin className="h-4 w-4 text-primary" />
                                                                    {trip.destination}
                                                                </h3>
                                                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                                    <Calendar className="h-3 w-3" />
                                                                    {trip.dateStr}
                                                                </p>
                                                            </div>
                                                            <Badge variant={trip.status === 'upcoming' ? 'default' : 'secondary'} className="capitalize text-[10px]">
                                                                {trip.status === 'upcoming' ? t('travel.upcomingBadge', 'Futuro') : t('travel.pastBadge', 'Pasado')}
                                                            </Badge>
                                                        </div>

                                                        <div className="mt-auto pt-4 space-y-3 border-t border-border/50">
                                                            <div className="flex justify-between items-end">
                                                                <div>
                                                                    <p className="text-xs text-muted-foreground mb-0.5">{t('travel.spent', 'Gastado')}</p>
                                                                    <p className={`font-semibold ${isOverBudget ? 'text-destructive' : ''}`}>{formatCurrency(trip.spent)}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-xs text-muted-foreground mb-0.5">{t('travel.budget', 'Presupuesto')}</p>
                                                                    <p className="font-medium text-sm">{formatCurrency(trip.budget)}</p>
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Progress line */}
                                                            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                                                <div 
                                                                    className={`h-full ${isOverBudget ? 'bg-destructive' : 'bg-primary'} rounded-full transition-all`}
                                                                    style={{ width: `${Math.min(100, progress)}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Overview Column */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold opacity-0 select-none hidden lg:block">Overview</h2>
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Wallet className="h-4 w-4 text-primary" /> 
                                    {t('travel.globalBudget', 'Presupuesto Global')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Global Chart (Using first trip as mock) */}
                                    {trips.length > 0 && trips[0].expenses.length > 0 ? (
                                        <div className="h-[200px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={trips[0].expenses}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={50}
                                                        outerRadius={80}
                                                        paddingAngle={2}
                                                        dataKey="amount"
                                                    >
                                                        {trips[0].expenses.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <p className="text-xs text-center text-muted-foreground -mt-4">{t('travel.chartDesc', 'Desglose del próximo viaje')}</p>
                                        </div>
                                    ) : (
                                        <div className="h-[200px] flex items-center justify-center border border-dashed rounded-lg">
                                            <p className="text-sm text-muted-foreground">{t('travel.noData', 'Sin datos gráficos')}</p>
                                        </div>
                                    )}

                                    {trips.length > 0 && (
                                        <div className="space-y-2 pt-4 border-t">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-muted-foreground">{t('travel.totalTrips', 'Total de viajes')}</span>
                                                <span className="font-semibold">{trips.length}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-muted-foreground">{t('travel.totalBudgeted', 'Total presupuestado')}</span>
                                                <span className="font-semibold">{formatCurrency(trips.reduce((a, t) => a + t.budget, 0))}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('travel.addTitle', 'Crear Nuevo Viaje')}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>{t('travel.destination', 'Destino')}</Label>
                                <Input placeholder="Ej: Nueva York" value={newTrip.destination} onChange={e => setNewTrip({...newTrip, destination: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('travel.dates', 'Fechas (Aproximadas)')}</Label>
                                <Input placeholder="Ej: Octubre 2026" value={newTrip.dateStr} onChange={e => setNewTrip({...newTrip, dateStr: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('travel.budget', 'Presupuesto Total')}</Label>
                                <Input type="number" placeholder="0" value={newTrip.budget} onChange={e => setNewTrip({...newTrip, budget: e.target.value})} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>{t('common.cancel')}</Button>
                            <Button onClick={handleAddTrip}>{t('common.save')}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </PageLoader>
    );
}
