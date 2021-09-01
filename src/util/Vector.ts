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
}