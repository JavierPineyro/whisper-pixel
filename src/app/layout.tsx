import "~/styles/globals.css";

import { type Metadata } from "next";
import { Oxanium } from "next/font/google"
import { ThemeProvider } from "~/components/theme-provider"
import { Navbar } from "~/components/navbar";

const oxanium = Oxanium({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Whisper Pixel - Oculta y revela mensajes en imágenes",
  description: "Aplicación para ocultar mensajes secretos en imágenes PNG y revelarlos",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning={process.env.NODE_ENV === 'production'}>
      <body className={oxanium.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}