'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog'
import { Plus, Tag, Calendar as CalendarIcon, Trash2 } from 'lucide-react'
import { addTravelExpense } from '@/lib/actions/travel'

export default function TravelExpensesList({ goalId, expenses, currency }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleAddExpense(e) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.target)
    const data = {
      goalId,
      name: formData.get('name'),
      amount: formData.get('amount'),
      category: formData.get('category'),
      color: formData.get('color')
    }
    const res = await addTravelExpense(data)
    if (res.success) {
      setOpen(false)
      router.refresh()
    } else {
      alert(res.error)
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-muted/20">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full gap-2"><Plus className="h-4 w-4" /> Añadir Gasto</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Gasto de Viaje</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddExpense} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Concepto</Label>
                <Input id="name" name="name" placeholder="Ej. Vuelos, Hotel, Comida..." required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Monto ({currency})</Label>
                  <Input id="amount" name="amount" type="number" step="0.01" min="0.01" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <select id="category" name="category" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    <option value="Transporte">Transporte</option>
                    <option value="Alojamiento">Alojamiento</option>
                    <option value="Comida">Comida</option>
                    <option value="Actividades">Actividades</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color de Categoría</Label>
                <div className="flex items-center gap-2">
                  <Input id="color" name="color" type="color" defaultValue="#3b82f6" className="w-16 h-10 p-1 cursor-pointer" />
                  <span className="text-sm text-muted-foreground">Para el gráfico general</span>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Gasto'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto max-h-[500px]">
        {expenses.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <p>Aún no hay gastos registrados para este viaje.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: expense.color }}>
                    <Tag className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold">{expense.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="font-medium text-foreground/70">{expense.category}</span>
                      <span>•</span>
                      <CalendarIcon className="h-3 w-3" /> {new Date(expense.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{currency} {Number(expense.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
