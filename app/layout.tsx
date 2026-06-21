import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ciudadhub - Podcast sobre ciudades",
  description:
    "Conversaciones sobre urbanismo, movilidad, cultura y el futuro de nuestras ciudades en Latinoamérica.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-N1TGRB4GKB" strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-N1TGRB4GKB');
      `}</Script>
      <body className="bg-zinc-950 text-zinc-50 font-sans">{children}</body>
    </html>
  );
}
