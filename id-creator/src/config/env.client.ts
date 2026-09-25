// Values the browser needs. NEXT_PUBLIC_* must be referenced literally so Next can inline them at build time.
export const clientEnv = {
    serverUrl: process.env.NEXT_PUBLIC_SERVER_URL ?? "",
    googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
    localSaveMaxLen: Number(process.env.NEXT_PUBLIC_LOCAL_SAVE_MAX_LEN ?? 10),
    sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
}
