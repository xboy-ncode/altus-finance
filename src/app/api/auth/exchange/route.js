import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Esta route maneja el intercambio del código PKCE del lado del servidor.
 * El cliente redirige aquí cuando detecta ?code= en /register,
 * y el server client puede acceder al code_verifier en las cookies.
 */
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  console.log('[API EXCHANGE] code recibido:', code)

  if (!code) {
    return NextResponse.redirect(`${origin}/register?error=no_code`)
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  console.log('[API EXCHANGE] error:', error)
  console.log('[API EXCHANGE] user:', data?.user?.email)

  if (error) {
    return NextResponse.redirect(`${origin}/register?error=${encodeURIComponent(error.message)}`)
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}
