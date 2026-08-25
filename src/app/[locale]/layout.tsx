import { NextIntlClientProvider, hasLocale, type Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/shared/i18n/routing";
import Header from "@/widgets/Header";
import Footer from "@/widgets/Footer";
import type { ReactNode } from "react";
import type { Viewport } from "next";
import LocaleHtmlLang from "./LocaleHtmlLang";
import { ThemeProvider } from "../providers/theme";
import { PageTransitionProvider } from "../providers/transition";
import { ResponsiveProvider } from "../providers/responsive";

export const viewport: Viewport = {
    themeColor: "#ffffff",
};

type LocaleParams = { locale: Locale };
type LocaleLayoutProps = {
    children: ReactNode;
    params: LocaleParams | Promise<LocaleParams>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) notFound();

    const t = await getTranslations({ locale, namespace: "SkipLink" });

    return (
        <NextIntlClientProvider locale={locale}>
            <LocaleHtmlLang locale={locale} />
            <ThemeProvider>
                <PageTransitionProvider>
                    <ResponsiveProvider>
                        <a href="#main-content" className="skip-link">
                            {t("label")}
                        </a>
                        <div className="container">
                            <Header />
                            <main id="main-content" tabIndex={-1}>
                                {children}
                            </main>
                            <Footer />
                        </div>
                    </ResponsiveProvider>
                </PageTransitionProvider>
            </ThemeProvider>
        </NextIntlClientProvider>
    );
}
