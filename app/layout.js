import './globals.css'

export const metadata = {
  title: 'Study RPG',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0f0f14] text-white">
        {children}
      </body>
    </html>
  )
}
