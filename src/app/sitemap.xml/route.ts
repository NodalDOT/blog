import { routing } from "@/shared/i18n/routing";
import { BASE_SEO } from "@/app/[locale]/seo";
import { getPosts, type Post } from "@/entities/post";

const SITE_URL = BASE_SEO.en.url;
const STATIC_PATHS = ["", "/about", "/posts"];

type SitemapEntry = {
    locale: (typeof routing.locales)[number];
    path: string;
    lastModified?: string;
};

function formatLastModified(date: Date) {
    return date.toISOString().slice(0, 10);
}

function escapeXml(value: string) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;");
}

function getLatestPostDate(posts: Post[]) {
    return posts.reduce<string | undefined>((latest, post) => {
        const date = post.updated ?? post.date;
        return !latest || date > latest ? date : latest;
    }, undefined);
}

function getStaticEntries(locale: SitemapEntry["locale"], posts: Post[]) {
    const latest = getLatestPostDate(posts);

    return STATIC_PATHS.map((pagePath) => {
        // The listing pages change whenever a post does; /about has no such signal.
        const tracksPosts = pagePath !== "/about";

        return {
            locale,
            path: pagePath,
            ...(latest && tracksPosts
                ? { lastModified: formatLastModified(new Date(latest)) }
                : {}),
        } satisfies SitemapEntry;
    });
}

function getPostEntries(locale: SitemapEntry["locale"], posts: Post[]): SitemapEntry[] {
    return posts.map((post) => ({
        locale,
        path: `/posts/${post.id}`,
        lastModified: formatLastModified(new Date(post.updated ?? post.date)),
    }));
}

function getEntryUrl({ locale, path }: SitemapEntry) {
    return `${SITE_URL}/${locale}${path}`;
}

export async function GET() {
    const localizedEntries = await Promise.all(
        routing.locales.map(async (locale) => {
            const posts = await getPosts(locale);
            return [...getStaticEntries(locale, posts), ...getPostEntries(locale, posts)];
        })
    );
    const entries: SitemapEntry[] = localizedEntries.flat();
    const entriesByPath = Map.groupBy(entries, (entry) => entry.path);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries
    .map((entry) => {
        const alternates = entriesByPath.get(entry.path) ?? [];
        const defaultEntry = alternates.find(({ locale }) => locale === routing.defaultLocale);
        return [
            "  <url>",
            `    <loc>${escapeXml(getEntryUrl(entry))}</loc>`,
            ...(entry.lastModified ? [`    <lastmod>${entry.lastModified}</lastmod>`] : []),
            ...alternates.map(
                (alternate) =>
                    `    <xhtml:link rel="alternate" hreflang="${alternate.locale}" href="${escapeXml(getEntryUrl(alternate))}" />`
            ),
            ...(defaultEntry
                ? [
                      `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(getEntryUrl(defaultEntry))}" />`,
                  ]
                : []),
            "  </url>",
        ].join("\n");
    })
    .join("\n")}
</urlset>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "text/xml; charset=UTF-8",
        },
    });
}
