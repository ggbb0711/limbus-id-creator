export type Result<T> = { ok: true; data: T } | { ok: false; error: unknown }

export const ok = <T>(data: T): Result<T> => ({ ok: true, data })

export const fail = <T>(error: unknown): Result<T> => ({ ok: false, error })
