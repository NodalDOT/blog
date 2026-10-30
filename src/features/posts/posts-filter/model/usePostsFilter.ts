import { useState, useMemo } from "react";
import type { Post } from "@/entities/post";
import { useDebounce } from "@/shared/hooks/useDebounce";

interface UsePostsFilterProps {
    posts: Post[];
}

export const usePostsFilter = ({ posts }: UsePostsFilterProps) => {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 300);
    const normalizedQuery = debouncedQuery.trim().toLowerCase();

    const visiblePosts = useMemo(() => {
        if (!normalizedQuery) return posts;

        return posts.filter((post) =>
            `${post.title} ${post.subtitle}`.toLowerCase().includes(normalizedQuery)
        );
    }, [posts, normalizedQuery]);

    return { query, setQuery, visiblePosts };
};
