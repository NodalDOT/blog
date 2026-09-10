const MIN_DEVICE_MEMORY_GB = 1.5;
const MIN_HARDWARE_CONCURRENCY = 3;

export function canAnimateSkillCanvas(): boolean {
    if (typeof window === "undefined") return false;

    const prefersReducedMotion =
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const deviceMemory =
        (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? Infinity;
    const hwConcurrency = navigator.hardwareConcurrency ?? Infinity;

    return (
        !prefersReducedMotion &&
        deviceMemory >= MIN_DEVICE_MEMORY_GB &&
        hwConcurrency >= MIN_HARDWARE_CONCURRENCY
    );
}
