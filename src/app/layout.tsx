import { Providers } from "./providers";
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
      <head>
        <title>CorlaerBroodjes</title>
      </head>
      <body>
      <Providers>{children}</Providers>
      <Analytics />
      </body>
      </html>
  );
}