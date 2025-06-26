import { CustomerPage } from '@/components/component/dashboard/customers/page-data'
import { UserPage } from '@/components/component/dashboard/users/user-page'
import { Suspense } from 'react'
import { requireAdminOrEmployee } from '@/lib/auth-guards'

export default async function Customers() {
  // Protect this page - only admin and employee users can access
  await requireAdminOrEmployee()

  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<div>Loading...</div>}>
        <UserPage />
      </Suspense>
    </div>
  )
}
