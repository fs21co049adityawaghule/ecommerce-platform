import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShopEase - Your Premium E-commerce Destination',
  description: 'Discover a world of premium products at ShopEase. From electronics to fashion, home decor to sports equipment. Shop now and earn rewards!',
  keywords: 'ecommerce, online shopping, premium products, electronics, fashion, home decor',
  openGraph: {
    title: 'ShopEase - Your Premium E-commerce Destination',
    description: 'Discover a world of premium products at ShopEase. Shop now and earn rewards!',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}