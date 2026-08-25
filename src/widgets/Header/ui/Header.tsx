"use client";

import { useEffect, useMemo, useRef, type FC } from "react";
import { useLocale, useTranslations } from "next-intl";
import styles from "./Header.module.scss";

import IconLink from "@/shared/ui/IconLink";
import { throttle } from "@/shared/lib/throttle";
import { GITHUB_URL } from "@/shared/config/urls";
import { getNavigationsLinks } from "../model/navigation";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileMenu from "./MobileMenu";
import Navigation from "./Navigation";

export const Header: FC = () => {
    const locale = useLocale();
    const t = useTranslations();
    const headerRef = useRef<HTMLElement | null>(null);
    useEffect(() => {
        const setHeight = () => {
            if (headerRef.current) {
                const height = headerRef.current.offsetHeight;
                document.body.style.setProperty("--header-height", `${height}px`);
            }
        };

        setHeight();

        const onResize = throttle(setHeight, 300);
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
            onResize.cancel();
        };
    }, []);

    const links = useMemo(
        () =>
            getNavigationsLinks().map((link) => ({
                href: link.href,
                label: t(link.labelKey),
            })),
        [t]
    );

    const navAriaLabel = useMemo(() => t("Nav.ariaLabel"), [t]);
    const githubAria = useMemo(() => t("Social.githubAria"), [t]);
    const rssAria = useMemo(() => t("Social.rssAria"), [t]);

    return (
        <header ref={headerRef} className={styles["header"]}>
            <div className={styles["header__nav-desktop"]}>
                <Navigation links={links} ariaLabel={navAriaLabel} />
            </div>

            <MobileMenu links={links} ariaLabel={navAriaLabel} />

            <div className={styles["header__socials"]}>
                <IconLink
                    href={GITHUB_URL}
                    ariaLabel={githubAria}
                    iconLight="/assets/sprites/github-mark.svg"
                    iconDark="/assets/sprites/github-mark-white.svg"
                    width={48}
                    height={48}
                    size="lg"
                />
                <IconLink
                    href={`/${locale}/rss.xml`}
                    ariaLabel={rssAria}
                    iconLight="/assets/sprites/rss.svg"
                    iconDark="/assets/sprites/rss-white.svg"
                    width={48}
                    height={48}
                    size="lg"
                />
            </div>

            <div className={styles["header__settings"]}>
                <ThemeToggle />
                <LanguageSwitcher />
            </div>
        </header>
    );
};
