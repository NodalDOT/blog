import { getPosts } from "@/entities/post/api/getPosts";
import PostsFeed from "@/widgets/PostsFeed";
import type { Metadata } from "next";
import type { Locale } from "@/shared/i18n/types";
import type { FC } from "react";
import { getTranslations } from "next-intl/server";
import { createPageMetadata } from "../metadata";

interface PostsPageProps {
    params: Promise<{ locale: Locale }>;
}

const PostsPage: FC<PostsPageProps> = async ({ params }) => {
    const { locale } = await params;
    const posts = await getPosts(locale);
    return <PostsFeed posts={posts} />;
};

export default PostsPage;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations("Metadata.Posts");
    return createPageMetadata({
        title: t("title"),
        description: t("description"),
        path: `/${locale}/posts`,
        locale,
    });
}
