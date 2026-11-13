"use client";

import { Icon } from "@/shared/ui/Icon";
import type { FC } from "react";
import styles from "./MobileMenu.module.scss";
import { Link, usePathname } from "@/shared/i18n/navigation";
import Modal, { useModal } from "@/shared/ui/Modal";
import { usePageTransitionActions } from "@/app/providers/transition";
import { classNames } from "@/shared/lib/classNames";
import { useTranslations } from "next-intl";

interface MobileMenuProps {
    links: { href: string; label: string }[];
    ariaLabel?: string;
}

export const MobileMenu: FC<MobileMenuProps> = (props) => {
    const { links, ariaLabel } = props;
    const { open, toggleModal, closeModal } = useModal();
    const pathname = usePathname();
    const { startTransition } = usePageTransitionActions();
    const t = useTranslations("MobileMenu");

    return (
        <div className={styles["mobile-menu"]}>
            <button
                type="button"
                aria-haspopup="dialog"
                onClick={toggleModal}
                aria-expanded={open}
                aria-label={open ? t("closeMenu") : t("openMenu")}
                className={classNames(
                    styles["mobile-menu__trigger"],
                    open && styles["mobile-menu__trigger--active"]
                )}
            >
                <span className={styles["mobile-menu__line"]} />
                <span className={styles["mobile-menu__line"]} />
                <span className={styles["mobile-menu__line"]} />
            </button>

            <Modal
                open={open}
                onClose={closeModal}
                title={t("dialogTitle")}
                contentClassName={styles["mobile-menu__panel"]}
            >
                <nav className={styles["mobile-menu__nav"]} aria-label={ariaLabel}>
                    <ul className={styles["mobile-menu__list"]}>
                        {links.map(({ href, label }, index) => (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className={styles["mobile-menu__link"]}
                                    aria-current={pathname === href ? "page" : undefined}
                                    onClick={(event) => {
                                        if (
                                            event.metaKey ||
                                            event.ctrlKey ||
                                            event.shiftKey ||
                                            event.altKey ||
                                            event.button !== 0
                                        )
                                            return;
                                        event.preventDefault();
                                        startTransition(href);
                                        closeModal();
                                    }}
                                >
                                    <span
                                        className={styles["mobile-menu__number"]}
                                        aria-hidden="true"
                                    >
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <span className={styles["mobile-menu__label"]}>{label}</span>
                                    <Icon
                                        name="arrow-up-right"
                                        className={styles["mobile-menu__arrow"]}
                                    />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </Modal>
        </div>
    );
};
