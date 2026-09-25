import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Limbus Company ID Creator - Custom Card Maker",
        short_name: "Limbus ID Creator",
        start_url: "/",
        display: "standalone",
        theme_color: "#1a1210",
        background_color: "#1a1210",
        icons: [
            { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
            { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
    }
}
