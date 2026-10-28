"use client";

import type { FC } from "react";
import styles from "./MainHero.module.scss";
import Button from "@/shared/ui/Button";
import { classNames } from "@/shared/lib/classNames";
import { useTranslations } from "next-intl";
import ScrollButton from "@/shared/ui/ScrollButton";
import { Icon } from "@/shared/ui/Icon";
import Eye from "./Eye";

export const MainHero: FC = () => {
    const t = useTranslations("HomePage.MainHero");

    return (
        <section className={classNames(styles["main-hero"], "section")}>
            <div className={styles["main-hero__content"]}>
                <div className={styles["main-hero__headline"]}>
                    <h1>{t("greeting")}</h1>
                    <h2>{t("profession")}</h2>
                </div>
                <p>{t("description")}</p>
                <ScrollButton target="#main-posts">
                    <Button
                        rightIcon={<Icon name="arrow-down" />}
                        className={styles["main-hero__button"]}
                    >
                        {t("button")}
                    </Button>
                </ScrollButton>
            </div>
            <div className={styles["main-hero__eye"]} aria-hidden="true">
                <Eye />
            </div>
        </section>
    );
};
