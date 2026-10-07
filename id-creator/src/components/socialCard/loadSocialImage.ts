import 'server-only'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { reportError } from 'utils/reportError'
import { isSupportedImageType, supportedDataUrl } from './socialCardUtils'

const MAX_IMAGE_BYTES = 4_000_000
const FETCH_TIMEOUT_MS = 5000

export async function loadSocialImage(url: string | undefined): Promise<string | null> {
    if (!url) return null
    if (url.startsWith('data:')) return supportedDataUrl(url)
    if (!url.startsWith('https://')) return null
    try {
        const response = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS), next: { revalidate: 86400 } })
        const contentType = response.headers.get('content-type')
        if (!response.ok || !isSupportedImageType(contentType)) return null
        const buffer = Buffer.from(await response.arrayBuffer())
        if (buffer.byteLength > MAX_IMAGE_BYTES) return null
        return `data:${contentType!.split(';')[0].trim()};base64,${buffer.toString('base64')}`
    } catch (error) {
        reportError(error, { context: 'loadSocialImage', extra: { url } })
        return null
    }
}

export async function loadSiteIcon(): Promise<string | null> {
    try {
        const icon = await readFile(join(process.cwd(), 'public/icons/icon-192.png'))
        return `data:image/png;base64,${icon.toString('base64')}`
    } catch (error) {
        reportError(error, { context: 'loadSiteIcon' })
        return null
    }
}
