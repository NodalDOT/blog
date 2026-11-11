"use client";

import React, { useEffect, useId, type FC } from "react";
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
    ariaLabel?: string | undefined;
    contentClassName?: string | undefined;
}

const FOCUSABLE_SELECTOR =
    'a[href], button, textarea, input:not([type="hidden"]), select, video[controls], audio[controls], [tabindex]';

const getFocusableElements = (container: HTMLElement) =>
    Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (element) =>
            element.tabIndex >= 0 &&
            !element.hasAttribute("data-modal-focus-guard") &&
            !element.matches(":disabled") &&
            !element.closest('[inert], [aria-hidden="true"]') &&
            element.getClientRects().length > 0 &&
            getComputedStyle(element).visibility === "visible"
    );

const Modal: FC<ModalProps> = (props) => {
    const { open, onClose, children, title, description, ariaLabel, contentClassName } = props;
    const t = useTranslations("Modal");
    const [mounted, setMounted] = React.useState(false);
    const modalRef = React.useRef<HTMLDivElement>(null);
    const id = useId();
    const titleId = title ? `${id}-title` : undefined;
    const descId = description ? `${id}-description` : undefined;
    const focusBoundary = (last: boolean) => {
        const modal = modalRef.current;
        if (!modal) return;

        const focusable = getFocusableElements(modal);
        const target = last ? focusable[focusable.length - 1] : focusable[0];
        (target ?? modal).focus({ preventScroll: true });
    };

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            setMounted(true);
        });
        return () => cancelAnimationFrame(frame);
    }, []);

    useEffect(() => {
        if (!open || !mounted) return;

        const modal = modalRef.current;
        if (!modal) return;

        const previouslyFocused =
            document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const focusFirst = () => {
            (getFocusableElements(modal)[0] ?? modal).focus({ preventScroll: true });
        };
        const frame = requestAnimationFrame(focusFirst);
        const containFocus = (event: FocusEvent) => {
            if (event.target instanceof Node && !modal.contains(event.target)) {
                focusFirst();
            }
        };
        document.addEventListener("focusin", containFocus);

        return () => {
            cancelAnimationFrame(frame);
            document.removeEventListener("focusin", containFocus);
            if (previouslyFocused?.isConnected) {
                previouslyFocused.focus({ preventScroll: true });
            }
        };
    }, [open, mounted]);

    useEffect(() => {
        if (!open || !mounted) return;

        const { overflow, paddingRight } = document.body.style;
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        const currentPadding = Number.parseFloat(getComputedStyle(document.body).paddingRight) || 0;

        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = `${currentPadding + scrollBarWidth}px`;

        return () => {
            document.body.style.overflow = overflow;
            document.body.style.paddingRight = paddingRight;
        };
    }, [open, mounted]);

    useEffect(() => {
        if (!open || !mounted) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
            }
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, mounted, onClose]);

    if (!mounted) return null;

    return createPortal(
        <div
            className={classNames(
                styles["modal__backdrop"],
                open && styles["modal__backdrop--visible"]
            )}
            onClick={onClose}
            aria-hidden={!open}
            inert={!open}
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
                aria-label={title ? undefined : ariaLabel}
                aria-labelledby={titleId}
                aria-describedby={descId}
                onClick={(event) => event.stopPropagation()}
            >
                <span
                    className={styles["modal__focus-guard"]}
                    data-modal-focus-guard
                    tabIndex={open ? 0 : -1}
                    onFocus={() => focusBoundary(true)}
                />
                <div className={styles["modal__header"]}>
                    {title && (
                        <h2 className={styles["modal__title"]} id={titleId}>
                            {title}
                        </h2>
                    )}
                    <button
                        type="button"
                        className={styles["modal__close"]}
                        onClick={onClose}
                        aria-label={t("close")}
                    >
                        <Icon name="x" aria-hidden="true" />
                    </button>
                </div>
                {description && <p id={descId}>{description}</p>}
                {children}
                <span
                    className={styles["modal__focus-guard"]}
                    data-modal-focus-guard
                    tabIndex={open ? 0 : -1}
                    onFocus={() => focusBoundary(false)}
                />
            </div>
        </div>,
        document.body
    );
};

export const MemoizedModal = React.memo(Modal);
