import { db } from '@/db'
import { sharedGoals, sharedGoalMembers, sharedGoalContributions } from '@/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Progress } from '@/app/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs'
import { CopyIcon, Users, Settings, Plus, Check } from 'lucide-react'
import { acceptMember } from '@/lib/actions/shared-planner'
import { AcceptMemberButton } from './AcceptMemberButton'

export default async function SharedGoalDetailsPage({ params }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { id } = params
  
  // Buscar meta y sus relaciones
  const goal = await db.query.sharedGoals.findFirst({
    where: eq(sharedGoals.id, id),
    with: {
      members: {
        with: {
          user: true
        }
      },
      contributions: {
        with: {
          user: true
        },
        orderBy: [desc(sharedGoalContributions.createdAt)]
      }
    }
  })

  if (!goal) notFound()

  // Verificar que el usuario actual sea miembro (activo o pending)
  const currentMember = goal.members.find(m => m.userId === user.id)
  if (!currentMember) {
    return (
      <div className="flex-1 p-8 text-center mt-20">
        <h2 className="text-2xl font-bold">No tienes acceso a esta meta</h2>
        <p className="text-muted-foreground mt-2">Pide al creador que te invite.</p>
        <Link href="/shared-planner"><Button className="mt-4">Volver</Button></Link>
      </div>
    )
  }

  const isOwner = currentMember.role === 'owner'
  const isPending = currentMember.status === 'pending'
  const activeMembers = goal.members.filter(m => m.status === 'active')
  const pendingMembers = goal.members.filter(m => m.status === 'pending')
  
  // Calcular progreso
  const totalAmount = goal.contributions.reduce((sum, c) => sum + Number(c.amount), 0)
  const target = Number(goal.targetAmount)
  const progressPercent = Math.min((totalAmount / target) * 100, 100)

  if (isPending) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[50vh]">
        <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center text-4xl mb-6">⏳</div>
        <h2 className="text-3xl font-bold mb-2">Solicitud Pendiente</h2>
        <p className="text-muted-foreground max-w-md">
          Estás esperando a que el creador de <strong>{goal.title}</strong> acepte tu solicitud para unirte al plan. Vuelve más tarde.
        </p>
        <Link href="/shared-planner"><Button className="mt-8">Volver a Mis Planes</Button></Link>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-5xl mx-auto">
      {/* Banner de Solicitudes (Solo Owner) */}
      {isOwner && pendingMembers.length > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-primary flex items-center gap-2">
              <Users className="h-4 w-4" /> Tienes {pendingMembers.length} solicitud{pendingMembers.length > 1 ? 'es' : ''} de unión
            </h4>
            <p className="text-sm text-muted-foreground">Revisa la pestaña de Miembros para aceptar a tus amigos.</p>
          </div>
          <Button variant="outline" className="shrink-0 text-primary border-primary hover:bg-primary hover:text-primary-foreground">
            Ver Solicitudes
          </Button>
        </div>
      )}

      {/* Header del Plan */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Badge variant="outline">{goal.type.toUpperCase()}</Badge>
            <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">{goal.status.toUpperCase()}</Badge>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">{goal.title}</h1>
          {goal.description && <p className="text-muted-foreground mt-2">{goal.description}</p>}
        </div>
        
        <div className="flex gap-2">
           <div className="bg-muted px-4 py-2 rounded-md flex items-center gap-2 border border-border/50">
             <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Código de Invitación</span>
             <span className="font-mono font-bold tracking-widest">{goal.inviteCode}</span>
           </div>
           {isOwner && (
             <Link href={`/shared-planner/${goal.id}/settings`}>
               <Button variant="outline" size="icon"><Settings className="h-4 w-4" /></Button>
             </Link>
           )}
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Columna Izquierda (Progreso y Miembros) */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Progreso del Ahorro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end mb-4">
                <div>
                  <span className="text-4xl font-black">{goal.currency} {totalAmount.toLocaleString()}</span>
                  <span className="text-muted-foreground ml-2">de {target.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary">{progressPercent.toFixed(1)}%</span>
                </div>
              </div>
              <Progress value={progressPercent} className="h-4" />
            </CardContent>
          </Card>

          <Tabs defaultValue="feed" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto bg-transparent p-0">
              <TabsTrigger value="feed" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-6 py-3">Aportes y Notas</TabsTrigger>
              <TabsTrigger value="members" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-6 py-3">Miembros ({activeMembers.length})</TabsTrigger>
              <TabsTrigger value="media" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-6 py-3">Galería</TabsTrigger>
            </TabsList>
            
            <TabsContent value="feed" className="pt-6">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-semibold text-lg">Actividad Reciente</h3>
                 <Button size="sm" className="gap-1"><Plus className="h-4 w-4" /> Nuevo Aporte</Button>
               </div>
               
               <div className="space-y-4">
                 {goal.contributions.length === 0 ? (
                   <p className="text-muted-foreground text-center py-8">No hay aportes todavía. ¡Sé el primero!</p>
                 ) : (
                   goal.contributions.map(c => (
                     <div key={c.id} className="flex items-start gap-4 p-4 rounded-lg bg-card border">
                       <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">💸</div>
                       <div className="flex-1">
                         <div className="flex justify-between">
                           <p className="font-semibold">{c.user.fullName || 'Usuario'}</p>
                           <span className="text-sm font-bold text-emerald-500">+{goal.currency} {Number(c.amount).toLocaleString()}</span>
                         </div>
                         <p className="text-sm text-muted-foreground mt-1">{c.note || 'Aporte a la meta'}</p>
                         <p className="text-xs text-muted-foreground/60 mt-2">{new Date(c.createdAt).toLocaleDateString()}</p>
                       </div>
                     </div>
                   ))
                 )}
               </div>
            </TabsContent>

            <TabsContent value="members" className="pt-6 space-y-6">
               {isOwner && pendingMembers.length > 0 && (
                 <div>
                   <h3 className="font-semibold text-lg mb-4 text-primary">Solicitudes Pendientes</h3>
                   <div className="grid gap-3">
                     {pendingMembers.map(pm => (
                       <div key={pm.id} className="flex items-center justify-between p-3 rounded-lg border border-primary/20 bg-primary/5">
                         <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                             {pm.user.avatarUrl ? <img src={pm.user.avatarUrl} /> : <div className="h-full w-full bg-secondary flex items-center justify-center">{pm.user.fullName?.charAt(0) || '?'}</div>}
                           </div>
                           <div>
                             <p className="font-medium">{pm.user.fullName || pm.user.email}</p>
                             <p className="text-xs text-muted-foreground">Solicitado el {new Date(pm.invitedAt).toLocaleDateString()}</p>
                           </div>
                         </div>
                         <AcceptMemberButton goalId={goal.id} userId={pm.userId} />
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               <div>
                 <h3 className="font-semibold text-lg mb-4">Miembros Activos</h3>
                 <div className="grid gap-3">
                   {activeMembers.map(m => (
                     <div key={m.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                       <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                           {m.user.avatarUrl ? <img src={m.user.avatarUrl} /> : <div className="h-full w-full bg-secondary flex items-center justify-center">{m.user.fullName?.charAt(0) || '?'}</div>}
                         </div>
                         <div>
                           <p className="font-medium">{m.user.fullName || m.user.email}</p>
                           <p className="text-xs text-muted-foreground capitalize">{m.role}</p>
                         </div>
                       </div>
                       {m.role === 'owner' && <Badge>Creador</Badge>}
                     </div>
                   ))}
                 </div>
               </div>
            </TabsContent>

            <TabsContent value="media" className="pt-6 text-center py-12">
               <p className="text-muted-foreground">Galería de fotos próximamente.</p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Columna Derecha (Widgets) */}
        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground border-none">
            <CardHeader>
              <CardTitle>Aportar</CardTitle>
              <CardDescription className="text-primary-foreground/80">Suma dinero al pozo colectivo.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full py-6 text-lg shadow-xl" size="lg">Hacer un Aporte</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Detalles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Fecha Límite</p>
                <p className="font-medium">{goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : 'Sin fecha límite'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Creado el</p>
                <p className="font-medium">{new Date(goal.createdAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
