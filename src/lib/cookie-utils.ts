import { cookies } from 'next/headers'

export async function getAuthCookie() {
  const cookieStore = await cookies()
  return cookieStore.get('.AspNetCore.Identity.Application')
}
