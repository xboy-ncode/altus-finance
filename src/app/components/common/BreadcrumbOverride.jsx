'use client'

import { useEffect } from 'react'

export function BreadcrumbOverride({ title }) {
  useEffect(() => {
    if (title) {
      window.dispatchEvent(new CustomEvent('setBreadcrumbTitle', { detail: title }))
    }
    return () => {
      window.dispatchEvent(new CustomEvent('setBreadcrumbTitle', { detail: null }))
    }
  }, [title])

  return null
}
