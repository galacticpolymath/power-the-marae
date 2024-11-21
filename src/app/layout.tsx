import type { Metadata } from 'next';
import './globals.css';
import './marae.scss';

export const metadata: Metadata = {
  title: 'Power the Marae',
  description: 'Power the Marae',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="text-foreground bg-gray-100">{children}</body>
    </html>
  );
}
