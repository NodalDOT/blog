import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import bundleAnalyzer from "@next/bundle-analyzer";
import createMDX from "@next/mdx";

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env["ANALYZE"] === "true",
});

const nextConfig: NextConfig = {
    reactStrictMode: true,
};

const withNextIntl = createNextIntlPlugin("./src/shared/i18n/request.ts");
const withMDX = createMDX({
    options: {
        remarkPlugins: ["remark-gfm"],
    },
});

export default withBundleAnalyzer(withNextIntl(withMDX(nextConfig)));
