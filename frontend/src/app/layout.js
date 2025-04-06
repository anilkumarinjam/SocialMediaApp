import RootLayoutClient from "@/components/RootLayoutClient";
import "./globals.css";

export const metadata = {
  title: "Snapzy - Share Your Moments",
  description: "A modern social networking platform built with Next.js and MERN Stack",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen m-0 bg-[#F5F6FA]">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
