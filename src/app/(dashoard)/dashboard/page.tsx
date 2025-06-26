import { Component } from '@/components/component/dashboard/dashboard'
import { GetCurrentUser } from '@/lib/auth_actions'
import { getCompanyRevenue } from '@/lib/company_actions'
import { GetUserCompany } from '@/lib/user_actions'

export default async function Dashboard() {
  var user = await GetCurrentUser()
  if (user?.roles?.length == 1 && user.roles[0] == 'customer') {
    return <div>Hello {user.firstName + ' ' + user.lastName}</div>
  } else {
    var companyId = await GetUserCompany()
    var company_revenues = await getCompanyRevenue(companyId!)
    return <Component data={company_revenues!} />
  }
}
