import type { components } from '@/types/schemav3'

type User = components['schemas']['UserDto']

export function isCustomerOnly(user: User): boolean {
  return user.roles?.length === 1 && user.roles[0] === 'customer'
}

export function isEmployee(user: User): boolean {
  return (user.roles?.includes('employee') && !user.roles?.includes('admin')) ?? false
}

export function isAdmin(user: User): boolean {
  return user.roles?.includes('admin') ?? false
}

export async function isCourier(user: User): Promise<boolean> {
  if (!user.roles?.includes('employee')) {
    return false
  }

  const { GetCurrentUserEmployee } = await import('./employee_actions')
  const employee = await GetCurrentUserEmployee()

  return employee?.position?.toLowerCase() === 'courier'
}

export function getStatusBadgeProps(status: string) {
  const statusLower = status?.toLowerCase()
  let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default'
  let badgeClasses = ''

  switch (statusLower) {
    case 'on hold':
      badgeVariant = 'outline'
      badgeClasses = 'border-orange-500 text-orange-700 bg-orange-50'
      break
    case 'delivered':
      badgeVariant = 'default'
      badgeClasses = 'bg-green-600 text-white'
      break
    case 'in delivering':
      badgeVariant = 'default'
      badgeClasses = 'bg-blue-600 text-white'
      break
    case 'canceled':
      badgeVariant = 'destructive'
      badgeClasses = 'bg-red-600 text-white'
      break
    case 'wait courier':
    case 'waiting courier':
      badgeVariant = 'secondary'
      badgeClasses = 'bg-yellow-100 text-yellow-800 border-yellow-300'
      break
    default:
      badgeVariant = 'outline'
      badgeClasses = 'border-gray-300 text-gray-700'
  }

  return { badgeVariant, badgeClasses }
}
