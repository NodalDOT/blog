import { createPageMetadata } from "./metadata";
import type { Metadata } from "next";
import type { Locale } from "@/shared/i18n/types";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { getPosts } from "@/entities/post/api/getPosts";
import type { FC } from "react";
import { notFound } from "next/navigation";
import { routing } from "@/shared/i18n/routing";
import MainHero from "@/sections/main/MainHero";
import MainPosts from "@/sections/main/MainPosts";
import { BASE_SEO, resolveAbsoluteAssetUrl } from "./seo";

interface MainPageProps {
    params: Promise<{ locale: Locale }>;
}

const MainPage: FC<MainPageProps> = async ({ params }) => {
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) notFound();

    const posts = await getPosts(locale);
    const profileUrl = `${BASE_SEO[locale].url}/${locale}`;
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Person",
                name: "NodalDOT",
                url: profileUrl,
                image: resolveAbsoluteAssetUrl(BASE_SEO[locale].url, BASE_SEO[locale].defaultImage),
                sameAs: ["https://github.com/NodalDOT"],
                jobTitle: "Frontend Developer",
            },
            {
                "@type": "WebSite",
                name: BASE_SEO[locale].siteName,
                url: profileUrl,
                inLanguage: locale,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <MainHero />
            <MainPosts posts={posts} />
        </>
    );
};

export default MainPage;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) notFound();

    const t = await getTranslations("Metadata");
    return createPageMetadata({
        title: t("title"),
        description: t("description"),
        path: `/${locale}`,
        locale,
    });
}
