"use client"
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="bg-background border-b border-border">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <Link href="/" className="text-lg font-bold text-foreground">
            Whisper Pixel
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <a href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            Dashboard
          </a>
          <a href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
            Github
          </a>
        </div>
      </div>
    </nav>
  )
}