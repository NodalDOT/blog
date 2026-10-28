"use client";

import { useState, type FC } from "react";
import styles from "./MainPosts.module.scss";
import { classNames } from "@/shared/lib/classNames";
import Skeleton from "@/shared/ui/Skeleton";
import { useTranslations } from "next-intl";
import type { Post } from "@/entities/post";
import PostsSwiper from "./PostsSwiper";

interface MainPostsProps {
    posts: Post[];
}

export const MainPosts: FC<MainPostsProps> = (props) => {
    const { posts } = props;
    const [isSwiperReady, setIsSwiperReady] = useState(false);
    const t = useTranslations("HomePage.MainPosts");

    return (
        <section id="main-posts" className={classNames(styles["main-posts"], "section")}>
            <h2 className={styles["main-posts__title"]}>{t("title")}</h2>

            {!isSwiperReady && <Skeleton />}
            <div
                className={classNames(
                    styles["main-posts__content"],
                    !isSwiperReady && styles["main-posts__content--hidden"]
                )}
            >
                <PostsSwiper
                    posts={posts}
                    onReady={() => setIsSwiperReady(true)}
                    paginationClassName={styles["main-posts__slider-pagination"]}
                />
                <div
                    className={styles["main-posts__slider-pagination"]}
                    aria-hidden={!isSwiperReady}
                />
            </div>
        </section>
    );
};

export default MainPosts;
