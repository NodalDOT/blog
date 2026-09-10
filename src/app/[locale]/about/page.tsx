import AboutHero from "@/sections/about/AboutHero";
import AboutPath from "@/sections/about/AboutPath";
import AboutSkill from "@/sections/about/AboutSkill";
import type { Metadata } from "next";
import type { FC } from "react";
import { getTranslations } from "next-intl/server";
import { createPageMetadata } from "../metadata";
import type { Locale } from "@/shared/i18n/types";
import { BASE_SEO } from "../seo";
import { SKILLS } from "@/sections/about/AboutSkill/utils/skills";

interface AboutPageProps {
    params: Promise<{ locale: Locale }>;
}

const AboutPage: FC<AboutPageProps> = async ({ params }) => {
    const { locale } = await params;
    const profileUrl = `${BASE_SEO[locale].url}/${locale}`;
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        inLanguage: locale,
        mainEntity: {
            "@type": "Person",
            name: "NodalDOT",
            url: profileUrl,
            jobTitle: "Frontend Developer",
            sameAs: ["https://github.com/NodalDOT"],
            knowsAbout: SKILLS.map((skill) => skill.name),
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <AboutHero />
            <AboutPath />
            <AboutSkill />
        </>
    );
};

export default AboutPage;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations("Metadata.About");
    return createPageMetadata({
        title: t("title"),
        description: t("description"),
        path: `/${locale}/about`,
        locale,
    });
}
