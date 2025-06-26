'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { Positions } from '@/types/dashboard'
import type { components } from '@/types/schemav3'
import { getAuthCookie } from './cookie-utils'

type PositionDto = components['schemas']['PositionDto']

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

export async function CreatePosition(data: FormData) {
  var cookie = await getAuthCookie()
  let position_data = JSON.stringify({
    type: data.get('type'),
    description: data.get('description'),
  })

  try {
    const response = await fetch('http://localhost:7028/position', {
      cache: 'no-store',
      method: 'POST',
      credentials: 'include',
      body: position_data,
      headers: {
        'Content-Type': 'application/json',
        Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.text()
      let errorMessage = 'Failed to create position'

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
            errorMessage = 'Invalid position data provided'
            break
          case 401:
            errorMessage = 'You are not authorized to create positions'
            break
          case 403:
            errorMessage = 'You do not have permission to create positions'
            break
          case 409:
            errorMessage = 'A position with this name already exists'
            break
          case 500:
            errorMessage = 'Server error occurred while creating position'
            break
          default:
            errorMessage = `Failed to create position (${response.status})`
        }
      }

      return { success: false, error: errorMessage }
    }

    let result = await response.json()
    revalidatePath('/dashboard/positions')
    return { success: true, data: result }
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
    return { success: false, error: 'Network error: Unable to connect to server' }
  }
}

export async function UpdatePosition(data: FormData) {
  var cookie = await getAuthCookie()
  let position_data = JSON.stringify({
    id: parseInt(data.get('id') as string),
    type: data.get('type'),
    description: data.get('description'),
  })

  let url = `http://localhost:7028/position/${data.get('id')}`

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      method: 'PUT',
      credentials: 'include',
      body: position_data,
      headers: {
        'Content-Type': 'application/json',
        Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.text()
      let errorMessage = 'Failed to update position'

      try {
        const parsedError = JSON.parse(errorData)
        if (parsedError.title) {
          errorMessage = parsedError.title
        } else if (parsedError.message) {
          errorMessage = parsedError.message
        } else if (parsedError.errors) {
          const errorMessages = Object.values(parsedError.errors).flat()
          errorMessage = errorMessages.join(', ')
        }
      } catch {
        switch (response.status) {
          case 400:
            errorMessage = 'Invalid position data provided'
            break
          case 401:
            errorMessage = 'You are not authorized to update positions'
            break
          case 403:
            errorMessage = 'You do not have permission to update positions'
            break
          case 404:
            errorMessage = 'Position not found'
            break
          case 409:
            errorMessage = 'A position with this name already exists'
            break
          case 500:
            errorMessage = 'Server error occurred while updating position'
            break
          default:
            errorMessage = `Failed to update position (${response.status})`
        }
      }

      return { success: false, error: errorMessage }
    }

    revalidatePath('/dashboard/positions')
    return { success: true }
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
    return { success: false, error: 'Network error: Unable to connect to server' }
  }
}

export async function DeletePosition(id: number) {
  var cookie = await getAuthCookie()
  let url = `http://localhost:7028/position/${id}`

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
      let errorMessage = 'Failed to delete position'

      try {
        const parsedError = JSON.parse(errorData)
        if (parsedError.title) {
          errorMessage = parsedError.title
        } else if (parsedError.message) {
          errorMessage = parsedError.message
        }
      } catch {
        switch (response.status) {
          case 400:
            errorMessage = 'Cannot delete this position'
            break
          case 401:
            errorMessage = 'You are not authorized to delete positions'
            break
          case 403:
            errorMessage = 'You do not have permission to delete positions'
            break
          case 404:
            errorMessage = 'Position not found'
            break
          case 409:
            errorMessage = 'Cannot delete position: it is currently assigned to employees'
            break
          case 500:
            errorMessage = 'Server error occurred while deleting position'
            break
          default:
            errorMessage = `Failed to delete position (${response.status})`
        }
      }

      return { success: false, error: errorMessage }
    }

    revalidatePath('/dashboard/positions')
    return { success: true }
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
    return { success: false, error: 'Network error: Unable to connect to server' }
  }
}

export async function GetPositionById(id: number) {
  var cookie = await getAuthCookie()

  try {
    const response = await fetch(`http://localhost:7028/position/${id}`, {
      next: { revalidate: 30 },
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
      },
    })

    if (!response.ok) {
      throw new Error('Position not found')
    }

    let result: PositionDto = await response.json()
    return result
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
  }
}
