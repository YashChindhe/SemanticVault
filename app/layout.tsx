import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Semantic Vault | Meaning-Based Personal Search',
  description: 'Smart personal document search using vectors and AI. Search for meanings, not just keywords.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="bg-black text-industrial-300 antialiased selection:bg-emerald-500/20 selection:text-emerald-400">
        {children}
      </body>
    </html>
  )
}
