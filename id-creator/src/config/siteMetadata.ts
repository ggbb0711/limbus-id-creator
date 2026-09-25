import type { Metadata } from 'next'

export const siteUrl = 'https://limbus-company-id-creator.com'

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
