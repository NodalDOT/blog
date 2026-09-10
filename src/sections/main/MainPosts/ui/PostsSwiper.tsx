"use client";

import type { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

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
    return (
        <Swiper
            onInit={(swiper) => {
                onReady?.();
                requestAnimationFrame(() => swiper.update());
            }}
            grabCursor
            centeredSlides
            initialSlide={1}
            slidesPerView={3}
            spaceBetween={24}
            modules={[Pagination]}
            className={styles["main-posts__slider"]}
            pagination={{
                clickable: true,
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
            {posts.map((post, index) => {
                return (
                    <SwiperSlide key={index} className={styles["swiper-slide"]}>
                        <PostCard
                            id={post.id}
                            title={post.title}
                            subtitle={post.subtitle}
                            image={post.image}
                            videoUrl={post.videoUrl}
                            tags={post.tags}
                        />
                    </SwiperSlide>
                );
            })}
        </Swiper>
    );
};

export default PostsSwiper;
