import { Home, Users, Briefcase, Settings, BarChart } from 'lucide-react'
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavbarProps = {
  userType: string
}

const navItems = {
  team: [
    { name: 'Requests', icon: Home, href: '/dashboard/team/Requests' },
    { name: 'Inventory', icon: Briefcase, href: '/dashboard/team/inventory' },
    { name: 'Budget', icon: Users, href: '/dashboard/team/budget' },
    { name: 'Shipments', icon: Users, href: '/dashboard/team/shipment' },
  ],
  logistics_head: [
    { name: 'Shipments', icon: Home, href: '/dashboard/logistics_head/shipment' },
  ],
  financial_head: [
    { name: 'Budget', icon: Home, href: '/dashboard/financial_head/budget' },
    { name: 'Requests', icon: Briefcase, href: '/dashboard/financial_head/Requests' },
  ],
  technical_head: [
    { name: 'Requests', icon: Briefcase, href: '/dashboard/technical_head/Requests' },
    { name: 'Inventory', icon: Home, href: '/dashboard/technical_head/inventory' },
  ],
  fia_admin : [
    { name: 'Requests', icon: Briefcase, href: '/dashboard/fia_admin/Requests' },
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
