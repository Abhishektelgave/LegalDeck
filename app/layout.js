import { Geist, Geist_Mono, Inter, Playfair_Display, Lobster, Tektur, Big_Shoulders_Inline_Display } from "next/font/google";
import ClientLayout from "./components/ClientLayout";
import "./globals.css";

// Google Fonts
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const tektur = Tektur({ variable: "--font-tektur", subsets: ["latin"], weight: "600" });
const bigShouldersInline = Big_Shoulders_Inline_Display({ variable: "--font-big-shoulders-inline", subsets: ["latin"], weight: "300" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["400", "600", "700"], });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], });
const lobster = Lobster({ variable: "--font-lobster", subsets: ["latin"], weight: "400" });

export const metadata = {
  title: "LegalDeck",
  description: "An online Legal Consultation Platform that enables individuals to connect with professional lawyers, book appointments, upload case documents, and make online payments.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${playfair.variable} ${tektur.variable} ${lobster.variable} ${bigShouldersInline.variable} antialiased`} >
        <ClientLayout >
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
