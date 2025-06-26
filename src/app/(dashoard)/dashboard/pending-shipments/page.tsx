import type { Packages } from '@/types/dashboard'
import { PendingShipmentPage } from '@/components/component/dashboard/pending_shipments/page-data'
import { Suspense } from 'react'
import { requireCourier } from '@/lib/auth-guards'

export default async function PendingShipments() {
  // Protect this page - only courier employees can access
  await requireCourier()

  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<div>Loading...</div>}>
        <PendingShipmentPage />
      </Suspense>
    </div>
  )
}
