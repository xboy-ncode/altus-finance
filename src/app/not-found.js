import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 space-y-6">
            <h1 className="text-6xl font-bold tracking-tighter text-primary">404</h1>
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Página no encontrada</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Lo sentimos, no pudimos encontrar la página que estás buscando. Puede que haya sido movida o eliminada.
                </p>
            </div>
            <Button asChild className="gap-2 mt-4">
                <Link href="/">
                    <Home className="h-4 w-4" />
                    Volver al Dashboard
                </Link>
            </Button>
        </div>
    );
}
