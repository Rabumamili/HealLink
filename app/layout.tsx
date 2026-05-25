// app/layout.tsx
import type { Metadata, Viewport } from 'next'
// Remove all font imports - don't use next/font/google or next/font/local
import { Providers } from '@/providers/query-provider'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'HealLink - Healthcare Appointment & Diagnostic Management',
    template: '%s | HealLink'
  },
  description: 'HealLink is Ethiopia\'s integrated healthcare platform for booking doctor appointments, clinical services, and diagnostic tests. Discover providers, pay securely via Chapa, and manage your health digitally.',
  keywords: ['healthcare', 'Ethiopia', 'doctor appointment', 'diagnostic center', 'clinic', 'medical booking', 'Chapa payment', 'health platform'],
  authors: [{ name: 'HealLink' }],
  creator: 'HealLink',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0D9488',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          {children}
          <Toaster 
            position="top-right" 
            richColors 
            closeButton
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--background)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}