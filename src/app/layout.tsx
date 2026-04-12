import type { Metadata } from "next";
import { Inter, Noto_Serif, Manrope, Plus_Jakarta_Sans, Public_Sans, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSerif = Noto_Serif({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-noto-serif" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-plus-jakarta" });
const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-public-sans" });
const notoArabic = Noto_Sans_Arabic({ subsets: ["arabic"], variable: "--font-arabic" });

export const metadata: Metadata = {
  title: "Mithaq | مِيثَاق",
  description: "A relationship-building application for partners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSerif.variable} ${manrope.variable} ${plusJakarta.variable} ${publicSans.variable} ${notoArabic.variable}`}>
      <body className="antialiased font-sans text-on-surface bg-surface transition-colors duration-500">
        <Providers>
          <Toaster position="bottom-right" toastOptions={{
            style: {
              background: 'var(--surface-container-high)',
              color: 'var(--on-surface)',
              borderRadius: '1rem',
              border: '1px solid var(--primary-container)',
              fontFamily: 'inherit'
            }
          }} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
