'use client';

import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/next';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children, session }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <Navbar />
          <main className="main-content container py-4">
            {children}
          </main>
          <Footer />
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}