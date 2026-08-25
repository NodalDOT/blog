"use client";

import React, { useEffect, type FC } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.scss";
import { classNames } from "@/shared/lib/classNames";
import { Icon } from "@/shared/ui/Icon";
import { useTranslations } from "next-intl";
interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string | undefined;
    description?: string | undefined;
    contentClassName?: string | undefined;
}

const FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const Modal: FC<ModalProps> = (props) => {
    const { open, onClose, children, title, description, contentClassName } = props;
    const t = useTranslations("Modal");
    const [mounted, setMounted] = React.useState(false);
    const modalRef = React.useRef<HTMLDivElement>(null);
    const previouslyFocusedRef = React.useRef<HTMLElement | null>(null);

    useEffect(() => {
        const id = requestAnimationFrame(() => {
            setMounted(true);
        });
        return () => cancelAnimationFrame(id);
    }, []);

    useEffect(() => {
        if (!open) return;

        previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

        const id = requestAnimationFrame(() => {
            const focusable = modalRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
            (focusable?.[0] ?? modalRef.current)?.focus();
        });

        return () => {
            cancelAnimationFrame(id);
            previouslyFocusedRef.current?.focus();
        };
    }, [open]);

    useEffect(() => {
        if (open) {
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = `${scrollBarWidth}px`;
        } else {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        }

        return () => {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        };
    }, [open]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
                return;
            }

            if (e.key !== "Tab" || !modalRef.current) return;

            const focusable = Array.from(
                modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
            );
            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (!first || !last) return;

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };
        if (open) document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    if (!mounted) return null;

    const titleId = title ? "modal-title" : undefined;
    const descId = description ? "modal-description" : undefined;

    return createPortal(
        <div
            className={classNames(
                styles["modal__backdrop"],
                open && styles["modal__backdrop--visible"]
            )}
            onClick={onClose}
            aria-hidden={!open}
        >
            <div
                ref={modalRef}
                tabIndex={-1}
                className={classNames(
                    styles["modal__content"],
                    open && styles["modal__content--open"],
                    contentClassName
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descId}
                onClick={(e) => e.stopPropagation()}
            >
                {title && <h2 id={titleId}>{title}</h2>}
                {description && <p id={descId}>{description}</p>}

                <button
                    type="button"
                    className={styles["modal__close"]}
                    onClick={onClose}
                    aria-label={t("close")}
                >
                    <Icon name="x" />
                </button>
                {children}
            </div>
        </div>,
        document.body
    );
};

export const MemoizedModal = React.memo(Modal);
