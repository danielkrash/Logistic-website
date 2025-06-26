import type { Packages } from '@/types/dashboard'
import { PendingShipmentTable } from './data-table'
import { pendingShipmentColumns } from './columns'
import { GetPendingPackagesForCourier } from '@/lib/package_actions'
import { requireCourier } from '@/lib/auth-guards'

export async function PendingShipmentPage() {
  // Check if user is a courier (this will redirect if not)
  await requireCourier()

  const data = await GetPendingPackagesForCourier()
  console.log('Pending packages for courier:', data)

  // Client-side filtering as backup in case backend filtering isn't working
  const waitingCourierPackages =
    data?.filter(pkg => {
      const status = pkg.status?.toLowerCase()
      return status === 'waiting courier' || status === 'wait courier' || status?.includes('wait')
    }) || []

  console.log('Filtered waiting courier packages:', waitingCourierPackages.length)
  console.log('All statuses found:', [...new Set(data?.map(pkg => pkg.status) || [])])

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-2xl font-bold">Pending Shipments - Waiting for Courier</h1>
      <p className="mb-4 text-gray-600">
        These packages are waiting to be assigned to a courier. Click &ldquoAssign to Me&ldquo to
        take responsibility for delivery.
      </p>
      <PendingShipmentTable columns={pendingShipmentColumns} data={waitingCourierPackages} />
    </div>
  )
}
