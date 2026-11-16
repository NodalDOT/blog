"use client";

import { useEffect, useRef } from "react";
import styles from "./PostDetail.module.scss";

export const PostScrollProgress = () => {
    const progressRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let frameId = 0;
        const progressElement = progressRef.current;
        const article = progressElement?.closest("article");
        const content = article?.querySelector<HTMLElement>("[data-post-content]");
        if (!progressElement || !content) return;
        let visible = false;

        const updateProgress = () => {
            frameId = 0;

            const bounds = content.getBoundingClientRect();
            const headerHeight =
                Number.parseFloat(
                    getComputedStyle(document.body).getPropertyValue("--header-height")
                ) || 0;
            const distance = bounds.height - window.innerHeight + headerHeight;
            const progress =
                distance > 0
                    ? Math.min(1, Math.max(0, (headerHeight - bounds.top) / distance))
                    : bounds.bottom <= window.innerHeight
                      ? 1
                      : 0;

            progressElement.style.setProperty("--post-scroll-progress", progress.toString());
        };

        const requestUpdate = () => {
            if (!visible || frameId) return;
            frameId = window.requestAnimationFrame(updateProgress);
        };

        const observer = new ResizeObserver(() => {
            visible = progressElement.getClientRects().length > 0;
            requestUpdate();
        });
        observer.observe(content);
        observer.observe(progressElement);
        window.addEventListener("scroll", requestUpdate, { passive: true });
        window.addEventListener("resize", requestUpdate);

        return () => {
            if (frameId) {
                window.cancelAnimationFrame(frameId);
            }

            observer.disconnect();
            window.removeEventListener("scroll", requestUpdate);
            window.removeEventListener("resize", requestUpdate);
        };
    }, []);

    return <div ref={progressRef} className={styles["post-detail__progress"]} aria-hidden="true" />;
};
