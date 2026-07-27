"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Label } from '@/app/components/ui/label';
import {
    Send,
    MessageSquare,
    Smile,
    Meh,
    Frown,
    Star,
    Sparkles,
    CheckCircle2,
    ThumbsUp,
    AlertCircle
} from 'lucide-react';
import PageLoader from '@/app/components/ui/page-loader';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

export default function FeedbackPage() {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [rating, setRating] = useState(0);
    const [feedbackType, setFeedbackType] = useState('feature');

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 1500);
    };

    const feedbackTypes = [
        { id: 'feature', label: t('feedback.types.feature'), icon: Sparkles, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { id: 'bug', label: t('feedback.types.bug'), icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { id: 'general', label: t('feedback.types.general'), icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    ];

    if (isSubmitted) {
        return (
            <div className="flex items-center justify-center min-h-[70vh] p-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center space-y-6"
                >
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold">{t('feedback.thanksTitle')}</h2>
                        <p className="text-muted-foreground">{t('feedback.thanksMessage')}</p>
                    </div>
                    <Button onClick={() => setIsSubmitted(false)} className="w-full h-12 text-lg">{t('feedback.sendMore')}</Button>
                </motion.div>
            </div>
        );
    }

    return (
        <PageLoader loading={isLoading} message={t('common.loading')}>
            <div className="p-6 max-w-4xl mx-auto space-y-8 pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/80 to-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                            <Send className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{t('feedback.title')}</h1>
                            <p className="text-sm text-muted-foreground">{t('feedback.subtitle')}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left Side: Illustration and Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground border-none overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-20">
                                <Sparkles size={120} />
                            </div>
                            <CardContent className="p-8 relative z-10 space-y-4">
                                <h3 className="text-2xl font-bold">{t('feedback.helpEvolveTitle')}</h3>
                                <p className="text-primary-foreground/80 leading-relaxed">
                                    {t('feedback.helpEvolveDesc')}
                                </p>
                                <div className="pt-4 flex flex-col gap-3">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <ThumbsUp size={16} /> <span>{t('feedback.benefit1')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <CheckCircle2 size={16} /> <span>{t('feedback.benefit2')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <Smile size={16} /> <span>{t('feedback.benefit3')}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="p-4 rounded-xl border border-dashed border-primary/30 bg-primary/5">
                            <p className="text-xs text-center text-muted-foreground">
                                {t('feedback.supportNotice')}
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="lg:col-span-3">
                        <Card className="shadow-lg border-border/50">
                            <form onSubmit={handleSubmit}>
                                <CardHeader>
                                    <CardTitle>{t('feedback.submitTitle')}</CardTitle>
                                    <CardDescription>{t('feedback.submitSubtitle')}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Feedback Type Toggle */}
                                    <div className="space-y-3">
                                        <Label>{t('feedback.typeLabel')}</Label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {feedbackTypes.map((type) => {
                                                const Icon = type.icon;
                                                const isActive = feedbackType === type.id;
                                                return (
                                                    <button
                                                        key={type.id}
                                                        type="button"
                                                        onClick={() => setFeedbackType(type.id)}
                                                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-2 ${
                                                            isActive 
                                                            ? `border-primary ${type.bg}` 
                                                            : 'border-transparent bg-muted/50 hover:bg-muted'
                                                        }`}
                                                    >
                                                        <Icon className={`h-5 w-5 ${isActive ? type.color : 'text-muted-foreground'}`} />
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                            {type.label}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="space-y-3">
                                        <Label>{t('feedback.ratingLabel')}</Label>
                                        <div className="flex justify-center gap-2 py-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    onMouseEnter={() => setRating(star)}
                                                    className="transition-transform active:scale-90"
                                                >
                                                    <Star 
                                                        className={`h-8 w-8 transition-colors ${
                                                            star <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'
                                                        }`} 
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div className="space-y-2">
                                        <Label htmlFor="subject">{t('feedback.subject')}</Label>
                                        <Input id="subject" placeholder={t('feedback.subjectPlaceholder')} required />
                                    </div>

                                    {/* Message */}
                                    <div className="space-y-2">
                                        <Label htmlFor="message">{t('feedback.message')}</Label>
                                        <textarea
                                            id="message"
                                            rows={5}
                                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder={t('feedback.messagePlaceholder')}
                                            required
                                        ></textarea>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" className="w-full gap-2 h-11 text-lg">
                                        <Send size={18} /> {t('feedback.sendButton')}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </PageLoader>
    );
}
