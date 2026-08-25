import type { Post } from "@/entities/post";
import type { TocItem } from "../model/types";
import Tags from "@/shared/ui/Tags";
import styles from "./PostDetail.module.scss";
import { classNames } from "@/shared/lib/classNames";
import { PostScrollProgress } from "./PostScrollProgress";
import { PostBackLink } from "./PostBackLink";
import { PostDetailMedia } from "./PostDetailMedia";
import { PostToc } from "./PostToc";

interface PostDetailProps {
    post: Post;
    content: React.ReactElement;
    backLabel: string;
    tocLabel: string;
    toc?: TocItem[];
}

export const PostDetail: React.FC<PostDetailProps> = ({
    post,
    content,
    backLabel,
    tocLabel,
    toc = [],
}) => {
    return (
        <article className={classNames(styles["post-detail"], "section")}>
            <PostScrollProgress />

            <header className={styles["post-detail__hero"]}>
                <PostDetailMedia
                    imageSrc={post.image.src}
                    imageAlt={post.image.alt}
                    videoUrl={post.videoUrl}
                    date={post.date}
                />

                <div className={styles["post-detail__hero-content"]}>
                    <PostBackLink label={backLabel} />

                    <h1 className={styles["post-detail__title"]}>{post.title}</h1>

                    {post.subtitle && (
                        <p className={styles["post-detail__subtitle"]}>{post.subtitle}</p>
                    )}

                    <div className={styles["post-detail__hero-tags"]}>
                        <Tags tags={post.tags} />
                    </div>
                </div>
            </header>

            <div className={styles["post-detail__content-layout"]}>
                <div className={styles["post-detail__content"]}>{content}</div>

                {toc.length > 0 && <PostToc toc={toc} label={tocLabel} />}
            </div>
        </article>
    );
};
