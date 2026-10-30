import { BASE_SEO } from "@/app/[locale]/seo";
import { readPostFrontmatters } from "@/entities/post/api/readPostFrontmatters";
import { routing } from "@/shared/i18n/routing";

function isSupportedLocale(locale: string): locale is (typeof routing.locales)[number] {
    return routing.locales.includes(locale as (typeof routing.locales)[number]);
}

function escapeXml(value: string) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;");
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    if (!isSupportedLocale(locale)) {
        return new Response("Not found", { status: 404 });
    }

    const baseUrl = BASE_SEO[locale].url;
    const feedUrl = `${baseUrl}/${locale}/rss.xml`;
    const siteUrl = `${baseUrl}/${locale}/posts`;
    const posts = readPostFrontmatters(locale);

    const lastBuildDate = posts[0]?.date
        ? new Date(posts[0].date).toUTCString()
        : new Date().toUTCString();

    const items = posts
        .map((post) => {
            const postUrl = `${baseUrl}/${locale}/posts/${post.id}`;

            return `<item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(postUrl)}</link>
      <guid>${escapeXml(postUrl)}</guid>
      <description>${escapeXml(post.subtitle)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`;
        })
        .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(BASE_SEO[locale].siteName)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(BASE_SEO[locale].siteName)} posts feed</description>
    <language>${escapeXml(locale)}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/rss+xml; charset=UTF-8",
        },
    });
}
