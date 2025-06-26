'use server'
import 'server-only'
import { getAuthCookie } from './cookie-utils'
import { permanentRedirect, redirect } from 'next/navigation'
import type { paths, components } from '@/types/schemav3'
import type {
  CreatedUser,
  Packages,
  PackageStatuses,
  Roles,
  TrackedPackage,
  Users,
} from '@/types/dashboard'
import { revalidateTag } from 'next/cache'

export async function createPackagePartial(data: FormData) {
  var cookie = await getAuthCookie()

  // Convert FormData to the expected AddPackageDto format
  let add_data = JSON.stringify({
    senderEmail: data.get('senderEmail'),
    receiverEmail: data.get('receiverEmail'),
    deliveryAddress: data.get('deliveryAddress'),
    weight: parseFloat(data.get('weight') as string), // Convert to number as expected by schema
    toAdress: data.get('toAdress'), // Note: API has typo "toAdress" instead of "toAddress"
    companyName: data.get('companyName'), // Send company name as expected by schema
    description: data.get('description'),
    fragile: data.get('fragile'), // String value as expected by schema
    hazardous: data.get('hazardous'), // String value as expected by schema
    price: 0, // Default price, might be calculated by the backend
  })

  console.log('Sending package data:', add_data)

  try {
    const response = await fetch('http://localhost:7028/package', {
      method: 'POST',
      credentials: 'include',
      body: add_data,
      headers: {
        'Content-Type': 'application/json',
        Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
      },
    })

    console.log('Package creation response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Package creation failed:', errorText)
      return {
        success: false,
        error: `Failed to create package: ${response.status}`,
      }
    }

    const result = await response.json()
    console.log('Package creation result:', result)

    revalidateTag('package')
    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
    return {
      success: false,
      error: 'Network error occurred while creating package',
    }
  }
}

export async function GetPackages(status?: string) {
  var cookie = await getAuthCookie()
  if (status) {
    var url = `http://localhost:7028/package?registered=${status}`
  } else {
    var url = `http://localhost:7028/package`
  }
  try {
    const response = await fetch(url, {
      next: { tags: ['package'] },
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
      },
    })
    let result: Packages = await response.json()
    return result
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
  }
}
export async function GetPackageByTracker(id: string) {
  var cookie = await getAuthCookie()
  try {
    const response = await fetch(`http://localhost:7028/package/track/${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
      },
    })
    let result: TrackedPackage = await response.json()
    return result
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
  }
}

export async function changePackageDataById(data: FormData, id: string) {
  var cookie = await getAuthCookie()
  let change_data = JSON.stringify({
    status: data.get('status'),
    address: data.get('address'),
    toAdress: data.get('toAdress'),
  })
  let url = `http://localhost:7028/package/${id}`
  try {
    const response = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
      body: change_data,
      headers: {
        'Content-Type': 'application/json',
        Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
      },
    })
    console.log(response)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    revalidateTag('package')
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
  }
  redirect('http://localhost:3000/dashboard/shipments')
}

export async function DeletePackageById(id: string) {
  var cookie = await getAuthCookie()
  let url = `http://localhost:7028/package/${id}`
  try {
    const response = await fetch(url, {
      cache: 'no-store',
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
      },
    })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
  }
  redirect('http://localhost:3000/dashboard/shipments')
}
export async function RegisterPackageById(id: string) {
  var cookie = await getAuthCookie()
  let url = `http://localhost:7028/package/${id}/register`

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
      },
    })

    console.log('Package registration response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Package registration failed:', errorText)
      return {
        success: false,
        error: `Failed to register package: ${response.status}`,
      }
    }

    console.log('Package registered successfully')
    revalidateTag('package')
    return {
      success: true,
    }
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
    return {
      success: false,
      error: 'Network error occurred while registering package',
    }
  }
}

export const package_status_fetcher = async (url: string) => {
  var cookie = await getAuthCookie()
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
    },
  })
  if (!response.ok) {
    throw new Error('An error occurred while fetching the data.')
  }
  var result: PackageStatuses = await response.json()
  return result
}

export async function GetPendingPackagesForCourier() {
  var cookie = await getAuthCookie()
  try {
    // Try different status parameter formats
    const statusParam = 'waiting courier'
    const encodedStatus = encodeURIComponent(statusParam)
    const url = `http://localhost:7028/package?status=${encodedStatus}`

    console.log('Fetching packages with URL:', url)

    const response = await fetch(url, {
      next: { tags: ['package'] },
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
      },
    })

    if (!response.ok) {
      console.error('Failed to fetch pending packages. Response status:', response.status)
      const errorText = await response.text()
      console.error('Error response:', errorText)
      throw new Error('Failed to fetch pending packages')
    }

    let result: Packages = await response.json()

    // Debug logging to see what statuses are returned
    console.log('Total packages returned:', result.length)
    const statuses = result.map(pkg => pkg.status)
    console.log('Package statuses:', [...new Set(statuses)])
    console.log(
      'Packages with waiting courier status:',
      result.filter(pkg => pkg.status?.toLowerCase().includes('wait')).length,
    )

    return result
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
    return []
  }
}

export async function AssignCourierToPackage(packageId: string, deliveryDate: string) {
  var cookie = await getAuthCookie()

  // Get current user's employee ID
  const { GetCurrentUserEmployee } = await import('./employee_actions')
  const currentEmployee = await GetCurrentUserEmployee()

  if (!currentEmployee?.id) {
    return {
      success: false,
      error: 'Unable to get current user employee information',
    }
  }

  const assignData = JSON.stringify({
    courierId: currentEmployee.id,
    deliveryDate: deliveryDate,
  })

  console.log('Assigning package with courier ID:', currentEmployee.id)
  console.log('Delivery date (UTC):', deliveryDate)
  console.log('Parsed UTC date:', new Date(deliveryDate).toISOString())

  try {
    const response = await fetch(`http://localhost:7028/package/${packageId}/assign-courier`, {
      method: 'PUT',
      credentials: 'include',
      body: assignData,
      headers: {
        'Content-Type': 'application/json',
        Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to assign courier:', errorText)
      return {
        success: false,
        error: 'Failed to assign courier to package',
      }
    }

    revalidateTag('package')
    return {
      success: true,
    }
  } catch (error) {
    console.error('There was a problem with the assign courier operation:', error)
    return {
      success: false,
      error: 'Network error occurred while assigning courier',
    }
  }
}

export async function MarkPackageAsDelivered(packageId: string) {
  var cookie = await getAuthCookie()

  // Get current user's employee info to verify courier status
  const { GetCurrentUserEmployee } = await import('./employee_actions')
  const currentEmployee = await GetCurrentUserEmployee()

  if (!currentEmployee?.id) {
    return {
      success: false,
      error: 'Unable to get current user employee information',
    }
  }

  // Check if user is a courier
  const isCourier = currentEmployee.position?.toLowerCase() === 'courier'
  if (!isCourier) {
    return {
      success: false,
      error: 'Only couriers can mark packages as delivered',
    }
  }

  const deliveryData = JSON.stringify({
    status: 'delivered',
  })

  console.log('Marking package as delivered by courier:', currentEmployee.id)

  try {
    const response = await fetch(`http://localhost:7028/package/${packageId}`, {
      method: 'PUT',
      credentials: 'include',
      body: deliveryData,
      headers: {
        'Content-Type': 'application/json',
        Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to mark package as delivered:', errorText)
      return {
        success: false,
        error: 'Failed to mark package as delivered',
      }
    }

    revalidateTag('package')
    return {
      success: true,
    }
  } catch (error) {
    console.error('There was a problem with the mark as delivered operation:', error)
    return {
      success: false,
      error: 'Network error occurred while marking package as delivered',
    }
  }
}
