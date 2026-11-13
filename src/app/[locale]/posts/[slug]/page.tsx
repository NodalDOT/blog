import type { Metadata } from "next";
import type { Locale } from "@/shared/i18n/types";
import { notFound } from "next/navigation";
import { getPost } from "@/entities/post/api/getPost";
import PostDetail from "@/sections/post/PostDetail";
import { createPageMetadata } from "../../metadata";
import { getTranslations } from "next-intl/server";
import { BASE_SEO, resolveAbsoluteAssetUrl } from "../../seo";
import { assertDefined } from "@/shared/lib/assert";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
    const { locale, slug } = await params;

    const article = await getPost(locale, slug);
    if (!article) return notFound();

    const { title, subtitle, image } = article.post;

    return createPageMetadata({
        title,
        description: subtitle || title,
        openGraphTitle: title,
        openGraphDescription: subtitle || title,
        openGraphImage: image.src,
        openGraphType: "article",
        path: `/${locale}/posts/${slug}`,
        locale,
    });
}

export interface PostPageProps {
    params: Promise<{ locale: Locale; slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
    const { locale, slug } = await params;
    const t = await getTranslations({ locale, namespace: "PostDetail" });
    const tNav = await getTranslations({ locale, namespace: "Nav" });

    const article = await getPost(locale, slug);
    if (!article) return notFound();

    const { Content, post, toc } = article;

    const baseSeo = assertDefined(BASE_SEO[locale], `SEO config for locale ${locale} is required`);
    const postUrl = `${baseSeo.url}/${locale}/posts/${slug}`;
    const imageUrl = resolveAbsoluteAssetUrl(baseSeo.url, post.image.src);
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BlogPosting",
                headline: post.title,
                description: post.subtitle || post.title,
                image: [imageUrl],
                url: postUrl,
                mainEntityOfPage: postUrl,
                inLanguage: locale,
                datePublished: new Date(post.date).toISOString(),
                dateModified: new Date(post.updated ?? post.date).toISOString(),
                author: {
                    "@type": "Person",
                    name: "NodalDOT",
                    url: `${baseSeo.url}/${locale}`,
                },
                publisher: {
                    "@type": "Person",
                    name: "NodalDOT",
                    url: `${baseSeo.url}/${locale}`,
                },
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: tNav("home"),
                        item: `${baseSeo.url}/${locale}`,
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: tNav("posts"),
                        item: `${baseSeo.url}/${locale}/posts`,
                    },
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: post.title,
                        item: postUrl,
                    },
                ],
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PostDetail
                post={post}
                content={<Content />}
                backLabel={t("backToPosts")}
                tocLabel={t("tocTitle")}
                publishedLabel={t("published")}
                publishedDate={new Intl.DateTimeFormat(locale, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    timeZone: "UTC",
                }).format(new Date(post.date))}
                toc={toc}
            />
        </>
    );
}
