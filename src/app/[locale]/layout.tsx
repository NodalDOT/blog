import { NextIntlClientProvider, hasLocale, type Locale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/shared/i18n/routing";
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

    return (
        <NextIntlClientProvider locale={locale}>
            <LocaleHtmlLang locale={locale} />
            <ThemeProvider>
                <PageTransitionProvider>
                    <ResponsiveProvider>{children}</ResponsiveProvider>
                </PageTransitionProvider>
            </ThemeProvider>
        </NextIntlClientProvider>
    );
}
