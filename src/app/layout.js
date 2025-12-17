import './globals.css';
import ClientProviders from './components/ClientProviders';
import { showToast } from 'nextjs-toast-notify';

export const metadata = {
  title: 'Tu Aplicación Financiera',
  description: 'Dashboard financiero con Next.js',
};

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning aquí es clave para next-themes
    <html lang="es" suppressHydrationWarning>
      <body>
        
        <ClientProviders>

          {children}
        </ClientProviders>
       
      </body>
    </html>
  );
}