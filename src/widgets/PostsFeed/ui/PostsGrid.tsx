"use client";

import { memo, type FC } from "react";
import { PostCard, type ViewMode } from "@/shared/ui/PostCard";
import type { Post } from "@/entities/post";
import { classNames } from "@/shared/lib/classNames";
import styles from "./PostsFeed.module.scss";

interface PostsGridProps {
    posts: Post[];
    viewMode: ViewMode;
}

const PostsGridComponent: FC<PostsGridProps> = ({ posts, viewMode }) => {
    return (
        <div
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
                    viewMode={viewMode}
                />
            ))}
        </div>
    );
};

export const PostsGrid = memo(PostsGridComponent);
