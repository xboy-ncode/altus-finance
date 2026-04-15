"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import PageLoader from '@/app/components/ui/page-loader';
import { useSettings } from '@/app/components/contexts/SettingsContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, User, Sparkles, TrendingDown, TrendingUp, RefreshCcw } from 'lucide-react';

const SUGGESTIONS = [
    "¿En qué categoría gasto más?",
    "Resume mis finanzas del último mes",
    "¿Cómo puedo ahorrar para un viaje?",
    "Compara mis gastos con el mes anterior"
];

// Mock conversation flow
const MOCK_FLOW = {
    "¿En qué categoría gasto más?": {
        text: "Basado en tus datos de los últimos 30 días, tu mayor categoría de gasto es **Alimentación** (35% de tus gastos totales), seguido de **Transporte** (20%).\n\nHe notado que tus gastos en restaurantes subieron un 15% este mes. ¿Te gustaría establecer un presupuesto estricto para comida?",
        chart: 'food'
    },
    "Resume mis finanzas del último mes": {
        text: "¡Claro! En octubre de 2026 tuviste un buen desempeño:\n- **Ingresos**: $4,500.00\n- **Gastos**: $2,850.00\n- **Ahorro Neto**: +$1,650.00\n\nLograste ahorrar el 36% de tus ingresos, lo cual es excelente. Tu balance general creció un 12%.",
        chart: 'summary'
    },
    "¿Cómo puedo ahorrar para un viaje?": {
        text: "Para alcanzar tu meta del 'Viaje a Japón' ($5,000), te sugiero:\n1. Reducir un 10% el gasto en 'Entretenimiento' ($150 extra al mes).\n2. Destinar automáticamente el 50% de tus ingresos extra al fondo de viaje.\n\nSi guardas $300 dólares mensuales, llegarás a la meta en 10 meses. ¿Quieres que ajuste tu presupuesto mensual automáticamente?",
        chart: null
    },
    "Compara mis gastos con el mes anterior": {
        text: "Aquí tienes la comparativa respecto al mes pasado:\n\n📉 **Transporte**: -$45.00 (Has ahorrado en gasolina)\n📈 **Compras**: +$120.00 (Cuidado con los gastos hormiga)\n⚖️ **Servicios**: Sin cambios\n\nEn general, gastaste $75.00 **más** que el mes pasado.",
        chart: null
    }
};

export default function AssistantPage() {
    const { formatCurrency } = useSettings();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', text: '¡Hola! Soy tu asistente financiero impulsado por IA. Puedo analizar tus gastos, sugerir presupuestos y ayudarte a alcanzar tus metas. ¿En qué puedo ayudarte hoy?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = (text) => {
        if (!text.trim()) return;

        // Add user message
        const userMsg = { id: Date.now(), sender: 'user', text: text.trim() };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI thinking and responding
        setTimeout(() => {
            const match = MOCK_FLOW[text.trim()];
            const responseText = match ? match.text : "Entiendo. Esa es una gran pregunta, aunque por ahora solo estoy en fase de demostración. Intenta preguntarme sobre tus categorías de gasto o un resumen del mes.";
            
            setMessages(prev => [...prev, { 
                id: Date.now() + 1, 
                sender: 'ai', 
                text: responseText,
                chart: match?.chart
            }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <PageLoader loading={isLoading} message={t('common.loading')}>
            <div className="p-6 max-w-4xl mx-auto space-y-6 flex flex-col h-[calc(100vh-5rem)]">
                {/* Header */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/80 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                        <Bot className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            {t('nav.assistant', 'Asistente IA')} <Sparkles className="h-5 w-5 text-indigo-500" />
                        </h1>
                        <p className="text-sm text-muted-foreground">{t('assistant.subtitle', 'Análisis inteligente de tus finanzas')}</p>
                    </div>
                </div>

                {/* Chat Container */}
                <Card className="flex-1 flex flex-col shadow-md overflow-hidden border-indigo-500/10">
                    {/* Message Area */}
                    <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-muted/20">
                        <AnimatePresence initial={false}>
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={`flex items-start gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-indigo-500 text-white shadow-sm'}`}>
                                        {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                    </div>
                                    <div className={`flex flex-col gap-2 max-w-[80%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`p-4 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                                            msg.sender === 'user' 
                                                ? 'bg-primary text-primary-foreground rounded-tr-sm shadow-sm' 
                                                : 'bg-card text-card-foreground border shadow-sm rounded-tl-sm'
                                        }`}>
                                            {msg.text}
                                        </div>
                                        
                                        {/* Optional Chart Injection */}
                                        {msg.chart === 'food' && (
                                            <div className="bg-card border p-4 rounded-xl shadow-sm w-full max-w-sm flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-r-transparent animate-spin-slow" />
                                                <div>
                                                    <p className="font-semibold text-sm">35% Alimentación</p>
                                                    <p className="text-xs text-muted-foreground">Mayor gasto del mes</p>
                                                </div>
                                            </div>
                                        )}
                                        {msg.chart === 'summary' && (
                                            <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                                                <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg text-emerald-700 dark:text-emerald-400">
                                                    <TrendingUp className="h-4 w-4 mb-1" />
                                                    <p className="text-xs font-semibold">+12% Balance</p>
                                                </div>
                                                <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg text-blue-700 dark:text-blue-400">
                                                    <RefreshCcw className="h-4 w-4 mb-1" />
                                                    <p className="text-xs font-semibold">36% Tasa de ahorro</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-start gap-4"
                                >
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-indigo-500 text-white shadow-sm">
                                        <Bot className="h-4 w-4" />
                                    </div>
                                    <div className="bg-card border shadow-sm p-4 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
                                        <span className="w-2 h-2 bg-indigo-500/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 bg-indigo-500/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 bg-indigo-500/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                    </CardContent>

                    {/* Suggestions Area */}
                    {messages.length === 1 && (
                        <div className="p-4 bg-muted/20 border-t border-b flex gap-2 overflow-x-auto hide-scrollbar">
                            {SUGGESTIONS.map((sug, i) => (
                                <Button 
                                    key={i} 
                                    variant="secondary" 
                                    size="sm" 
                                    className="whitespace-nowrap rounded-full text-xs"
                                    onClick={() => handleSend(sug)}
                                >
                                    {sug}
                                </Button>
                            ))}
                        </div>
                    )}

                    {/* Input Area */}
                    <CardFooter className="p-4 bg-card border-t shrink-0">
                        <form 
                            onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
                            className="flex w-full gap-2 items-center"
                        >
                            <Input 
                                placeholder={t('assistant.placeholder', 'Pregunta sobre tus gastos o presupuestos...')}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="flex-1 rounded-full px-4 focus-visible:ring-indigo-500"
                                disabled={isTyping}
                            />
                            <Button type="submit" size="icon" disabled={!inputValue.trim() || isTyping} className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white">
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            </div>
        </PageLoader>
    );
}
