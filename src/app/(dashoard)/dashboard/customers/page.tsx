import { CustomerPage } from '@/components/component/dashboard/customers/page-data'
import { Suspense } from 'react'
import { requireAdminOrEmployee } from '@/lib/auth-guards'

export default async function Customers() {
  // Protect this page - only admin and employee users can access
  await requireAdminOrEmployee()
  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<div>Loading...</div>}>
        <CustomerPage />
      </Suspense>
    </div>
  )
}
