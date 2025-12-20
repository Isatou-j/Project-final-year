import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '@/components/providers/client-providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ),
  title: {
    default: 'TeleHealth - Modern Healthcare Platform',
    template: '%s | TeleHealth',
  },
  description:
    'Connect with healthcare professionals through our secure telemedicine platform. Book appointments, consult remotely, and manage your health records with ease.',
  keywords: [
    'telemedicine',
    'telehealth',
    'online doctor',
    'virtual consultation',
    'healthcare',
    'medical appointments',
    'remote healthcare',
    'digital health',
  ],
  authors: [{ name: 'TeleHealth Team' }],
  creator: 'TeleHealth',
  publisher: 'TeleHealth',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'TeleHealth - Modern Healthcare Platform',
    description:
      'Connect with healthcare professionals through our secure telemedicine platform. Book appointments, consult remotely, and manage your health records with ease.',
    siteName: 'TeleHealth',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TeleHealth - Modern Healthcare Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TeleHealth - Modern Healthcare Platform',
    description:
      'Connect with healthcare professionals through our secure telemedicine platform.',
    images: ['/og-image.jpg'],
    creator: '@telehealth',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin=''
        />
        <link rel='dns-prefetch' href={process.env.NEXT_PUBLIC_API_URL} />
        <meta name='color-scheme' content='light dark' />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'TeleHealth',
              description:
                'Modern Healthcare Platform for telehealth and remote consultations',
              url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
              logo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/logo.png`,
              sameAs: [
                'https://twitter.com/telehealth',
                'https://linkedin.com/company/telehealth',
                'https://facebook.com/telehealth',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+220-1234-8354',
                contactType: 'customer service',
                availableLanguage: 'English',
              },
              applicationCategory: 'HealthcareApplication',
              operatingSystem: 'Web Browser',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'GMD',
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans`}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
