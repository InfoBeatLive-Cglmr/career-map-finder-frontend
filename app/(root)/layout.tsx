import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "../context/AppContext";
import { Providers } from '../context/providers';
import { ThemeProvider } from '../context/ThemeContext'; 
import { ThemeProviderDownload } from '../context/ThemeContextDownload';

import Script from "next/script";
import Analytics from "../components/home/auth/Analytics";
const GA_MEASUREMENT_ID ="G-N3Y6GDFJ4J";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"],});
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"],});

export const metadata: Metadata = {
  title: 'CareerMapFinder | Career Discovery & Regional Roadmaps for Students',
  description: 'Discover your better study path, regional entrance exams, state quotas, entry salary expectations, and living costs across the globe.',
  openGraph: {
    title: 'CareerMapFinder | Career Ecosystem',
    description: 'Comprehensive career discovery, regional state roadmaps, exam cutoffs, and ROI calculators tailored for students and parents.',
    url: 'https://www.careermapfinder.com',
    siteName: 'CareerMapFinder',
    locale: 'en_IN',
    type: 'website',
  },
};


export default function RootLayout({ children,}: Readonly<{ children: React.ReactNode;}>) {
  return (
    <html lang="en">
       <head>

        <Script strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />

        <Script id="google-analytics" strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              }); `, }}  />

       <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2297424135683590"
       crossOrigin="anonymous" strategy="afterInteractive"/>

       </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
        <ThemeProvider>
          <ThemeProviderDownload>
           <Providers>
              <AppProvider>
                <Analytics />
                {children}
              </AppProvider>
            </Providers>
          </ThemeProviderDownload>
        </ThemeProvider>
      </body>
    </html>
  );
}
