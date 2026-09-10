import { Vector3 } from "three";
import { assertDefined } from "@/shared/lib/assert";
import { SKILLS } from "./skills";

export type SkillPoint = {
    position: Vector3;
    name: string;
    svgUrl: string;
    canvasTexture?: HTMLCanvasElement;
};

export const CONFIG = {
    RADIUS: 8,
    ICON_SIZE: 1.2,
    ROTATION_SPEED: 0.0003,
    SPHERE_POINT_COUNT: 50,
    CONNECT_NEIGHBORS: 6,
    INTERACTION_DISTANCE: 1.5,
    AUTO_ROTATION_ENABLED: true,
    AUTO_ROTATION_SPEED: 0.0003,
    MOUSE_ROTATION_ENABLED: true,
    CLICK_ANIMATION_DURATION: 1500,
};

export function generateGoldenSphereCube(count: number): Vector3[] {
    const positions: Vector3[] = [];
    const offset = 2 / count;
    const increment = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
        const y = i * offset - 1 + offset / 2;
        const r = Math.sqrt(1 - y * y);
        const phi = i * increment;

        const x = Math.cos(phi) * r * CONFIG.RADIUS;
        const yPos = y * CONFIG.RADIUS;
        const z = Math.sin(phi) * r * CONFIG.RADIUS;

        positions.push(new Vector3(x, yPos, z));
    }

    return positions;
}

export function createSkillPoints(positions: Vector3[]): SkillPoint[] {
    return positions.map((position, i) => ({
        position,
        name: assertDefined(SKILLS[i % SKILLS.length], "Skill definition is required").name,
        svgUrl: assertDefined(SKILLS[i % SKILLS.length], "Skill definition is required").icon,
    }));
}

export function findNearestNeighbors(
    points: SkillPoint[],
    count: number = CONFIG.CONNECT_NEIGHBORS
): number[][] {
    return points.map((point, i) => {
        return points
            .map((other, j) => ({
                idx: j,
                dist: point.position.distanceTo(other.position),
            }))
            .filter((v) => v.idx !== i)
            .sort((a, b) => a.dist - b.dist)
            .slice(0, count)
            .map((v) => v.idx);
    });
}

export async function createSvgTexture(svgUrl: string): Promise<HTMLCanvasElement> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = 256;
            canvas.height = 256;
            const ctx = assertDefined(canvas.getContext("2d"), "2D canvas context is required");
            ctx.drawImage(img, 0, 0, 256, 256);
            resolve(canvas);
        };
        img.onerror = () => {
            const canvas = document.createElement("canvas");
            canvas.width = 256;
            canvas.height = 256;
            resolve(canvas);
        };
        img.src = svgUrl;
    });
}
