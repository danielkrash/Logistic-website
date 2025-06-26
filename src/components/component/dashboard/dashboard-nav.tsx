import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PackageIcon, BellIcon, SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from '@/components/ui/dropdown-menu'
import Image from 'next/image'
import { LeftNav } from '@/components/component/dashboard/dashboard-nav-left'
import { MobileNav } from '@/components/component/dashboard/dashboard-nav-mobile'
import { UserNav } from '@/components/component/user-nav'
import { GetCurrentUser } from '@/lib/auth_actions'
import { GetCurrentUserEmployee } from '@/lib/employee_actions'

export async function MainDashboardNav({ children }: { children?: React.ReactNode }) {
  let user = await GetCurrentUser()
  let employee = null

  // Get employee data if user has employee role
  if (user?.roles?.includes('employee')) {
    try {
      employee = await GetCurrentUserEmployee()
    } catch (error) {
      console.error('Failed to fetch employee data:', error)
    }
  }

  return (
    <main key="1" className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="dark:to-dark hidden border-r bg-gradient-to-b from-gray-100/40 to-white dark:bg-gradient-to-b dark:from-gray-800/40 lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="/">
              <PackageIcon className="h-6 w-6" />
              <span className="">Logistic Inc</span>
            </Link>
            <Button className="ml-auto h-8 w-8" size="icon" variant="outline">
              <BellIcon className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <LeftNav user={user!} employee={employee} />
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 lg:h-[60px]">
          <div className="w-full flex-1">
            <MobileNav user={user!} employee={employee} />
          </div>
          <UserNav user={user} />
        </header>
        {children}
      </div>
    </main>
  )
}
