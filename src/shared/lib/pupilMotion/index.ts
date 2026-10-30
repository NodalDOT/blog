interface PupilMotionOptions {
    pupil: HTMLElement;
    sclera: HTMLElement;

    gapRatio?: number;

    pupilScale?: number;

    squintRatio?: number;
    isSquinting?: () => boolean;
}

interface LookOptions {
    stiffness?: number;
}

const DEFAULT_STIFFNESS = 30;
const EDGE_SAMPLES = 24;
const FIT_ITERATIONS = 12;
const MAX_STEP = 1 / 30;

export function createPupilMotion({
    pupil,
    sclera,
    gapRatio = 0.08,
    pupilScale = 1,
    squintRatio = 1,
    isSquinting = () => false,
}: PupilMotionOptions) {
    let x = 0;
    let y = 0;
    let vx = 0;
    let vy = 0;
    let targetX = 0;
    let targetY = 0;
    let stiffness = DEFAULT_STIFFNESS;
    let frame = 0;
    let lastTime = 0;
    let enabled = true;

    const getBounds = (squint = isSquinting()) => {
        const radiusX = sclera.offsetWidth / 2;
        const radiusY = (sclera.offsetHeight / 2) * (squint ? squintRatio : 1);
        const gap = (sclera.offsetHeight / 2) * gapRatio;
        return {
            radiusX: radiusX - gap,
            radiusY: radiusY - gap,
            pupilRadius: (pupil.offsetWidth / 2) * pupilScale,
        };
    };

    const fits = (px: number, py: number, radiusX: number, radiusY: number, r: number) => {
        for (let i = 0; i < EDGE_SAMPLES; i++) {
            const angle = (i / EDGE_SAMPLES) * Math.PI * 2;
            const ex = (px + Math.cos(angle) * r) / radiusX;
            const ey = (py + Math.sin(angle) * r) / radiusY;
            if (ex * ex + ey * ey > 1) return false;
        }
        return true;
    };

    const clamp = (px: number, py: number, squint?: boolean): [number, number] => {
        const { radiusX, radiusY, pupilRadius } = getBounds(squint);
        if (fits(px, py, radiusX, radiusY, pupilRadius)) return [px, py];

        let low = 0;
        let high = 1;
        for (let i = 0; i < FIT_ITERATIONS; i++) {
            const mid = (low + high) / 2;
            if (fits(px * mid, py * mid, radiusX, radiusY, pupilRadius)) low = mid;
            else high = mid;
        }
        return [px * low, py * low];
    };

    const render = () => {
        pupil.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
    };

    const step = (time: number) => {
        const dt = Math.min((time - lastTime) / 1000, MAX_STEP);
        lastTime = time;

        const damping = 2 * Math.sqrt(stiffness);
        vx += (stiffness * (targetX - x) - damping * vx) * dt;
        vy += (stiffness * (targetY - y) - damping * vy) * dt;
        x += vx * dt;
        y += vy * dt;

        const [cx, cy] = clamp(x, y, false);
        if (cx !== x || cy !== y) {
            x = cx;
            y = cy;
            vx *= 0.5;
            vy *= 0.5;
        }
        render();

        const settled =
            Math.abs(targetX - x) < 0.05 &&
            Math.abs(targetY - y) < 0.05 &&
            Math.abs(vx) < 0.05 &&
            Math.abs(vy) < 0.05;
        frame = settled ? 0 : requestAnimationFrame(step);
    };

    const wake = () => {
        if (frame || !enabled) return;
        lastTime = performance.now();
        frame = requestAnimationFrame(step);
    };

    const lookAt = (px: number, py: number, { stiffness: next }: LookOptions = {}) => {
        [targetX, targetY] = clamp(px, py);
        stiffness = next ?? DEFAULT_STIFFNESS;
        wake();
    };

    const lookAtScreenPoint = (
        clientX: number,
        clientY: number,
        reach: number,
        options?: LookOptions
    ) => {
        const eye = sclera.getBoundingClientRect();
        const dx = clientX - (eye.left + eye.width / 2);
        const dy = clientY - (eye.top + eye.height / 2);
        const share = Math.min(Math.hypot(dx, dy) / reach, 1);
        const angle = Math.atan2(dy, dx);
        const { radiusX, radiusY } = getBounds();
        lookAt(Math.cos(angle) * radiusX * share, Math.sin(angle) * radiusY * share, options);
    };

    const lookAtShare = (shareX: number, shareY: number, options?: LookOptions) => {
        const { radiusX, radiusY } = getBounds();
        lookAt(shareX * radiusX, shareY * radiusY, options);
    };

    const refit = () => {
        [targetX, targetY] = clamp(targetX, targetY);
        wake();
    };

    const setEnabled = (value: boolean) => {
        enabled = value;
        if (!value && frame) {
            cancelAnimationFrame(frame);
            frame = 0;
        } else if (value) {
            wake();
        }
    };

    const destroy = () => {
        setEnabled(false);
        pupil.style.translate = "";
    };

    return { lookAt, lookAtShare, lookAtScreenPoint, refit, setEnabled, destroy };
}

export type PupilMotion = ReturnType<typeof createPupilMotion>;
