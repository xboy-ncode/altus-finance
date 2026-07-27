'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { joinSharedGoalByCode } from '@/lib/actions/shared-planner'
import { Card, CardContent } from '@/app/components/ui/card'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/app/components/ui/button'

export default function AutoJoinPage({ params }) {
  const router = useRouter()
  // React 19 pattern to unwrap params
  const { code } = use(params)
  
  const [status, setStatus] = useState('loading') // loading, success, error
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    async function processJoin() {
      if (!code) return
      
      const cleanCode = code.toUpperCase().trim()
      const res = await joinSharedGoalByCode(cleanCode)
      
      if (res.success) {
        setStatus('success')
      } else {
        setErrorMsg(res.error)
        setStatus('error')
      }
    }
    
    processJoin()
  }, [code])

  return (
    <div className="flex-1 flex items-center justify-center p-4 min-h-[60vh]">
      <Card className="max-w-md w-full text-center">
        <CardContent className="pt-10 pb-8 space-y-4">
          {status === 'loading' && (
            <>
              <div className="flex justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
              <h2 className="text-xl font-medium">Procesando invitación...</h2>
              <p className="text-sm text-muted-foreground">Verificando el código {code}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="flex justify-center">
                <CheckCircle2 className="h-16 w-16 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold">¡Solicitud Enviada!</h2>
              <p className="text-muted-foreground mb-4">
                El creador ha sido notificado. Una vez aceptado, verás el plan en tu dashboard.
              </p>
              <Button onClick={() => router.push('/shared-planner')}>Ir a Mis Planes</Button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="flex justify-center">
                <XCircle className="h-16 w-16 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold">No pudimos unirte</h2>
              <p className="text-muted-foreground text-sm font-medium text-destructive mb-4">
                {errorMsg}
              </p>
              <Button variant="outline" onClick={() => router.push('/shared-planner/join')}>
                Probar otro código
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
