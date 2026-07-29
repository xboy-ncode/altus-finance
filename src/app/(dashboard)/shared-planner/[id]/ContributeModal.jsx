'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import { addContribution } from '@/lib/actions/shared-planner'

export function ContributeModal({ goalId, currency }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.target)
    const amount = formData.get('amount')
    const note = formData.get('note')

    const res = await addContribution(goalId, amount, note)
    if (res.success) {
      setOpen(false)
      router.refresh()
    } else {
      setError(res.error)
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full py-6 text-lg shadow-xl" size="lg">
          Hacer un Aporte
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hacer un Aporte</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Monto ({currency})</Label>
            <Input id="amount" name="amount" type="number" step="0.01" min="0.01" placeholder="0.00" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">Nota (Opcional)</Label>
            <Textarea id="note" name="note" placeholder="Mensaje de apoyo..." />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Registrando...' : 'Aportar Dinero'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
