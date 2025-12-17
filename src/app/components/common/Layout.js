'use client';

import React, { useMemo } from 'react';
import { AppSidebar } from '@/app/components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb";
import { Separator } from "@/app/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/app/components/ui/sidebar";
import { usePathname } from 'next/navigation';
import { showToast } from 'nextjs-toast-notify';

// Extraemos la lógica fuera del componente para que no se redefine en cada render
const BREADCRUMBS_MAP = {
  'transactions': 'Transacciones',
  'reports': 'Reportes',
  'accounts': 'Cuentas',
  'settings': 'Configuración',
  'profile': 'Perfil'
};

export default function Layout({ children }) {
  const pathname = usePathname();

  // Memorizamos los breadcrumbs para rendimiento
  const breadcrumbs = useMemo(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const list = [{ title: 'Dashboard', href: '/', isLast: pathSegments.length === 0 }];
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      list.push({
        title: BREADCRUMBS_MAP[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
        href: currentPath,
        isLast
      });
    });
    return list;
  }, [pathname]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((bc, index) => (
                <React.Fragment key={bc.href}>
                  <BreadcrumbItem className={index === 0 && breadcrumbs.length > 1 ? "hidden md:block" : ""}>
                    {bc.isLast ? (
                      <BreadcrumbPage>{bc.title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={bc.href}>{bc.title}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!bc.isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex-1 p-4">
          {children}
        </main>
     
      </SidebarInset>
    </SidebarProvider>
  );
}