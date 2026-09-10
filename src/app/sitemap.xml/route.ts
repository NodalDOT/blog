import { routing } from "@/shared/i18n/routing";
import { BASE_SEO } from "@/app/[locale]/seo";
import { readPostFrontmatters } from "@/entities/post/api/readPostFrontmatters";

const SITE_URL = BASE_SEO.en.url;
const STATIC_PATHS = ["", "/about", "/posts"];

type SitemapEntry = {
    url: string;
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

function getLatestPostDate(locale: string) {
    return readPostFrontmatters(locale).reduce<string | undefined>((latest, post) => {
        const date = post.updated ?? post.date;
        return !latest || date > latest ? date : latest;
    }, undefined);
}

function getStaticEntries() {
    return routing.locales.flatMap((locale) => {
        const latest = getLatestPostDate(locale);

        return STATIC_PATHS.map((pagePath) => {
            // The listing pages change whenever a post does; /about has no such signal.
            const tracksPosts = pagePath !== "/about";

            return {
                url: `${SITE_URL}/${locale}${pagePath}`,
                ...(latest && tracksPosts
                    ? { lastModified: formatLastModified(new Date(latest)) }
                    : {}),
            } satisfies SitemapEntry;
        });
    });
}

function getPostEntries() {
    return routing.locales.flatMap((locale) => {
        return readPostFrontmatters(locale).map((post) => ({
            url: `${SITE_URL}/${locale}/posts/${post.id}`,
            lastModified: formatLastModified(new Date(post.updated ?? post.date)),
        }));
    });
}

export function GET() {
    const entries: SitemapEntry[] = [...getStaticEntries(), ...getPostEntries()];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
    .map(({ url, lastModified }) =>
        [
            "  <url>",
            `    <loc>${escapeXml(url)}</loc>`,
            ...(lastModified ? [`    <lastmod>${lastModified}</lastmod>`] : []),
            "  </url>",
        ].join("\n")
    )
    .join("\n")}
</urlset>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "text/xml; charset=UTF-8",
        },
    });
}
