import type { ComponentProps } from "react";
import type { MDXComponents } from "mdx/types";
import { HighlightedCode } from "@/shared/ui/HighlightedCode";

const components: MDXComponents = {
    code: HighlightedCode,
    pre: (props: ComponentProps<"pre">) => <pre tabIndex={0} {...props} />,
    th: (props: ComponentProps<"th">) => <th scope="col" {...props} />,
};

export function useMDXComponents(): MDXComponents {
    return components;
}
