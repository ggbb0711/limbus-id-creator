import * as Sentry from "@sentry/nextjs";
import { clientEnv } from "config/env.client";

Sentry.init({
    dsn: clientEnv.sentryDsn,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
