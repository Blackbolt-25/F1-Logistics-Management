'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { url } from 'inspector/promises'
import { usePathname } from 'next/navigation'
import { redirect } from 'next/navigation'

export default function Layout({ 
  children,
  params
}: { 
  children: React.ReactNode
  params: { userType?: string }
}) {
  const pathname = usePathname().split("/");
  var userType = pathname[pathname.length - 1];
  var userType2 = pathname[pathname.length - 2]
  const table = ['team','technical_head','financial_head','fia_admin','logistics_head']
  var counter=0;
  for(let i=0;i<table.length;i++){
      if(userType==table[i])
          counter=1;
  }
  if(counter==0)
    userType=userType2
  return <DashboardLayout userType={userType}>{children}</DashboardLayout>
}
