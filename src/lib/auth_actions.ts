'use server'
import 'server-only'
import { cookies } from 'next/headers'
import { permanentRedirect, redirect } from 'next/navigation'
import type { paths, components } from '@/types/schemav3'

type User = components['schemas']['UserDto']
type signUpError =
  paths['/auth/register']['post']['responses']['400']['content']['application/problem+json']
type resType = {
  CompanyModel: {
    Login: {
      Error?: string
      token?: string
      emp_type: string
      emp_name: string
      emp_guid: string
      emp_email: string
    }
  }
}
export async function signIn(data: FormData) {
  let login_data: FormData = new FormData()
  // login_data.append('emp_email', data.get('email') as string);
  // login_data.append('emp_psw', data.get('password') as string);
  // login_data.append('LogisticCompany.Models.CompanyModel', "Login");
  // let response: resType = await fetch('http://misrad.org/logisticcompany/Main/Dispatcher',{method: 'POST', body: login_data}).then(response => response.json());
  // console.log(response);
  // if(response.CompanyModel.Login.Error){
  //     return response.CompanyModel.Login.Error;
  // }
  // cookies().set('token', response.CompanyModel.Login.emp_guid, { secure: true })
  // redirect('http://localhost:3000/')
  login_data.append('email', data.get('email') as string)
  login_data.append('password', data.get('password') as string)
  let response = await fetch('http://localhost:7028/auth/login?useCookies=true', {
    method: 'POST',
    body: JSON.stringify({ email: data.get('email'), password: data.get('password') }),
    headers: { 'Content-Type': 'application/json' },
  })
  let cookie_val = response.headers.get('set-cookie')
  if (!cookie_val) {
    return response.status
  }
  const regex = /\.AspNetCore\.Identity\.Application=([^;]*)/
  const match = cookie_val.match(regex)
  if (match && match[1]) {
    const cookieStore = await cookies()
    cookieStore.set('.AspNetCore.Identity.Application', match[1], { httpOnly: true, secure: true })
  }
  redirect('http://localhost:3000/')
}

export async function GetCurrentUser() {
  const cookieStore = await cookies()
  var cookie = cookieStore.get('.AspNetCore.Identity.Application')
  if (cookie == undefined) {
    return null
  }
  try {
    const response = await fetch('http://localhost:7028/users/current', {
      cache: 'no-store',
      method: 'GET',
      credentials: 'include',
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
}

export async function signUp(data: FormData) {
  let login_data = JSON.stringify({
    email: data.get('email'),
    password: data.get('password'),
    firstName: data.get('firstName'),
    lastName: data.get('lastName'),
    birthDate: data.get('birthday'),
  })
  console.log(login_data)
  const response = await fetch('http://localhost:7028/auth/register', {
    cache: 'no-store',
    method: 'POST',
    credentials: 'include',
    body: login_data,
    headers: {
      'Content-Type': 'application/json',
    },
  })
  console.log('We are here', response)
  if (response.status != 200) {
    var error: signUpError = await response.json()
    console.log(error)
    return error
  }
  redirect('http://localhost:3000/sign-in')
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete('.AspNetCore.Identity.Application')
  redirect('http://localhost:3000/')
}
