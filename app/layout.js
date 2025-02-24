import { Raleway } from "next/font/google"
import "./globals.css"

const raleway = Raleway({ subsets: ["latin"] })

export const metadata = {
  title: "Ryde5 - Taxi Booking Service",
  description: "Book your ride with Ryde5",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={raleway.className}>{children}</body>
    </html>
  )
}

