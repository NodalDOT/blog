"use client";

import { type FC, type ReactElement, cloneElement, isValidElement } from "react";
import type { ButtonAsButton, ButtonAsLink, ButtonProps } from "@/shared/ui/Button";

type ScrollButtonProps = {
    children: ReactElement<ButtonProps>;
    target?: string;
    offset?: number;
    behavior?: ScrollBehavior;
    fallback?: "top" | "bottom";
};

export const ScrollButton: FC<ScrollButtonProps> = (props) => {
    const { children, target, offset = 0, behavior = "smooth", fallback = "top" } = props;

    const scroll = () => {
        if (target) {
            const el = document.querySelector(target);
            if (el) {
                const y = el.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: y, behavior });
                return;
            }

            if (process.env.NODE_ENV !== "production") {
                console.warn(`ScrollButton: target "${target}" not found, using fallback scroll.`);
            }
        }

        window.scrollTo({
            top: fallback === "bottom" ? document.body.scrollHeight : 0,
            behavior,
        });
    };

    const child = Array.isArray(children) ? children.find((c) => isValidElement(c)) : children;

    if (!isValidElement<ButtonProps>(child)) {
        return <>{children}</>;
    }

    const childProps = (child.props ?? {}) as ButtonProps;

    if (childProps.as === "a") {
        const el = child as ReactElement<ButtonAsLink>;
        const elProps = (el.props ?? {}) as ButtonAsLink;
        return cloneElement(el, {
            onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
                elProps.onClick?.(event);
                scroll();
            },
        });
    }

    const el = child as ReactElement<ButtonAsButton>;
    const elProps = (el.props ?? {}) as ButtonAsButton;
    return cloneElement(el, {
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
            elProps.onClick?.(event);
            scroll();
        },
    });
};
