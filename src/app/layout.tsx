import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  fallback: ["serif", "Georgia"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["sans-serif", "Arial"],
});

export const metadata: Metadata = {
  title: "Vysh | Luxury 925 Pure Silver Rakhi & Royal Jewellery",
  description: "Explore India's premier luxury Rakhi collection in 925 Sterling Silver, Kundan, and Personalized Photo Rakhis. Handcrafted with BIS Hallmark certification.",
  keywords: ["Luxury Rakhi", "925 Silver Rakhi", "Customized Rakhi", "Pure Silver Jewellery", "Bhaiya Bhabhi Lumba", "Vysh Store"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${poppins.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#FFF9F8] text-[#1D1D1D] font-sans">
        <TooltipProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </TooltipProvider>
      </body>
    </html>
  );
}
