"use client";
import React from "react";
import styles from "./Link.module.scss";
import { classNames } from "@/shared/lib/classNames";
import { Link as LocaleLink } from "@/shared/i18n/navigation";
interface LinkProps {
    href: string;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
}

const Link: React.FC<LinkProps> = (props) => {
    const { href, label, isActive, onClick } = props;
    const triggerNavigationCallback = (e: { preventDefault: () => void }) => {
        if (!onClick) return;

        e.preventDefault();
        onClick();
    };
    return (
        <LocaleLink
            href={href}
            onNavigate={triggerNavigationCallback}
            aria-current={isActive ? "page" : undefined}
            className={classNames(styles["link"], isActive && styles["active"])}
        >
            {label}
        </LocaleLink>
    );
};

export const MemoizedLink = React.memo(Link);
