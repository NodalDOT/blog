import { Montserrat } from "next/font/google";
import { getLocale } from "next-intl/server";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/shared/styles/index.scss";
import { BASE_SEO } from "./[locale]/seo";

export const metadata: Metadata = {
    title: "NodalDOT",
    description: BASE_SEO.en.siteName,
    metadataBase: new URL(BASE_SEO.en.url),
};

const montserrat = Montserrat({
    subsets: ["latin", "cyrillic"],
    variable: "--font-montserrat",
    display: "swap",
});
const themeInitScript = `(() => {
    let stored;
    try {
        stored = localStorage.getItem("theme");
    } catch {}
    const systemTheme = typeof window.matchMedia === "function"
        && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    const theme = stored === "light" || stored === "dark" ? stored : systemTheme;
    document.documentElement.setAttribute("data-theme", theme);
})();`;

export default async function RootLayout({ children }: { children: ReactNode }) {
    const locale = await getLocale();

    return (
        <html lang={locale} suppressHydrationWarning data-scroll-behavior="smooth">
            <head>
                <meta name="color-scheme" content="light dark" />
                <script id="theme-init" dangerouslySetInnerHTML={{ __html: themeInitScript }} />
            </head>
            <body className={`${montserrat.variable} ${montserrat.className}`}>{children}</body>
        </html>
    );
}
