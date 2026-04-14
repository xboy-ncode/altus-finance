import React from 'react';
import { Badge } from '@/app/components/ui/badge';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from 'react-i18next';

const RecentTransactions = ({ transactions = [] }) => {
    const { formatCurrency, formatDate } = useSettings();
    const { t } = useTranslation();

    return (
        <div className="space-y-3">
            {transactions.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                    {t('transactions.noTransactions')}
                </div>
            ) : (
                transactions.map((transaction) => {
                    const isIncome = transaction.type === 'income';
                    const Icon = isIncome ? ArrowUpRight : ArrowDownRight;
                    const iconBgColor = isIncome ? 'bg-green-50' : 'bg-red-50';
                    const iconColor = isIncome ? 'text-green-600' : 'text-red-600';

                    return (
                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBgColor}`}>
                                    <Icon className={`h-5 w-5 ${iconColor}`} />
                                </div>
                                <div>
                                    <div className="font-medium text-sm">
                                        {transaction.description}
                                    </div>
                                    <Badge variant="outline" className="mt-1 text-xs">
                                        {transaction.category}
                                    </Badge>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`font-semibold text-sm ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                                    {isIncome ? '+' : '-'} {formatCurrency(Math.abs(transaction.amount))}
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                    {formatDate(transaction.date)}
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default RecentTransactions;