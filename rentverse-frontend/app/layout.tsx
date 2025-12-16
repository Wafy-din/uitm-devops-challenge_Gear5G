import React from 'react'
import type { Metadata } from 'next'
import { Poly, Manrope } from 'next/font/google'
import './globals.css'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/scrollbar'
import '@maptiler/sdk/dist/maptiler-sdk.css'
import clsx from 'clsx'
import AuthInitializer from '@/components/AuthInitializer'
import ToastProvider from '@/components/ToastProvider'

const poly = Poly({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-poly',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
})

export const metadata: Metadata = {
  title: 'RentVerse - Property Rental Platform',
  description: 'Find your perfect rental property in Malaysia. Browse apartments, houses, condominiums and more.',
  manifest: '/manifest.json',
  themeColor: '#0d9488',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'RentVerse',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'RentVerse',
    title: 'RentVerse - Property Rental Platform',
    description: 'Find your perfect rental property in Malaysia',
  },
  twitter: {
    card: 'summary',
    title: 'RentVerse - Property Rental Platform',
    description: 'Find your perfect rental property in Malaysia',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  icons: {
    icon: '/icon-192x192.png',
    apple: '/icon-192x192.png',
  },
}

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={clsx([poly.className, manrope.className])}>
    <head>
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#0d9488" />
      <link rel="apple-touch-icon" href="/icon-192x192.png" />
    </head>
    <body>
      <AuthInitializer />
      <ToastProvider />
      {children}
    </body>
    </html>
  )
}
