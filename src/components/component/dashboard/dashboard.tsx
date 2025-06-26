'use client'
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from '@/components/ui/table'
import React from 'react'
import { LineChart, type ValueFormatter } from '@tremor/react'
import type { CompanyRevenue } from '@/types/dashboard'

const valueFormatter: ValueFormatter = function (number) {
  return '$ ' + new Intl.NumberFormat('us').format(number).toString()
}

export function Component({
  data,
  userRole = 'employee',
}: {
  data: CompanyRevenue[]
  userRole?: string
}) {
  const getChartTitle = () => {
    if (userRole === 'admin') {
      return 'All Companies Revenue Overview'
    }
    return 'Your Company Revenue'
  }

  const getChartDescription = () => {
    if (userRole === 'admin') {
      return 'Revenue data across all companies (USD)'
    }
    return 'Company revenue over time (USD)'
  }

  // For admin view, we might want to process data to show multiple companies
  const processedData = React.useMemo(() => {
    if (userRole === 'admin' && data) {
      // Group data by company and date for better visualization
      const groupedData: { [key: string]: any } = {}

      data.forEach(item => {
        const dateKey = item.date || 'Unknown'
        if (!groupedData[dateKey]) {
          groupedData[dateKey] = { date: dateKey, totalRevenue: 0, revenue: 0 }
        }
        groupedData[dateKey].revenue += item.revenue || 0
        groupedData[dateKey].totalRevenue += item.revenue || 0
      })

      return Object.values(groupedData)
    }
    return data
  }, [data, userRole])

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">
          {userRole === 'admin' ? 'All Companies Revenues' : 'Company Revenue'}
        </h1>
      </div>
      <div className="rounded-lg border p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
          {getChartDescription()}
        </h3>
        {processedData && processedData.length > 0 ? (
          <>
            <LineChart
              className="mt-4 h-72"
              data={processedData}
              index="date"
              yAxisWidth={65}
              categories={['revenue']}
              colors={
                userRole === 'admin' ? ['indigo', 'cyan', 'emerald', 'amber'] : ['indigo', 'cyan']
              }
              valueFormatter={valueFormatter}
            />
            <div className="mt-4 text-sm text-gray-600">
              {userRole === 'admin'
                ? `Showing revenue data for all companies (${data.length} records)`
                : `Showing revenue data for your company (${data.length} records)`}
            </div>
          </>
        ) : (
          <div className="mt-4 flex h-72 items-center justify-center rounded-lg border-2 border-dashed border-gray-200">
            <div className="text-center">
              <p className="mb-2 text-lg text-gray-500">No revenue data available</p>
              <p className="text-sm text-gray-400">
                {userRole === 'admin'
                  ? 'No companies have revenue data yet'
                  : "Your company doesn't have revenue data yet"}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
