import { Home, Users, Briefcase, Settings, BarChart } from 'lucide-react'
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavbarProps = {
  userType: string
}

const navItems = {
  team: [
    { name: 'Requests', icon: Home, href: '/dashboard/Team/Requests' },
    { name: 'Inventory', icon: Briefcase, href: '/dashboard/Team/inventory' },
    { name: 'Budget', icon: Users, href: '/dashboard/Team/budget' },
    { name: 'Shipments', icon: Users, href: '/dashboard/Team/shipment' },
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
  const pathname = usePathname()
  const items = navItems[userType as keyof typeof navItems] || []

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.name}>
          <SidebarMenuButton asChild isActive={pathname === item.href}>
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
