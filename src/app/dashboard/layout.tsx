import { DashboardLayout } from '@/components/dashboard/DashboardLayout'

export default function Layout({ children }: { children: React.ReactNode }) {
  // In a real application, you would get the user type from the session or context
  const userType = "team" // This is a placeholder, replace with actual user type

  return <DashboardLayout userType={userType}>{children}</DashboardLayout>
}
