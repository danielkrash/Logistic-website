'use server'
import 'server-only'
import { permanentRedirect, redirect } from 'next/navigation'
import type { paths, components } from '@/types/schemav3'
import type { Companies, CompanyRevenue, Roles } from '@/types/dashboard'
import { format } from 'date-fns'
import { revalidateTag } from 'next/cache'
import { getAuthCookie } from './cookie-utils'

export async function getRoles() {
  var cookie = await getAuthCookie()
  try {
    const response = await fetch('http://localhost:7028/role', {
      next: { revalidate: 3600 },
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
      },
    })
    let result: Roles = await response.json()
    return result
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
  }
}
export async function getCompanyRevenue(id: number) {
  var cookie = await getAuthCookie()
  try {
    const response = await fetch(`http://localhost:7028/company/${id}/revenue`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
      },
    })
    let result: CompanyRevenue[] = await response.json()
    return result
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
  }
}
export async function createCompanyPartial(data: FormData) {
  var cookie = await getAuthCookie()
  let add_data = JSON.stringify({
    name: data.get('name'),
    address: data.get('address'),
  })
  try {
    const response = await fetch('http://localhost:7028/company', {
      method: 'POST',
      credentials: 'include',
      body: add_data,
      headers: {
        'Content-Type': 'application/json',
        Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
      },
    })
    let result = await response.json()
    revalidateTag('company')
    return result
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
  }
  redirect('http://localhost:3000/dashboard/company')
}

export async function GetCompanies() {
  var cookie = await getAuthCookie()
  try {
    const response = await fetch('http://localhost:7028/company', {
      next: { tags: ['company'] },
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
      },
    })
    let result: Companies = await response.json()
    return result
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
  }
}

export async function changeCompanyDataById(data: FormData) {
  var cookie = await getAuthCookie()
  let date = format(new Date(), 'yyyy-MM-dd')
  let change_data = JSON.stringify({
    name: data.get('name'),
    id: data.get('id'),
    creationDate: date,
    address: data.get('address'),
  })
  let url = `http://localhost:7028/company/${data.get('id')}`
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
    revalidateTag('company')
    return res
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
  }
  redirect('http://localhost:3000/dashboard/company')
}

export const company_fetcher = async (url: string) => {
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
  var result: Companies = await response.json()
  return result
}

export async function getAllCompaniesRevenue() {
  var cookie = await getAuthCookie()
  try {
    // First try to get all companies revenue from a single endpoint
    const response = await fetch('http://localhost:7028/company/revenue/all', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
      },
    })

    if (response.ok) {
      let result: CompanyRevenue[] = await response.json()
      return result
    }

    // If the endpoint doesn't exist, fallback to getting all companies and their individual revenues
    const companies = await GetCompanies()
    if (!companies) return []

    const allRevenues: CompanyRevenue[] = []

    // Get revenue for each company
    for (const company of companies) {
      if (company.id) {
        try {
          const companyRevenue = await getCompanyRevenue(company.id)
          if (companyRevenue) {
            allRevenues.push(...companyRevenue)
          }
        } catch (error) {
          console.error(`Failed to get revenue for company ${company.id}:`, error)
        }
      }
    }

    return allRevenues
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
    return []
  }
}
