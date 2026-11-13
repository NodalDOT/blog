import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

interface BaseButtonProps {
    children?: ReactNode;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    className?: string | undefined;
    hovered?: boolean;
    ariaLabel?: string | undefined;
    href?: string | undefined;
    disabled?: boolean;
}

export type ButtonAsButton = BaseButtonProps & {
    as?: "button";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonAsLink = BaseButtonProps & {
    as: "a";
    onNavigate?: (event: { preventDefault: () => void }) => void;
    href: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export type ButtonProps = ButtonAsButton | ButtonAsLink;
