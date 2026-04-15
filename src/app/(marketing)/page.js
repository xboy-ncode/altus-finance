'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import Link from 'next/link';
import { ArrowRight, PieChart, Shield, Zap, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function Counter({ from, duration = 2 }) {
  const [count, setCount] = useState(from);
  
  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      const currentCount = Math.floor(from + (progress * 50)); 
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    
    const interval = setInterval(() => {
        setCount(prev => prev + Math.floor(Math.random() * 2));
    }, 5000);

    return () => {
        cancelAnimationFrame(animationFrame);
        clearInterval(interval);
    };
  }, [from, duration]);

  return (
    <span className="inline-flex items-center gap-2 mx-1">
      <span className="font-mono font-black text-white tabular-nums drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] text-2xl md:text-4xl">
        {count.toLocaleString()}
      </span>
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"></span>
      </span>
    </span>
  );
}

export default function LandingPage() {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generar partículas solo en el cliente para evitar mismatch de hidratación
    const newParticles = [...Array(6)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 5 + 5,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const springScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Efectos de Parallax
  const y1 = useTransform(springScroll, [0, 1], [0, -200]);
  const y2 = useTransform(springScroll, [0, 1], [0, -500]);
  const rotate = useTransform(springScroll, [0, 1], [0, 10]);
  const scale = useTransform(springScroll, [0, 0.5], [1, 1.1]);
  
  return (
    <div ref={containerRef} className="relative min-h-screen bg-background text-foreground selection:bg-primary/30">
      
      {/* ─── Capa de Decoración (Fija y detrás de todo) ───────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 1. Grid Pattern mejorado */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* 2. Nebulosas (Blobs) con colores más intensos */}
        <motion.div 
          animate={{ 
            x: [0, 50, 0], 
            y: [0, 30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[50%] bg-primary/20 blur-[120px] rounded-full opacity-60"
        />
        <motion.div 
          animate={{ 
            x: [0, -40, 0], 
            y: [0, 60, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-emerald-500/15 blur-[100px] rounded-full opacity-50"
        />
        <motion.div 
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
            scale: [0.8, 1, 0.8]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[10%] w-[70%] h-[40%] bg-primary/10 blur-[90px] rounded-full"
        />
      </div>

      {/* ─── Contenido Principal (Con Z superior) ─────────────────────── */}
      <div className="relative z-10">
        {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 max-w-4xl"
        >
          <Badge variant="outline" className="px-4 py-1.5 border-primary/20 bg-primary/5 text-primary animate-pulse">
            {t('marketing.heroBadge')}
          </Badge>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1]">
            {t('marketing.heroTitle1')} <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-emerald-400 to-primary">
              {t('marketing.heroTitle2')}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('marketing.heroSubtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full group">
                {t('marketing.getStarted')}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full backdrop-blur-sm bg-background/50">
                {t('marketing.viewDemo')}
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Parallax Dashboard Preview */}
        <motion.div 
          style={{ y: y1, rotateX: rotate, scale }}
          className="mt-20 relative w-full max-w-6xl mx-auto px-4 perspective-1000"
        >
          <div className="relative rounded-2xl border border-white/10 bg-card/50 backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-primary/30 hover:border-primary/30 group">
            <div className="h-9 border-b border-white/5 bg-white/10 flex items-center gap-2 px-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
              </div>
              <span className="text-[11px] text-muted-foreground/60 ml-4 font-mono uppercase tracking-[0.2em]">Altus Protocol v1.0</span>
            </div>
            
            <div className="relative bg-muted/5">
              <img 
                src="/screenshot001.png" 
                alt="Altus Dashboard Preview" 
                className="w-full h-auto block"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>

          <motion.div 
            style={{ y: y2 }}
            className="absolute -top-20 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none"
          />
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold">Por qué elegir Altus</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Tecnología de punta para que no tengas que preocuparte por las hojas de cálculo nunca más.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: "Velocidad Extrema", desc: "Sincronización en tiempo real con todas tus cuentas bancarias.", index: "01" },
              { icon: Shield, title: "Seguridad Bancaria", desc: "Encriptación de grado militar AES-256 para tus datos.", index: "02" },
              { icon: PieChart, title: "IA Predictiva", desc: "Nuestro asistente predice tus gastos del próximo mes.", index: "03" },
              { icon: Globe, title: "Acceso Global", desc: "Disponible en cualquier dispositivo, en cualquier lugar.", index: "04" }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative p-8 rounded-3xl border border-white/10 bg-card/20 backdrop-blur-md hover:border-primary/50 hover:bg-card/40 transition-all duration-500 overflow-hidden"
              >
                {/* Número decorativo de fondo */}
                <span className="absolute -bottom-4 -right-4 text-9xl font-black text-white/[0.03] pointer-events-none group-hover:text-primary/5 transition-colors">
                  {f.index}
                </span>

                {/* Aura del icono */}
                <div className="relative w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <f.icon className="h-7 w-7 text-primary relative z-10" />
                </div>

                <h3 className="text-2xl font-bold mb-4 tracking-tight group-hover:text-primary transition-colors">
                  {f.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed relative z-10">
                  {f.desc}
                </p>

                {/* Brillo de borde inferior al hacer hover */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-primary to-transparent group-hover:w-full transition-all duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 relative">
         <motion.div 
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="container mx-auto max-w-5xl rounded-[2.5rem] bg-emerald-600 px-8 py-24 text-center text-primary-foreground relative overflow-hidden shadow-[0_0_50px_-12px_rgba(16,185,129,0.5)]"
         >
            {/* ─── Capas de Decoración Interna ─── */}
            
            {/* 1. Gradiente Animado de Fondo */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-primary animate-gradient-slow opacity-90" />
            
            {/* 2. Patrón de Micro-rejilla */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
            
            {/* 3. Partículas / Luces Flotantes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
               {particles.map((particle) => (
                 <motion.div
                   key={particle.id}
                   animate={{
                     y: [0, -100, 0],
                     x: [0, 25, 0],
                     opacity: [0.2, 0.5, 0.2],
                   }}
                   transition={{
                     duration: particle.duration,
                     delay: particle.delay,
                     repeat: Infinity,
                     ease: "easeInOut",
                   }}
                   className="absolute w-2 h-2 bg-white rounded-full blur-[2px]"
                   style={{
                     left: particle.left,
                     top: particle.top,
                   }}
                 />
               ))}
            </div>

            {/* 4. Glow central */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-gradient from-white/20 to-transparent blur-3xl opacity-50" />

            {/* ─── Contenido ─── */}
            <div className="relative z-10 space-y-10">
               <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
                 {t('marketing.ctaTitle')}
               </h2>
               
               <div className="space-y-4">
                 <p className="text-xl md:text-2xl font-medium opacity-90 max-w-3xl mx-auto leading-relaxed">
                   {t('marketing.ctaSubtitleStart')}
                   <Counter from={3000} />
                   {t('marketing.ctaSubtitleEnd')}
                 </p>
               </div>

               <Link href="/register" className="inline-block pt-4">
                 <motion.div
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                 >
                   <Button size="lg" variant="secondary" className="h-16 px-12 text-xl rounded-2xl font-black shadow-2xl shadow-black/20 bg-white text-emerald-600 hover:bg-emerald-50 transition-all border-b-4 border-emerald-200 active:border-b-0 group">
                      {t('marketing.createAccount')}
                   </Button>
                 </motion.div>
               </Link>
            </div>

            {/* Esquinas decorativas futuristas */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-white/20 rounded-tl-[2.5rem]" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-white/20 rounded-br-[2.5rem]" />
         </motion.div>
      </section>
    </div>
  </div>
  );
}
