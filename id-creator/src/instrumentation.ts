import * as Sentry from "@sentry/nextjs";
import { clientEnv } from "config/env.client";

export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs" || process.env.NEXT_RUNTIME === "edge") {
        Sentry.init({
            dsn: clientEnv.sentryDsn,
        });
    }
}

export const onRequestError = Sentry.captureRequestError;
