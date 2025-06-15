import * as React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  Shield,
  LayoutDashboard,
  Key,
  AlertTriangle,
  Scan,
  Settings,
  User,
  LogOut,
} from "lucide-react";

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  items: SidebarNavItem[];
}

export interface SidebarNavItem {
  title: string;
  icon: LucideIcon;
  href: string;
  disabled?: boolean;
}

export function Sidebar({ className, ...props }: SidebarProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  const sidebarItems: SidebarNavItem[] = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      title: "Gestor de Contraseñas",
      icon: Key,
      href: "/password-manager",
    },
    {
      title: "Simulador Phishing",
      icon: AlertTriangle,
      href: "/phishing-simulator",
    },
    {
      title: "Escáner de Red",
      icon: Scan,
      href: "/network-scanner",
    },
    {
      title: "Configuración",
      icon: Settings,
      href: "/settings",
      disabled: false,
    },
  ];

  return (
    <aside
      className={cn("w-64 bg-sidebar fixed h-full flex flex-col", className)}
      {...props}
    >
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <Shield className="text-primary text-2xl" />
          <h1 className="text-xl font-semibold text-sidebar-foreground">CyberShield</h1>
        </div>
      </div>
      
      <nav className="mt-5 flex-1">
        <ul className="space-y-1">
          {sidebarItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "w-full justify-start px-5 py-3 rounded-lg mb-1",
                  item.disabled ? "opacity-50 pointer-events-none" : "",
                  location === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="mr-2 h-5 w-5" />
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-5 border-t border-sidebar-border">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center text-sidebar-foreground">
            <User className="h-5 w-5" />
            <span className="ml-2 font-medium">{user?.username || "Usuario"}</span>
          </div>
          <button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )}
          >
            <LogOut className="mr-2 h-5 w-5" />
            {logoutMutation.isPending ? "Cerrando sesión..." : "Cerrar sesión"}
          </button>
        </div>
      </div>
    </aside>
  );
}
