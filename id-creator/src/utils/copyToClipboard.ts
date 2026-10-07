import { Result, fail, ok } from "./result"

export async function copyToClipboard(text: string): Promise<Result<void>> {
    try {
        await navigator.clipboard.writeText(text)
        return ok(undefined)
    } catch (error) {
        return fail(error)
    }
}
