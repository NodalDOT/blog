"use client";

import { memo, useState, type FC } from "react";

import type { ViewMode } from "@/shared/ui/PostCard";
import type { Post } from "@/entities/post";
import styles from "./PostsFeed.module.scss";
import { classNames } from "@/shared/lib/classNames";
import Search from "@/shared/ui/Search";
import { usePostsFilter } from "@/features/posts/posts-filter";
import { useTranslations } from "next-intl";

import { PostsGrid } from "./PostsGrid";
import { ViewModeSwitch } from "./ViewModeSwitch";

interface PostsFeedProps {
    posts: Post[];
}

const PostsFeed: FC<PostsFeedProps> = ({ posts }) => {
    const t = useTranslations("PostsFeed");
    const { query, setQuery, visiblePosts } = usePostsFilter({
        posts,
    });
    const [viewMode, setViewMode] = useState<ViewMode>("image");

    return (
        <section className={classNames(styles["posts-feed"], "section")}>
            <div className={styles["posts-feed__intro"]}>
                <h1 className={styles["posts-feed__title"]}>{t("title")}</h1>
                <p className={styles["posts-feed__description"]}>{t("description")}</p>
            </div>

            <div className={styles["posts-feed__toolbar"]}>
                <Search
                    value={query}
                    onChange={setQuery}
                    hideLabel
                    className={styles["posts-feed__search"]}
                />

                <div className={styles["posts-feed__results-bar"]}>
                    <p className={styles["posts-feed__count"]} role="status" aria-atomic="true">
                        {t("results", { count: visiblePosts.length })}
                    </p>
                    <ViewModeSwitch value={viewMode} onChange={setViewMode} />
                </div>
            </div>

            {visiblePosts.length > 0 ? (
                <PostsGrid posts={visiblePosts} viewMode={viewMode} />
            ) : (
                <p className={styles["posts-feed__empty"]}>{t("empty")}</p>
            )}
        </section>
    );
};

export default memo(PostsFeed);
