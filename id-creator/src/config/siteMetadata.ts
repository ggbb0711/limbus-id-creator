import type { Metadata } from 'next'
import { clientEnv } from './env.client'

export const siteUrl = clientEnv.siteUrl

export const THEME_COLOR = '#1a1210'

const title = 'Limbus Company ID Creator - Custom Card Maker'
const description =
    'Create custom Limbus Company Identity and E.G.O cards with our fan-made character creator. Design, customize, and share your own characters with the community.'

export const baseOpenGraph = {
    type: 'website',
    siteName: 'Limbus ID Creator',
    title,
    description,
} satisfies NonNullable<Metadata['openGraph']>

export const defaultSocialImages = ['/Images/SiteLogo.webp']

// Root metadata. Pages set their own `title` (filled into the template) and `alternates.canonical`.
// Don't put a canonical here: it would be inherited by every page.
export const siteMetadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: '%s | Limbus ID Creator' },
    description,
    keywords: ['Limbus Company', 'ID creator', 'EGO creator', 'fan character creator', 'custom identity card', 'Project Moon', 'Limbus Company fan tool'],
    authors: [{ name: 'Limbus ID Creator' }],
    openGraph: { ...baseOpenGraph, images: defaultSocialImages },
    twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: defaultSocialImages,
    },
}

interface PageMetadataInput {
    title: string
    description: string
    path: string
}

export function pageMetadata({ title, description, path }: PageMetadataInput): Metadata {
    return {
        title,
        description,
        alternates: { canonical: path },
        openGraph: { ...baseOpenGraph, title, description, url: path, images: defaultSocialImages },
        twitter: { ...siteMetadata.twitter, title, description, images: defaultSocialImages },
    }
}
