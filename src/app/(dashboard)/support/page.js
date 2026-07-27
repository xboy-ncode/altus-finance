"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Label } from '@/app/components/ui/label';
import {
    LifeBuoy,
    MessageCircle,
    Mail,
    FileText,
    ExternalLink,
    Search,
    ChevronRight,
    HelpCircle,
    BookOpen,
    ShieldCheck
} from 'lucide-react';
import PageLoader from '@/app/components/ui/page-loader';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function SupportPage() {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const categories = [
        {
            title: t('support.categories.gettingStarted'),
            icon: BookOpen,
            description: t('support.categories.gettingStartedDesc'),
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            title: t('support.categories.security'),
            icon: ShieldCheck,
            description: t('support.categories.securityDesc'),
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        },
        {
            title: t('support.categories.features'),
            icon: HelpCircle,
            description: t('support.categories.featuresDesc'),
            color: 'text-amber-500',
            bg: 'bg-amber-500/10'
        }
    ];

    const faqs = t('support.faqs', { returnObjects: true });

    return (
        <PageLoader loading={isLoading} message={t('common.loading')}>
            <div className="p-6 max-w-5xl mx-auto space-y-8 pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/80 to-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                            <LifeBuoy className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{t('support.title')}</h1>
                            <p className="text-sm text-muted-foreground">{t('support.subtitle')}</p>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <Card className="border-none shadow-md bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
                    <CardContent className="p-8">
                        <div className="max-w-2xl mx-auto text-center space-y-4">
                            <h2 className="text-2xl font-bold">{t('support.searchTitle')}</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input 
                                    className="pl-10 h-12 text-lg shadow-sm border-primary/20 focus-visible:ring-primary" 
                                    placeholder={t('support.searchPlaceholder')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Help Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="hover:shadow-md transition-all cursor-pointer group border-border/50">
                                <CardContent className="p-6 space-y-4">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${cat.bg}`}>
                                        <cat.icon className={`h-6 w-6 ${cat.color}`} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{cat.title}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{cat.description}</p>
                                    </div>
                                    <Button variant="ghost" className="w-full justify-between p-0 hover:bg-transparent text-primary">
                                        {t('support.viewArticles')} <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <HelpCircle className="h-5 w-5 text-primary" />
                            {t('support.faqTitle')}
                        </h3>
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <Card key={i} className="border-border/50">
                                    <CardHeader className="p-4 pb-2">
                                        <CardTitle className="text-base font-semibold">{faq.q}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <p className="text-sm text-muted-foreground">{faq.a}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xl font-bold">{t('support.contactUs')}</h3>
                        <div className="grid gap-4">
                            <Card className="bg-primary text-primary-foreground border-none shadow-lg shadow-primary/20 overflow-hidden relative group">
                                <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                                <CardContent className="p-6 relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <MessageCircle className="h-6 w-6" />
                                        <h4 className="font-bold">{t('support.liveChat')}</h4>
                                    </div>
                                    <p className="text-sm text-primary-foreground/80 mb-4">{t('support.liveChatDesc')}</p>
                                    <Button variant="secondary" className="w-full font-bold">{t('support.startChat')}</Button>
                                </CardContent>
                            </Card>

                            <Card className="border-border/50">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-2 text-primary">
                                        <Mail className="h-5 w-5" />
                                        <h4 className="font-bold text-foreground">{t('support.emailSupport')}</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4">support@altus.io</p>
                                    <Button variant="outline" className="w-full">{t('support.sendEmail')}</Button>
                                </CardContent>
                            </Card>

                            <Card className="border-border/50">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-2 text-primary">
                                        <FileText className="h-5 w-5" />
                                        <h4 className="font-bold text-foreground">{t('support.docs')}</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4">{t('support.docsDesc')}</p>
                                    <Button variant="outline" className="w-full gap-2">
                                        {t('support.visitDocs')} <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </PageLoader>
    );
}
