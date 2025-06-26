import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Package,
  Calendar,
  Truck,
  User,
  Building,
  MapPin,
  DollarSign,
  Weight,
  AlertTriangle,
  Box,
} from 'lucide-react'
import { GetPackageByTracker } from '@/lib/package_actions'

export default async function Page({ params }: { params: Promise<{ packageId: string }> }) {
  const { packageId } = await params
  var pack = await GetPackageByTracker(packageId)
  if (pack == undefined || pack == null) {
    return (
      <main key="1" className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
        <div className="dark:to-dark hidden bg-gradient-to-b from-gray-100/40 to-white dark:bg-gradient-to-b dark:from-gray-800/40 lg:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-[60px] items-center px-6">
              <span className="sr-only">Toggle notifications</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="gap- flex h-14 items-center">
            <div className="w-full flex-1"></div>
          </header>
          <p>Package not found</p>
        </div>
      </main>
    )
  } else {
    const getStatusColor = (status: string) => {
      const statusLower = status.toLowerCase()
      if (statusLower.includes('in delivering')) return 'bg-blue-500'
      if (statusLower.includes('delivered')) return 'bg-green-500'
      if (statusLower.includes('on hold')) return 'bg-yellow-500'
      if (statusLower.includes('wait courier')) return 'bg-cyan-500'
      return 'bg-gray-500'
    }
    return (
      <main className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
        <div className="dark:to-dark hidden bg-gradient-to-b from-gray-100/40 to-white dark:bg-gradient-to-b dark:from-gray-800/40 lg:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-[60px] items-center px-6"></div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4">
            <div className="w-full flex-1"></div>
          </header>
          <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Package Information
                </h1>
                <p className="mt-3 text-xl text-gray-500 sm:mt-4">
                  Track your package and view its details
                </p>
              </div>
              <Card className="mb-8 overflow-hidden shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold">
                      Tracking Number: {pack.trackingNumber}
                    </CardTitle>
                    <Badge
                      className={`text-white ${getStatusColor(pack.status!)} rounded-full px-4 py-2 text-sm font-semibold`}
                    >
                      {pack.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="mb-3 text-lg font-semibold">Shipping Details</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                          <span>Shipped: {pack.shippingDate!}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-5 w-5 text-green-500" />
                          <span>Estimated Delivery: {pack.deliveryDate!}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-5 w-5 text-red-500" />
                          <span>To: {pack.deliveryAddress}</span>
                        </div>
                        <div className="flex items-center">
                          <Truck className="mr-2 h-5 w-5 text-purple-500" />
                          <span>Delivery to Address: {pack.toAdress! ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-3 text-lg font-semibold">Package Details</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Box className="mr-2 h-5 w-5 text-orange-500" />
                          <span>Weight: {pack.packageInfo?.weight} kg</span>
                        </div>
                        <div className="flex items-center">
                          <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                          <span>Fragile: {pack.packageInfo?.fragile ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex items-center">
                          <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                          <span>Hazardous: {pack.packageInfo?.hazardous ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex items-center">
                          <Package className="mr-2 h-5 w-5 text-indigo-500" />
                          <span>Description: {pack.packageInfo?.description}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div>
                      <h3 className="mb-3 text-lg font-semibold">Sender</h3>
                      <div className="flex items-center">
                        <User className="mr-2 h-5 w-5 text-blue-500" />
                        <span>{pack.senderEmail}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-3 text-lg font-semibold">Receiver</h3>
                      <div className="flex items-center">
                        <User className="mr-2 h-5 w-5 text-green-500" />
                        <span>{pack.receiverEmail}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-3 text-lg font-semibold">Shipping Company</h3>
                      <div className="flex items-center">
                        <Building className="mr-2 h-5 w-5 text-purple-500" />
                        <span>{pack.companyName || 'Unknown Company'}</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="mr-2 h-5 w-5 text-gray-500" />
                      <span>Registered by: {pack.registarEmployeeEmail}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="mr-2 h-5 w-5 text-green-500" />
                      <span className="text-xl font-bold">${pack.price?.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    )
  }
}
