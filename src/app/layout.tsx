import { Providers } from "./providers";
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="nl">
      <head>
        <title>CorlaerBroodjes</title>
      </head>
      <body>
      <Providers>{children}</Providers>
      <Analytics />
      <GoogleAnalytics gaId="G-VV0QWD6052" />
      </body>
      </html>
  );
}