"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import styles from "./NotFound.module.scss";
import Button from "@/shared/ui/Button";
import { classNames } from "@/shared/lib/classNames";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/shared/i18n/navigation";

export const NotFound = () => {
    const t = useTranslations("NotFound");
    const locale = useLocale();

    const { push } = useRouter();

    const [animate, setAnimate] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const navigationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const rows = 20;
    const cols = 40;
    const tiles = useMemo(() => Array.from({ length: rows * cols }), [rows, cols]);

    const [delays, setDelays] = useState<number[]>([]);

    useEffect(() => {
        if (!buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const newDelays = tiles.map((_, i) => {
            const row = Math.floor(i / cols);
            const col = i % cols;

            const tileWidth = window.innerWidth / cols;
            const tileHeight = window.innerHeight / rows;

            const tileX = col * tileWidth + tileWidth / 2;
            const tileY = row * tileHeight + tileHeight / 2;

            const distance = Math.hypot(tileX - centerX, tileY - centerY);
            return distance / 1500;
        });

        setDelays(newDelays);
    }, [tiles]);

    useEffect(() => {
        return () => {
            if (navigationTimeoutRef.current) {
                clearTimeout(navigationTimeoutRef.current);
            }
        };
    }, []);

    const startHomeNavigation = () => {
        if (animate) return;

        setAnimate(true);
        const maxDelay = delays.length ? Math.max(...delays) : 0;

        navigationTimeoutRef.current = setTimeout(
            () => {
                push("/", { locale });
            },
            (maxDelay + 0.5) * 1000
        );
    };

    return (
        <section className={styles["not-found"]}>
            <h1 className={styles["not-found__glitch"]} aria-label={t("heading")}>
                404
                <span aria-hidden="true">404</span>
                <span aria-hidden="true">404</span>
            </h1>
            <p className={styles["not-found__message"]}>{t("message")}</p>
            <Button
                ref={buttonRef}
                className={classNames(
                    styles["not-found__button"],
                    animate && styles["not-found__button--ghost"]
                )}
                onClick={startHomeNavigation}
            >
                {t("button")}
            </Button>

            <div className={styles["not-found__grid"]}>
                {tiles.map((_, i) => (
                    <div
                        key={`tile-${Math.floor(i / cols)}-${i % cols}`}
                        className={classNames(
                            styles["not-found__tile"],
                            animate && styles["active"]
                        )}
                        style={{ transitionDelay: `${delays[i] || 0}s` }}
                    />
                ))}
            </div>
        </section>
    );
};
