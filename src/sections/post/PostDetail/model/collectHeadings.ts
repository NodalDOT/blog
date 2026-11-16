import type { TocItem } from "./types";

export function collectHeadings(content: HTMLElement): TocItem[] {
    const usedIds = new Set(
        Array.from(content.ownerDocument.querySelectorAll("[id]"), (element) => element.id)
    );
    const toc: TocItem[] = [];
    let section: TocItem | undefined;

    for (const heading of content.querySelectorAll<HTMLHeadingElement>("h2, h3")) {
        const title = heading.textContent?.trim();
        if (!title) continue;

        if (!heading.id) {
            const slug =
                title
                    .toLowerCase()
                    .normalize("NFKD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/&/g, " and ")
                    .replace(/[^\p{L}\p{N}\s-]/gu, "")
                    .trim()
                    .replace(/\s+/g, "-") || "section";
            let id = slug;
            let suffix = 2;
            while (usedIds.has(id)) id = `${slug}-${suffix++}`;
            heading.id = id;
            usedIds.add(id);
        }
        if (!heading.hasAttribute("tabindex")) heading.tabIndex = -1;

        const item: TocItem = { id: heading.id, title, children: [] };
        if (heading.tagName === "H2") {
            toc.push(item);
            section = item;
        } else if (section) {
            section.children.push(item);
        } else {
            toc.push(item);
        }
    }

    return toc;
}
