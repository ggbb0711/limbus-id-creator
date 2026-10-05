import { readInt, readNumber, readString } from "./readEnv"

export const clientEnv = {
    serverUrl: process.env.NEXT_PUBLIC_SERVER_URL ?? "",
    googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
    sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    siteUrl: readString(process.env.NEXT_PUBLIC_SITE_URL, "https://limbus-company-id-creator.com"),
    gaId: readString(process.env.NEXT_PUBLIC_GA_ID, "G-DRPHJ20BKN"),
    googleSiteVerification: readString(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION, "EOMmuwe09B4xyHvvl87ibojAIuf1snvLw9eP5Gt-Cm4"),
}

export const appConfig = Object.freeze({
    limits: Object.freeze({
        card: Object.freeze({
            maxSkills: readInt(process.env.NEXT_PUBLIC_MAX_SKILLS, "NEXT_PUBLIC_MAX_SKILLS", 40, { min: 1 }),
            maxTraits: readInt(process.env.NEXT_PUBLIC_MAX_TRAITS, "NEXT_PUBLIC_MAX_TRAITS", 10, { min: 0 }),
            maxCustomKeywords: readInt(process.env.NEXT_PUBLIC_MAX_CUSTOM_KEYWORDS, "NEXT_PUBLIC_MAX_CUSTOM_KEYWORDS", 20, { min: 0 }),
            localSaveMaxLen: readInt(process.env.NEXT_PUBLIC_LOCAL_SAVE_MAX_LEN, "NEXT_PUBLIC_LOCAL_SAVE_MAX_LEN", 10, { min: 1 }),
        }),
        post: Object.freeze({
            maxUserTags: readInt(process.env.NEXT_PUBLIC_MAX_POST_USER_TAGS, "NEXT_PUBLIC_MAX_POST_USER_TAGS", 20, { min: 0 }),
            maxForumFilterTags: readInt(process.env.NEXT_PUBLIC_MAX_FORUM_FILTER_TAGS, "NEXT_PUBLIC_MAX_FORUM_FILTER_TAGS", 21, { min: 0 }),
            maxImages: readInt(process.env.NEXT_PUBLIC_MAX_POST_IMAGES, "NEXT_PUBLIC_MAX_POST_IMAGES", 8, { min: 1 }),
            maxTitleLength: readInt(process.env.NEXT_PUBLIC_MAX_POST_TITLE_LENGTH, "NEXT_PUBLIC_MAX_POST_TITLE_LENGTH", 199, { min: 1 }),
        }),
        user: Object.freeze({
            maxUsernameLength: readInt(process.env.NEXT_PUBLIC_MAX_USERNAME_LENGTH, "NEXT_PUBLIC_MAX_USERNAME_LENGTH", 65, { min: 1 }),
        }),
        upload: Object.freeze({
            skillImage: readInt(process.env.NEXT_PUBLIC_MAX_SKILL_IMAGE_BYTES, "NEXT_PUBLIC_MAX_SKILL_IMAGE_BYTES", 100_000, { min: 1 }),
            idSinnerIcon: readInt(process.env.NEXT_PUBLIC_MAX_ID_SINNER_ICON_BYTES, "NEXT_PUBLIC_MAX_ID_SINNER_ICON_BYTES", 100_000, { min: 1 }),
            egoSinnerIcon: readInt(process.env.NEXT_PUBLIC_MAX_EGO_SINNER_ICON_BYTES, "NEXT_PUBLIC_MAX_EGO_SINNER_ICON_BYTES", 80_000, { min: 1 }),
            idSplashArt: readInt(process.env.NEXT_PUBLIC_MAX_ID_SPLASH_BYTES, "NEXT_PUBLIC_MAX_ID_SPLASH_BYTES", 4_000_000, { min: 1 }),
            egoSplashArt: readInt(process.env.NEXT_PUBLIC_MAX_EGO_SPLASH_BYTES, "NEXT_PUBLIC_MAX_EGO_SPLASH_BYTES", 1_200_000, { min: 1 }),
            userIcon: readInt(process.env.NEXT_PUBLIC_MAX_USER_ICON_BYTES, "NEXT_PUBLIC_MAX_USER_ICON_BYTES", 102_400, { min: 1 }),
        }),
    }),
    paging: Object.freeze({
        postsPerPage: readInt(process.env.NEXT_PUBLIC_POSTS_PER_PAGE, "NEXT_PUBLIC_POSTS_PER_PAGE", 10, { min: 1, max: 100 }),
        commentsPerPage: readInt(process.env.NEXT_PUBLIC_COMMENTS_PER_PAGE, "NEXT_PUBLIC_COMMENTS_PER_PAGE", 10, { min: 1, max: 100 }),
        cloudSavesPerPage: readInt(process.env.NEXT_PUBLIC_CLOUD_SAVES_PER_PAGE, "NEXT_PUBLIC_CLOUD_SAVES_PER_PAGE", 50, { min: 1, max: 200 }),
    }),
    timing: Object.freeze({
        alertMs: readInt(process.env.NEXT_PUBLIC_ALERT_MS, "NEXT_PUBLIC_ALERT_MS", 4000, { min: 1500 }),
        searchDebounceMs: readInt(process.env.NEXT_PUBLIC_SEARCH_DEBOUNCE_MS, "NEXT_PUBLIC_SEARCH_DEBOUNCE_MS", 300, { min: 0 }),
        autosaveDebounceMs: readInt(process.env.NEXT_PUBLIC_AUTOSAVE_DEBOUNCE_MS, "NEXT_PUBLIC_AUTOSAVE_DEBOUNCE_MS", 500, { min: 0 }),
    }),
    image: Object.freeze({
        compressMaxSizeMB: readNumber(process.env.NEXT_PUBLIC_IMAGE_COMPRESS_MAX_MB, "NEXT_PUBLIC_IMAGE_COMPRESS_MAX_MB", 1, { min: 0.05 }),
        compressMinDimension: readInt(process.env.NEXT_PUBLIC_IMAGE_MIN_DIMENSION, "NEXT_PUBLIC_IMAGE_MIN_DIMENSION", 1650, { min: 100 }),
        webpQuality: readNumber(process.env.NEXT_PUBLIC_WEBP_QUALITY, "NEXT_PUBLIC_WEBP_QUALITY", 0.7, { min: 0, max: 1 }),
    }),
})

export type AppConfig = typeof appConfig
