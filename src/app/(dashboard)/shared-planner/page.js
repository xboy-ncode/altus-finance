import { db } from '@/db'
import { sharedGoals, sharedGoalMembers } from '@/db/schema'
import { eq, and, inArray } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/app/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card'

// Componente de servidor para listar
export default async function SharedPlannerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let myGoals = []
  
  if (user) {
    // Obtener los planes donde el usuario es miembro activo, owner o pendiente
    const memberships = await db.query.sharedGoalMembers.findMany({
      where: and(
        eq(sharedGoalMembers.userId, user.id),
        inArray(sharedGoalMembers.status, ['active', 'pending'])
      ),
      with: {
        goal: {
          with: {
            members: true,
            contributions: true
          }
        }
      }
    })
    
    myGoals = memberships.map(m => ({ ...m.goal, membershipStatus: m.status }))
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Shared Planner</h2>
          <p className="text-muted-foreground mt-1">Ahorra en conjunto para metas comunes.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/shared-planner/join">
            <Button variant="secondary">Unirse con Código</Button>
          </Link>
          <Link href="/shared-planner/new">
            <Button>Crear Nuevo Plan</Button>
          </Link>
        </div>
      </div>
      
      {myGoals.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl mt-8 text-center bg-card/50">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4 text-2xl">🎯</div>
          <h3 className="text-xl font-bold mb-2">No tienes planes compartidos</h3>
          <p className="text-muted-foreground max-w-sm mb-6">Crea uno nuevo e invita a tus amigos, o únete a uno existente introduciendo el código de invitación.</p>
          <div className="flex gap-4">
             <Link href="/shared-planner/new"><Button>Crear Plan</Button></Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {myGoals.map((goal) => {
            const memberCount = goal.members?.length || 0;
            const currentAmount = goal.contributions?.reduce((sum, c) => sum + Number(c.amount), 0) || 0;
            const progress = goal.targetAmount > 0 ? (currentAmount / goal.targetAmount) * 100 : 0;
            
            return (
              <Link href={`/shared-planner/${goal.id}`} key={goal.id}>
                <Card className="hover:shadow-md transition-all hover:border-primary/50 cursor-pointer h-full flex flex-col overflow-hidden group">
                  {goal.coverImageUrl && (
                    <div className="h-32 w-full overflow-hidden bg-muted relative">
                      <img src={goal.coverImageUrl} alt={goal.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-1 flex items-center justify-between">
                      {goal.title}
                      {goal.membershipStatus === 'pending' && (
                        <span className="text-xs bg-amber-500/10 text-amber-600 px-2 py-1 rounded-full border border-amber-500/20 font-medium">⏳ Pendiente</span>
                      )}
                    </CardTitle>
                    <p className="text-sm font-medium text-primary">
                      {goal.currency} {currentAmount} <span className="text-muted-foreground text-xs font-normal">de {goal.targetAmount}</span>
                    </p>
                  </CardHeader>
                  <CardContent className="mt-auto pb-4">
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-primary" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{memberCount} miembro{memberCount !== 1 && 's'}</span>
                      <span>{progress.toFixed(0)}% completado</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
