import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { Post } from "@/entities/post";

export const useAnimatedPosts = (posts: Post[]) => {
    const [displayedPosts, setDisplayedPosts] = useState(posts);
    const currentPosts = useRef(posts);

    useEffect(() => {
        if (posts === currentPosts.current) return;

        let cancelled = false;
        let transition: ViewTransition | undefined;
        const media = window.matchMedia("(prefers-reduced-motion: reduce)");
        const skipAnimation = () => {
            if (media.matches) transition?.skipTransition();
        };
        const frame = requestAnimationFrame(() => {
            const sameResults =
                posts.length === currentPosts.current.length &&
                posts.every((post, index) => post === currentPosts.current[index]);
            const update = () => {
                if (cancelled) return;
                currentPosts.current = posts;
                setDisplayedPosts(posts);
            };

            if (
                sameResults ||
                media.matches ||
                !document.startViewTransition ||
                !CSS.supports("selector(:active-view-transition-type(posts-filter))")
            ) {
                update();
                return;
            }

            transition = document.startViewTransition({
                update: () => flushSync(update),
                types: ["posts-filter"],
            });
            // Skipping an interrupted animation rejects ready, but still updates the DOM.
            void transition.ready.catch(() => undefined);
        });

        media.addEventListener("change", skipAnimation);
        return () => {
            cancelled = true;
            cancelAnimationFrame(frame);
            transition?.skipTransition();
            media.removeEventListener("change", skipAnimation);
        };
    }, [posts]);

    return displayedPosts;
};
