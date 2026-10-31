"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Button from "@/shared/ui/Button";
import { Icon } from "@/shared/ui/Icon";
import Modal, { useModal } from "@/shared/ui/Modal";
import styles from "./PostDetail.module.scss";

interface PostDetailMediaProps {
    postId: string;
    date: string;
    imageSrc: string;
    imageAlt: string;
    videoUrl: string;
}

const ProjectVideo = ({ src }: { src: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        void video.play().catch(() => undefined);

        return () => {
            video.pause();
            video.currentTime = 0;
        };
    }, [src]);

    return (
        <video
            ref={videoRef}
            className={styles["post-detail__video"]}
            src={src}
            tabIndex={0}
            controls
            playsInline
        />
    );
};

export const PostDetailMedia = ({
    postId,
    date,
    imageSrc,
    imageAlt,
    videoUrl,
}: PostDetailMediaProps) => {
    const { open, openModal, closeModal } = useModal();
    const t = useTranslations("PostDetail");
    const year = date.slice(0, 4);

    return (
        <div className={styles["post-detail__hero-media-wrapper"]}>
            <div className={styles["post-detail__hero-media-meta"]} aria-hidden="true">
                <span className={styles["post-detail__hero-media-meta-value"]}>
                    {postId.padStart(2, "0")}
                </span>
                <span className={styles["post-detail__hero-media-meta-line"]} />
                <span className={styles["post-detail__hero-media-meta-label"]}>POST</span>
            </div>

            <div className={styles["post-detail__hero-media-frame"]}>
                <Image
                    className={styles["post-detail__hero-media"]}
                    src={imageSrc}
                    alt={imageAlt}
                    width={1600}
                    height={800}
                    priority
                    sizes="(max-width: 786px) 100vw, (max-width: 1200px) 60vw, 800px"
                />

                {videoUrl && (
                    <>
                        <Button
                            type="button"
                            ariaLabel={t("playVideo")}
                            className={styles["post-detail__play-button"]}
                            onClick={openModal}
                        />

                        <Button
                            type="button"
                            ariaLabel={t("playVideo")}
                            className={styles["post-detail__play-button-center"]}
                            onClick={openModal}
                        >
                            <Icon name="play" />
                        </Button>
                    </>
                )}
            </div>

            <div
                className={styles["post-detail__hero-media-meta"]}
                data-side="end"
                aria-hidden="true"
            >
                <span className={styles["post-detail__hero-media-meta-value"]}>{year}</span>
                <span className={styles["post-detail__hero-media-meta-line"]} />
                <span className={styles["post-detail__hero-media-meta-label"]}>16:9</span>
            </div>

            {videoUrl && (
                <>
                    <Modal
                        open={open}
                        onClose={closeModal}
                        ariaLabel={t("videoDialogTitle")}
                        contentClassName={styles["post-detail__video-modal"]}
                    >
                        <div className={styles["post-detail__video-frame"]}>
                            {open && <ProjectVideo src={videoUrl} />}
                        </div>
                    </Modal>
                </>
            )}
        </div>
    );
};
