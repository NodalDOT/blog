"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { collectHeadings } from "../../model/collectHeadings";
import type { TocItem } from "../../model/types";
import styles from "./PostToc.module.scss";

interface PostTocProps {
    label: string;
}

export const PostToc: React.FC<PostTocProps> = ({ label }) => {
    const titleId = useId();
    const [toc, setToc] = useState<TocItem[] | null>(null);
    const initialize = useCallback((nav: HTMLElement | null) => {
        const content = nav?.closest("article")?.querySelector<HTMLElement>("[data-post-content]");
        if (content) setToc(collectHeadings(content));
    }, []);
    const layoutRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<SVGPathElement>(null);
    const markerRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        if (!toc?.length) return;
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
        const nativeScrollspy = CSS.supports("scroll-target-group: auto");

        const updateActive = () => {
            frameId = 0;
            const nativeActive = nativeScrollspy
                ? entries.findIndex(({ link }) => link.matches(":target-current"))
                : -1;
            const active =
                nativeActive >= 0
                    ? nativeActive
                    : maxScroll > 0 && window.scrollY >= maxScroll - 1
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
        // The browser's initial fragment navigation runs before generated IDs exist.
        let hashTarget: HTMLElement | null = null;
        try {
            hashTarget = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
        } catch {
            // A malformed fragment must not prevent the TOC from initializing.
        }
        const hashFrame = requestAnimationFrame(() => {
            if (hashTarget && content.contains(hashTarget)) {
                hashTarget.scrollIntoView({ behavior: "instant", block: "start" });
            }
        });
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
            cancelAnimationFrame(hashFrame);
            window.removeEventListener("scroll", requestUpdate);
            window.removeEventListener("resize", updateLayout);
        };
    }, [toc]);

    return (
        <nav
            ref={initialize}
            id="toc"
            className={styles["post-toc"]}
            aria-labelledby={titleId}
            hidden={!toc?.length}
            data-empty={toc !== null && toc.length === 0}
        >
            <h2 id={titleId} className={styles["post-toc__title"]}>
                {label}
            </h2>
            <div ref={layoutRef} className={styles["post-toc__layout"]}>
                <svg className={styles["post-toc__ribbon"]} aria-hidden="true" focusable="false">
                    <path ref={trackRef} className={styles["post-toc__ribbon-track"]} />
                    <path ref={markerRef} className={styles["post-toc__ribbon-fill"]} />
                </svg>
                <ul className={styles["post-toc__list"]}>
                    {toc?.map((item) => (
                        <PostTocItem key={item.id} item={item} />
                    ))}
                </ul>
            </div>
        </nav>
    );
};

const PostTocItem: React.FC<{ item: TocItem }> = ({ item }) => (
    <li className={styles["post-toc__item"]}>
        <a className={styles["post-toc__link"]} href={`#${encodeURIComponent(item.id)}`}>
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
