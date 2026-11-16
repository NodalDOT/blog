import type { ComponentProps } from "react";
import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
    pre: (props: ComponentProps<"pre">) => <pre tabIndex={0} {...props} />,
    th: (props: ComponentProps<"th">) => <th scope="col" {...props} />,
};

export function useMDXComponents(): MDXComponents {
    return components;
}
