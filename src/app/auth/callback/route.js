import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  console.log('[AUTH CALLBACK] URL completa:', request.url)
  console.log('[AUTH CALLBACK] code:', code)
  console.log('[AUTH CALLBACK] origin:', origin)
  console.log('[AUTH CALLBACK] next:', next)

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    console.log('[AUTH CALLBACK] exchangeCodeForSession error:', error)
    console.log('[AUTH CALLBACK] exchangeCodeForSession user:', data?.user?.email)
    if (!error) {
      const isInternalRedirect = next.startsWith('/')
      const redirectTo = isInternalRedirect ? `${origin}${next}` : `${origin}/dashboard`
      console.log('[AUTH CALLBACK] redirigiendo a:', redirectTo)
      return NextResponse.redirect(redirectTo)
    }
  } else {
    console.log('[AUTH CALLBACK] NO HAY CODE en la URL')
  }

  console.log('[AUTH CALLBACK] FALLO - redirigiendo a /register con error')
  return NextResponse.redirect(`${origin}/register?error=auth_callback_failed`)
}
