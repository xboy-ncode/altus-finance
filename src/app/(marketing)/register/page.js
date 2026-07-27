'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Rocket, Loader2 } from 'lucide-react';
import { signInWithGoogle, signInWithEmail } from '@/app/lib/actions/auth-providers';

export default function RegisterPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    await signInWithGoogle();
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setEmailLoading(true);
    const result = await signInWithEmail(email);
    setEmailLoading(false);
    
    if (result?.success) {
      setSent(true);
    } else {
      alert(result?.error || 'Error al enviar el código');
    }
  };

  if (sent) {
    return (
      <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-white/10 bg-card/50 backdrop-blur-xl text-center p-6">
          <Rocket className="h-12 w-12 text-primary mx-auto mb-4 animate-bounce" />
          <CardTitle className="mb-2">¡Revisa tu correo!</CardTitle>
          <CardDescription>
            Hemos enviado un enlace de acceso a <strong>{email}</strong>. 
            Haz clic en el enlace para entrar directamente.
          </CardDescription>
          <Button variant="ghost" className="mt-6" onClick={() => setSent(false)}>
            Volver a intentar
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      {/* Glows de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full -z-10" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors group">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Volver al inicio
        </Link>

        <Card className="border-white/10 bg-card/50 backdrop-blur-xl shadow-2xl shadow-primary/5">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
               <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Rocket className="h-6 w-6 text-primary" />
               </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              {t('auth.registerTitle')}
            </CardTitle>
            <CardDescription>
              Accede a tu cuenta de forma segura
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  className="bg-background/50 border-white/10" 
                />
              </div>
              <Button 
                type="submit"
                disabled={emailLoading || loading}
                className="w-full h-11 text-base font-semibold group" 
                size="lg"
              >
                {emailLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Enviar enlace mágico'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">O continúa con</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              type="button" 
              className="w-full h-11 border-white/10 bg-white/5 hover:bg-white/10"
              disabled={loading || emailLoading}
              onClick={handleGoogleLogin}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                  <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
              )}
              Google
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              {t('auth.haveAccount')}{' '}
              <Link href="/dashboard" className="text-primary hover:underline font-medium">
                {t('auth.signIn')}
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
