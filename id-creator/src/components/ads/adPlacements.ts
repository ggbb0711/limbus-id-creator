import type { AdcashBannerVariant } from "./AdcashBanner";

export const AD_PLACEMENTS = {
    homeLeaderboard: [{ minWidth: 768, size: "728x90" }, { minWidth: 0, size: "300x100" }],
    forumLeaderboard: [{ minWidth: 768, size: "728x90" }, { minWidth: 500, size: "468x60" }, { minWidth: 0, size: "300x100" }],
    postBelowContent: [{ minWidth: 1300, size: "728x90" }, { minWidth: 768, size: "468x60" }, { minWidth: 0, size: "300x100" }],
    postSidebarRectangle: [{ minWidth: 0, size: "300x250" }],
    postSidebarSkyscraper: [{ minWidth: 1100, size: "160x600" }],
    blogPostEnd: [{ minWidth: 768, size: "336x280" }, { minWidth: 0, size: "300x250" }],
    blogIndexEnd: [{ minWidth: 768, size: "728x90" }, { minWidth: 0, size: "250x250" }],
} as const satisfies Record<string, readonly AdcashBannerVariant[]>
