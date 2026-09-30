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
      <body className="bg-orbital-dark text-slate-100 antialiased selection:bg-sky-500/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
