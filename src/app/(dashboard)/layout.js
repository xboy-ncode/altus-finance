import Layout from '@/app/components/common/Layout';
import { setupNewUser } from '@/app/lib/actions/auth';

export default async function DashboardLayout({ children }) {
  // Inicializar usuario, cuentas y categorías por defecto si es la primera vez
  await setupNewUser();

  return <Layout>{children}</Layout>;
}
