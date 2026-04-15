'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Check, Zap, Globe, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function PricingPage() {
  const { t } = useTranslation();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'

  const plans = [
    {
      id: 'free',
      key: 'free',
      icon: Globe,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/10',
      borderColor: 'border-white/5',
      buttonVariant: 'outline',
    },
    {
      id: 'pro',
      key: 'pro',
      icon: Zap,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30',
      buttonVariant: 'default',
      popular: true,
    }
  ];

  return (
    <div className="relative min-h-screen py-24 px-4">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10" />

      <div className="container mx-auto max-w-5xl">
        <div className="text-center space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge variant="outline" className="px-4 py-1.5 border-primary/20 bg-primary/5 text-primary mb-4">
              {t('marketing.pricing')}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              {t('marketing.pricingTitle')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
              {t('marketing.pricingSubtitle')}
            </p>
          </motion.div>

          {/* Billing Toggle */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4 pt-8"
          >
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
              {t('marketing.monthly')}
            </span>
            <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-14 h-7 rounded-full bg-muted border border-white/10 p-1 transition-colors hover:bg-muted/80"
            >
              <motion.div 
                animate={{ x: billingCycle === 'monthly' ? 0 : 28 }}
                className="w-5 h-5 rounded-full bg-primary shadow-lg shadow-primary/20"
              />
            </button>
            <span className={`text-sm ${billingCycle === 'yearly' ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
              {t('marketing.yearly')}
              <Badge variant="secondary" className="ml-2 bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                {t('marketing.save20')}
              </Badge>
            </span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className={`relative overflow-hidden border-white/10 bg-card/50 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 ${plan.popular ? 'scale-105 border-primary/50 z-10' : ''}`}>
                  {plan.popular && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                        {t('marketing.mostPopular')}
                      </div>
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-2xl ${plan.bgColor} flex items-center justify-center mb-4`}>
                      <Icon className={`h-6 w-6 ${plan.color}`} />
                    </div>
                    <CardTitle className="text-2xl font-bold">{t(`marketing.plans.${plan.key}.name`)}</CardTitle>
                    <CardDescription className="min-h-[40px]">{t(`marketing.plans.${plan.key}.description`)}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">$</span>
                      <span className="text-6xl font-black tracking-tighter">
                        {billingCycle === 'monthly' ? t(`marketing.plans.${plan.key}.price`) : (parseFloat(t(`marketing.plans.${plan.key}.price`)) * 0.8).toFixed(2)}
                      </span>
                      <span className="text-muted-foreground ml-1">/{t('marketing.monthly').toLowerCase()}</span>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/5">
                      {t(`marketing.plans.${plan.key}.features`, { returnObjects: true }).map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-center gap-3 text-sm">
                          <div className={`h-5 w-5 rounded-full ${plan.bgColor} flex items-center justify-center shrink-0`}>
                            <Check className={`h-3 w-3 ${plan.color}`} />
                          </div>
                          <span className="text-muted-foreground/90">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Link href="/register" className="w-full">
                      <Button 
                        variant={plan.buttonVariant} 
                        className={`w-full h-12 text-base font-bold rounded-xl ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                      >
                        {t('marketing.getStarted')}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 p-8 rounded-3xl bg-muted/30 border border-white/5 backdrop-blur-sm text-center max-w-3xl mx-auto"
        >
          <p className="text-sm text-muted-foreground leading-relaxed">
            Todos nuestros planes incluyen encriptación de datos AES-256 y copias de seguridad automáticas diarias. 
            Próximamente soporte para múltiples monedas y criptomonedas.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
