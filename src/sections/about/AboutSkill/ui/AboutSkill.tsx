"use client";

import { useState, useSyncExternalStore, type FC } from "react";
import dynamic from "next/dynamic";
import styles from "./AboutSkill.module.scss";
import { classNames } from "@/shared/lib/classNames";
import Skeleton from "@/shared/ui/Skeleton";
import SkillsFallback from "./SkillsFallback";
import { canAnimateSkillCanvas } from "../utils/deviceCapability";
import { useTranslations } from "next-intl";

const SkillCanvasWrapper = dynamic(() => import("./SkillCanvasWrapper"), {
    ssr: false,
    loading: () => <Skeleton />,
});

const subscribe = () => () => undefined;
const getServerSnapshot = () => null;

export const AboutSkill: FC = () => {
    const [isCanvasReady, setIsCanvasReady] = useState(false);
    const canAnimate = useSyncExternalStore(subscribe, canAnimateSkillCanvas, getServerSnapshot);
    const t = useTranslations("AboutPage.AboutSkill");

    return (
        <section className={classNames(styles["about-skill"], "section")}>
            <h2>{t("title")}</h2>

            {canAnimate === false ? (
                <SkillsFallback />
            ) : (
                <>
                    {!isCanvasReady && <Skeleton />}

                    <div
                        className={classNames(
                            styles["about-skill__canvas-wrapper"],
                            !isCanvasReady && styles["about-skill__canvas-wrapper--hidden"]
                        )}
                    >
                        {canAnimate && (
                            <SkillCanvasWrapper onReady={() => setIsCanvasReady(true)} />
                        )}
                    </div>
                </>
            )}
        </section>
    );
};

export default AboutSkill;
