'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/components/ui/button'
import { Settings, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/app/components/ui/dialog'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'

export function SettingsButton({ goalId, initialName, initialTarget, initialType }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(initialName)
  const [target, setTarget] = useState(initialTarget)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  async function handleSave() {
    setError(null)
    setLoading(true)
    const res = await fetch(`/api/wishlists/${goalId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, target: Number(target), type: initialType })
    })
    
    if (!res.ok) {
      setError('Error al guardar la meta.')
      setLoading(false)
      return
    }

    setLoading(false)
    setOpen(false)
    router.refresh()
  }

  async function handleDelete() {
    if (!confirm('¿Estás seguro de eliminar esta meta? Todos sus gastos y datos se perderán.')) return;
    setError(null)
    setLoading(true)
    const res = await fetch(`/api/wishlists/${goalId}`, { method: 'DELETE' })
    if (!res.ok) {
      setError('Error al eliminar la meta.')
      setLoading(false)
      return
    }
    router.push('/wishlists')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon"><Settings className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurar Meta</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nombre de la Meta</Label>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Monto Objetivo</Label>
            <Input type="number" step="0.01" value={target} onChange={e => setTarget(e.target.value)} />
          </div>
          {error && <p className="text-sm text-destructive font-medium">{error}</p>}
        </div>
        <DialogFooter className="flex justify-between items-center w-full">
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            <Trash2 className="h-4 w-4 mr-2" /> Eliminar Meta
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={loading}>Guardar</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
