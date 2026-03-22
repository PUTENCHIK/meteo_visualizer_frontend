import { Vector2 } from 'three';
import { degToRad } from 'three/src/math/MathUtils.js';
import type { PolarPositionDto } from './interfaces';

export class PolarPosition {
    public radius: number;
    public angle: number;

    constructor(r: number = 0, a: number = 0) {
        this.radius = r;
        this.angle = a;
    }

    public toJSON(): PolarPositionDto {
        return {
            radius: this.radius,
            angle: this.angle,
        };
    }

    static fromJSON(data: PolarPositionDto): PolarPosition {
        return new PolarPosition(data.radius, data.angle);
    }

    get x(): number {
        return this.radius * Math.sin(degToRad(this.angle));
    }

    get y(): number {
        return this.radius * Math.cos(degToRad(this.angle));
    }

    public toVector2(): Vector2 {
        return new Vector2(this.x, this.y);
    }
}
