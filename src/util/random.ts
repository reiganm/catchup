export function randomFromRange(from: number, to: number): number {
    return from + Math.random() * (to - from);
}