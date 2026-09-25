export const clientEnv = {
    serverUrl: process.env.NEXT_PUBLIC_SERVER_URL ?? "",
    googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
    localSaveMaxLen: Number(process.env.NEXT_PUBLIC_LOCAL_SAVE_MAX_LEN ?? 10),
    sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
}
