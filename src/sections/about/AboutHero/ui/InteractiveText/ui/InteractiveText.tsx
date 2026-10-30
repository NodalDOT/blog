import React, { type FC } from "react";
import styles from "./InteractiveText.module.scss";
import Button from "@/shared/ui/Button";
import { useTranslations } from "next-intl";
import { usePageTransitionActions } from "@/app/providers/transition";

const FillWord = ({ children }: { children: React.ReactNode }) => (
    <span className={styles["interactive-text__fill-word"]}>{children}</span>
);

export const InteractiveText: FC = () => {
    const t = useTranslations("AboutPage.interactiveText");
    const { startTransition } = usePageTransitionActions();

    return (
        <div className={styles["interactive-text"]}>
            <h1>{t("title")}</h1>

            <p className={styles["interactive-text__paragraph"]}>
                {t.rich("paragraph1", {
                    dev: (chunks) => <FillWord>{chunks}</FillWord>,
                    perf: (chunks) => <FillWord>{chunks}</FillWord>,
                    access: (chunks) => <FillWord>{chunks}</FillWord>,
                })}
            </p>

            <p className={styles["interactive-text__paragraph"]}>
                {t.rich("paragraph2", {
                    types: (chunks) => <FillWord>{chunks}</FillWord>,
                    architecture: (chunks) => <FillWord>{chunks}</FillWord>,
                    pixel: (chunks) => <FillWord>{chunks}</FillWord>,
                })}
            </p>

            <div className={styles["interactive-text__actions"]}>
                <Button
                    as="a"
                    href="/posts"
                    onClick={(e) => {
                        e.preventDefault();
                        startTransition("/posts");
                    }}
                    ariaLabel={t("buttonAria")}
                >
                    {t("button")}
                </Button>
            </div>
        </div>
    );
};

export default InteractiveText;
