import Layout from '@/app/components/common/Layout';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/db';
import { profiles, subscriptions, accounts, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function DashboardLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let userProfile = null;
  let userSubscription = null;

  if (user) {
    // Paralelizar todas las queries del sidebar
    const [profileResult, subscriptionResult] = await Promise.all([
      db.select().from(profiles).where(eq(profiles.id, user.id)).limit(1),
      db.select().from(subscriptions).where(eq(subscriptions.userId, user.id)).limit(1),
    ]);

    userProfile = profileResult[0] ?? null;
    userSubscription = subscriptionResult[0] ?? null;

    // Solo crear perfil+cuentas si el usuario es nuevo (no tiene perfil aún)
    if (!userProfile) {
      try {
        const { setupNewUser } = await import('@/app/lib/actions/auth');
        await setupNewUser();
        // Re-fetch después del setup
        const [p2, s2] = await Promise.all([
          db.select().from(profiles).where(eq(profiles.id, user.id)).limit(1),
          db.select().from(subscriptions).where(eq(subscriptions.userId, user.id)).limit(1),
        ]);
        userProfile = p2[0] ?? null;
        userSubscription = s2[0] ?? null;
      } catch (e) {
        console.error('Error en setup de nuevo usuario:', e);
      }
    }
  }

  return <Layout user={userProfile} subscription={userSubscription}>{children}</Layout>;
}
