"use client";

import { Link } from "@/shared/i18n/navigation";
import { usePageTransitionActions } from "@/app/providers/transition";
import { Icon } from "@/shared/ui/Icon";
import styles from "./PostDetail.module.scss";

interface PostBackLinkProps {
    label: string;
}

export const PostBackLink = ({ label }: PostBackLinkProps) => {
    const { startTransition } = usePageTransitionActions();

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
