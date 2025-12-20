import type { Metadata } from 'next';

export function generateMetadata(overrides: Partial<Metadata> = {}): Metadata {
  const baseMetadata: Metadata = {
    title: 'TeleHealth - Modern Healthcare Platform',
    description:
      'Connect with healthcare professionals through our secure telemedicine platform. Book appointments, consult remotely, and manage your health records with ease.',
  };

  return {
    ...baseMetadata,
    ...overrides,
    title: overrides.title || baseMetadata.title,
    description: overrides.description || baseMetadata.description,
  };
}

export function generateStructuredData(
  type: string,
  data: Record<string, any>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };
}

export function generateCanonicalUrl(path: string = '') {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}${path}`;
}
