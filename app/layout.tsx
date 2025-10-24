import './globals.css'

export const metadata = {
  title: 'Czyste Pomniki API',
  description: 'API server for Czyste Pomniki app'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <body>
        {children}
      </body>
    </html>
  )
}