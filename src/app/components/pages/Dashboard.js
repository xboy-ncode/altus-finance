"use client"

import React, { useState, useEffect } from 'react';

import { 
    PieChart,
    RefreshCw,
    Calendar,
    TrendingUp,
    Filter,
    Maximize2,
    AlertCircle,
    CheckCircle
} from 'lucide-react';

// shadcn/ui imports
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/app/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Badge } from "@/app/components/ui/badge";
import { Skeleton } from "@/app/components/ui/skeleton";
import { showToast, toast } from 'nextjs-toast-notify'
import { 
    Tooltip, 
    TooltipContent, 
    TooltipProvider, 
    TooltipTrigger 
} from "@/app/components/ui/tooltip";

// Import dashboard components (you'll need to update these too)
import OverviewCards from '../dashboard/OverviewCards';
import RecentTransactions from '../dashboard/RecentTransactions';
import ExpenseByCategoryChart from '../dashboard/ExpenseByCategoryChart';
import MonthlyBalanceChart from '../dashboard/MonthlyBalanceChart';
import UpcomingBills from '../dashboard/UpcomingBills';

// Mock data import
import { mockDashboardData } from '../utils/mockData';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [timePeriod, setTimePeriod] = useState('this-month');
    const [lastUpdated, setLastUpdated] = useState(null);


    const fetchData = async (showRefreshIndicator = false) => {
        try {
            if (showRefreshIndicator) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }
            setError(null);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, showRefreshIndicator ? 500 : 800));
            
            setDashboardData(mockDashboardData);
            setLastUpdated(new Date().toLocaleTimeString());
            
            if (showRefreshIndicator) {
                showToast.success("Dashboard actualizado",{
                    
 
                    duration: 3000,
                });
            }
        } catch (err) {
            setError('Error al cargar los datos del dashboard');
showToast.error("Error, No se pudieron cargar los datos del dashboard.",{
               
                duration: 5000,
           
            });
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [timePeriod]);

    const handlePeriodChange = (value) => {
        setTimePeriod(value);
    };
    const handleRefresh = async () => {
        await fetchData(true);
    };

    const renderLoadingSkeleton = () => (
        <div className="p-6 space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-80" />
                        <Skeleton className="h-4 w-40" />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
            
            {/* Overview Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <Card key={i}>
                        <CardHeader className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-32" />
                        </CardHeader>
                    </Card>
                ))}
            </div>
            
            {/* Charts Skeleton */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                <Card className="xl:col-span-3">
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-80 w-full" />
                    </CardContent>
                </Card>
                <Card className="xl:col-span-2">
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-80 w-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    if (isLoading && !dashboardData) {
        return renderLoadingSkeleton();
    }

    if (error && !dashboardData) {
        return (
            <div className="p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error al cargar el dashboard</AlertTitle>
                    <AlertDescription className="mt-2">
                        {error}
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="ml-2"
                            onClick={handleRefresh}
                        >
                            Reintentar
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 min-h-screen">
            {/* Enhanced Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                        <PieChart className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Dashboard Financiero
                        </h1>
                        {lastUpdated && (
                            <p className="text-sm text-muted-foreground">
                                Última actualización: {lastUpdated}
                            </p>
                        )}
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-muted-foreground" />
                                    <Select value={timePeriod} onValueChange={handlePeriodChange}>
                                        <SelectTrigger className="w-48">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="this-month">Este mes</SelectItem>
                                            <SelectItem value="last-month">Mes pasado</SelectItem>
                                            <SelectItem value="last-3-months">Últimos 3 meses</SelectItem>
                                            <SelectItem value="this-year">Este año</SelectItem>
                                            <SelectItem value="last-year">Año pasado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Filtrar por periodo</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button 
                                    onClick={handleRefresh}
                                    disabled={isRefreshing}
                                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                                >
                                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                                    Actualizar
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Actualizar datos</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="mb-6">
                <OverviewCards data={dashboardData?.overview} />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-6">
                <Card className="xl:col-span-3 glass-card border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-500" />
                            Balance Mensual
                        </CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Maximize2 className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Ver en pantalla completa</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardHeader>
                    <CardContent className="h-96">
                        <MonthlyBalanceChart data={dashboardData?.monthlyBalance} />
                    </CardContent>
                </Card>
                
                <Card className="xl:col-span-2 glass-card border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-500 to-orange-500" />
                            Gastos por Categoría
                        </CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Maximize2 className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Ver en pantalla completa</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardHeader>
                    <CardContent className="h-96">
                        <ExpenseByCategoryChart data={dashboardData?.expensesByCategory} />
                    </CardContent>
                </Card>
            </div>

            {/* Data Section */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                <Card className="xl:col-span-3 glass-card border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-gradient-to-br from-green-500 to-blue-500" />
                            Transacciones Recientes
                        </CardTitle>
                        <Button variant="ghost" size="sm">
                            Ver todas
                        </Button>
                    </CardHeader>
                    <CardContent className="h-96 overflow-y-auto">
                        <RecentTransactions transactions={dashboardData?.recentTransactions} />
                    </CardContent>
                </Card>
                
                <Card className="xl:col-span-2 glass-card border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-gradient-to-br from-yellow-500 to-orange-500" />
                            Próximos Pagos
                            <Badge variant="destructive" className="ml-2">
                                {dashboardData?.upcomingBills?.length || 0}
                            </Badge>
                        </CardTitle>
                        <Button variant="ghost" size="sm">
                            Gestionar
                        </Button>
                    </CardHeader>
                    <CardContent className="h-96 overflow-y-auto">
                        <UpcomingBills bills={dashboardData?.upcomingBills} />
                    </CardContent>
                </Card>
            </div>

            {/* Loading Overlay */}
            {isRefreshing && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                    <Card className="p-6">
                        <div className="flex items-center gap-3">
                            <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
                            <div>
                                <p className="font-medium">Actualizando datos...</p>
                                <p className="text-sm text-muted-foreground">Por favor espera un momento</p>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Dashboard;