import type { Metadata } from 'next'
import '../index.css'
import '../App.css'

export const metadata: Metadata = {
  title: 'Auction Hub',
  description: 'Hub Bid Nation - Auctions platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}


