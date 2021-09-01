export class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {    
        this.x = x;
        this.y = y;
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
}