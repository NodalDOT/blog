import { parse } from "acorn";
import type { Program } from "estree";
import type { Root, Nodes } from "mdast";
import type {} from "mdast-util-mdxjs-esm";

interface TocItem {
    id: string;
    title: string;
    children: TocItem[];
}

export default function remarkPostToc() {
    return function transform(tree: Root) {
        const usedIds = new Set<string>();
        const toc: TocItem[] = [];
        let currentSection: TocItem | null = null;
        visitTree(tree, (node) => {
            if (node.type !== "heading" || (node.depth !== 2 && node.depth !== 3)) {
                return;
            }
            const title = extractNodeText(node).trim();
            const id = createUniqueSlug(title, usedIds);
            node.data ??= {};
            node.data.hProperties = {
                ...node.data.hProperties,
                id,
                tabIndex: -1,
            };
            if (!title) {
                return;
            }
            const item: TocItem = {
                id,
                title,
                children: [],
            };
            if (node.depth === 2) {
                toc.push(item);
                currentSection = item;
                return;
            }
            if (currentSection) {
                currentSection.children.push(item);
                return;
            }
            toc.push(item);
        });
        const value = `export const toc = ${JSON.stringify(toc)};`;
        tree.children.push({
            type: "mdxjsEsm",
            value,
            data: {
                estree: parse(value, { ecmaVersion: "latest", sourceType: "module" }) as Program,
            },
        });
    };
}
function createUniqueSlug(value: string, usedIds: Set<string>): string {
    const baseSlug = slugify(value) || "section";
    let id = baseSlug;
    let suffix = 2;

    while (usedIds.has(id)) {
        id = `${baseSlug}-${suffix++}`;
    }

    usedIds.add(id);
    return id;
}

function slugify(value: string): string {
    return value
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/&/g, " and ")
        .replace(/[^\p{L}\p{N}\s-]/gu, "")
        .trim()
        .replace(/\s+/g, "-");
}
function visitTree(node: Nodes, visitor: (node: Nodes) => void): void {
    visitor(node);
    if (!("children" in node)) return;

    for (const child of node.children) {
        visitTree(child, visitor);
    }
}
function extractNodeText(node: Nodes): string {
    if (node.type === "text" || node.type === "inlineCode") {
        return node.value ?? "";
    }
    if (node.type === "image") {
        return node.alt ?? "";
    }
    if (node.type === "break") {
        return " ";
    }
    return "children" in node ? node.children.map(extractNodeText).join("") : "";
}
