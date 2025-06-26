'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { Employee, Positions } from '@/types/dashboard'
import { getAuthCookie } from './cookie-utils'
import { GetCurrentUser } from './auth_actions'

export async function GetPositions() {
  var cookie = await getAuthCookie()
  try {
    const response = await fetch('http://localhost:7028/position', {
      next: { revalidate: 30 },
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
      },
    })
    let result: Positions = await response.json()
    return result
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
  }
}

export async function GetEmployees() {
  var cookie = await getAuthCookie()
  try {
    const response = await fetch('http://localhost:7028/employee', {
      cache: 'no-store',
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
      },
    })
    let result: Employee[] = await response.json()
    return result
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
  }
}

export async function AddEmployeePartial(data: FormData) {
  var cookie = await getAuthCookie()
  let add_data = JSON.stringify({
    id: data.get('id'),
    salary: data.get('salary'),
    positionId: data.get('positionId'),
    officeId: data.get('officeId'),
  })
  console.log(add_data)
  try {
    const response = await fetch('http://localhost:7028/employee', {
      cache: 'no-store',
      method: 'POST',
      credentials: 'include',
      body: add_data,
      headers: {
        'Content-Type': 'application/json',
        Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
      },
    })
    console.log(response)
    // Check if the response is not OK (status code outside 200-299 range)
    if (!response.ok) {
      const errorData = await response.text()
      let errorMessage = 'Failed to add employee'

      // Try to parse error response for more specific message
      try {
        const parsedError = JSON.parse(errorData)
        if (parsedError.title) {
          errorMessage = parsedError.title
        } else if (parsedError.message) {
          errorMessage = parsedError.message
        } else if (parsedError.errors) {
          // Handle validation errors
          const errorMessages = Object.values(parsedError.errors).flat()
          errorMessage = errorMessages.join(', ')
        }
      } catch {
        // If parsing fails, check for common HTTP status codes
        switch (response.status) {
          case 400:
            errorMessage = 'Invalid employee data provided'
            break
          case 401:
            errorMessage = 'You are not authorized to add employees'
            break
          case 403:
            errorMessage = 'You do not have permission to add employees'
            break
          case 409:
            errorMessage = 'Employee already exists or data conflicts'
            break
          case 500:
            errorMessage = 'Server error occurred while adding employee'
            break
          default:
            errorMessage = `Failed to add employee (${response.status})`
        }
      }
      return { success: false, error: errorMessage }
    }
    console.log('all good')

    // Try to parse JSON response, but don't fail if there's no content
    let result = null
    try {
      const responseText = await response.text()
      if (responseText) {
        result = JSON.parse(responseText)
      }
    } catch (parseError) {
      console.log('No JSON content in response, which is fine for some operations')
    }

    revalidatePath('/dashboard/employees')
    return { success: true, data: result }
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
    return { success: false, error: 'Network error: Unable to connect to server' }
  }
}

export async function AddEmployeePartialWithRedirect(data: FormData) {
  const result = await AddEmployeePartial(data)
  if (result.success) {
    redirect('/dashboard/employees')
  }
  return result
}

export async function changeEmployeeDataById(data: FormData) {
  var cookie = await getAuthCookie()
  let change_data = JSON.stringify({
    id: data.get('id'),
    salary: data.get('salary'),
    positionId: data.get('positionId'),
    officeId: data.get('officeId'),
  })
  let url = `http://localhost:7028/employee/${data.get('id')} `
  console.log('Changing employee data for ID:', data.get('id'))
  console.log('Change data:', change_data)
  console.log('Request URL:', url)
  try {
    const response = await fetch(url, {
      cache: 'no-store',
      method: 'PUT',
      credentials: 'include',
      body: change_data,
      headers: {
        'Content-Type': 'application/json',
        Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.text()
      let errorMessage = 'Failed to update employee'

      // Try to parse error response for more specific message
      try {
        const parsedError = JSON.parse(errorData)
        if (parsedError.title) {
          errorMessage = parsedError.title
        } else if (parsedError.message) {
          errorMessage = parsedError.message
        } else if (parsedError.errors) {
          // Handle validation errors
          const errorMessages = Object.values(parsedError.errors).flat()
          errorMessage = errorMessages.join(', ')
        }
      } catch {
        // If parsing fails, check for common HTTP status codes
        switch (response.status) {
          case 400:
            errorMessage = 'Invalid employee data provided'
            break
          case 401:
            errorMessage = 'You are not authorized to update employees'
            break
          case 403:
            errorMessage = 'You do not have permission to update this employee'
            break
          case 404:
            errorMessage = 'Employee not found'
            break
          case 409:
            errorMessage = 'Employee data conflicts with existing records'
            break
          case 500:
            errorMessage = 'Server error occurred while updating employee'
            break
          default:
            errorMessage = `Failed to update employee (${response.status})`
        }
      }

      return { success: false, error: errorMessage }
    }

    revalidatePath('/dashboard/employees')
    return { success: true }
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
    return { success: false, error: 'Network error: Unable to connect to server' }
  }
}

export async function DeleteEmployeeById(id: string) {
  var cookie = await getAuthCookie()
  console.log('Deleting employee with ID:', id)
  let url = `http://localhost:7028/employee/${id}`
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
      const errorData = await response.text()
      let errorMessage = 'Failed to delete employee'

      // Try to parse error response for more specific message
      try {
        const parsedError = JSON.parse(errorData)
        if (parsedError.title) {
          errorMessage = parsedError.title
        } else if (parsedError.message) {
          errorMessage = parsedError.message
        } else if (parsedError.errors) {
          // Handle validation errors
          const errorMessages = Object.values(parsedError.errors).flat()
          errorMessage = errorMessages.join(', ')
        }
      } catch {
        // If parsing fails, check for common HTTP status codes
        switch (response.status) {
          case 400:
            errorMessage = 'Invalid employee data or employee cannot be deleted'
            break
          case 401:
            errorMessage = 'You are not authorized to delete employees'
            break
          case 403:
            errorMessage = 'You do not have permission to delete this employee'
            break
          case 404:
            errorMessage = 'Employee not found'
            break
          case 409:
            errorMessage =
              'Cannot delete employee - they may have active assignments or dependencies'
            break
          case 500:
            errorMessage = 'Server error occurred while deleting employee'
            break
          default:
            errorMessage = `Failed to delete employee (${response.status})`
        }
      }

      return { success: false, error: errorMessage }
    }

    // Success case - DELETE operations typically return 204 No Content
    revalidatePath('/dashboard/employees')
    return { success: true }
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
    return { success: false, error: 'Network error: Unable to connect to server' }
  }
}

export const position_fetcher = async (url: string) => {
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
  var result: Positions = await response.json()
  return result
}

export async function GetCurrentEmployee() {
  var cookie = await getAuthCookie()
  if (!cookie) {
    return null
  }

  try {
    // First get current user to get the user ID
    const currentUser = await GetCurrentUser()
    if (!currentUser?.id) {
      return null
    }

    // Since user ID and employee ID are the same, fetch employee directly by ID
    const response = await fetch(`http://localhost:7028/employee/${currentUser.id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        console.log('Employee not found for current user')
        return null
      }
      throw new Error(`Failed to fetch employee: ${response.status}`)
    }

    const currentEmployee = await response.json()
    console.log('Found current employee:', currentEmployee)
    return currentEmployee
  } catch (error) {
    console.error('There was a problem fetching current employee:', error)
    return null
  }
}
