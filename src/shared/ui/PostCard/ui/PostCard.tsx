"use client";

import React, { type FC } from "react";
import Image from "next/image";
import styles from "./PostCard.module.scss";
import { Link } from "@/shared/i18n/navigation";

import { classNames } from "@/shared/lib/classNames";
import { usePageTransitionActions } from "@/app/providers/transition";

export type ViewMode = "compact" | "image" | "video";

export interface PostCardProps {
    id: string;
    title: string;
    subtitle: string;
    image: { src: string; alt: string; thumbnailSrc?: string };
    videoUrl?: string;
    viewMode?: ViewMode;

    style?: React.CSSProperties;
}

const PostCard: FC<PostCardProps> = ({
    id,
    title,
    subtitle,
    image,
    videoUrl,
    viewMode = "image",

    ...otherProps
}) => {
    const { startTransition } = usePageTransitionActions();
    const imageSrc = image.thumbnailSrc?.trim() || image.src;
    const hasImage = imageSrc.trim().length > 0;
    const showVideo = viewMode === "video" && Boolean(videoUrl?.trim());

    return (
        <article data-id={id} className={classNames(styles["post-card"])} {...otherProps}>
            <Link
                href={`/posts/${id}`}
                onNavigate={(event) => {
                    event.preventDefault();
                    startTransition(`/posts/${id}`);
                }}
                className={styles["post-card__link"]}
            >
                <h3 className={styles["post-card__title"]}>
                    <span className={styles["post-card__title-text"]}>{title}</span>
                </h3>
            </Link>

            {subtitle && <p className={styles["post-card__subtitle"]}>{subtitle}</p>}

            <div className={styles["post-card__media"]}>
                {hasImage && (
                    <Image
                        src={imageSrc}
                        alt={image.alt}
                        width={1200}
                        height={675}
                        sizes="(max-width: 767px) 90vw, (max-width: 1023px) 45vw, 30vw"
                        className={styles["post-card__image"]}
                    />
                )}

                {showVideo && (
                    <video
                        src={videoUrl}
                        width={1200}
                        height={675}
                        autoPlay
                        muted
                        loop
                        playsInline
                        onPlaying={(event) => {
                            event.currentTarget.dataset["playing"] = "true";
                        }}
                        className={styles["post-card__video"]}
                        aria-hidden="true"
                        tabIndex={-1}
                    />
                )}
            </div>
        </article>
    );
};

export const MemoizedPostCard = React.memo(PostCard);
export { PostCard };
export default MemoizedPostCard;
