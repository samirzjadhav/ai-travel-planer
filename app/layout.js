import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "AI Travel Planner",
  description: "AI-powered trip planning",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Navbar */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-sky-600">
              AI Travel Planner
            </Link>

            <nav className="flex gap-6 text-sm font-medium">
              <Link href="/generate" className="hover:text-sky-600">
                Generate
              </Link>
              <Link href="/saved" className="hover:text-sky-600">
                Saved
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
