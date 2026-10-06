import type { MetadataRoute } from "next";
import { THEME_COLOR } from "config/siteMetadata";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Limbus Company ID Creator - Custom Card Maker",
        short_name: "Limbus ID Creator",
        start_url: "/",
        display: "standalone",
        theme_color: THEME_COLOR,
        background_color: THEME_COLOR,
        icons: [
            { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
            { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
    }
}
