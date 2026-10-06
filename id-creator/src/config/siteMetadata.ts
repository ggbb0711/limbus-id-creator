import type { Metadata } from 'next'
import { clientEnv } from './env.client'

export const siteUrl = clientEnv.siteUrl

export const THEME_COLOR = '#1a1210'

const title = 'Limbus Company ID Creator - Custom Card Maker'
const description =
    'Create custom Limbus Company Identity and E.G.O cards with our fan-made character creator. Design, customize, and share your own characters with the community.'

// Root metadata. Pages set their own `title` (filled into the template) and `alternates.canonical`.
// Don't put a canonical here: it would be inherited by every page.
export const siteMetadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: '%s | Limbus ID Creator' },
    description,
    keywords: ['Limbus Company', 'ID creator', 'EGO creator', 'fan character creator', 'custom identity card', 'Project Moon', 'Limbus Company fan tool'],
    authors: [{ name: 'Limbus ID Creator' }],
    openGraph: {
        type: 'website',
        siteName: 'Limbus ID Creator',
        title,
        description,
        images: ['/Images/SiteLogo.webp'],
    },
    twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ['/Images/SiteLogo.webp'],
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
        openGraph: { ...siteMetadata.openGraph, title, description, url: path },
        twitter: { ...siteMetadata.twitter, title, description },
    }
}
