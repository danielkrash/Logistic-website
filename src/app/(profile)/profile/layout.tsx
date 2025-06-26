import '../../../styles/globals.css'
import { MainDashboardNav } from '@/components/component/dashboard/dashboard-nav'
import { MobileNav } from '@/components/component/dashboard/dashboard-nav-mobile'
import { AuthHeader } from '@/components/component/login/header'
import { UserProfileNav } from '@/components/component/login/user-profile-nav'
import { ThemeProvider } from '@/components/component/theme-provider'
import { inter } from '@/components/font'
import { Toaster } from '@/components/ui/sonner'
import { GetCurrentUser } from '@/lib/auth_actions'
import { ProfileHeader } from '@/components/component/profile/profile-header'
import { ProfileNav } from '@/components/component/profile/profile-nav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
          <ProfileNav>{children}</ProfileNav>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
