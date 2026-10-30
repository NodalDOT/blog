"use client";

import { memo, useCallback, useMemo, useState, type FC } from "react";

import type { ViewMode } from "@/shared/ui/PostCard";
import type { Post } from "@/entities/post";
import styles from "./PostsFeed.module.scss";
import { classNames } from "@/shared/lib/classNames";
import Search from "@/shared/ui/Search";
import { Select, type SelectOption } from "@/shared/ui/Select";
import { usePostsFilter } from "@/features/posts/posts-filter";
import { useTranslations } from "next-intl";
import { PostsGrid } from "./PostsGrid";

interface PostsFeedProps {
    posts: Post[];
}

const PostsFeed: FC<PostsFeedProps> = ({ posts }) => {
    const t = useTranslations("PostsFeed");
    const { query, setQuery, visiblePosts } = usePostsFilter({
        posts,
    });
    const [viewMode, setViewMode] = useState<ViewMode>("image");

    const VIEW_MODES = useMemo<SelectOption[]>(
        () => [
            { value: "compact", label: t("modes.compact") },
            { value: "image", label: t("modes.image") },
            { value: "video", label: t("modes.video") },
        ],
        [t]
    );

    const viewModeLabel = useMemo(() => t("viewMode"), [t]);
    const viewModeAria = useMemo(() => t("viewModeAria"), [t]);

    const handleViewModeChange = useCallback((value: string) => {
        setViewMode(value as ViewMode);
    }, []);

    return (
        <section className={classNames(styles["posts-feed"], "section")}>
            <div className={styles["posts-feed__intro"]}>
                <h1 className={styles["posts-feed__title"]}>{t("title")}</h1>
                <p className={styles["posts-feed__description"]}>{t("description")}</p>
            </div>

            <div className={styles["posts-feed__header"]}>
                <Search value={query} onChange={setQuery} />
                <Select
                    value={viewMode}
                    onChange={handleViewModeChange}
                    options={VIEW_MODES}
                    label={viewModeLabel}
                    ariaLabel={viewModeAria}
                />
            </div>

            {visiblePosts.length > 0 ? (
                <PostsGrid posts={visiblePosts} viewMode={viewMode} />
            ) : (
                <p className={styles["posts-feed__empty"]} role="status">
                    {t("empty")}
                </p>
            )}
        </section>
    );
};

export default memo(PostsFeed);
