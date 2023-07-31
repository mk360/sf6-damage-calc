import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/header';
import Footer from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Street Fighter 6 Damage Calculator',
  description: 'A work-in-progress Calculator that shows you how much your combo does.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}><Header /><main className='main-content'>{children}</main><Footer /></body>
    </html>
  )
}
