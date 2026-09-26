import React from "react";
import type { Metadata, Viewport } from "next";
import "styles/reset.css";
import "styles/style.css";
import { mikodacs, rubik } from "styles/fonts";
import { siteMetadata } from "config/siteMetadata";
import { GoogleAnalytics } from '@next/third-parties/google'
import Providers from "./providers";

export const metadata: Metadata = siteMetadata

export const viewport: Viewport = {
  themeColor: "#000000",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
      <html lang="en" className={`${rubik.variable} ${mikodacs.variable}`}>
        <head>
          {/* Google site verification */}
          <meta name="google-site-verification" content="EOMmuwe09B4xyHvvl87ibojAIuf1snvLw9eP5Gt-Cm4" />
          {/* Adsense snippets */}
          {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2161757435040376" crossOrigin="anonymous"></script> */}
          {/* Mediavine */}
          {/* <script type="text/javascript" async={true} data-noptimize="1" data-cfasync="false" src="//scripts.mediavine.com/tags/43dced82-5ca9-4c31-bf67-e780146fe518.js"></script> */}
        </head>
        <body>
          <Providers>{children}</Providers>
        </body>
        <GoogleAnalytics gaId="G-DRPHJ20BKN"/>
      </html>
    )
}
