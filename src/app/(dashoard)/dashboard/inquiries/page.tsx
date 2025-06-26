import { lusitana } from '@/components/font'
import { SearchBar } from '@/components/component/search'
import { cookies } from 'next/headers'
import type { paths, components } from '@/types/schemav3'
import { Button } from '@/components/ui/button'
import { get } from 'http'
import { requireAdminOrEmployee } from '@/lib/auth-guards'

export default async function Inquiries() {
  // Protect this page - only admin and employee users can access
  await requireAdminOrEmployee()
  return <div>No Content</div>
}
