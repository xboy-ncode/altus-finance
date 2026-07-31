'use client'

import { useState, useEffect, useMemo } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import { addContribution } from '@/lib/actions/shared-planner'
import { Loader2 } from 'lucide-react'

export function ContributeModal({ goalId, currency, accounts = [] }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [accountId, setAccountId] = useState('')
  const [amount, setAmount] = useState('')
  const [rates, setRates] = useState(null)
  const [loadingRates, setLoadingRates] = useState(false)
  
  const router = useRouter()

  // Buscar tasas de cambio al abrir
  useEffect(() => {
    if (open && !rates) {
      setLoadingRates(true)
      fetch('/api/rates')
        .then(res => res.json())
        .then(data => {
          setRates(data)
          setLoadingRates(false)
        })
        .catch(err => {
          console.error(err)
          setLoadingRates(false)
        })
    }
  }, [open, rates])

  const selectedAccount = useMemo(() => {
    return accounts.find(a => a.id === accountId)
  }, [accountId, accounts])

  const conversionPreview = useMemo(() => {
    if (!amount || isNaN(amount) || !selectedAccount) return null;
    
    // Si la meta está en USD/USDT y la cuenta en VES
    if (currency !== 'VES' && selectedAccount.currency === 'VES') {
      const rate = rates?.binance || rates?.bcv || 0
      if (!rate) return 'Cargando tasa...'
      const vesAmount = (parseFloat(amount) * rate).toFixed(2)
      return `≈ ${vesAmount} VES se descontarán de tu cuenta (Tasa: ${rate.toFixed(2)})`
    }
    
    // Si la cuenta y la meta tienen la misma moneda o no hay conversión
    return `Se descontarán ${parseFloat(amount).toFixed(2)} ${selectedAccount.currency} de tu cuenta.`
  }, [amount, selectedAccount, currency, rates])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.target)
    const note = formData.get('note')
    
    // Determinar la tasa a enviar
    let exchangeRate = 1;
    if (currency !== 'VES' && selectedAccount?.currency === 'VES') {
      exchangeRate = rates?.binance || rates?.bcv || 1;
    }

    const res = await addContribution(goalId, amount, note, accountId, exchangeRate)
    if (res.success) {
      setOpen(false)
      setAmount('')
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
            <Label>Cuenta de Origen</Label>
            <Select value={accountId} onValueChange={setAccountId} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una cuenta" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map(acc => (
                  <SelectItem key={acc.id} value={acc.id}>
                    {acc.name} ({acc.balance} {acc.currency})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Monto en {currency} (Para la meta)</Label>
            <Input 
              id="amount" 
              name="amount" 
              type="number" 
              step="0.01" 
              min="0.01" 
              placeholder="0.00" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required 
            />
            {conversionPreview && (
              <p className="text-xs text-muted-foreground font-medium animate-pulse">
                {conversionPreview}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Nota (Opcional)</Label>
            <Textarea id="note" name="note" placeholder="Mensaje de apoyo..." />
          </div>
          
          {error && <p className="text-sm text-destructive">{error}</p>}
          
          <Button type="submit" className="w-full" disabled={loading || loadingRates}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? 'Registrando...' : 'Aportar Dinero'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
