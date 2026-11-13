"use client";

import React from "react";
import { Icon } from "@/shared/ui/Icon";
import { useTranslations } from "next-intl";
import styles from "./ThemeToggle.module.scss";
import { useTheme } from "@/app/providers/theme";

const ThemeToggle: React.FC = () => {
    const { toggleTheme } = useTheme();
    const t = useTranslations();

    return (
        <button type="button" onClick={toggleTheme} className={styles["theme-toggle"]}>
            <span className={styles["theme-toggle__label-dark"]}>{t("Theme.switchTo.dark")}</span>
            <span className={styles["theme-toggle__label-light"]}>{t("Theme.switchTo.light")}</span>
            <span className={styles["theme-toggle__container"]}>
                <span className={styles["theme-toggle__icons"]} aria-hidden>
                    <Icon name="sun" size={18} className={styles["theme-toggle__icon"]} />
                    <Icon name="moon" size={18} className={styles["theme-toggle__icon"]} />
                </span>
                <span className={styles["theme-toggle__thumb"]} aria-hidden />
            </span>
        </button>
    );
};

export const MemoizedThemeToggle = React.memo(ThemeToggle);
