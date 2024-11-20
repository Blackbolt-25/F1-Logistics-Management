'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { url } from 'inspector/promises'
import { usePathname } from 'next/navigation'
import { redirect } from 'next/navigation'

export default function OutLayout({ 
  children,
  params
}: { 
  children: React.ReactNode
  params: { userType?: string }
}) {
  const pathname = usePathname().split("/");
  var userType = pathname[pathname.length - 1];
  return <DashboardLayout userType={userType}>{children}</DashboardLayout>
}
