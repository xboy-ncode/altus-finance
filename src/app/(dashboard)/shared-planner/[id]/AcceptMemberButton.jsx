'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { Check } from 'lucide-react'
import { acceptMember } from '@/lib/actions/shared-planner'

export function AcceptMemberButton({ goalId, userId }) {
  const [loading, setLoading] = useState(false)

  async function handleAccept() {
    setLoading(true)
    await acceptMember(goalId, userId)
    setLoading(false)
  }

  return (
    <Button size="sm" onClick={handleAccept} disabled={loading} className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white">
      <Check className="h-4 w-4" /> {loading ? 'Aceptando...' : 'Aceptar'}
    </Button>
  )
}
