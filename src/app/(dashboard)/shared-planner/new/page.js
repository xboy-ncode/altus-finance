'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSharedGoal } from '@/lib/actions/shared-planner'
import { Button } from '@/app/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'

export default function NewSharedGoalPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.target)
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      targetAmount: formData.get('targetAmount'),
      targetDate: formData.get('targetDate'),
      type: formData.get('type') || 'custom'
    }

    const res = await createSharedGoal(data)
    if (res.success) {
      router.push(`/shared-planner/${res.goal.id}`)
    } else {
      setError(res.error)
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Crear Nuevo Plan Compartido</CardTitle>
          <CardDescription>Empieza a ahorrar junto con tus amigos, pareja o familia.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="new-goal-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título de la Meta</Label>
              <Input id="title" name="title" placeholder="Ej. Viaje a Japón 2027" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descripción (Opcional)</Label>
              <Input id="description" name="description" placeholder="Ahorro para vuelos y hotel..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetAmount">Monto Objetivo</Label>
                <Input id="targetAmount" name="targetAmount" type="number" step="0.01" min="1" placeholder="5000.00" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetDate">Fecha Objetivo (Opcional)</Label>
                <Input id="targetDate" name="targetDate" type="date" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Meta</Label>
              <select id="type" name="type" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="travel">✈️ Viaje</option>
                <option value="property">🏠 Propiedad</option>
                <option value="product">🛍️ Producto</option>
                <option value="event">🎉 Evento</option>
                <option value="custom">🎯 Otro</option>
              </select>
            </div>
            
            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>Cancelar</Button>
          <Button type="submit" form="new-goal-form" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Meta Compartida'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
