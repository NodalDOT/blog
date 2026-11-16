import { getPosts } from "./getPosts";
import { getPost, getPostSlugs } from "./getPost";

jest.mock("./getPost", () => ({
    getPostSlugs: jest.fn(),
    getPost: jest.fn(),
}));

beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(getPostSlugs).mockReturnValue(["9", "1"]);
    jest.mocked(getPost).mockImplementation(async (_locale, slug) => ({
        Content: () => null,
        post: {
            id: slug,
            title: "Post",
            subtitle: "Description",
            image: { src: "/post.jpg", alt: "Preview" },
            videoUrl: "",
            date: slug === "1" ? "2026-08-10" : "2026-05-25",
            updated: slug === "1" ? "2026-08-10" : "2027-01-01",
        },
    }));
});

it("orders compiled posts by publication date and preserves their metadata", async () => {
    const posts = await getPosts("en");

    expect(posts.map((post) => post.id)).toEqual(["1", "9"]);
    expect(posts[1]).toMatchObject({
        updated: "2027-01-01",
        image: { src: "/post.jpg", alt: "Preview" },
    });
    expect(getPost).toHaveBeenCalledWith("en", "1");
});

it("returns an empty list when there are no published posts", async () => {
    jest.mocked(getPostSlugs).mockReturnValue([]);

    expect(await getPosts("en")).toEqual([]);
    expect(getPost).not.toHaveBeenCalled();
});
