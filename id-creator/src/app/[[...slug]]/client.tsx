'use client'
 
import dynamic from 'next/dynamic'
import React from 'react'
import * as Sentry from "@sentry/react";
import { EnvironmentVariables } from 'Config/Environments';

Sentry.init({
  dsn: EnvironmentVariables.NEXT_PUBLIC_SENTRY_DSN,
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  enableLogs: true,
});
const App = dynamic(() => import('../../App/App'), { ssr: false })

 
export function ClientOnly() {
  return <App />
}