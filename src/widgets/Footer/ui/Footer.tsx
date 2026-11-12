import styles from "./Footer.module.scss";
import ScrollButton from "@/shared/ui/ScrollButton";
import Link from "@/shared/ui/Link";
import Button from "@/shared/ui/Button";
import { Icon } from "@/shared/ui/Icon";
import { EMAIL } from "@/shared/config/urls";
import { getTranslations } from "next-intl/server";

export async function Footer() {
    const t = await getTranslations("Footer");

    return (
        <footer className={styles["footer"]}>
            <span className={styles["footer__meta"]}>
                © {new Date().getFullYear()} {t("author")}
            </span>
            <span className={styles["footer__meta"]}>
                <Link href={`mailto:${EMAIL}`} label={EMAIL} />
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
