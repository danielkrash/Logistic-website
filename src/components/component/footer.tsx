import Link from 'next/link'
import { ThemeButton } from './theme-button'
import { Package } from 'lucide-react'
import { Suspense } from 'react'

export function Footer() {
  return (
    // <footer className="bg-background pb-8 px-6 py-6 text-foreground w-full">
    //   <section>
    //   <div className="flex flex-wrap justify-between">
    //     <div className="flex space-x-4">
    //       <svg
    //         className=" h-8 w-8 text-muted-foreground"
    //         fill="none"
    //         height="24"
    //         stroke="currentColor"
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth="2"
    //         viewBox="0 0 24 24"
    //         width="24"
    //         xmlns="http://www.w3.org/2000/svg"
    //       >
    //         <path d="m7.5 4.27 9 5.15" />
    //         <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    //         <path d="m3.3 7 8.7 5 8.7-5" />
    //         <path d="M12 22V12" />
    //       </svg>
    //       <span className="text-xl font-bold">Parcel Co.</span>
    //     </div>
    //     <div className=" mt-4 flex items-center justify-center">
    //       <div className="space-x-6">
    //         <ThemeButton />
    //       </div>
    //     </div>
    //   </div>
    //   </section>
    //   <section>
    //     <ul className='flex justify-between items-center w-full px-0 py-0'>
    //       <li>
    //       <Link className="text-base font-medium hover:underline" href="/#">
    //         Home
    //       </Link>
    //       </li>
    //       <li>
    //       <Link className="text-base font-medium hover:underline" href="/#service">
    //         Services
    //       </Link>
    //       </li>
    //       <li>
    //       <Link className="text-base font-medium hover:underline" href="/#testimonials">
    //         Testimonials
    //       </Link>
    //       </li>
    //       <li>
    //       <Link className="text-base font-medium hover:underline" href="/#faq">
    //         FAQ
    //       </Link>
    //       </li>
    //     </ul>
    //     <div>
    //         <p className="text-sm text-muted-foreground">© Parcel Co. All rights reserved.</p>
    //       </div>
    //   </section>
    // </footer>

    <footer className="m-4 rounded-lg shadow">
      <hr className="border-gray-200 dark:border-gray-700" />
      <div className="mx-auto w-full max-w-screen-xl p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link href="/" className="mb-4 flex items-center space-x-3 sm:mb-0 rtl:space-x-reverse">
            <Package size={32} className="h-8" />
            <span className="self-center whitespace-nowrap text-2xl font-semibold">Parcel Co.</span>
          </Link>
          <ul className="mb-6 flex flex-wrap items-center text-sm font-medium text-gray-500 sm:mb-0">
            <li>
              <Link href={'/about' as any} className="me-4 hover:underline md:me-6">
                About
              </Link>
            </li>
            <li>
              <Link href={'/privacy' as any} className="me-4 hover:underline md:me-6">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href={'/license' as any} className="me-4 hover:underline md:me-6">
                Licensing
              </Link>
            </li>
            <li>
              <Link href={'/contact' as any} className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between p-4 md:py-4">
          <span className="block text-sm text-gray-500 sm:text-center">
            © 2023{' '}
            <Link href="/" className="hover:underline">
              Parcel™
            </Link>
            . All Rights Reserved.
          </span>
          <Suspense fallback={<div>Loading...</div>}>
            <ThemeButton />
          </Suspense>
        </div>
      </div>
    </footer>
  )
}
