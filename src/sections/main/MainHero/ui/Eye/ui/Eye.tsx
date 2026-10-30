"use client";

import React, { useRef, type FC } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { initGsap } from "@/shared/lib/gsap/init";
import { createPupilMotion } from "@/shared/lib/pupilMotion";

import style from "./Eye.module.scss";

initGsap();

const LINK_SELECTOR = "a[href], button";
const FULL_LOOK_DISTANCE = 600;
const RELEASE_DELAY = 250;
const INTENT_DELAY = 90;
const BREATH_SCALE = 1.06;
const SQUINT_RATIO = 0.88;

const isOnScreen = (element: Element) => {
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) return false;
    const hit = document.elementFromPoint(x, y);
    return !!hit && (hit === element || element.contains(hit));
};

const Eye: FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const pupilRef = useRef<HTMLDivElement>(null);
    const scleraRef = useRef<HTMLDivElement>(null);
    const blocksRefs = useRef<HTMLDivElement[]>([]);

    useGSAP(
        () => {
            const container = containerRef.current;
            const pupil = pupilRef.current;
            const sclera = scleraRef.current;
            const blocks = blocksRefs.current;

            if (!container || !pupil || !sclera) return;

            const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
            const random = gsap.utils.random;
            const focusedClass = style["eye--focused"] ?? "";
            let target: Element | null = null;

            const motion = createPupilMotion({
                pupil,
                sclera,
                pupilScale: reducedMotion ? 1 : BREATH_SCALE,
                squintRatio: SQUINT_RATIO,
                isSquinting: () => target !== null,
            });

            let idleCall: gsap.core.Tween | null = null;
            const stopIdle = () => idleCall?.kill();

            const idleStep = () => {
                const roll = Math.random();
                const angle = Math.random() * Math.PI * 2;
                let reach = 0.75 * Math.sqrt(Math.random());
                let stiffness = 14;
                let hold = 1.1 + random(0.4, 1.2);

                if (!reducedMotion && roll < 0.25) {
                    reach = random(0.85, 1);
                    stiffness = 45;
                    hold = 0.6 + random(0.6, 1.4);
                } else if (roll < 0.45) {
                    reach = random(0, 0.1);
                    stiffness = 20;
                    hold = 0.9 + random(1.4, 2.8);
                }

                motion.lookAtShare(Math.cos(angle) * reach, Math.sin(angle) * reach, {
                    stiffness,
                });
                idleCall = gsap.delayedCall(hold, idleStep);
            };

            const breathing = gsap.to(pupil, {
                scale: BREATH_SCALE,
                duration: 2.8,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                paused: true,
            });

            const lashes = container.querySelector<HTMLElement>(`.${style["eye__lashes"]}`);
            let blinkCall: gsap.core.Tween | null = null;

            const blinkOnce = () => {
                const timing = { duration: 220, easing: "ease-in-out" };
                sclera.animate(
                    [
                        { transform: "scaleY(1)" },
                        { transform: "scaleY(0.04)", offset: 0.45 },
                        { transform: "scaleY(1)" },
                    ],
                    timing
                );
                lashes?.animate(
                    [
                        { translate: "0 0" },
                        { translate: "0 32%", offset: 0.45 },
                        { translate: "0 0" },
                    ],
                    timing
                );
                pupil.animate(
                    [{ opacity: 1 }, { opacity: 0, offset: 0.45 }, { opacity: 1 }],
                    timing
                );
            };

            const scheduleBlink = () => {
                blinkCall = gsap.delayedCall(random(2.5, 6.5), () => {
                    blinkOnce();
                    if (Math.random() < 0.2) gsap.delayedCall(0.32, blinkOnce);
                    scheduleBlink();
                });
            };

            const blockTweens = blocks.map((block, i) =>
                gsap.to(block, {
                    y: gsap.utils.random(10, 25),
                    repeat: -1,
                    yoyo: true,
                    duration: gsap.utils.random(4, 7),
                    ease: "sine.inOut",
                    repeatDelay: gsap.utils.random(0.2, 0.8),
                    delay: i * 0.3,
                    force3D: true,
                    paused: true,
                })
            );

            let releaseTimer: ReturnType<typeof setTimeout> | undefined;
            let intentTimer: ReturnType<typeof setTimeout> | undefined;
            let isVisible = false;

            const lookAt = (element: Element) => {
                clearTimeout(releaseTimer);
                if (!isVisible || element === target || !isOnScreen(element)) return;
                target = element;

                const rect = element.getBoundingClientRect();
                stopIdle();
                motion.lookAtScreenPoint(
                    rect.left + rect.width / 2,
                    rect.top + rect.height / 2,
                    FULL_LOOK_DISTANCE,
                    { stiffness: 22 }
                );
                container.classList.add(focusedClass);
            };

            const releaseNow = () => {
                clearTimeout(releaseTimer);
                if (!target) return;
                target = null;
                container.classList.remove(focusedClass);
                if (isVisible) idleCall = gsap.delayedCall(0.4, idleStep);
            };

            const release = () => {
                clearTimeout(releaseTimer);
                releaseTimer = setTimeout(releaseNow, RELEASE_DELAY);
            };

            const findLink = (node: EventTarget | null) => {
                const link = node instanceof Element ? node.closest(LINK_SELECTOR) : null;
                return link && !container.contains(link) ? link : null;
            };

            const handlePointerOver = (event: PointerEvent) => {
                if (event.pointerType !== "mouse") return;
                const link = findLink(event.target);
                if (!link) return;
                clearTimeout(intentTimer);
                intentTimer = setTimeout(() => lookAt(link), INTENT_DELAY);
            };
            const handlePointerOut = (event: PointerEvent) => {
                if (event.pointerType !== "mouse") return;
                const next = event.relatedTarget;
                const current = findLink(event.target);
                if (current && next instanceof Node && current.contains(next)) return;
                clearTimeout(intentTimer);
                if (target) release();
            };
            const handleFocusIn = (event: FocusEvent) => {
                const link = findLink(event.target);
                if (link?.matches(":focus-visible")) lookAt(link);
            };

            document.addEventListener("pointerover", handlePointerOver, { passive: true });
            document.addEventListener("pointerout", handlePointerOut, { passive: true });
            document.addEventListener("focusin", handleFocusIn);
            document.addEventListener("focusout", release);

            const loops = [breathing, ...blockTweens];

            const trigger = ScrollTrigger.create({
                trigger: container,
                start: "top bottom",
                end: "bottom top",
                onToggle: ({ isActive }) => {
                    isVisible = isActive;
                    if (!isActive) releaseNow();
                    motion.setEnabled(isActive);
                    blinkCall?.kill();
                    stopIdle();

                    if (isActive) {
                        blockTweens.forEach((anim) => anim.play());
                        if (!reducedMotion) {
                            breathing.play();
                            scheduleBlink();
                        }
                        if (!target) idleStep();
                    } else {
                        loops.forEach((anim) => anim.pause());
                    }
                },
            });

            return () => {
                clearTimeout(releaseTimer);
                clearTimeout(intentTimer);
                document.removeEventListener("pointerover", handlePointerOver);
                document.removeEventListener("pointerout", handlePointerOut);
                document.removeEventListener("focusin", handleFocusIn);
                document.removeEventListener("focusout", release);
                trigger.kill();
                stopIdle();
                blinkCall?.kill();
                motion.destroy();
                loops.forEach((anim) => anim.kill());
            };
        },
        { scope: containerRef }
    );

    const eyelashTypes = ["type-1", "type-2", "type-3"];
    const blockPositions = ["top-left", "top-right", "bottom-left", "bottom-right"];

    return (
        <div className={style["eye"]} ref={containerRef}>
            {blockPositions.map((pos, index) => (
                <div
                    key={pos}
                    ref={(el) => {
                        if (el) blocksRefs.current[index] = el;
                    }}
                    className={`${style["eye__block"]} ${style[`eye__block--${pos}`]}`}
                />
            ))}

            <div className={style["eye__wrapper"]}>
                <div className={style["eye__lashes"]}>
                    {eyelashTypes.map((type) => (
                        <div
                            key={type}
                            className={`${style["eye__eyelash"]} ${style[`eye__eyelash--${type}`]}`}
                        />
                    ))}
                </div>

                <div className={style["eye__sclera"]} ref={scleraRef}>
                    <div className={style["eye__pupil"]} ref={pupilRef} />
                </div>
            </div>
        </div>
    );
};

export const MemoizedEye = React.memo(Eye);
