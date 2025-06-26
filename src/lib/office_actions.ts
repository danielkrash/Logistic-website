'use server'
import 'server-only'
import { permanentRedirect, redirect } from 'next/navigation'
import type { paths, components } from '@/types/schemav3'
import type { Companies, Offices, Roles } from '@/types/dashboard'
import { format } from 'date-fns'
import { revalidateTag } from 'next/cache'
import { getAuthCookie } from './cookie-utils'

export async function createOfficePartial(data: FormData) {
  var cookie = await getAuthCookie()
  let add_data = JSON.stringify({
    address: data.get('address'),
    phoneNumber: data.get('phoneNumber'),
    companyName: data.get('companyName'),
  })
  try {
    const response = await fetch('http://localhost:7028/office', {
      cache: 'no-store',
      method: 'POST',
      credentials: 'include',
      body: add_data,
      headers: {
        'Content-Type': 'application/json',
        Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
      },
    })
    let result = await response.json()
    revalidateTag('office')
    return result
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
  }
  redirect('http://localhost:3000/dashboard/offices')
}

export async function GetOffices() {
  var cookie = await getAuthCookie()
  try {
    const response = await fetch('http://localhost:7028/office', {
      method: 'GET',
      next: { tags: ['office'] },
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
      },
    })
    let result: Offices = await response.json()
    return result
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
  }
}

export async function changeOfficeDataById(data: FormData) {
  var cookie = await getAuthCookie()
  let change_data = JSON.stringify({
    phoneNumber: data.get('phoneNumber'),
    id: data.get('id'),
    address: data.get('address'),
  })
  let url = `http://localhost:7028/office/${data.get('id')}`
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
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    var res = await response.json()
    revalidateTag('office')
    return res
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
  }
  redirect('http://localhost:3000/dashboard/offices')
}
