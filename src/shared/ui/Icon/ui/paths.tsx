import type { ReactNode } from "react";

export type IconName =
    | "chevron-down"
    | "search"
    | "languages"
    | "code-2"
    | "layers"
    | "graduation-cap"
    | "x"
    | "play"
    | "arrow-up"
    | "arrow-down"
    | "arrow-left"
    | "sun"
    | "moon";

export const ICON_PATHS: Record<IconName, ReactNode> = {
    "chevron-down": <path d="m6 9 6 6 6-6" />,
    search: (
        <>
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
        </>
    ),
    languages: (
        <>
            <path d="m5 8 6 6" />
            <path d="m4 14 6-6 2-3" />
            <path d="M2 5h12" />
            <path d="M7 2h1" />
            <path d="m22 22-5-10-5 10" />
            <path d="M14 18h6" />
        </>
    ),
    "code-2": (
        <>
            <path d="m16 18 6-6-6-6" />
            <path d="m8 6-6 6 6 6" />
        </>
    ),
    layers: (
        <>
            <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
            <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
            <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
        </>
    ),
    "graduation-cap": (
        <>
            <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
            <path d="M22 10v6" />
            <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
        </>
    ),
    x: (
        <>
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </>
    ),
    play: (
        <path
            d="M8 6.82v10.36a1 1 0 0 0 1.53.848l8.14-5.18a1 1 0 0 0 0-1.696l-8.14-5.18A1 1 0 0 0 8 6.82"
            fill="currentColor"
            stroke="none"
        />
    ),
    "arrow-up": (
        <>
            <path d="m5 12 7-7 7 7" />
            <path d="M12 19V5" />
        </>
    ),
    "arrow-down": (
        <>
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
        </>
    ),
    "arrow-left": <path d="M15 18 9 12l6-6" />,
    sun: (
        <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
        </>
    ),
    moon: (
        <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
    ),
};
