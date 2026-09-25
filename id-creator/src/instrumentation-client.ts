import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    // PII collection (was `sendDefaultPii: true` with @sentry/react) is left at the SDK's defaults.
    // Opt in per category with `dataCollection` if it's needed.
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
