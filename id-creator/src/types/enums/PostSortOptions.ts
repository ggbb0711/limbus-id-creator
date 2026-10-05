export const POST_SORT_OPTIONS = ["Title", "MostViewed", "MostCommented", "Earliest", "Latest"] as const
export type PostSortOption = typeof POST_SORT_OPTIONS[number]

export const isPostSortOption = (value: unknown): value is PostSortOption =>
    typeof value === "string" && (POST_SORT_OPTIONS as readonly string[]).includes(value)
