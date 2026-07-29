import { db } from '@/db';
import { sharedGoals, travelExpenses, sharedGoalMembers } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { ChevronLeft, Plus, MapPin, Calendar, Receipt } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import { Badge } from '@/app/components/ui/badge';
import TravelExpensesList from './TravelExpensesList';

export default async function TravelDetailsPage({ params }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { id } = await params;

  const goal = await db.query.sharedGoals.findFirst({
    where: and(eq(sharedGoals.id, id), eq(sharedGoals.type, 'travel')),
    with: {
      members: {
        with: {
          user: true
        }
      },
      travelExpenses: {
        orderBy: [desc(travelExpenses.createdAt)]
      }
    }
  });

  if (!goal) notFound();

  // Check if current user is member
  const currentMember = goal.members.find(m => m.userId === user.id);
  if (!currentMember) {
    return (
      <div className="flex-1 p-8 text-center mt-20">
        <h2 className="text-2xl font-bold">No tienes acceso a este viaje</h2>
        <Link href="/travel"><Button className="mt-4">Volver</Button></Link>
      </div>
    );
  }

  const totalSpent = goal.travelExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const budget = Number(goal.targetAmount);
  const progressPercent = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;
  const isOverBudget = totalSpent > budget;

  const isPast = goal.targetDate && new Date(goal.targetDate) < new Date();
  
  return (
    <div className="flex-1 p-4 md:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/travel">
          <Button variant="ghost" size="icon"><ChevronLeft className="h-5 w-5" /></Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" /> {goal.title}
          </h2>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : 'Sin fecha'}</span>
            <Badge variant={isPast ? 'secondary' : 'default'}>{isPast ? 'Pasado' : 'Futuro'}</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Resumen de Presupuesto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="text-sm text-muted-foreground">Total Gastado</p>
                  <p className={`text-3xl font-bold ${isOverBudget ? 'text-destructive' : ''}`}>{goal.currency} {totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Presupuesto</p>
                  <p className="text-xl font-medium">{goal.currency} {budget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              </div>
              <Progress value={progressPercent} className={`h-2 ${isOverBudget ? 'bg-destructive/20 [&>div]:bg-destructive' : ''}`} />
              <p className="text-xs text-muted-foreground mt-2 text-right">{progressPercent.toFixed(1)}% utilizado</p>
            </div>
            
            {goal.description && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{goal.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" /> Lista de Gastos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <TravelExpensesList 
              goalId={goal.id} 
              expenses={goal.travelExpenses} 
              currency={goal.currency} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
