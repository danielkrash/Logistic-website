import type { Packages } from '@/types/dashboard'
import { CompanyPage } from '@/components/component/dashboard/company/page-data'
import { Suspense } from 'react'
import { requireAdminOrManager } from '@/lib/auth-guards'

export default async function Company() {
  // Protect this page - only admin and manager users can access
  await requireAdminOrManager()

  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<div>Loading...</div>}>
        <CompanyPage />
      </Suspense>
    </div>
  )
}
