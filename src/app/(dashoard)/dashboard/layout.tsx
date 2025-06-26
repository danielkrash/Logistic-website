import type { Metadata } from 'next'
import '../../../styles/globals.css'
import { Footer } from '@/components/component/footer'
import { ThemeProvider } from '@/components/component/theme-provider'
import { MainDashboardNav } from '@/components/component/dashboard/dashboard-nav'
import { inter } from '@/components/font'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: ' Cargo - Global Logistics and International Shipping',
  description:
    'Cargo is a company with many years of experience in transporting and sending parcels of any weight and complexity',
  keywords: ['Parcel', 'Cargo', 'Transport', 'Courier'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`flex min-h-screen flex-col ${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="cargo-theme"
        >
          <MainDashboardNav>{children}</MainDashboardNav>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
