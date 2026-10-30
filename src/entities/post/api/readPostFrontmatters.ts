import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ROOT = path.join(process.cwd(), "content/posts");

export interface PostFrontmatter {
    id: string;
    title: string;
    subtitle: string;
    imageSrc: string;
    imageAlt: string;
    videoUrl: string;

    date: string;
    updated?: string;
}

export function readPostFrontmatters(locale: string): PostFrontmatter[] {
    const dir = path.join(ROOT, locale);
    if (!fs.existsSync(dir)) return [];

    return fs
        .readdirSync(dir)
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => {
            const id = file.replace(/\.mdx$/, "");
            const source = fs.readFileSync(path.join(dir, file), "utf8");
            const { data } = matter(source);

            return {
                id,
                title: String(data["title"] ?? ""),
                subtitle: String(data["subtitle"] ?? ""),
                imageSrc: String(data["imageSrc"] ?? ""),
                imageAlt: String(data["imageAlt"] ?? ""),
                videoUrl: String(data["videoUrl"] ?? ""),

                date: String(data["date"] ?? ""),
                ...(data["updated"] ? { updated: String(data["updated"]) } : {}),
            } satisfies PostFrontmatter;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
