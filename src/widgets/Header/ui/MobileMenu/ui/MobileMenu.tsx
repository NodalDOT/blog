"use client";

import type { FC } from "react";
import styles from "./MobileMenu.module.scss";
import Link from "@/shared/ui/Link";
import { usePathname } from "@/shared/i18n/navigation";
import Modal, { useModal } from "@/shared/ui/Modal";
import { usePageTransition } from "@/app/providers/transition";
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
    const { startTransition } = usePageTransition();
    const t = useTranslations("MobileMenu");

    return (
        <div className={styles["mobile-menu"]}>
            <button
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

            <Modal open={open} onClose={closeModal}>
                <nav className={styles["mobile-menu__nav"]} aria-label={ariaLabel}>
                    {links.map(({ href, label }) => (
                        <Link
                            href={href}
                            label={label}
                            key={label}
                            isActive={pathname === href}
                            onClick={() => {
                                startTransition(href);
                                closeModal();
                            }}
                        />
                    ))}
                </nav>
            </Modal>
        </div>
    );
};
