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
