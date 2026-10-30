"use client";

import { memo, type FC } from "react";
import { useTranslations } from "next-intl";
import type { ViewMode } from "@/shared/ui/PostCard";
import { Icon, type IconName } from "@/shared/ui/Icon";
import styles from "./PostsFeed.module.scss";

interface ViewModeSwitchProps {
    value: ViewMode;
    onChange: (value: ViewMode) => void;
}

const VIEW_MODES: { value: ViewMode; icon: IconName }[] = [
    { value: "compact", icon: "list" },
    { value: "image", icon: "image" },
    { value: "video", icon: "video" },
];

const ViewModeSwitchComponent: FC<ViewModeSwitchProps> = ({ value, onChange }) => {
    const t = useTranslations("PostsFeed");

    return (
        <div role="group" aria-label={t("viewModeAria")} className={styles["posts-feed__view"]}>
            {VIEW_MODES.map((mode) => (
                <button
                    key={mode.value}
                    type="button"
                    aria-pressed={value === mode.value}
                    className={styles["posts-feed__view-option"]}
                    onClick={() => onChange(mode.value)}
                >
                    <Icon name={mode.icon} size={20} />
                    <span className={styles["posts-feed__view-label"]}>
                        {t(`modes.${mode.value}`)}
                    </span>
                </button>
            ))}
        </div>
    );
};

export const ViewModeSwitch = memo(ViewModeSwitchComponent);
