export const BASE_SEO = {
    en: {
        siteName: "NodalDOT blog",
        locale: "en_US",
        url: "https://nodaldot.space",
        defaultImage: "/posts/images/1.webp",
    },
    ru: {
        siteName: "NodalDOT блог",
        locale: "ru_RU",
        url: "https://nodaldot.space",
        defaultImage: "/posts/images/1.webp",
    },
} as const;

export function resolveAbsoluteAssetUrl(baseUrl: string, assetPath: string) {
    if (assetPath.startsWith("http")) return assetPath;

    const normalizedPath = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
    return `${baseUrl}${normalizedPath}`;
}
