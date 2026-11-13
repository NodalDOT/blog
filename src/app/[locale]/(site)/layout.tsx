import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import Header from "@/widgets/Header";
import Footer from "@/widgets/Footer";

export default async function SiteLayout({ children }: { children: ReactNode }) {
    const t = await getTranslations("SkipLink");

    return (
        <>
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
        </>
    );
}
