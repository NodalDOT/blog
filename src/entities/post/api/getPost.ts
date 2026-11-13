import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import type { MDXContent } from "mdx/types";
import { LOCALES } from "@/shared/i18n/types";
import type { Post, PostMetadata, PostTocItem } from "../model/types";

interface PostModule {
    default: MDXContent;
    metadata: PostMetadata;
    toc: PostTocItem[];
}

export function getPostSlugs(locale: string): string[] {
    if (!LOCALES.some((supported) => supported === locale)) return [];

    const dir = path.join(process.cwd(), "content/posts", locale);
    if (!fs.existsSync(dir)) return [];

    return fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
        .map((entry) => entry.name.slice(0, -4));
}

export const getPost = cache(async (locale: string, slug: string) => {
    if (!getPostSlugs(locale).includes(slug)) return undefined;

    const {
        default: Content,
        metadata,
        toc,
    }: PostModule = await import(`../../../../content/posts/${locale}/${slug}.mdx`);

    const post: Post = { ...metadata, id: slug };
    return { Content, post, toc };
});
