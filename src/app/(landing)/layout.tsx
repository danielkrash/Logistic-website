import type { Metadata } from 'next'
import '../../styles/globals.css'
import { Footer } from '@/components/component/footer'
import { Header } from '@/components/component/header'
import { ThemeProvider } from '@/components/component/theme-provider'
import { inter } from '@/components/font'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: ' Cargo - Global Logistics and International Shipping',
  description:
    'Cargo is a company with many years of experience in transporting and sending parcels of any weight and complexity',
  keywords: ['Parcel', 'Cargo', 'Transport', 'Courier'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` ${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="cargo-theme"
        >
          <Header />
          <main className="flex-1 bg-background text-foreground">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
