'use client'
import Link from 'next/link'

export default function Navbar(){
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
        <Link href="/" className="font-bold">AI Travel Planner</Link>
        <div className="flex gap-3">
          <Link href="/generate" className="text-sm">Generate</Link>
          <Link href="/saved" className="text-sm">Saved</Link>
        </div>
      </div>
    </nav>
  )
}
