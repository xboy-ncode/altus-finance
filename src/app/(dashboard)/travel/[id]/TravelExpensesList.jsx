'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog'
import { Plus, Tag, Calendar as CalendarIcon, Trash2, Check, Hourglass, CheckCircle2, Pencil } from 'lucide-react'
import { addTravelExpense, editTravelExpense } from '@/lib/actions/travel'

export default function TravelExpensesList({ goalId, expenses, currency, totalSaved = 0 }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [editingExpense, setEditingExpense] = useState(null)

  async function handleAddExpense(e) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.target)
    const data = {
      goalId,
      name: formData.get('name'),
      amount: formData.get('amount'),
      category: formData.get('category'),
      color: formData.get('color'),
      priority: formData.get('priority')
    }
    
    let res
    if (editingExpense) {
      res = await editTravelExpense(editingExpense.id, data)
    } else {
      res = await addTravelExpense(data)
    }
    
    if (res.success) {
      setOpen(false)
      setEditingExpense(null)
      router.refresh()
    } else {
      alert(res.error)
    }
    setLoading(false)
  }

  function openEditModal(expense) {
    setEditingExpense(expense)
    setOpen(true)
  }

  // Ordenar gastos por prioridad y luego cronológicamente
  const sortedExpenses = [...expenses].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return new Date(a.createdAt) - new Date(b.createdAt);
  })
  
  // Calcular cobertura
  let runningSum = 0
  const processedExpenses = sortedExpenses.map(expense => {
    const amount = Number(expense.amount)
    runningSum += amount
    const isCovered = totalSaved >= runningSum
    return {
      ...expense,
      amount,
      isCovered
    }
  })

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-muted/20">
        <Dialog open={open} onOpenChange={(val) => {
          setOpen(val)
          if (!val) setEditingExpense(null)
        }}>
          <DialogTrigger asChild>
            <Button className="w-full gap-2"><Plus className="h-4 w-4" /> Añadir Ítem al Presupuesto</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingExpense ? 'Editar Ítem' : 'Registrar Gasto'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddExpense} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Concepto</Label>
                  <Input id="name" name="name" defaultValue={editingExpense?.name || ''} placeholder="Ej. Vuelos, Hotel, Comida..." required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridad (1 = Mayor)</Label>
                  <Input id="priority" name="priority" type="number" min="1" defaultValue={editingExpense?.priority || 1} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Monto ({currency})</Label>
                  <Input id="amount" name="amount" defaultValue={editingExpense?.amount || ''} type="number" step="0.01" min="0.01" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <select id="category" name="category" defaultValue={editingExpense?.category || 'Transporte'} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    <option value="Transporte">Transporte</option>
                    <option value="Alojamiento">Alojamiento</option>
                    <option value="Comida">Comida</option>
                    <option value="Actividades">Actividades</option>
                    <option value="Equipamiento">Equipamiento</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color de Categoría</Label>
                <div className="flex items-center gap-2">
                  <Input id="color" name="color" type="color" defaultValue={editingExpense?.color || '#3b82f6'} className="w-16 h-10 p-1 cursor-pointer" />
                  <span className="text-sm text-muted-foreground">Para el gráfico general</span>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Guardando...' : (editingExpense ? 'Actualizar Ítem' : 'Guardar Ítem')}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto max-h-[500px]">
        {processedExpenses.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <p>Aún no hay gastos registrados para esta meta.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {processedExpenses.map((expense, index) => (
              <div key={expense.id} className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${expense.isCovered ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-card hover:bg-muted/50'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: expense.isCovered ? '#10b981' : expense.color }}>
                    {expense.isCovered ? <Check className="h-5 w-5" /> : <span className="text-sm font-bold opacity-80">{expense.priority || index + 1}</span>}
                  </div>
                  <div>
                    <p className={`font-semibold ${expense.isCovered ? 'text-emerald-700 dark:text-emerald-400' : ''}`}>
                      {expense.name}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="font-medium text-foreground/70">{expense.category}</span>
                      <span>•</span>
                      {expense.isCovered ? (
                        <span className="text-emerald-600 dark:text-emerald-500 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> ¡Cubierto!
                        </span>
                      ) : (
                        <span className="text-amber-500 flex items-center gap-1">
                          <Hourglass className="h-3 w-3" /> Pendiente
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`font-bold text-lg ${expense.isCovered ? 'text-emerald-600 dark:text-emerald-500' : ''}`}>
                      {currency} {expense.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => openEditModal(expense)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
