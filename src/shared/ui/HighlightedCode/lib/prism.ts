import Prism from "prismjs";
import "prismjs/components/prism-js-extras";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";

for (const language of ["javascript", "typescript", "jsx", "tsx"]) {
    const grammar = Prism.languages[language];
    if (grammar) {
        Object.assign(grammar, {
            variable: /[$_\p{ID_Start}][$\u200c\u200d\p{ID_Continue}]*/u,
        });
    }
}

export { Prism };
