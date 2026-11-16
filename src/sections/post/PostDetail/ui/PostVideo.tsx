"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import Button from "@/shared/ui/Button";
import { Icon } from "@/shared/ui/Icon";
import Modal, { useModal } from "@/shared/ui/Modal";
import styles from "./PostDetailMedia.module.scss";

export const PostVideo = ({ src }: { src: string }) => {
    const { open, openModal, closeModal } = useModal();
    const t = useTranslations("PostDetail");
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !open) return;

        video.currentTime = 0;
        void video.play().catch(() => undefined);
        return () => video.pause();
    }, [src, open]);

    return (
        <>
            <Button
                type="button"
                ariaLabel={t("playVideo")}
                className={styles["post-detail__play-button"]}
                onClick={openModal}
            >
                <span className={styles["post-detail__play-button-center"]} aria-hidden="true">
                    <Icon name="play" />
                </span>
            </Button>
            <Modal
                open={open}
                onClose={closeModal}
                title={t("videoDialogTitle")}
                contentClassName={styles["post-detail__video-modal"]}
            >
                <video
                    ref={videoRef}
                    className={styles["post-detail__video"]}
                    src={src}
                    preload="none"
                    controls
                    playsInline
                />
            </Modal>
        </>
    );
};
