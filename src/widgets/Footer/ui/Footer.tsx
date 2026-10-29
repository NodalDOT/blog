import styles from "./Footer.module.scss";
import ScrollButton from "@/shared/ui/ScrollButton";
import Link from "@/shared/ui/Link";
import Button from "@/shared/ui/Button";
import { Icon } from "@/shared/ui/Icon";
import { EMAIL, GITHUB_URL } from "@/shared/config/urls";
import { getTranslations } from "next-intl/server";
import { classNames } from "@/shared/lib/classNames";

export async function Footer() {
    const t = await getTranslations("Footer");

    return (
        <footer className={styles["footer"]}>
            <span className={styles["footer__meta"]}>© {new Date().getFullYear()}</span>
            <span className={styles["footer__meta"]}>{t("author")}</span>
            <span className={classNames(styles["footer__meta"], styles["footer__contacts"])}>
                <Link href={`mailto:${EMAIL}`} label={EMAIL} />
                <span aria-hidden="true">·</span>
                <Link href={GITHUB_URL} label={"@NodalDOT"} />
            </span>

            <div className={styles["footer__scroll"]}>
                <ScrollButton>
                    <Button
                        leftIcon={<Icon name="arrow-up" />}
                        ariaLabel={t("scrollToTop")}
                        className={styles["footer__scroll-button"]}
                    />
                </ScrollButton>
            </div>
        </footer>
    );
}
