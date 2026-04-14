"use client"

import * as React from "react"
import {
  ArrowUpDown,
  Bot,
  ClipboardPenIcon,
  Command,
  GemIcon,
  Home,
  LandmarkIcon,
  LifeBuoy,
  Map,
  Send,
  Settings2,
  Moon,
  Sun,
} from "lucide-react"

import { useTheme } from "next-themes"
import { useTranslation } from "react-i18next"

import { motion, AnimatePresence } from "framer-motion"

import { Switch } from "@/app/components/ui/switch"

import { NavMain } from "@/app/components/nav-main"
import { NavProjects } from "@/app/components/nav-projects"
import { NavSecondary } from "@/app/components/nav-secondary"
import { NavUser } from "@/app/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/components/ui/sidebar"

const data = {
  user: {
    name: "Dev Joel",
    email: "dev.joel@altus.io",
    avatar: "/icon-512.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
      isActive: true,
    },
    {
      title: "Transacciones",
      url: "/transactions",
      icon: ArrowUpDown,
    },
    {
      title: "Reportes",
      url: "/reports",
      icon: ClipboardPenIcon,
    },
    {
      title: "Cuentas",
      url: "/accounts",
      icon: LandmarkIcon,
    },
    {
      title: "Configuración",
      url: "/settings",
      icon: Settings2,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  features: [
    {
      name: "Wishlists",
      url: "/wishlists",
      icon: GemIcon,
    },
    {
      name: "Travel Planner",
      url: "/travel",
      icon: Map,
    },
    {
      name: "AI Assistant",
      url: "/assistant",
      icon: Bot,
    },
  ],
}

export function AppSidebar({ ...props }) {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation()
  
  // Estado para evitar errores de hidratación
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const isDark = theme === "dark"

  // Dynamic translated nav entries
  const translatedData = {
    ...data,
    navMain: data.navMain.map(item => ({
      ...item,
      title: t(`nav.${item.url.split('/')[1] || 'dashboard'}`)
    })),
    features: data.features.map(item => ({
      ...item,
      name: t(`nav.${item.url.split('/')[1]}`)
    }))
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div
                  className="bg-transparent flex aspect-square size-9 items-center justify-center overflow-hidden">
                  <img src="/logo-navbar.png" alt="Altus Logo" className="size-full object-contain" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight ml-1">
                  <span className="truncate font-bold text-base tracking-tight">Altus</span>
                  <span className="truncate text-xs text-muted-foreground">Finance Dashboard</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={translatedData.navMain} />
        <NavProjects features={translatedData.features} />
        <div className="px-4 py-2 mt-4 border-t border-sidebar-border/50">
          <div className="flex items-center justify-between p-2 rounded-lg bg-sidebar-accent/50 transition-colors duration-300">
            {/* Contenedor Izquierdo: Icono + Texto */}
            <div className="flex items-center gap-3 h-7"> {/* h-7 ayuda a mantener una altura constante para el centrado */}

              {/* Contenedor del Icono: Subido a size-4 para que coincida con el centro visual */}
              <div className="relative size-4 flex items-center justify-center">
                <Sun className={`absolute transition-all duration-500 ${isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`} size={16} />
                <Moon className={`absolute transition-all duration-500 ${isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`} size={16} />
              </div>

              {/* Texto Animado con Framer Motion */}
              <div className="overflow-hidden"> {/* Recorta la animación para que no se vea fuera del área */}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isDark ? "dark" : "light"}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="text-sm font-medium block"
                  >
                    {isDark ? "Modo Oscuro" : "Modo Claro"}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* Switch: Alineado automáticamente por el justify-between del padre */}
            <Switch
              id="theme-mode"
              checked={isDark}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
