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
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }) {
  const pathname = usePathname();
  const { t } = useTranslation();

  // Memorizamos los breadcrumbs para rendimiento
  const breadcrumbs = useMemo(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const list = [{ title: t('nav.dashboard'), href: '/', isLast: pathSegments.length === 0 }];
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      list.push({
        title: t(`nav.${segment}`, { defaultValue: segment.charAt(0).toUpperCase() + segment.slice(1) }),
        href: currentPath,
        isLast
      });
    });
    return list;
  }, [pathname, t]);

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
        <main className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full w-full p-4"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}