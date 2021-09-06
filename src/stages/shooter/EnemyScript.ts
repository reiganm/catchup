import { Vector } from "../../util/Vector";
import { ObjectSpawner } from "./ObjectSpawner"
import { NibblerShip } from "./NibblerShip";
import { ReturnerShip } from "./ReturnerShip";
import { WaverShip } from "./WaverShip";
import { GoliathShip } from "./GoliathShip";

export const sampleEnemyScript = [
    "a-d-a",
    ":wait_1000",
    "-c-c-c",
    ":wait_1000",
    "c-c-c-",
    "-a----",
    "-a----",
    "-a----",
    ":wait_500",
    "-b-b-",
    "-b--b-",
    "-b---b-",
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

const DEFAULT_THRESHOLD = 250;

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
            // TODO: don't leave it like that, it should actually end somewhere...
            this.instructionPointer = 0;
            // return;
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
        for (let i = 0; i < instruction.length; i++) {
            const xPos = this.screenDimensions.x + 20;
            const yPos = (this.screenDimensions.y / instruction.length) * (i + 0.5);
            switch (instruction[i]) {
                case "-":
                    continue;
                case "a":
                    this.spawner.spawn(new NibblerShip(xPos, yPos));
                    break;
                case "b":
                    this.spawner.spawn(new ReturnerShip(xPos, yPos));
                    break;
                case "c":
                    this.spawner.spawn(new WaverShip(xPos, yPos));
                    break;
                case "d":
                    this.spawner.spawn(new GoliathShip(xPos, yPos));
                    break;
            }
            
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