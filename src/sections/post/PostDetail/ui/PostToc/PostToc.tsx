"use client";

import { useEffect, useId, useRef } from "react";
import type { TocItem } from "../../model/types";
import styles from "./PostToc.module.scss";

interface PostTocProps {
    toc: TocItem[];
    label: string;
}

export const PostToc: React.FC<PostTocProps> = ({ toc, label }) => {
    const titleId = useId();
    const layoutRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<SVGPathElement>(null);
    const markerRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        const layout = layoutRef.current;
        const content = layout
            ?.closest("article")
            ?.querySelector<HTMLElement>("[data-post-content]");
        if (!layout || !content) return;

        const links = Array.from(layout.querySelectorAll<HTMLAnchorElement>("a[href^='#']"));
        const entries = links.flatMap((link) => {
            const heading = document.getElementById(decodeURIComponent(link.hash.slice(1)));
            return heading ? [{ link, heading, headingTop: 0 }] : [];
        });
        let frameId = 0;
        let maxScroll = 0;
        let activeLink: HTMLAnchorElement | undefined;
        let segments: { x: number; top: number; bottom: number }[] = [];

        const updateActive = () => {
            frameId = 0;
            const active =
                maxScroll > 0 && window.scrollY >= maxScroll - 1
                    ? entries.length - 1
                    : Math.max(
                          0,
                          entries.findLastIndex(({ headingTop }) => window.scrollY >= headingTop)
                      );
            const link = entries[active]?.link;
            if (link === activeLink) return;

            activeLink?.removeAttribute("aria-current");
            link?.setAttribute("aria-current", "location");
            activeLink = link;
            const segment = segments[active];
            markerRef.current?.setAttribute(
                "d",
                segment ? `M${segment.x} ${segment.top} V${segment.bottom}` : ""
            );
        };
        const requestUpdate = () => {
            if (!frameId) frameId = requestAnimationFrame(updateActive);
        };
        const updateLayout = () => {
            maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const bounds = layout.getBoundingClientRect();
            segments = entries.map((entry) => {
                const { link, heading } = entry;
                entry.headingTop =
                    heading.getBoundingClientRect().top +
                    window.scrollY -
                    (Number.parseFloat(getComputedStyle(heading).scrollMarginTop) || 0) -
                    1;
                const rect = link.getBoundingClientRect();
                return {
                    x: rect.left - bounds.left - 12,
                    top: rect.top - bounds.top,
                    bottom: rect.bottom - bounds.top,
                };
            });
            let path = "";
            segments.forEach((segment, index) => {
                const previous = segments[index - 1];
                if (!previous) path += `M${segment.x} ${segment.top}`;
                else if (previous.x === segment.x) path += ` V${segment.top}`;
                else {
                    const middle = (previous.bottom + segment.top) / 2;
                    path += ` C${previous.x} ${middle} ${segment.x} ${middle} ${segment.x} ${segment.top}`;
                }
                path += ` V${segment.bottom}`;
            });
            trackRef.current?.setAttribute("d", path);
            activeLink?.removeAttribute("aria-current");
            activeLink = undefined;
            requestUpdate();
        };
        const observer = new ResizeObserver(updateLayout);
        observer.observe(layout);
        observer.observe(content);
        observer.observe(document.body);
        updateLayout();
        window.addEventListener("scroll", requestUpdate, { passive: true });
        window.addEventListener("resize", updateLayout);
        return () => {
            observer.disconnect();
            cancelAnimationFrame(frameId);
            window.removeEventListener("scroll", requestUpdate);
            window.removeEventListener("resize", updateLayout);
        };
    }, [toc]);

    return (
        <nav id="toc" className={styles["post-toc"]} aria-labelledby={titleId}>
            <h2 id={titleId} className={styles["post-toc__title"]}>
                {label}
            </h2>
            <div ref={layoutRef} className={styles["post-toc__layout"]}>
                <svg className={styles["post-toc__ribbon"]} aria-hidden="true" focusable="false">
                    <path ref={trackRef} className={styles["post-toc__ribbon-track"]} />
                    <path ref={markerRef} className={styles["post-toc__ribbon-fill"]} />
                </svg>
                <ul className={styles["post-toc__list"]}>
                    {toc.map((item) => (
                        <PostTocItem key={item.id} item={item} />
                    ))}
                </ul>
            </div>
        </nav>
    );
};

const PostTocItem: React.FC<{ item: TocItem }> = ({ item }) => (
    <li className={styles["post-toc__item"]}>
        <a className={styles["post-toc__link"]} href={`#${item.id}`}>
            {item.title}
        </a>
        {item.children.length > 0 && (
            <ul className={styles["post-toc__list"]}>
                {item.children.map((child) => (
                    <PostTocItem key={child.id} item={child} />
                ))}
            </ul>
        )}
    </li>
);
