"use client"

import React, { useState, useEffect } from 'react';
import { 
    PieChart,
    RefreshCw,
    Calendar,
} from 'lucide-react';
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/app/components/ui/select";
import { 
    Tooltip, 
    TooltipContent, 
    TooltipProvider, 
    TooltipTrigger 
} from "@/app/components/ui/tooltip";
import PageLoader from './components/ui/page-loader';

import OverviewCards from './components/dashboard/OverviewCards';
import RecentTransactions from './components/dashboard/RecentTransactions';
import ExpenseByCategoryChart from './components/dashboard/ExpenseByCategoryChart';
import MonthlyBalanceChart from './components/dashboard/MonthlyBalanceChart';
import UpcomingBills from './components/dashboard/UpcomingBills';
import { mockDashboardData } from './components/utils/mockData';
import { useSettings } from './components/contexts/SettingsContext';
import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [timePeriod, setTimePeriod] = useState('this-month');
    const [lastUpdated, setLastUpdated] = useState(null);
    const { formatDate } = useSettings();
    const { t } = useTranslation();

    const fetchData = async (showRefreshIndicator = false) => {
        try {
            if (showRefreshIndicator) setIsRefreshing(true);
            else setIsLoading(true);
            
            await new Promise(resolve => setTimeout(resolve, 400));
            setDashboardData(mockDashboardData);
            setLastUpdated(new Date().toLocaleTimeString());
        } catch (err) {
            // Error handled silently for now
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [timePeriod]);

    return (
        <PageLoader loading={isLoading && !dashboardData} message={t('dashboard.loading')}>
            <div className="p-6 space-y-6 min-h-screen">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/80 to-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                            <PieChart className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
                            <p className="text-sm text-muted-foreground">{t('dashboard.updated')}: {lastUpdated}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <Select value={timePeriod} onValueChange={setTimePeriod}>
                            <SelectTrigger className="w-48">
                                <Calendar className="h-4 w-4 mr-2" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="this-month">{t('dashboard.thisMonth')}</SelectItem>
                                <SelectItem value="this-year">{t('dashboard.thisYear')}</SelectItem>
                            </SelectContent>
                        </Select>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button 
                                        onClick={() => fetchData(true)} 
                                        disabled={isRefreshing}
                                        variant="outline"
                                        size="icon"
                                    >
                                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Actualizar datos</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                <OverviewCards data={dashboardData?.overview} />

                <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                    <Card className="xl:col-span-3 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader><CardTitle>{t('dashboard.monthlyBalanceTitle')}</CardTitle></CardHeader>
                        <CardContent className="h-96"><MonthlyBalanceChart data={dashboardData?.monthlyBalance} /></CardContent>
                    </Card>
                    
                    <Card className="xl:col-span-2 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader><CardTitle>{t('dashboard.expenseByCategoryTitle')}</CardTitle></CardHeader>
                        <CardContent className="h-96"><ExpenseByCategoryChart data={dashboardData?.expensesByCategory} /></CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                    <Card className="xl:col-span-3 shadow-sm">
                        <CardHeader><CardTitle>{t('dashboard.recentTransactionsTitle')}</CardTitle></CardHeader>
                        <CardContent className="h-96 overflow-y-auto"><RecentTransactions transactions={dashboardData?.recentTransactions} /></CardContent>
                    </Card>
                    <Card className="xl:col-span-2 shadow-sm">
                        <CardHeader><CardTitle>{t('dashboard.upcomingBillsTitle')}</CardTitle></CardHeader>
                        <CardContent className="h-96 overflow-y-auto"><UpcomingBills bills={dashboardData?.upcomingBills} /></CardContent>
                    </Card>
                </div>
            </div>
        </PageLoader>
    );
}