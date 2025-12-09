import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "AI Travel Planner",
  description: "Generate AI-powered travel itineraries",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="max-w-5xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
