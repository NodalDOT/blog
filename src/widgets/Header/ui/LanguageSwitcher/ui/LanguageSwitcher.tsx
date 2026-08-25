"use client";

import { type FC } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/shared/i18n/navigation";
import { routing } from "@/shared/i18n/routing";
import { Icon } from "@/shared/ui/Icon";
import styles from "./LanguageSwitcher.module.scss";
import { classNames } from "@/shared/lib/classNames";

export const LanguageSwitcher: FC = () => {
    const pathname = usePathname();
    const locale = useLocale();
    const t = useTranslations("LanguageSwitcher");
    const router = useRouter();
    const handleLangChange = (newLocale: string) => {
        router.push(pathname, { locale: newLocale });
    };

    return (
        <div className={styles["language-switcher"]}>
            <button
                type="button"
                aria-label={t("ariaLabel")}
                className={styles["language-switcher__trigger"]}
            >
                <Icon name="languages" size={24} />
            </button>

            <ul className={styles["language-switcher__options"]}>
                {routing.locales.map((lang) => (
                    <li key={lang}>
                        <button
                            type="button"
                            onClick={() => handleLangChange(lang)}
                            aria-current={locale === lang ? "true" : undefined}
                            className={classNames(locale === lang && styles["selected"])}
                            disabled={locale === lang}
                        >
                            {lang.toUpperCase()}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
