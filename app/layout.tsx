import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OPF',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode,
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        {modal}
        <Toaster />
      </body>
    </html>
  )
}
