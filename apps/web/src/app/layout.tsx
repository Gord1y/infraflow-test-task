import type { Metadata, Viewport } from 'next'
import { Roboto_Slab } from 'next/font/google'

import Providers from '@/components/providers'

import './globals.css'
import { cn } from '@/lib/utils'

const font = Roboto_Slab({
  subsets: ['latin'],
  display: 'swap'
})

export const metadata: Metadata = {
  title: {
    default: 'Test Task',
    template: '%s | Ifraflow'
  },
  description: 'Ifraflow - Test Task',
  keywords: 'Ifraflow, Test Task, Next.js, React, TypeScript',
  creator: 'Gord1y',
  // manifest: '/site.webmanifest',
  metadataBase: new URL('https://gord1y.dev/'),
  applicationName: 'Ifraflow',
  appleWebApp: {
    capable: true,
    title: 'Ifraflow',
    statusBarStyle: 'black-translucent'
  },
  icons: {
    apple: '/icons/apple-touch-icon.png'
  },
  authors: [{ name: 'Gord1y', url: 'https://gord1y.dev/' }],
  other: {
    'mobile-web-app-capable': 'yes',
    'msapplication-tap-highlight': 'no'
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL
  },
  openGraph: {
    type: 'website',
    siteName: 'Infraflow Test Task',
    emails: ['email@test.com'],
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'Ifraflow - Test Task',
    description: 'Ifraflow - Test Task',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/icons/icon512_maskable.png`,
        width: 512,
        height: 512,
        alt: 'Ifraflow - Test Task'
      }
    ]
  },
  formatDetection: {
    telephone: true
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  themeColor: '#ffffff',
  colorScheme: 'light dark'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn('antialiased', font.className)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
