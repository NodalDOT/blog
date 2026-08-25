"use client";

import { type FC, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/ui/Icon";
import Tags from "@/shared/ui/Tags";
import { assertDefined } from "@/shared/lib/assert";
import { classNames } from "@/shared/lib/classNames";
import { debounce } from "@/shared/lib/debounce";
import { initGsap } from "@/shared/lib/gsap/init";
import styles from "./AboutPath.module.scss";

initGsap();

const ICON_MAP = {
    nda_company: <Icon name="layers" size={64} />,
    university: <Icon name="graduation-cap" size={64} />,
    self_study: <Icon name="code-2" size={64} />,
} as const;

type PathItemKey = keyof typeof ICON_MAP;

export const AboutPath: FC = () => {
    const t = useTranslations("AboutPage.AboutPath");

    const containerRef = useRef<HTMLElement>(null);
    const itemsRef = useRef<HTMLLIElement[]>([]);
    const ballRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    const itemKeys: PathItemKey[] = ["nda_company", "university", "self_study"];

    useGSAP(
        () => {
            const items = itemsRef.current;
            const ball = ballRef.current;
            const progress = progressRef.current;

            if (!items.length || !ball || !progress) return;

            const ballOffset = ball.offsetHeight / 2;

            gsap.set(ball, { force3D: true });
            gsap.set(progress, { force3D: true });

            const ballSetY = gsap.quickSetter(ball, "y", "px");
            const progressSetY = gsap.quickSetter(progress, "y", "px");
            const progressSetScaleY = gsap.quickSetter(progress, "scaleY");

            let startY = 0;
            let endY = 0;
            let distance = 0;

            const getItemCenter = (item: HTMLElement) => item.offsetTop + item.offsetHeight / 2;

            const calculatePositions = () => {
                startY = getItemCenter(assertDefined(items[0], "First path item is required"));
                endY = getItemCenter(
                    assertDefined(items[items.length - 1], "Last path item is required")
                );
                distance = endY - startY;

                gsap.set(progress, { y: startY, height: distance, scaleY: 0 });
            };

            calculatePositions();

            const debouncedResizeHandler = debounce(() => {
                calculatePositions();
                ScrollTrigger.refresh();
            }, 300);
            window.addEventListener("resize", debouncedResizeHandler);

            let lastVisible: boolean | null = null;
            let lastActiveIndex = -1;

            const trigger = ScrollTrigger.create({
                trigger: assertDefined(items[0], "First path item is required"),
                start: "top center",
                endTrigger: assertDefined(items[items.length - 1], "Last path item is required"),
                end: "center center",
                scrub: 0.5,

                onUpdate: (self) => {
                    const p = self.progress;

                    const isVisible = p > 0 && p < 1;

                    if (isVisible !== lastVisible) {
                        const visibleClass = assertDefined(
                            styles["is-visible"],
                            "Visible class is required"
                        );
                        ball.classList.toggle(visibleClass, isVisible);
                        progress.classList.toggle(visibleClass, isVisible);
                        lastVisible = isVisible;
                    }

                    ballSetY(startY + distance * p - ballOffset);
                    progressSetY(startY);
                    progressSetScaleY(p);

                    const activeIndex = Math.round(p * (items.length - 1));

                    if (activeIndex !== lastActiveIndex) {
                        const activeClass = assertDefined(
                            styles["is-active"],
                            "Active class is required"
                        );
                        const previousItem = items[lastActiveIndex];
                        if (lastActiveIndex >= 0 && previousItem) {
                            previousItem.classList.remove(activeClass);
                        }
                        const activeItem = items[activeIndex];
                        if (activeItem) {
                            activeItem.classList.add(activeClass);
                        }
                        lastActiveIndex = activeIndex;
                    }
                },
            });

            return () => {
                trigger.kill();
                window.removeEventListener("resize", debouncedResizeHandler);
                debouncedResizeHandler.cancel();
            };
        },
        { scope: containerRef }
    );

    return (
        <section ref={containerRef} className={classNames(styles["about-path"], "section")}>
            <h2 className={styles["about-path__title"]}>{t("title")}</h2>

            <div className={styles["about-path__list-wrapper"]}>
                <div ref={progressRef} className={styles["about-path__progress"]} />

                <div ref={ballRef} className={styles["about-path__ball"]} />

                <ol className={styles["about-path__list"]}>
                    {itemKeys.map((key, i) => {
                        const tags = t(`items.${key}.tags`)
                            .split(",")
                            .map((s) => s.trim());

                        return (
                            <li
                                key={key}
                                ref={(el) => {
                                    if (el) itemsRef.current[i] = el;
                                }}
                                className={styles["about-path__item"]}
                            >
                                <div className={styles["about-path__card"]}>
                                    <div className={styles["about-path__after"]}>
                                        <h3>{t(`items.${key}.title`)}</h3>

                                        <span className={styles["about-path__date"]}>
                                            {t(`items.${key}.date`)}
                                        </span>

                                        <span className={styles["about-path__place"]}>
                                            {t(`items.${key}.place`)}
                                        </span>

                                        <Tags tags={tags} className={styles["about-path__tags"]} />
                                    </div>

                                    <div className={styles["about-path__before"]}>
                                        {ICON_MAP[key]}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </section>
    );
};

export default AboutPath;
