import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  User,
  Briefcase,
  Users,
  Shield,
  UserCheck,
  Package,
  Mail,
  PackageMinus,
  PackagePlus,
} from 'lucide-react'
import exp from 'constants'
import type { paths, components } from '@/types/schemav3'
import { GetUserSecrets } from '@/lib/user_actions'
import { GetCurrentUser } from '@/lib/auth_actions'

type UserSecrets =
  paths['/users/current/secrets']['get']['responses']['200']['content']['application/json']
type EmployeeSecrets = {
  email: 'string'
  userRole: ['string']
  companyCount: number
  userCount: number
  roleCount: number
  employeeCount: number
  managerCount: number
  packagesCount: number
}

export async function UserSecrets() {
  var userRole = await GetCurrentUser()
  var role = userRole?.roles
  if (
    role !== undefined &&
    (role?.includes('admin') || role?.includes('manager') || role?.includes('employee'))
  ) {
    let results: EmployeeSecrets = await GetUserSecrets()
    const employee_stats = [
      { title: 'Companies', value: results.companyCount, icon: Briefcase },
      { title: 'Users', value: results.userCount, icon: Users },
      { title: 'Roles', value: results.roleCount, icon: Shield },
      { title: 'Employees', value: results.employeeCount, icon: User },
      { title: 'Managers', value: results.managerCount, icon: UserCheck },
      { title: 'Packages', value: results.packagesCount, icon: Package },
    ]
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center space-x-4">
            <Mail className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">{results.email}</h2>
              <p className="text-sm text-muted-foreground">Role: {role?.join(', ')}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {employee_stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  } else {
    let results: UserSecrets = await GetUserSecrets()
    const user_stats = [
      { title: 'received_packages', value: results.receivedPackageCount, icon: PackagePlus },
      { title: 'sent_packages', value: results.sentPackageCount, icon: PackageMinus },
    ]
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center space-x-4">
            <Mail className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">{results.email}</h2>
              <p className="text-sm text-muted-foreground">Id: {results.id}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {user_stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }
}
