import { Vector } from "../../util/Vector";
import { ObjectSpawner } from "./ObjectSpawner"
import { EnemyShip } from "./EnemyShip";

export const sampleEnemyScript = [
    ":wait_1000",
    "-a----",
    "-a----",
    "-a----",
    ":wait_500",
    "----a-",
    "----a-",
    "----a-",
    ":wait_500",
    "a----a",
    "-a--a-",
    "--aa--",
    "-a--a-",
    "a----a",
    ":wait_1000",
    ":question_Meow, Tom, is your girlfriend coming?_ummm_Y-yeah! Any moment now...",
];

const DEFAULT_THRESHOLD = 500;

export class EnemyScript {
    spawner: ObjectSpawner;
    counter: number;
    threshold: number;
    instructionPointer: number;
    instructions: string[];
    screenDimensions: Vector;

    constructor(
        spawner: ObjectSpawner,
        screenDimensions: Vector,
        instructions: string[]
    ) {
        this.spawner = spawner;
        this.counter = 0;
        this.threshold = DEFAULT_THRESHOLD;
        this.instructionPointer = 0;
        this.instructions = instructions;
        this.screenDimensions = screenDimensions;
    }

    update(dt: number) {
        if (this.instructionPointer >= this.instructions.length) {
            return;
        }

        this.counter += dt;

        while (this.counter >= this.threshold) {
            this.counter -= this.threshold;
            this.executeInstruction(this.instructions[this.instructionPointer]);
            this.instructionPointer += 1;
        }
    }

    private executeCommand(name: string, args: string[]) {
        switch (name) {
            case "wait":
                this.threshold = Number(args[0]);
                break;
            case "question":
                console.log(args);
                this.threshold = DEFAULT_THRESHOLD;
                break;
        }
        
    }

    private spawnEnemies(instruction: string) {
        for (let i = 0; i <= instruction.length; i++) {
            if (instruction[i] === "-") {
                continue;
            }
            
            this.spawner.spawn(new EnemyShip(
                this.screenDimensions.x + 20,
                (this.screenDimensions.y / instruction.length) * (i + 0.5)
            ));
        }

        this.threshold = DEFAULT_THRESHOLD;
    }

    private executeInstruction(instruction: string) {
        if (instruction.startsWith(":")) {
            const [name, ...args] = instruction.slice(1).split("_");
            this.executeCommand(name, args);
        } else {
            this.spawnEnemies(instruction);
        }
    }
    
}