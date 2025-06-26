'use server'
import 'server-only'
import { getAuthCookie } from './cookie-utils'
import { permanentRedirect, redirect } from 'next/navigation'
import type { paths, components } from '@/types/schemav3'
import type { CreatedUser, Roles, Users } from '@/types/dashboard'

type User = components['schemas']['UserDto']
type changeUserPassword = paths['/users/current/password']['put']['responses']
export async function changeData(data: FormData) {
  var cookie = await getAuthCookie()
  let change_data = JSON.stringify({
    firstName: data.get('firstName'),
    lastName: data.get('lastName'),
    email: data.get('email'),
    adress: data.get('address'),
    birthDate: data.get('dob'),
    phoneNumber: data.get('phone'),
  })
  try {
    const response = await fetch('http://localhost:7028/users/current', {
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
      throw new Error('Network response was not ok')
    }
    var res: User = await response.json()
    return res
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
  }
  redirect('http://localhost:3000/profile')
}

export async function changePassword(data: FormData) {
  var cookie = await getAuthCookie()
  let change_data = JSON.stringify({
    currentPassword: data.get('currentPassword'),
    newPassword: data.get('newPassword'),
  })
  try {
    const response = await fetch('http://localhost:7028/users/current/password', {
      cache: 'no-store',
      method: 'PUT',
      credentials: 'include',
      body: change_data,
      headers: {
        'Content-Type': 'application/json',
        Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
      },
    })
    if (!(response.status === 204)) {
      let error: changeUserPassword = await response.json()
      return error
    }
    let result = await response.json()
    return result
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
  }
  redirect('http://localhost:3000/profile/password')
}
export async function GetUserSecrets() {
  var cookie = await getAuthCookie()
  try {
    const response = await fetch('http://localhost:7028/users/current/secrets', {
      next: { revalidate: 30 },
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
      },
    })
    let result = await response.json()
    return result
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
  }
  redirect('http://localhost:3000/profile/personal-data')
}
export async function GetUsers() {
  var cookie = await getAuthCookie()
  try {
    const response = await fetch('http://localhost:7028/users', {
      cache: 'no-store',
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
      },
    })
    let result: Users = await response.json()
    return result
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
  }
}

export async function GetUserCompany() {
  var cookie = await getAuthCookie()
  try {
    const response = await fetch('http://localhost:7028/users/current/Company', {
      cache: 'no-store',
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
      },
    })
    let result: number = await response.json()
    return result
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
  }
}
export async function AddUserPartial(data: FormData) {
  var cookie = await getAuthCookie()
  let add_data = JSON.stringify({
    Email: data.get('Email'),
    password: data.get('password'),
    Role: data.get('Role'),
  })
  try {
    const response = await fetch('http://localhost:7028/users', {
      cache: 'no-store',
      method: 'POST',
      credentials: 'include',
      body: add_data,
      headers: {
        'Content-Type': 'application/json',
        Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
      },
    })
    let result: CreatedUser = await response.json()
    return result
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
  }
  redirect('http://localhost:3000/dashboard/users')
}

export async function changeUserDataById(data: FormData) {
  var cookie = await getAuthCookie()
  let change_data = JSON.stringify({
    firstName: data.get('firstName'),
    lastName: data.get('lastName'),
    email: data.get('email'),
    address: data.get('address'),
    birthDate: data.get('birthDate'),
    phoneNumber: data.get('phoneNumber'),
    role: data.get('role'),
  })
  let url = `http://localhost:7028/users/${data.get('id')}`
  console.log(change_data, url)
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
      throw new Error('Network response was not ok')
    }
    var res: User = await response.json()
    console.log(res)
    return res
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
  }
  redirect('http://localhost:3000/dashboard/users')
}
export async function DeleteUserById(id: string) {
  var cookie = await getAuthCookie()
  let url = `http://localhost:7028/users/${id}`
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
    var res = await response.json()
    console.log(res)
    return res
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
  }
  redirect('http://localhost:3000/dashboard/users')
}
export async function DeleteUserRoleById(data: FormData) {
  var cookie = await getAuthCookie()
  let delete_data = JSON.stringify({
    id: data.get('id'),
    role: data.get('role'),
  })
  let url = `http://localhost:7028/users/${data.get('id')}/role`
  try {
    const response = await fetch(url, {
      cache: 'no-store',
      method: 'DELETE',
      credentials: 'include',
      body: delete_data,
      headers: {
        'Content-Type': 'application/json',
        Cookie: `.AspNetCore.Identity.Application=${cookie?.value}`,
      },
    })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    var res = await response.json()
    console.log(res)
    return res
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
  }
  redirect('http://localhost:3000/dashboard/users')
}

export const role_fetcher = async (url: string) => {
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
  var result: Roles = await response.json()
  return result
}
export const user_fetcher = async (url: string) => {
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
  var result: Users = await response.json()
  return result
}
