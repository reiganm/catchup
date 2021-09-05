import { Vector } from "../../util/Vector";

export interface Aimer {
    vectorTowardsPlayer(sourcePoint: Vector): Vector
}