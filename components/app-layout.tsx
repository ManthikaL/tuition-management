"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Menu, X, Moon, Sun, LogOut, Bell } from "lucide-react";
import { useApp } from "@/contexts/app-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, setTheme } = useTheme();
  const { currentUser, setCurrentUser, notifications } = useApp();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const menuItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: "📊",
    },
    {
      label: "Students",
      href: "/students",
      icon: "👨‍🎓",
    },
    {
      label: "Tutors",
      href: "/tutors",
      icon: "👩‍🏫",
    },
    {
      label: "Attendance",
      href: "/attendance",
      icon: "✓",
    },
    {
      label: "Fees",
      href: "/fees",
      icon: "💰",
    },
    {
      label: "Reports",
      href: "/reports",
      icon: "📈",
    },
    {
      label: "Classes",
      href: "/classes",
      icon: "🏫",
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: "🔔",
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
  ];

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-card text-card-foreground transition-all duration-300 flex flex-col border-r border-border`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && (
            <Link
              href="/dashboard"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                T
              </div>
              <span className="font-bold text-lg hidden md:inline">
                Tuition
              </span>
            </Link>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group relative"
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && (
                <>
                  <span className="text-sm font-medium flex-1">
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-sidebar-border p-3 space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`w-full ${sidebarOpen ? "justify-start" : "justify-center"}`}
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4" />
                {sidebarOpen && <span className="ml-2 text-xs">Light</span>}
              </>
            ) : (
              <>
                <Moon className="w-4 h-4" />
                {sidebarOpen && <span className="ml-2 text-xs">Dark</span>}
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className={`w-full justify-${sidebarOpen ? "start" : "center"} text-destructive hover:text-destructive hover:bg-destructive/10`}
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span className="ml-2 text-xs">Logout</span>}
          </Button>

          {/* <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`w-full justify-${sidebarOpen ? "start" : "center"}`}
          >
            {sidebarOpen ? (
              <>
                <X className="w-4 h-4" />
                <span className="ml-2 text-xs">Collapse</span>
              </>
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </Button> */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card text-card-foreground border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {currentUser?.role === "admin" && "Admin Dashboard"}
              {currentUser?.role === "tutor" && "Tutor Portal"}
              {currentUser?.role === "student" && "Student Portal"}
              {currentUser?.role === "parent" && "Parent Portal"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>

            {/* User Info */}
            <Card className="px-4 py-2">
              <div className="text-sm">
                <p className="font-semibold">{currentUser?.name}</p>
                <p className="text-muted-foreground text-xs capitalize">
                  {currentUser?.role}
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-background">
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
