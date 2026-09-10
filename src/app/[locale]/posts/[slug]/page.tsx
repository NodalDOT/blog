import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Metadata } from "next";
import type { Locale } from "@/shared/i18n/types";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import PostDetail from "@/sections/post/PostDetail";
import { createPostHeadingComponent, createPostTocRemarkPlugin } from "@/sections/post/PostDetail";
import type { Post } from "@/entities/post";
import type { TocItem } from "@/sections/post/PostDetail";
import { createPageMetadata } from "../../metadata";
import remarkGfm from "remark-gfm";
import { getTranslations } from "next-intl/server";
import { BASE_SEO, resolveAbsoluteAssetUrl } from "../../seo";
import { assertDefined } from "@/shared/lib/assert";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
    const { locale, slug } = await params;

    const file = path.join(process.cwd(), "content/posts", locale, `${slug}.mdx`);
    if (!fs.existsSync(file)) return { title: "Post not found" };

    const source = fs.readFileSync(file, "utf8");
    const { data } = matter(source);

    const title = String(data["title"] ?? "");
    const subtitle = String(data["subtitle"] ?? title);
    const imageSrc = data["imageSrc"];

    return createPageMetadata({
        title,
        description: subtitle,
        openGraphTitle: title,
        openGraphDescription: subtitle,
        ...(typeof imageSrc === "string" ? { openGraphImage: imageSrc } : {}),
        openGraphType: "article",
        path: `/${locale}/posts/${slug}`,
        locale,
    });
}

export interface PostPageProps {
    params: Promise<{ locale: Locale; slug: string }>;
}

type PostFrontmatter = Omit<Post, "image"> & {
    imageSrc: string;
    imageAlt: string;
};

export default async function PostPage({ params }: PostPageProps) {
    const { locale, slug } = await params;
    const t = await getTranslations({ locale, namespace: "PostDetail" });
    const tNav = await getTranslations({ locale, namespace: "Nav" });

    const file = path.join(process.cwd(), "content/posts", locale, `${slug}.mdx`);
    if (!fs.existsSync(file)) return notFound();

    const source = fs.readFileSync(file, "utf8");
    const toc: TocItem[] = [];
    const postTocRemarkPlugin = createPostTocRemarkPlugin(toc);

    const { content, frontmatter } = await compileMDX<PostFrontmatter>({
        source,
        components: {
            h2: createPostHeadingComponent("h2"),
            h3: createPostHeadingComponent("h3"),
        },
        options: {
            parseFrontmatter: true,
            mdxOptions: {
                remarkPlugins: [remarkGfm, postTocRemarkPlugin],
            },
        },
    });

    const post: Post = {
        ...frontmatter,
        image: {
            src: frontmatter.imageSrc,
            alt: frontmatter.imageAlt,
        },
    };

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
                content={content}
                backLabel={t("backToPosts")}
                tocLabel={t("tocTitle")}
                toc={toc}
            />
        </>
    );
}
