'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { joinSharedGoalByCode } from '@/lib/actions/shared-planner'
import { Button } from '@/app/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { CheckCircle2 } from 'lucide-react'

export default function JoinSharedGoalPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.target)
    const code = formData.get('inviteCode').toUpperCase().trim()
    
    if (!code) {
      setError('Por favor ingresa un código válido')
      setLoading(false)
      return
    }

    const res = await joinSharedGoalByCode(code)
    if (res.success) {
      setSuccess(true)
    } else {
      setError(res.error)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 min-h-[60vh]">
        <Card className="max-w-md w-full text-center border-primary/20">
          <CardContent className="pt-10 pb-6 space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold">¡Solicitud Enviada!</h2>
            <p className="text-muted-foreground">
              Hemos enviado tu solicitud al creador del plan. Una vez que te acepte, podrás ver la meta y comenzar a colaborar.
            </p>
          </CardContent>
          <CardFooter className="justify-center pb-8">
            <Button onClick={() => router.push('/shared-planner')}>Volver a Mis Planes</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle>Unirse a un Plan</CardTitle>
          <CardDescription>Ingresa el código de invitación que te compartió el creador.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="join-goal-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inviteCode">Código de Invitación</Label>
              <Input 
                id="inviteCode" 
                name="inviteCode" 
                placeholder="Ej. K7RX3MQP" 
                className="text-center text-xl tracking-widest uppercase font-mono"
                maxLength={8}
                required 
              />
            </div>
            {error && <p className="text-sm text-red-500 font-medium text-center">{error}</p>}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={() => router.back()}>Cancelar</Button>
          <Button type="submit" form="join-goal-form" disabled={loading} className="w-full sm:w-auto">
            {loading ? 'Verificando...' : 'Solicitar Acceso'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
