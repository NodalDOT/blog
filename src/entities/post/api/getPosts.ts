import { readPostFrontmatters } from "./readPostFrontmatters";

export async function getPosts(locale: string) {
    return readPostFrontmatters(locale).map((post) => ({
        id: post.id,
        title: post.title,
        subtitle: post.subtitle,
        image: { src: post.imageSrc, alt: post.imageAlt },
        videoUrl: post.videoUrl,

        date: post.date,
    }));
}
