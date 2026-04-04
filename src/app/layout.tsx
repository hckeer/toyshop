import type { Metadata } from "next";
import { Barlow_Condensed, Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-heading",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RC Toys Nepal — Nepal's Pioneer in Radio Control",
  description:
    "RC Toys Nepal is Kathmandu's premier destination for Radio Control cars, drones, trucks, and pro-grade building kits. Traxxas, HPI, Tamiya, and more.",
  keywords: [
    "RC toys Nepal",
    "Radio Control Nepal",
    "RC car Kathmandu",
    "RC drone Nepal",
    "Traxxas Nepal",
    "hobby grade RC",
  ],
  openGraph: {
    title: "RC Toys Nepal — Built for Speed. Engineered for Thrill.",
    description:
      "Nepal's pioneer in Radio Control. Shop RC cars, drones, and performance upgrades.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${barlowCondensed.variable} ${bebasNeue.variable} ${inter.variable}`}>
      <body className="bg-[#050505] text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
