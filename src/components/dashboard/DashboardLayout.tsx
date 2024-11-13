'use client'

import { useState } from 'react'
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarTrigger } from "@/components/ui/sidebar"
import { Navbar } from './Navbar'
import { UserNav } from './UserNav'

type DashboardLayoutProps = {
  children: React.ReactNode
  userType: string
}

export function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar>
          <SidebarHeader>
            <h2 className="text-lg font-semibold">Dashboard</h2>
          </SidebarHeader>
          <SidebarContent>
            <Navbar userType={userType} />
          </SidebarContent>
          <SidebarFooter>
            <UserNav />
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 overflow-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold">{userType.charAt(0).toUpperCase() + userType.slice(1)} Dashboard</h1>
            <div className="w-8" /> {/* Spacer for alignment */}
          </div>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
