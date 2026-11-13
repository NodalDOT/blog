import remarkPostToc from "./remarkPostToc";

type Tree = Parameters<ReturnType<typeof remarkPostToc>>[0];

it("exports a nested TOC with matching unique heading IDs", () => {
    const tree: Tree = {
        type: "root",
        children: [
            { type: "heading", depth: 1, children: [{ type: "text", value: "Title" }] },
            { type: "heading", depth: 2, children: [{ type: "text", value: "Начало" }] },
            { type: "heading", depth: 3, children: [{ type: "inlineCode", value: "Code" }] },
            { type: "heading", depth: 2, children: [{ type: "text", value: "Начало" }] },
        ],
    };

    remarkPostToc()(tree);

    expect(tree.children?.slice(1, 4).map((node) => node.data?.hProperties?.["id"])).toEqual([
        "начало",
        "code",
        "начало-2",
    ]);
    const toc = [
        { id: "начало", title: "Начало", children: [{ id: "code", title: "Code", children: [] }] },
        { id: "начало-2", title: "Начало", children: [] },
    ];
    expect(tree.children?.at(-1)?.value).toBe(
        `export const toc = JSON.parse(${JSON.stringify(JSON.stringify(toc))});`
    );
});

it("keeps standalone subheadings and does not leak headings between articles", () => {
    const transform = remarkPostToc();
    const tree: Tree = {
        type: "root",
        children: [{ type: "heading", depth: 3, children: [{ type: "text", value: "Details" }] }],
    };
    transform(tree);
    expect(tree.children?.at(-1)?.value).toContain("details");

    const emptyTree: Tree = { type: "root", children: [] };
    transform(emptyTree);
    expect(emptyTree.children?.at(-1)?.value).toBe('export const toc = JSON.parse("[]");');
});
