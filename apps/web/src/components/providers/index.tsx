'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { httpBatchLink } from '@trpc/react-query'
// import { Analytics } from '@vercel/analytics/next'
// import { SpeedInsights } from '@vercel/speed-insights/next'
import { PropsWithChildren, useState } from 'react'

import { Toaster } from '@/components/ui/sonner'

import Footer from '../layout/footer'
import Header from '../layout/header'
import Main from '../layout/main'

import { ThemeProvider } from './theme-provider'
import { trpc } from '@/lib/trpc-client'

const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false
          }
        }
      })
  )
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${process.env.NEXT_PUBLIC_API_URL}`
        })
      ]
    })
  )

  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='light'
      enableSystem
      disableTransitionOnChange
    >
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Header />
          <Main>
            {children}
            <Footer />
          </Main>

          {/* <Analytics />
            <SpeedInsights /> */}
          <ReactQueryDevtools initialIsOpen={false} />
          <Toaster />
        </QueryClientProvider>
      </trpc.Provider>
    </ThemeProvider>
  )
}

export default Providers
