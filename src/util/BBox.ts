export class BBox {
    minX: number;
    minY: number;
    width: number;
    height: number;

    constructor(minX: number, minY: number, width: number, height: number) {
        this.minX = minX;
        this.minY = minY;
        this.width = width;
        this.height = height;
    }

    isPointInside(x: number, y: number): boolean {
        return (
            x >= this.minX
            && x < this.minX + this.width
            && y >= this.minY
            && y < this.minY + this.height
        );
    }

    isIntersecting(otherBBox: BBox): boolean {
        return (
            this.isPointInside(otherBBox.minX, otherBBox.minY)
            || this.isPointInside(otherBBox.minX + otherBBox.width, otherBBox.minY)
            || this.isPointInside(otherBBox.minX, otherBBox.minY + otherBBox.height)
            || this.isPointInside(otherBBox.minX + otherBBox.width, otherBBox.minY + otherBBox.height)
        )
    }

    translated(dx: number, dy: number): BBox {
        return new BBox(this.minX + dx, this.minY + dy, this.width, this.height);
    }
}