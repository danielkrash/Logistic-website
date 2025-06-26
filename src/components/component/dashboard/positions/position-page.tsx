import { GetPositions } from '@/lib/position_actions'
import { PositionColumns } from '@/components/component/dashboard/positions/position-columns'
import { PositionDataTable } from './position-data-table'

export async function PositionPage() {
  const data = await GetPositions()

  return (
    <div className="container mx-auto w-full py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Positions</h1>
        <p className="text-muted-foreground">Manage all positions in your organization</p>
      </div>
      <PositionDataTable columns={PositionColumns} data={data || []} />
    </div>
  )
}
