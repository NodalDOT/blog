export type ClassValue =
    string | number | boolean | null | undefined | ClassValue[] | { [key: string]: boolean };

export function classNames(...args: ClassValue[]): string {
    const classes: string[] = [];

    const process = (input: ClassValue): void => {
        if (!input) return;

        if (typeof input === "string" || typeof input === "number") {
            classes.push(String(input));
        } else if (Array.isArray(input)) {
            input.forEach(process);
        } else if (typeof input === "object") {
            for (const [key, value] of Object.entries(input)) {
                if (value) classes.push(key);
            }
        }
    };

    args.forEach(process);

    return classes.join(" ");
}
