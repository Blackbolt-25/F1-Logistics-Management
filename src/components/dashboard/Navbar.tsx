import { Home, Users, Briefcase, Settings, BarChart, Barcode, Car } from 'lucide-react'
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import Link from 'next/link'

type NavbarProps = {
  userType: string
}

const navItems = {
  team: [
    { name: 'Dashboard', icon: Home, href: '/dashboard/team' },
    { name: 'Projects', icon: Briefcase, href: '/dashboard/team/projects' },
    { name: 'Team', icon: Car, href: '/dashboard/team/members' },
  ],
  logistics_head: [
    { name: 'Dashboard', icon: Home, href: '/dashboard/logistics_head' },
    { name: 'Inventory', icon: Briefcase, href: '/dashboard/logistics_head/inventory' },
    { name: 'Shipments', icon: BarChart, href: '/dashboard/logistics_head/shipments' },
  ],
  financial_head: [
    { name: 'Dashboard', icon: Home, href: '/dashboard/financial_head' },
    { name: 'Budget', icon: Briefcase, href: '/dashboard/financial_head/budget' },
    { name: 'Reports', icon: BarChart, href: '/dashboard/financial_head/reports' },
  ],
  technical_head: [
    { name: 'Dashboard', icon: Home, href: '/dashboard/technical_head' },
    { name: 'Projects', icon: Briefcase, href: '/dashboard/technical_head/projects' },
    { name: 'Resources', icon: Settings, href: '/dashboard/technical_head/resources' },
  ],
}

export function Navbar({ userType }: NavbarProps) {
  const items = navItems[userType as keyof typeof navItems] || []

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.name}>
          <SidebarMenuButton asChild>
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
