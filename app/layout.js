import "./globals.css";

export const metadata = {
  title: "AI Travel Planner",
  description: "Generate AI-powered travel itineraries",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
