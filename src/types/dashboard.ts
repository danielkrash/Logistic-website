import type { components, paths } from '@/types/schemav3'

export type Users = paths['/users']['get']['responses']['200']['content']['application/json']
export type User = paths['/users/{id}']['get']['responses']['200']['content']['application/json']
export type CreatedUser = paths['/users']['post']['responses']['201']['content']['application/json']
export type Roles = paths['/role']['get']['responses']['200']['content']['application/json']
export type Companies = paths['/company']['get']['responses']['200']['content']['application/json']
export type Company =
  paths['/company/{id}']['get']['responses']['200']['content']['application/json']
export type Offices = paths['/office']['get']['responses']['200']['content']['application/json']
export type Office = paths['/office/{id}']['get']['responses']['200']['content']['application/json']
export type Employee =
  paths['/employee/{id}']['get']['responses']['200']['content']['application/json']
export type Positions = paths['/position']['get']['responses']['200']['content']['application/json']
export type ChangeEmployee =
  paths['/employee/{id}']['put']['requestBody']['content']['application/json']
export type Packages = paths['/package']['get']['responses']['200']['content']['application/json']
export type Package =
  paths['/package/{id}']['get']['responses']['200']['content']['application/json']
export type PackageInfo = components['schemas']['PackageInfo']
export type PackageCreate = components['schemas']['AddPackageDto']
export type PackageStatuses =
  paths['/package/status']['get']['responses']['200']['content']['application/json']
export type CompanyRevenue = components['schemas']['CompanyRevenue']
export type TrackedPackage =
  paths['/package/track/{id}']['get']['responses']['200']['content']['application/json']
export type PackageStatus = components['schemas']['PackageStatus']

export type Customers = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  company: string
  created: string
}
