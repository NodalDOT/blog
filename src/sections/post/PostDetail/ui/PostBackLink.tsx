"use client";

import { Link } from "@/shared/i18n/navigation";
import { usePageTransition } from "@/app/providers/transition";
import { Icon } from "@/shared/ui/Icon";
import styles from "./PostDetail.module.scss";

interface PostBackLinkProps {
    label: string;
}

export const PostBackLink = ({ label }: PostBackLinkProps) => {
    const { startTransition } = usePageTransition();

    return (
        <Link
            href="/posts"
            className={styles["post-detail__back-link"]}
            onClick={() => startTransition("/posts")}
        >
            <Icon name="arrow-left" className={styles["post-detail__back-icon"]} />
            {label}
        </Link>
    );
};
