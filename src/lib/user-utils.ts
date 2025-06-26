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
