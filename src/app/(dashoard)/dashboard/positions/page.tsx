import { PositionPage } from '@/components/component/dashboard/positions/page-data'
import { Suspense } from 'react'
import { requireAdminOrManager } from '@/lib/auth-guards'

export default async function Positions() {
  // Protect this page - only admin and manager users can access
  await requireAdminOrManager()

  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<div>Loading...</div>}>
        <PositionPage />
      </Suspense>
    </div>
  )
}
