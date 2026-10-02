import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EDOLUS // Orbital Intelligence Platform',
  description: 'Next-generation low-Earth orbit planetary observation and synthetic intelligence.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-orbital-dark text-slate-100 antialiased selection:bg-sky-500/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}

