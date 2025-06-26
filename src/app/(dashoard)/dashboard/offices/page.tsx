import type { Packages } from '@/types/dashboard'
import { CompanyPage } from '@/components/component/dashboard/company/page-data'
import { Suspense } from 'react'
import { OfficePage } from '@/components/component/dashboard/office/page-data'
import { requireAdminOrEmployee } from '@/lib/auth-guards'

export default async function Company() {
  // Protect this page - only admin and employee users can access
  await requireAdminOrEmployee()

  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<div>Loading...</div>}>
        <OfficePage />
      </Suspense>
    </div>
  )
}
