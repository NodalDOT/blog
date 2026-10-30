import fs from "fs";
import path from "path";
import { readPostFrontmatters } from "./readPostFrontmatters";

jest.mock("fs", () => ({
    existsSync: jest.fn(),
    readdirSync: jest.fn(() => ["9.mdx", "1.mdx", "notes.txt"]),
    readFileSync: jest.fn(),
}));

beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(fs.existsSync).mockReturnValue(true);
    jest.mocked(fs.readFileSync).mockImplementation((file) => {
        const newer = path.basename(String(file)) === "1.mdx";
        return `---\ntitle: "Post"\ndate: "${newer ? "2026-08-10" : "2026-05-25"}"\nupdated: "${newer ? "2026-08-10" : "2027-01-01"}"\n---\nContent`;
    });
});

describe("readPostFrontmatters", () => {
    it("orders posts by publication date, not filename or modification date", () => {
        const posts = readPostFrontmatters("en");

        expect(posts.map((post) => post.id)).toEqual(["1", "9"]);
        expect(posts[0]?.date).toBe("2026-08-10");
        expect(fs.readFileSync).toHaveBeenCalledTimes(2);
        expect(posts.every((post) => !("tags" in post))).toBe(true);
    });

    it("returns an empty list for a missing locale directory", () => {
        jest.mocked(fs.existsSync).mockReturnValue(false);

        expect(readPostFrontmatters("missing")).toEqual([]);
        expect(fs.readdirSync).not.toHaveBeenCalled();
    });

    it("returns an empty list when there are no post files", () => {
        jest.mocked(fs.readdirSync).mockReturnValueOnce([]);

        expect(readPostFrontmatters("en")).toEqual([]);
    });
});
