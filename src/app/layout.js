import './globals.css';
import ClientProviders from './components/ClientProviders';

export const metadata = {
  title: 'Altus — Tu Dashboard Financiero Personal',
  description: 'Gestiona tus finanzas personales con un dashboard intuitivo. Rastrea ingresos, gastos, ahorros y metas financieras.',
  keywords: ['finanzas', 'presupuesto', 'gastos', 'ingresos', 'dashboard financiero'],
};

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning aquí es clave para next-themes
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}