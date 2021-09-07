export class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {    
        this.x = x;
        this.y = y;
    }

    get isNull(): boolean {
        return this.x === 0 && this.y === 0;
    }

    get measure(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    normalized(): Vector {    
        const measure = this.measure;
        if (this.isNull) {
            return new Vector(0, 0);
        }

        return new Vector(
            this.x / measure,
            this.y / measure
        );
    }

    scaled(factor: number): Vector {
        return new Vector(
            this.x * factor,
            this.y * factor
        );
    }

    rotated(radians: number): Vector {
        return new Vector(
            this.x * Math.cos(radians) - this.y * Math.sin(radians),
            this.x * Math.sin(radians) + this.y * Math.cos(radians)
        );
    }

    adding(otherVector: Vector): Vector {
        return new Vector(
            otherVector.x + this.x,
            otherVector.y + this.y,
        )
    }

    subtracting(otherVector: Vector): Vector {
        return new Vector(
            this.x - otherVector.x,
            this.y - otherVector.y
        );
    }
}