"use client";

import { useEffect, useRef, useState, type FC } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { classNames } from "@/shared/lib/classNames";
import { createPupilMotion, type PupilMotion } from "@/shared/lib/pupilMotion";
import { SKILLS } from "../utils/skills";
import styles from "./AboutSkill.module.scss";

const FULL_LOOK_DISTANCE = 320;
const SQUINT_RATIO = 0.88;

export const AboutSkill: FC = () => {
    const t = useTranslations("AboutPage.AboutSkill");
    const sectionRef = useRef<HTMLElement>(null);
    const scleraRef = useRef<HTMLDivElement>(null);
    const pupilRef = useRef<HTMLDivElement>(null);
    const motionRef = useRef<PupilMotion | null>(null);
    const activeSkillRef = useRef<string | null>(null);
    const [activeSkill, setActiveSkill] = useState<string | null>(null);

    useEffect(() => {
        const section = sectionRef.current;
        const sclera = scleraRef.current;
        const pupil = pupilRef.current;
        if (!section || !sclera || !pupil) return;

        const motion = createPupilMotion({
            pupil,
            sclera,
            squintRatio: SQUINT_RATIO,
            isSquinting: () => activeSkillRef.current !== null,
        });
        motionRef.current = motion;
        let frame = 0;

        const handleMove = (event: PointerEvent) => {
            if (event.pointerType !== "mouse" || frame) return;
            frame = requestAnimationFrame(() => {
                frame = 0;
                motion.lookAtScreenPoint(event.clientX, event.clientY, FULL_LOOK_DISTANCE);
            });
        };
        const handleLeave = () => {
            cancelAnimationFrame(frame);
            frame = 0;
            motion.lookAt(0, 0, { stiffness: 14 });
        };

        section.addEventListener("pointermove", handleMove, { passive: true });
        section.addEventListener("pointerleave", handleLeave);

        return () => {
            cancelAnimationFrame(frame);
            section.removeEventListener("pointermove", handleMove);
            section.removeEventListener("pointerleave", handleLeave);
            motion.destroy();
            motionRef.current = null;
        };
    }, []);

    useEffect(() => {
        activeSkillRef.current = activeSkill;
        motionRef.current?.refit();
    }, [activeSkill]);

    const handleSkillEnter = (name: string, element: Element) => {
        setActiveSkill(name);
        const rect = element.getBoundingClientRect();
        motionRef.current?.lookAtScreenPoint(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            FULL_LOOK_DISTANCE
        );
    };

    return (
        <section ref={sectionRef} className={classNames(styles["about-skill"], "section")}>
            <h2>{t("title")}</h2>

            <div className={styles["about-skill__stage"]}>
                <div
                    className={classNames(
                        styles["about-skill__eye"],
                        activeSkill && styles["about-skill__eye--focused"]
                    )}
                    aria-hidden="true"
                >
                    <div className={styles["about-skill__face"]}>
                        <div className={styles["about-skill__lashes"]}>
                            <span />
                            <span />
                            <span />
                        </div>

                        <div ref={scleraRef} className={styles["about-skill__sclera"]}>
                            <div ref={pupilRef} className={styles["about-skill__pupil"]} />
                        </div>
                    </div>

                    <p className={styles["about-skill__caption"]}>
                        <span
                            key={activeSkill ?? ""}
                            className={styles["about-skill__caption-text"]}
                        >
                            {activeSkill ?? t("hint")}
                        </span>
                    </p>
                </div>

                <ul
                    className={styles["about-skill__grid"]}
                    onPointerLeave={(event) => {
                        if (event.pointerType === "mouse") setActiveSkill(null);
                    }}
                >
                    {SKILLS.map((skill) => (
                        <li key={skill.name}>
                            <a
                                href={skill.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles["about-skill__item"]}
                                data-active={activeSkill === skill.name}
                                onPointerEnter={(event) =>
                                    handleSkillEnter(skill.name, event.currentTarget)
                                }
                                onFocus={(event) =>
                                    handleSkillEnter(skill.name, event.currentTarget)
                                }
                                onBlur={() => setActiveSkill(null)}
                            >
                                <span className={styles["about-skill__icon"]}>
                                    <Image src={skill.icon} alt="" width={32} height={32} />
                                </span>
                                <span className={styles["about-skill__name"]}>{skill.name}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default AboutSkill;
