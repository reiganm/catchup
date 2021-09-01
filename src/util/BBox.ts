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

    get maxX(): number {
        return this.minX + this.width;
    }

    get maxY(): number {
        return this.minY + this.height;
    }

    isPointInside(x: number, y: number): boolean {
        return (
            x >= this.minX
            && x < this.maxX
            && y >= this.minY
            && y < this.maxY
        );
    }

    private isInside(otherBBox: BBox): boolean {
        return (
            this.isPointInside(otherBBox.minX, otherBBox.minY)
            || this.isPointInside(otherBBox.maxX, otherBBox.minY)
            || this.isPointInside(otherBBox.minX, otherBBox.maxY)
            || this.isPointInside(otherBBox.maxX, otherBBox.maxY)
        );
    }
    
    isIntersecting(otherBBox: BBox): boolean {
        return this.isInside(otherBBox) || otherBBox.isInside(this);
    }

    translated(dx: number, dy: number): BBox {
        return new BBox(this.minX + dx, this.minY + dy, this.width, this.height);
    }
}