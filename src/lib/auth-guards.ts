'use server'
import { redirect } from 'next/navigation'
import { GetCurrentUser } from './auth_actions'
import type { components } from '@/types/schemav3'

type User = components['schemas']['UserDto']

export async function requireAuth(): Promise<User> {
  const user = await GetCurrentUser()
  if (!user) {
    redirect('/sign-in')
  }
  return user
}

export async function requireAdminOrEmployee(): Promise<User> {
  const user = await requireAuth()

  // If user is customer only, redirect to dashboard home
  if (user.roles?.length === 1 && user.roles[0] === 'customer') {
    redirect('/dashboard')
  }

  return user
}

export async function requireAdmin(): Promise<User> {
  const user = await requireAuth()

  // If user is not admin, redirect to dashboard home
  if (!user.roles?.includes('admin')) {
    redirect('/dashboard')
  }

  return user
}

export async function requireCourier(): Promise<User> {
  const user = await requireAuth()

  // Check if user is an employee (has employee role)
  if (!user.roles?.includes('employee')) {
    redirect('/dashboard')
  }

  // Get employee information to check position
  const { GetCurrentUserEmployee } = await import('./employee_actions')
  const employee = await GetCurrentUserEmployee()

  if (!employee || employee.position?.toLowerCase() !== 'courier') {
    redirect('/dashboard')
  }

  return user
}

export async function requireAdminOrManager(): Promise<User> {
  const user = await requireAuth()
  console.log('User roles:', user.roles)
  // If user is not admin or manager, redirect to dashboard home
  if (!user.roles?.includes('admin') && !user.roles?.includes('manager')) {
    redirect('/dashboard')
  }
  console.log('User is admin or manager:', user)
  return user
}
