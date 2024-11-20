// 'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { url } from 'inspector/promises'
// import { usePathname } from 'next/navigation'
import { redirect } from 'next/navigation'

export default function Layout({ 
  children,
  params
}: { 
  children: React.ReactNode
  params: { userType?: string }
}) {
  // const pathname = usePathname().split("/");
  // var userType = pathname[pathname.length - 1];
  // if(userType == 'team')
  //   userType = 'Team';
  const userType = 'team';
  return <DashboardLayout userType={userType}>{children}</DashboardLayout>
}
