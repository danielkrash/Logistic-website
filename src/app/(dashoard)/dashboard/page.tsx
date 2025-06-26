import { Component } from '@/components/component/dashboard/dashboard'
import { GetCurrentUser } from '@/lib/auth_actions'
import { getCompanyRevenue, getAllCompaniesRevenue } from '@/lib/company_actions'
import { GetUserCompany } from '@/lib/user_actions'

export default async function Dashboard() {
  var user = await GetCurrentUser()

  // Customer users - don't see anything (just basic greeting)
  if (user?.roles?.length == 1 && user.roles[0] == 'customer') {
    return <div>Hello {user.firstName + ' ' + user.lastName}</div>
  }
  // Admin users - show ALL companies revenue chart
  else if (user?.roles?.includes('admin')) {
    var allCompaniesRevenue = await getAllCompaniesRevenue()
    return <Component data={allCompaniesRevenue || []} userRole="admin" />
  }
  // Manager/Employee users - show only revenue for company where they are working
  else {
    var companyId = await GetUserCompany()
    var company_revenues = await getCompanyRevenue(companyId!)
    return <Component data={company_revenues || []} userRole="employee" />
  }
}
