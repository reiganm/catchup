import { ShooterObject } from "./ShooterObject";

/** Object that ShooterObjects can request to spawn other objects like bullets */
export interface ObjectSpawner {
    spawn(object: ShooterObject): void
    despawn(object: ShooterObject): void
}