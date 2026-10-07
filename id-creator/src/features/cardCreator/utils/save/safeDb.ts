import { Result, fail, ok } from "utils/result"
import { reportError } from "utils/reportError"

export async function safeDb<T>(operation: () => Promise<T>, context: string): Promise<Result<T>> {
    try {
        return ok(await operation())
    } catch (error) {
        reportError(error, { context })
        return fail(error)
    }
}
