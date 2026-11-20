import React, { ReactElement } from "react";

export const ADSENSE_CLIENT = "ca-pub-2161757435040376"

export default function AdsenseScript(): ReactElement {
    return <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`} crossOrigin="anonymous"></script>
}
