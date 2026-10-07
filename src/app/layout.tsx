import { Providers } from "./providers";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";
import type { Metadata } from "next";
import { Header } from "./header";
export const metadata: Metadata = { title: "CorlaerBroodjes" };

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="nl">
      <head>
      </head>
      <body>
      <Providers>
          <Header />
          {children}
      </Providers>
      <Analytics />
      <SpeedInsights />
      </body>
      </html>
  );
}