"use client";

import React, { type FC } from "react";
import Image from "next/image";
import styles from "./PostCard.module.scss";
import { Link } from "@/shared/i18n/navigation";
import Tags from "@/shared/ui/Tags/index";
import { classNames } from "@/shared/lib/classNames";
import { usePageTransition } from "@/app/providers/transition";

export type ViewMode = "compact" | "image" | "video";

const MAX_VISIBLE_TAGS = 3;

export interface PostCardProps {
    id: string;
    title: string;
    subtitle: string;
    image: { src: string; alt: string };
    videoUrl: string;
    tags: string[];
    style?: React.CSSProperties;
}

const PostCard: FC<PostCardProps> = ({
    id,
    title,
    subtitle,
    image,
    videoUrl,
    tags = [],
    ...otherProps
}) => {
    const { startTransition } = usePageTransition();
    const hasImage = image.src.trim().length > 0;
    const hasVideo = videoUrl.trim().length > 0;
    const visibleTags =
        tags.length > MAX_VISIBLE_TAGS
            ? [...tags.slice(0, MAX_VISIBLE_TAGS), `+${tags.length - MAX_VISIBLE_TAGS}`]
            : tags;

    return (
        <article data-id={id} className={classNames(styles["post-card"])} {...otherProps}>
            <Link
                href={`/posts/${id}`}
                onClick={() => {
                    startTransition(`/posts/${id}`);
                }}
                className={styles["post-card__link"]}
            >
                <h3 className={styles["post-card__title"]}>{title}</h3>
            </Link>

            {subtitle && <p className={styles["post-card__subtitle"]}>{subtitle}</p>}

            <div className={styles["post-card__media"]}>
                {hasImage && (
                    <Image
                        src={image.src}
                        alt={image.alt}
                        width={1200}
                        height={675}
                        className={styles["post-card__image"]}
                    />
                )}

                {hasVideo && (
                    <video
                        src={videoUrl}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className={styles["post-card__video"]}
                        aria-hidden="true"
                        tabIndex={-1}
                    />
                )}
            </div>
            <div className={styles["post-card__tags"]}>
                <Tags tags={visibleTags} />
            </div>
        </article>
    );
};

export const MemoizedPostCard = React.memo(PostCard);
export { PostCard };
export default MemoizedPostCard;
