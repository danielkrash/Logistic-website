import '../../styles/globals.css'
import { Footer } from '@/components/component/footer'
import { ThemeProvider } from '@/components/component/theme-provider'
import { inter } from '@/components/font'
import { AuthHeader } from '@/components/component/login/header'
import { Toaster } from '@/components/ui/sonner'

export default function LoginLayout({ children }: { children: React.ReactNode }) {
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
          <div className="flex min-h-screen flex-col">
            <div className="bg-alternative flex flex-1 flex-col">
              <AuthHeader />
              <div className="flex flex-1">
                <main className="border-default flex flex-1 flex-shrink-0 flex-col items-center border-r bg-stone-50 px-5 pb-8 pt-16 shadow-lg dark:bg-muted/25">
                  <section className="flex w-[330px] flex-1 flex-col justify-center sm:w-[384px]">
                    <div className="">{children}</div>
                  </section>
                </main>
              </div>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
