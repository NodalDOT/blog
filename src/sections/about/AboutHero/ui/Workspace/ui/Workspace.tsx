"use client";

import { useRef, useState, type FC } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Prism from "prismjs";

import { assertDefined } from "@/shared/lib/assert";
import { classNames } from "@/shared/lib/classNames";
import { initGsap } from "@/shared/lib/gsap/init";
import styles from "./Workspace.module.scss";

initGsap();

const handleActionKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, action: () => void) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    action();
};

const SOURCE_CODE = [
    "const developer = {",
    "  name: 'NodalDOT',",
    "  status: 'Coding',",
    "  coffee: true",
    "};",
    "",
    "async function deploy() {",
    "  await developer.code();",
    "  console.log('Production ready!');",
    "}",
    "",
    "// Success!",
];

const FULL_SOURCE_CODE = SOURCE_CODE.join("\n");

export const Workspace: FC = () => {
    const [lightOn, setLightOn] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const codeRef = useRef<HTMLElement>(null);
    const pupilRef = useRef<SVGGElement>(null);
    const lidRef = useRef<SVGRectElement>(null);

    const rafRef = useRef<number | null>(null);
    const blinkTweenRef = useRef<gsap.core.Tween | null>(null);
    const blinkDelayRef = useRef<gsap.core.Tween | null>(null);
    const pupilTweenRef = useRef<gsap.core.Tween | null>(null);

    const typeWriter = () => {
        if (!codeRef.current) return;

        let index = 0;

        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }

        codeRef.current.innerHTML = "";

        const addChar = () => {
            if (!codeRef.current) return;

            const currentText = FULL_SOURCE_CODE.slice(0, index + 1);

            codeRef.current.innerHTML = Prism.highlight(
                currentText,
                assertDefined(
                    Prism.languages["javascript"],
                    "Prism javascript grammar is required"
                ),
                "javascript"
            );

            index++;

            if (index < FULL_SOURCE_CODE.length) {
                rafRef.current = requestAnimationFrame(addChar);
            } else {
                rafRef.current = null;
            }
        };

        addChar();
    };

    const handleScreenClick = () => {
        typeWriter();

        if (lidRef.current) {
            gsap.killTweensOf(lidRef.current);

            gsap.fromTo(
                lidRef.current,
                { height: 0 },
                {
                    height: 110,
                    duration: 0.3,
                    ease: "power2.inOut",
                    yoyo: true,
                    repeat: 1,
                }
            );
        }
    };

    useGSAP(
        () => {
            typeWriter();

            if (!lidRef.current || !pupilRef.current) return;

            const blinkCycle = () => {
                blinkTweenRef.current = gsap.fromTo(
                    lidRef.current,
                    { height: 0 },
                    {
                        height: 110,
                        duration: 0.8,
                        ease: "power2.inOut",
                        yoyo: true,
                        repeat: 1,
                        onComplete: () => {
                            blinkDelayRef.current = gsap.delayedCall(
                                gsap.utils.random(2, 4),
                                blinkCycle
                            );
                        },
                    }
                );
            };

            blinkCycle();

            const movePupil = () => {
                pupilTweenRef.current = gsap.to(pupilRef.current, {
                    x: gsap.utils.random(-10, 10),
                    y: gsap.utils.random(-10, 10),
                    duration: gsap.utils.random(1, 2),
                    ease: "power1.inOut",
                    onComplete: movePupil,
                });
            };

            movePupil();

            return () => {
                if (rafRef.current) {
                    cancelAnimationFrame(rafRef.current);
                }

                blinkTweenRef.current?.kill();
                blinkDelayRef.current?.kill();
                pupilTweenRef.current?.kill();
                gsap.killTweensOf(lidRef.current);
                gsap.killTweensOf(pupilRef.current);
            };
        },
        { scope: wrapperRef }
    );

    return (
        <div
            ref={wrapperRef}
            className={classNames(styles["workspace"], lightOn && styles["workspace--light-on"])}
            aria-hidden
        >
            <div className={styles["workspace__monitor-group"]}>
                <div
                    className={styles["workspace__light-beam"]}
                    style={{ opacity: lightOn ? 1 : 0 }}
                />

                <div
                    className={styles["workspace__screen-bar"]}
                    role="button"
                    tabIndex={0}
                    onClick={() => setLightOn((v) => !v)}
                    onKeyDown={(event) =>
                        handleActionKeyDown(event, () => setLightOn((value) => !value))
                    }
                />

                <div className={styles["workspace__monitor-frame"]}>
                    <div
                        className={styles["workspace__screen"]}
                        role="button"
                        tabIndex={0}
                        onClick={handleScreenClick}
                        onKeyDown={(event) => handleActionKeyDown(event, handleScreenClick)}
                    >
                        <div className={styles["workspace__code-container"]}>
                            {/* Invisible copy of the full snippet. It reserves exactly the
                                height the typed text will need at any width, so the layout
                                never depends on a JS measurement. */}
                            <pre className={styles["workspace__code-sizer"]} aria-hidden="true">
                                {FULL_SOURCE_CODE}
                            </pre>

                            <pre className={styles["workspace__code-typed"]}>
                                <code ref={codeRef} className="language-javascript" />
                            </pre>
                        </div>

                        <div className={styles["workspace__eye-widget"]}>
                            <svg viewBox="0 0 100 100">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    className={styles["workspace__eye-ball"]}
                                />

                                <g ref={pupilRef}>
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="22"
                                        className={styles["workspace__pupil"]}
                                    />
                                </g>

                                <rect
                                    ref={lidRef}
                                    x={0}
                                    y={0}
                                    width={100}
                                    height={0}
                                    rx={55}
                                    className={styles["workspace__lid"]}
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className={styles["workspace__stand-neck"]} />
                <div className={styles["workspace__stand-base"]} />
            </div>

            <div className={styles["workspace__mug-container"]}>
                <div className={styles["workspace__mug"]}>
                    <div className={styles["workspace__mug-handle"]} />
                </div>
            </div>

            <div className={styles["workspace__desk"]} />
        </div>
    );
};

export default Workspace;
