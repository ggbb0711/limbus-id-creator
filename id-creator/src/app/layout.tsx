import React from "react";
import type { Metadata, Viewport } from "next";
import "styles/reset.css";
import "styles/style.css";
import { mikodacs, rubik } from "styles/fonts";
import { THEME_COLOR, siteMetadata } from "config/siteMetadata";
import { GoogleAnalytics } from '@next/third-parties/google'
import Providers from "./providers";
import { clientEnv } from "config/env.client";

export const metadata: Metadata = siteMetadata

export const viewport: Viewport = {
  themeColor: THEME_COLOR,
}

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
      <html lang="en" className={`${rubik.variable} ${mikodacs.variable}`}>
        <head>
          {/* Google site verification */}
          {clientEnv.googleSiteVerification && <meta name="google-site-verification" content={clientEnv.googleSiteVerification} />}
          {/* Adsense snippets */}
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8788213017462869" crossOrigin="anonymous"></script>
          {/* Mediavine */}
          {/* <script type="text/javascript" async={true} data-noptimize="1" data-cfasync="false" src="//scripts.mediavine.com/tags/43dced82-5ca9-4c31-bf67-e780146fe518.js"></script> */}
          {/* Admaven snippet */}
          <script data-cfasync="false" src="//dv5vwlgir0hsc.cloudfront.net/?lwvvd=1732986"></script>
        </head>
        <body>
          <Providers>{children}</Providers>
        </body>
        {clientEnv.gaId && <GoogleAnalytics gaId={clientEnv.gaId}/>}
      </html>
    )
}
