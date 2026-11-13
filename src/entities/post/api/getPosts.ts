import { getPost, getPostSlugs } from "./getPost";
import type { Post } from "../model/types";

export async function getPosts(locale: string) {
    const modules = await Promise.all(getPostSlugs(locale).map((slug) => getPost(locale, slug)));

    return modules
        .filter((module) => module !== undefined)
        .map(({ post }): Post => post)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
