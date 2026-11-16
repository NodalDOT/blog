import Image from "next/image";
import type { Post } from "@/entities/post";
import { PostVideo } from "./PostVideo";
import styles from "./PostDetailMedia.module.scss";

export const PostDetailMedia = ({ post }: { post: Post }) => {
    const { id, date, image, videoUrl } = post;

    return (
        <div className={styles["post-detail__hero-media-wrapper"]}>
            <div className={styles["post-detail__hero-media-meta"]} aria-hidden="true">
                <span className={styles["post-detail__hero-media-meta-value"]}>
                    {id.padStart(2, "0")}
                </span>
                <span className={styles["post-detail__hero-media-meta-line"]} />
                <span className={styles["post-detail__hero-media-meta-label"]}>POST</span>
            </div>

            <div className={styles["post-detail__hero-media-frame"]}>
                <Image
                    className={styles["post-detail__hero-media"]}
                    src={image.src}
                    alt={image.alt}
                    width={1600}
                    height={800}
                    preload
                    fetchPriority="high"
                    sizes="(max-width: 785px) 90vw, (max-width: 1599px) calc(90vw - 21rem), 123rem"
                />

                {videoUrl && <PostVideo src={videoUrl} />}
            </div>

            <div
                className={styles["post-detail__hero-media-meta"]}
                data-side="end"
                aria-hidden="true"
            >
                <span className={styles["post-detail__hero-media-meta-value"]}>
                    {date.slice(0, 4)}
                </span>
                <span className={styles["post-detail__hero-media-meta-line"]} />
                <span className={styles["post-detail__hero-media-meta-label"]}>16:9</span>
            </div>
        </div>
    );
};
