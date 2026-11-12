"use client";

import type { FC } from "react";
import styles from "./AboutHero.module.scss";
import { classNames } from "@/shared/lib/classNames";
import InteractiveText from "./InteractiveText";
import Workspace from "./Workspace";

export const AboutHero: FC = () => {
    return (
        <section className={classNames(styles["about-hero"], "section")}>
            <Workspace />
            <InteractiveText />
        </section>
    );
};

export default AboutHero;
