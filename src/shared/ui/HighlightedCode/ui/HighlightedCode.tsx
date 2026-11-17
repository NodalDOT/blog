import type { ComponentProps, FC } from "react";
import { classNames } from "@/shared/lib/classNames";
import { Prism } from "../lib/prism";
import styles from "./HighlightedCode.module.scss";

export const HighlightedCode: FC<ComponentProps<"code">> = ({ children, className, ...props }) => {
    const codeClassName = classNames(styles["highlighted-code"], className);
    const language = /\blanguage-([\w-]+)\b/.exec(className ?? "")?.[1];
    const grammar = language ? Prism.languages[language] : undefined;

    if (!language || !grammar || typeof children !== "string") {
        return (
            <code className={codeClassName} {...props}>
                {children}
            </code>
        );
    }

    return (
        <code
            className={codeClassName}
            {...props}
            dangerouslySetInnerHTML={{ __html: Prism.highlight(children, grammar, language) }}
        />
    );
};
