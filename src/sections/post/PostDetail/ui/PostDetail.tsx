import type { Post } from "@/entities/post";
import type { TocItem } from "../model/types";

import styles from "./PostDetail.module.scss";
import contentStyles from "./PostContent.module.scss";
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
    publishedLabel: string;
    publishedDate: string;
    toc?: TocItem[];
}

export const PostDetail: React.FC<PostDetailProps> = ({
    post,
    content,
    backLabel,
    tocLabel,
    publishedLabel,
    publishedDate,
    toc = [],
}) => {
    return (
        <article className={classNames(styles["post-detail"], "section")}>
            <PostScrollProgress />

            <header className={styles["post-detail__hero"]}>
                <div className={styles["post-detail__hero-meta"]}>
                    <PostBackLink label={backLabel} />

                    <p className={styles["post-detail__published"]}>
                        <span>{publishedLabel}</span>
                        <time dateTime={post.date}>{publishedDate}</time>
                    </p>
                </div>

                <div className={styles["post-detail__hero-content"]}>
                    <h1 className={styles["post-detail__title"]}>{post.title}</h1>

                    {post.subtitle && (
                        <p className={styles["post-detail__subtitle"]}>{post.subtitle}</p>
                    )}
                </div>
                <PostDetailMedia post={post} />
            </header>

            <div className={styles["post-detail__content-layout"]} data-has-toc={toc.length > 0}>
                {toc.length > 0 && <PostToc toc={toc} label={tocLabel} />}

                <div className={contentStyles["post-content"]} data-post-content>
                    {content}
                </div>
            </div>
        </article>
    );
};
