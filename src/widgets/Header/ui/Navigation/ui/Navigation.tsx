"use client";

import React, { type FC } from "react";
import { usePathname } from "@/shared/i18n/navigation";
import styles from "./Navigation.module.scss";
import Link from "@/shared/ui/Link";
import { classNames } from "@/shared/lib/classNames";
import { usePageTransitionActions } from "@/app/providers/transition";

interface NavigationProps {
    links: Array<{ href: string; label: string }>;
    ariaLabel?: string;
}

const NavigationComponent: FC<NavigationProps> = (props) => {
    const { links, ariaLabel } = props;
    const pathname = usePathname();
    const { startTransition } = usePageTransitionActions();
    return (
        <nav className={classNames(styles["navigation"])} aria-label={ariaLabel}>
            <ul className={classNames(styles["navigation__list"])}>
                {links.map(({ href, label }) => (
                    <li key={href}>
                        <Link
                            href={href}
                            label={label}
                            isActive={pathname === href}
                            onClick={() => startTransition(href)}
                        />
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export const Navigation = React.memo(NavigationComponent);
