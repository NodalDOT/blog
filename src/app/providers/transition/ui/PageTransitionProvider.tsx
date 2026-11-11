"use client";

import {
    createContext,
    useState,
    use,
    useEffect,
    useTransition,
    useRef,
    useCallback,
    useMemo,
    type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname } from "@/shared/i18n/navigation";
import { classNames } from "@/shared/lib/classNames";
import styles from "./PageTransition.module.scss";

interface IPageTransitionActions {
    startTransition: (to: string, locale?: string) => void;
}

interface IPageTransitionState {
    isPending: boolean;
    isAnimating: boolean;
}

const PageTransitionActionsContext = createContext<IPageTransitionActions>({
    startTransition: () => {},
});

const PageTransitionStateContext = createContext<IPageTransitionState>({
    isPending: false,
    isAnimating: false,
});

export const PageTransitionProvider = ({ children }: { children: ReactNode }) => {
    const { push } = useRouter();
    const pathname = usePathname();

    const [isPending, startReactTransition] = useTransition();
    const [isAnimating, setIsAnimating] = useState(false);
    const [mounted, setMounted] = useState(false);

    const savedPathname = useRef(pathname);
    const navigationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pendingNavigationRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        const id = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(id);
    }, []);

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout> | null = null;

        if (savedPathname.current !== pathname) {
            savedPathname.current = pathname;
            timeoutId = setTimeout(() => setIsAnimating(false), 100);
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [pathname]);

    const isAnimatingRef = useRef(isAnimating);
    useEffect(() => {
        isAnimatingRef.current = isAnimating;
    }, [isAnimating]);

    useEffect(() => {
        const media = window.matchMedia("(prefers-reduced-motion: reduce)");
        const handleMotionChange = () => {
            if (!media.matches) return;

            if (navigationTimeoutRef.current !== null) {
                clearTimeout(navigationTimeoutRef.current);
                navigationTimeoutRef.current = null;
            }
            const navigate = pendingNavigationRef.current;
            pendingNavigationRef.current = null;
            isAnimatingRef.current = false;
            setIsAnimating(false);
            navigate?.();
        };

        media.addEventListener("change", handleMotionChange);
        return () => {
            media.removeEventListener("change", handleMotionChange);
            if (navigationTimeoutRef.current !== null) {
                clearTimeout(navigationTimeoutRef.current);
            }
        };
    }, []);

    const startTransition = useCallback(
        (to: string, locale?: string) => {
            if (isAnimatingRef.current) return;
            if (to === pathname) return;

            const navigate = () => {
                startReactTransition(() => {
                    if (locale) {
                        push(to, { locale });
                    } else {
                        push(to);
                    }
                });
            };

            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                navigate();
                return;
            }

            isAnimatingRef.current = true;
            setIsAnimating(true);
            pendingNavigationRef.current = navigate;
            navigationTimeoutRef.current = setTimeout(() => {
                navigationTimeoutRef.current = null;
                pendingNavigationRef.current = null;
                navigate();
            }, 400);
        },
        [pathname, push, startReactTransition]
    );

    const actionsValue = useMemo(() => ({ startTransition }), [startTransition]);
    const stateValue = useMemo(() => ({ isPending, isAnimating }), [isPending, isAnimating]);

    const loaderPortal = mounted
        ? createPortal(
              <div
                  className={classNames(styles["loader"], isAnimating && styles["loader--active"])}
              />,
              document.body
          )
        : null;

    return (
        <PageTransitionActionsContext.Provider value={actionsValue}>
            <PageTransitionStateContext.Provider value={stateValue}>
                {children}
                {loaderPortal}
            </PageTransitionStateContext.Provider>
        </PageTransitionActionsContext.Provider>
    );
};

export const usePageTransitionActions = () => use(PageTransitionActionsContext);
export const usePageTransitionState = () => use(PageTransitionStateContext);

export const usePageTransition = () => {
    const actions = usePageTransitionActions();
    const state = usePageTransitionState();

    return useMemo(() => ({ ...actions, ...state }), [actions, state]);
};
