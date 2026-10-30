export interface Post {
    id: string;
    title: string;
    subtitle: string;
    image: { src: string; alt: string };
    videoUrl: string;

    date: string;
    updated?: string;
}
