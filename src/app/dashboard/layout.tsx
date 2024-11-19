import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { redirect } from 'next/navigation'

export default function Layout({ 
  children,
  params
}: { 
  children: React.ReactNode
  params: { userType?: string }
}) {
  // Convert userType to lowercase to ensure consistent routing
  // console.log(params.userType)
  const userType = params.userType?.toLowerCase() || 'team'

  // Validate user type
  const validUserTypes = ['team', 'logistics_head', 'financial_head', 'technical_head']
  if (!validUserTypes.includes(userType)) {
    redirect('/dashboard/team')
  }

  return <DashboardLayout userType={userType}>{children}</DashboardLayout>
}
