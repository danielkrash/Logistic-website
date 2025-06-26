'use client'
import Link, { type LinkProps } from 'next/link'
import {
  PackageIcon,
  HomeIcon,
  UsersIcon,
  NewspaperIcon,
  type LucideIcon,
  Building2Icon,
  BriefcaseIcon,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import type { Route } from 'next'
import type { components } from '@/types/schemav3'

type LinkGroup = LinkProps<Route> & {
  name: string
  icon: LucideIcon
}

type User = components['schemas']['UserDto']

export function LeftNav({ user, employee }: { user: User; employee?: any }) {
  const pathname = usePathname()

  // Check if user is a courier (has employee role and courier position)
  const isCourier =
    user.roles?.includes('employee') && employee?.position?.toLowerCase() === 'courier'

  if (user.roles?.length == 1 && user.roles?.at(0) === 'customer') {
    const links: LinkGroup[] = [
      { name: 'Home', href: '/dashboard', icon: HomeIcon },
      { name: 'Shipments', href: '/dashboard/shipments', icon: PackageIcon },
    ]
    return (
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          {links.map(link => {
            const LinkIcon = link.icon
            return (
              <Link
                key={link.name}
                href={link.href}
                prefetch={true}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  pathname === link.href
                    ? 'text-blue-600 drop-shadow-sm transition-all hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-300/40'
                    : 'text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50'
                }`}
              >
                <LinkIcon className="h-4 w-4" />
                <p className="hidden md:block">{link.name}</p>
              </Link>
            )
          })}
        </nav>
      </div>
    )
  } else if (
    !user.roles?.includes('admin') &&
    !user.roles?.includes('manager') &&
    user.roles?.includes('employee')
  ) {
    // Navigation for regular employee users (excluding admin and manager)
    const links: LinkGroup[] = [
      { name: 'Home', href: '/dashboard', icon: HomeIcon },
      { name: 'Shipments', href: '/dashboard/shipments', icon: PackageIcon },
    ]

    // Only add Pending Shipments for couriers
    if (isCourier) {
      links.push({
        name: 'PendingShipments',
        href: '/dashboard/pending-shipments',
        icon: PackageIcon,
      })
    }
    return (
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          {links.map(link => {
            const LinkIcon = link.icon
            return (
              <Link
                key={link.name}
                href={link.href}
                prefetch={true}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  pathname === link.href
                    ? 'text-blue-600 drop-shadow-sm transition-all hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-300/40'
                    : 'text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50'
                }`}
              >
                <LinkIcon className="h-4 w-4" />
                <p className="hidden md:block">{link.name}</p>
              </Link>
            )
          })}
        </nav>
      </div>
    )
  } else if (
    (user.roles?.includes('admin') || user.roles?.includes('manager')) &&
    user.roles?.includes('employee')
  ) {
    // Navigation for admin/manager employee users
    const links: LinkGroup[] = [
      { name: 'Home', href: '/dashboard', icon: HomeIcon },
      {
        name: 'Employees',
        href: '/dashboard/employees',
        icon: UsersIcon,
      },
      { name: 'Users', href: '/dashboard/users', icon: UsersIcon },
      { name: 'Positions', href: '/dashboard/positions' as any, icon: BriefcaseIcon },
      { name: 'Offices', href: '/dashboard/offices', icon: HomeIcon },
      { name: 'Shipments', href: '/dashboard/shipments', icon: PackageIcon },
    ]

    // Only add Pending Shipments for couriers (even if they're admin/manager)
    if (isCourier) {
      links.push({
        name: 'PendingShipments',
        href: '/dashboard/pending-shipments',
        icon: PackageIcon,
      })
    }
    return (
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          {links.map(link => {
            const LinkIcon = link.icon
            return (
              <Link
                key={link.name}
                href={link.href}
                prefetch={true}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  pathname === link.href
                    ? 'text-blue-600 drop-shadow-sm transition-all hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-300/40'
                    : 'text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50'
                }`}
              >
                <LinkIcon className="h-4 w-4" />
                <p className="hidden md:block">{link.name}</p>
              </Link>
            )
          })}
        </nav>
      </div>
    )
  } else {
    const links: LinkGroup[] = [
      { name: 'Home', href: '/dashboard', icon: HomeIcon },
      {
        name: 'Company',
        href: '/dashboard/company',
        icon: Building2Icon,
      },
      {
        name: 'Employees',
        href: '/dashboard/employees',
        icon: UsersIcon,
      },
      // { name: 'Customers', href: '/dashboard/customers', icon: UsersIcon },
      { name: 'Users', href: '/dashboard/users', icon: UsersIcon },
      { name: 'Positions', href: '/dashboard/positions' as any, icon: BriefcaseIcon },
      { name: 'Offices', href: '/dashboard/offices', icon: HomeIcon },
      { name: 'Shipments', href: '/dashboard/shipments', icon: PackageIcon },
      // { name: 'Inquiries', href: '/dashboard/inquiries', icon: NewspaperIcon },
    ]
    return (
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          {links.map(link => {
            const LinkIcon = link.icon
            return (
              <Link
                key={link.name}
                href={link.href}
                prefetch={true}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  pathname === link.href
                    ? 'text-blue-600 drop-shadow-sm transition-all hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-300/40'
                    : 'text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50'
                }`}
              >
                <LinkIcon className="h-4 w-4" />
                <p className="hidden md:block">{link.name}</p>
              </Link>
            )
          })}
        </nav>
      </div>
    )
  }
}
