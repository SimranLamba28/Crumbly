'use client';

import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import Navbar from '@/components/Navbar/Navbar';
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
          <footer className="footer py-3">
            <p>© {new Date().getFullYear()} BakeMuse - Created with 🧁</p>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}