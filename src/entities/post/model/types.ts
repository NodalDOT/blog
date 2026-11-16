export interface Post {
    id: string;
    title: string;
    subtitle: string;
    image: { src: string; alt: string };
    videoUrl: string;

    date: string;
    updated?: string;
}

export type PostMetadata = Omit<Post, "id">;
