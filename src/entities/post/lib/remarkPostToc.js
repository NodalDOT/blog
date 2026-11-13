/**
 * @typedef {import('../model/types').PostTocItem} PostTocItem
 * @typedef {{ type: string, depth?: number, value?: string, alt?: string, children?: MdastNode[], data?: { hProperties?: Record<string, string>, estree?: object } }} MdastNode
 */

function remarkPostToc() {
    /** @param {MdastNode} tree */
    return function transform(tree) {
        const slugCounts = new Map();
        /** @type {PostTocItem[]} */
        const nextToc = [];
        /** @type {PostTocItem | null} */
        let currentSection = null;
        visitTree(tree, (node) => {
            if (node.type !== "heading" || (node.depth !== 2 && node.depth !== 3)) {
                return;
            }
            const title = extractNodeText(node).trim();
            const id = createUniqueSlug(title, slugCounts);
            node.data ??= {};
            node.data.hProperties = {
                ...node.data.hProperties,
                id,
            };
            if (!title) {
                return;
            }
            const item = {
                id,
                title,
                children: [],
            };
            if (node.depth === 2) {
                nextToc.push(item);
                currentSection = item;
                return;
            }
            if (currentSection) {
                currentSection.children.push(item);
                return;
            }
            nextToc.push(item);
        });
        // Export the TOC with the compiled module so rendering never mutates shared state.
        const serializedToc = JSON.stringify(nextToc);
        tree.children ??= [];
        tree.children.push({
            type: "mdxjsEsm",
            value: `export const toc = JSON.parse(${JSON.stringify(serializedToc)});`,
            data: {
                estree: {
                    type: "Program",
                    sourceType: "module",
                    body: [
                        {
                            type: "ExportNamedDeclaration",
                            specifiers: [],
                            source: null,
                            declaration: {
                                type: "VariableDeclaration",
                                kind: "const",
                                declarations: [
                                    {
                                        type: "VariableDeclarator",
                                        id: { type: "Identifier", name: "toc" },
                                        init: {
                                            type: "CallExpression",
                                            optional: false,
                                            callee: {
                                                type: "MemberExpression",
                                                object: { type: "Identifier", name: "JSON" },
                                                property: { type: "Identifier", name: "parse" },
                                                computed: false,
                                                optional: false,
                                            },
                                            arguments: [{ type: "Literal", value: serializedToc }],
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
        });
    };
}
/** @param {string} value @param {Map<string, number>} slugCounts */
function createUniqueSlug(value, slugCounts) {
    const baseSlug = slugify(value) || "section";
    const currentCount = slugCounts.get(baseSlug) ?? 0;
    slugCounts.set(baseSlug, currentCount + 1);
    return currentCount === 0 ? baseSlug : `${baseSlug}-${currentCount + 1}`;
}
/** @param {string} value */
function slugify(value) {
    return value
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/&/g, " and ")
        .replace(/[^\p{L}\p{N}\s-]/gu, "")
        .trim()
        .replace(/\s+/g, "-");
}
/** @param {MdastNode} node @param {(node: MdastNode) => void} visitor */
function visitTree(node, visitor) {
    visitor(node);
    for (const child of node.children ?? []) {
        visitTree(child, visitor);
    }
}
/** @param {MdastNode} node @returns {string} */
function extractNodeText(node) {
    if (node.type === "text" || node.type === "inlineCode") {
        return node.value ?? "";
    }
    if (node.type === "image") {
        return node.alt ?? "";
    }
    if (node.type === "break") {
        return " ";
    }
    return (node.children ?? []).map(extractNodeText).join("");
}

module.exports = remarkPostToc;
