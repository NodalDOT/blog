"use client";

import { memo, useEffect, useRef, type FC } from "react";
import { PostCard, type ViewMode } from "@/shared/ui/PostCard";
import type { Post } from "@/entities/post";
import { classNames } from "@/shared/lib/classNames";
import styles from "./PostsFeed.module.scss";

interface PostsGridProps {
    posts: Post[];
    viewMode: ViewMode;
}

const PostsGridComponent: FC<PostsGridProps> = ({ posts, viewMode }) => {
    const gridRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const grid = gridRef.current;
        if (!grid) return;
        const videos = grid.querySelectorAll<HTMLVideoElement>("video");
        videos.forEach((v) => {
            if (viewMode === "video") {
                v.play().catch(() => {});
            } else {
                v.pause();
            }
        });
    }, [viewMode, posts]);

    return (
        <div
            ref={gridRef}
            className={classNames(styles["posts-feed__grid"], styles[`mode-${viewMode}`])}
            data-view-mode={viewMode}
        >
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    subtitle={post.subtitle}
                    image={post.image}
                    videoUrl={post.videoUrl}
                />
            ))}
        </div>
    );
};

export const PostsGrid = memo(PostsGridComponent);
