'use client'

import { useState } from 'react'
import Link, { type LinkProps } from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Package,
  PackageIcon,
  type LucideIcon,
  HomeIcon,
  UsersIcon,
  NewspaperIcon,
  ArrowUpRightSquareIcon,
  Building2Icon,
  BriefcaseIcon,
} from 'lucide-react'
import type { Route } from 'next'
import { usePathname } from 'next/navigation'
import type { components } from '@/types/schemav3'

type LinkGroup = LinkProps<Route> & {
  name: string
  icon: LucideIcon
}
type User = components['schemas']['UserDto']

export function MobileNav({ user }: { user: User }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  if (user.roles?.length == 1 && user.roles?.at(0) === 'customer') {
    const links: LinkGroup[] = [
      {
        name: 'Company',
        href: '/dashboard/company',
        icon: Building2Icon,
      },
      { name: 'Shipments', href: '/dashboard/shipments', icon: PackageIcon },
    ]
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
          >
            <PackageIcon className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0">
          <MobileLink href="/dashboard" className="flex items-center" onOpenChange={setOpen}>
            <Package size={32} className="h-8" />
            <span className="self-center whitespace-nowrap text-2xl font-semibold">Parcel Co.</span>
          </MobileLink>
          <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
            <div className="flex flex-col space-y-3">
              {links.map(link => {
                // const LinkIcon = link.icon;
                return (
                  <MobileLink
                    key={link.name}
                    href={link.href}
                    className={`${
                      pathname === link.href
                        ? 'text-blue-600 drop-shadow-sm transition-all hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-300/40'
                        : 'text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50'
                    }`}
                    onOpenChange={setOpen}
                  >
                    {/* <LinkIcon className='h-6 w-6'/> */}
                    <span className="text-lg">{link.name}</span>
                  </MobileLink>
                )
              })}
              <MobileLink
                className="flex h-10 items-center text-lg"
                href={'/'}
                onOpenChange={setOpen}
              >
                <span className="text-xl">Parcel Homepage</span>
                <ArrowUpRightSquareIcon className="mx-3 h-4 w-4 place-items-end" />
              </MobileLink>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    )
  } else {
    const links: LinkGroup[] = [
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
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
          >
            <PackageIcon className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0">
          <MobileLink href="/dashboard" className="flex items-center" onOpenChange={setOpen}>
            <Package size={32} className="h-8" />
            <span className="self-center whitespace-nowrap text-2xl font-semibold">Parcel Co.</span>
          </MobileLink>
          <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
            <div className="flex flex-col space-y-3">
              {links.map(link => {
                // const LinkIcon = link.icon;
                return (
                  <MobileLink
                    key={link.name}
                    href={link.href}
                    className={`${
                      pathname === link.href
                        ? 'text-blue-600 drop-shadow-sm transition-all hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-300/40'
                        : 'text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50'
                    }`}
                    onOpenChange={setOpen}
                  >
                    {/* <LinkIcon className='h-6 w-6'/> */}
                    <span className="text-lg">{link.name}</span>
                  </MobileLink>
                )
              })}
              <MobileLink
                className="flex h-10 items-center text-lg"
                href={'/'}
                onOpenChange={setOpen}
              >
                <span className="text-xl">Parcel Homepage</span>
                <ArrowUpRightSquareIcon className="mx-3 h-4 w-4 place-items-end" />
              </MobileLink>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    )
  }
}

type MobileLinkProps = LinkProps<Route> & {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({ href, onOpenChange, className, children, ...props }: MobileLinkProps) {
  return (
    <Link
      href={href}
      onClick={() => {
        onOpenChange?.(false)
      }}
      className={className}
    >
      {children}
    </Link>
  )
}
