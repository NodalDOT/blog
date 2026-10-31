"use client";

import React, { type FC } from "react";
import { Input } from "@/shared/ui/Input";
import styles from "./Search.module.scss";
import { Icon } from "@/shared/ui/Icon";
import { useTranslations } from "next-intl";
import { classNames } from "@/shared/lib/classNames";

interface SearchProps {
    value: string;
    onChange: (v: string) => void;
    hideLabel?: boolean;
    className?: string | undefined;
}

export const Search: FC<SearchProps> = React.memo(
    ({ value, onChange, hideLabel = false, className }) => {
        const t = useTranslations("Search");

        return (
            <div className={classNames(styles["search"], className)}>
                <Input
                    icon={<Icon name="search" />}
                    type="text"
                    name="search"
                    label={t("label")}
                    hideLabel={hideLabel}
                    placeholder={t("placeholder")}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    autoComplete="off"
                />
            </div>
        );
    }
);

Search.displayName = "Search";
