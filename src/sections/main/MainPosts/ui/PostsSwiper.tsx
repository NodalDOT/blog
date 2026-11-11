"use client";

import type { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Pagination } from "swiper/modules";
import { useTranslations } from "next-intl";

import "swiper/css";
import "swiper/css/pagination";

import styles from "./MainPosts.module.scss";
import { PostCard } from "@/shared/ui/PostCard";
import type { Post } from "@/entities/post";

interface PostsSwiperProps {
    posts: Post[];
    onReady?: (() => void) | undefined;
    paginationClassName: string | undefined;
}
const PostsSwiper: FC<PostsSwiperProps> = (props) => {
    const { posts, onReady, paginationClassName } = props;
    const t = useTranslations("HomePage.MainPosts");
    return (
        <Swiper
            onInit={(swiper) => {
                onReady?.();
                requestAnimationFrame(() => swiper.update());
            }}
            grabCursor
            centeredSlides
            initialSlide={0}
            slidesPerView={3}
            spaceBetween={24}
            modules={[Pagination, A11y]}
            a11y={{
                containerMessage: t("carouselLabel"),
                slideLabelMessage: t("slideLabel", {
                    index: "{{index}}",
                    slidesLength: "{{slidesLength}}",
                }),
                paginationBulletMessage: t("paginationLabel", { index: "{{index}}" }),
            }}
            className={styles["main-posts__slider"]}
            pagination={{
                clickable: true,
                bulletElement: "button",
                el: `.${paginationClassName}`,
            }}
            breakpoints={{
                0: {
                    slidesPerView: 1,
                    spaceBetween: 12,
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 16,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                },
            }}
        >
            {posts.map((post) => {
                return (
                    <SwiperSlide key={post.id} className={styles["swiper-slide"]}>
                        <PostCard
                            id={post.id}
                            title={post.title}
                            subtitle={post.subtitle}
                            image={post.image}
                            videoUrl={post.videoUrl}
                        />
                    </SwiperSlide>
                );
            })}
        </Swiper>
    );
};

export default PostsSwiper;
