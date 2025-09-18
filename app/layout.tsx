import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Should I Delegate This? - AI Decision Game',
  description: 'An interactive educational game for school leaders to learn when to delegate tasks to AI versus keeping them human-driven.',
  keywords: ['AI', 'delegation', 'education', 'school leadership', 'decision making'],
  authors: [{ name: 'DLG8' }],
  openGraph: {
    title: 'Should I Delegate This? - AI Decision Game',
    description: 'Learn when to delegate tasks to AI versus keeping them human-driven through interactive scenarios.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Should I Delegate This? - AI Decision Game',
    description: 'Learn when to delegate tasks to AI versus keeping them human-driven through interactive scenarios.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}