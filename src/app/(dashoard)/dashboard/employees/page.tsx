import { lusitana } from '@/components/font'
import { SearchBar } from '@/components/component/search'
import { Suspense } from 'react'
import { CustomerPage } from '@/components/component/dashboard/customers/page-data'
import { EmployeePage } from '@/components/component/dashboard/employee/employee-page'
import { requireAdminOrManager } from '@/lib/auth-guards'

export default async function Employee() {
  // Protect this page - only admin and manager users can access
  await requireAdminOrManager()

  return (
    //   <div className="w-full">
    //   <div className="flex w-full items-center justify-between">
    //     <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
    //   </div>
    //   <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
    //     <SearchBar placeholder="Search invoices..." />
    //     <CreateInvoice />
    //   </div>
    //   <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
    //     <Table query={query} currentPage={currentPage} />
    //   </Suspense>
    //   <div className="mt-5 flex w-full justify-center">
    //     <Pagination totalPages={totalPages} />
    //   </div>
    // </div>
    <div className="container mx-auto py-10">
      <Suspense fallback={<div>Loading...</div>}>
        <EmployeePage />
      </Suspense>
    </div>
  )
}
