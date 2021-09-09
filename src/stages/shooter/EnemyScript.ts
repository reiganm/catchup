import { Vector } from "../../util/Vector";
import { ObjectSpawner } from "./ObjectSpawner"
import { NibblerShip } from "./NibblerShip";
import { ReturnerShip } from "./ReturnerShip";
import { WaverShip } from "./WaverShip";
import { GoliathShip } from "./GoliathShip";
import { Boss } from "./Boss";
import { AmyBoss } from "./AmyBoss";
import { ValacBoss } from "./ValacBoss";
import { HaborymBoss } from "./HaborymBoss";
import { FloatingHead } from "./FloatingHead";
import { Answer } from "./Answer";


const DEFAULT_THRESHOLD = 250;

type ScriptMode = "normal" | "halt";

export interface GameChanger {
    completeLevel(): void
    startBossBattle(boss: Boss, name: string): void
    showQuestion(text: string): void
    hideQuestion(): void
}

export class EnemyScript {
    spawner: ObjectSpawner;
    gameChanger: GameChanger
    counter: number;
    threshold: number;
    instructionPointer: number;
    instructions: string[];
    screenDimensions: Vector;
    mode: ScriptMode;

    constructor(
        spawner: ObjectSpawner,
        gameChanger: GameChanger,
        screenDimensions: Vector,
        instructions: string[]
    ) {
        this.spawner = spawner;
        this.gameChanger = gameChanger;
        this.counter = 0;
        this.threshold = DEFAULT_THRESHOLD;
        const startIndex = instructions.indexOf("#start");
        if (startIndex < 0) {
            this.instructionPointer = 0
        } else {
            this.instructionPointer = startIndex;
        }
        this.instructions = instructions;
        this.screenDimensions = screenDimensions;
        this.mode = "normal";
    }

    update(dt: number) {
        if (this.instructionPointer >= this.instructions.length) {
            return;
        }

        if (this.mode === "halt") {
            return;
        }

        this.counter += dt;

        while (this.counter >= this.threshold) {
            this.counter -= this.threshold;
            this.executeInstruction(this.instructions[this.instructionPointer]);
            this.instructionPointer += 1;
        }
    }

    private spawnBoss(boss: Boss, name: string) {
        this.spawner.spawn(boss);
        this.gameChanger.startBossBattle(boss, name);
        boss.onDestroyed = () => {
            this.gameChanger.completeLevel();   
        };
    }

    private executeCommand(name: string, args: string[]) {
        switch (name) {
            case "wait":
                this.threshold = Number(args[0]);
                break;
            case "question":
                this.mode = "halt";
                const [question, answerText1, answerText2] = args;
                const head = new FloatingHead(
                    this.screenDimensions.x + 90,
                    this.screenDimensions.y / 2,
                    (question === "...") ? "tomato" : "cat",
                    () => {
                        this.gameChanger.showQuestion(question);
                        const answer1 = new Answer(head.x, head.y - 100, answerText1);
                        const answer2 = new Answer(head.x, head.y + 100, answerText2);

                        const onDestroyed = () => {
                            this.spawner.despawn(head);
                            this.spawner.despawn(answer1);
                            this.spawner.despawn(answer2);
                            this.mode = "normal";
                            this.gameChanger.hideQuestion();
                        }

                        answer1.onDestroyed = onDestroyed;
                        answer2.onDestroyed = onDestroyed;

                        this.spawner.spawn(answer1);
                        this.spawner.spawn(answer2);
                    }
                )
                this.spawner.spawn(head);
                this.threshold = DEFAULT_THRESHOLD;
                break;
            case "boss":
                this.mode = "halt";
                const xPos = this.screenDimensions.x + 90;
                const yPos = this.screenDimensions.y / 2;
                switch (args[0]) {
                    case "amy":
                        this.spawnBoss(new AmyBoss(xPos, yPos), "Tomato Amy");
                        break;
                    case "valac":
                        this.spawnBoss(new ValacBoss(xPos, yPos), "Tomato Valac");
                        break;
                    case "haborym":
                        this.spawnBoss(new HaborymBoss(xPos, yPos), "Tomato Haborym");
                        break;
                }
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
    }

    private executeInstruction(instruction: string) {
        if (instruction.startsWith(":")) {
            const [name, ...args] = instruction.slice(1).split("_");
            this.executeCommand(name, args);
        } else if (instruction.startsWith("#")) {
            return;
        } else {
            this.spawnEnemies(instruction);
            this.threshold = DEFAULT_THRESHOLD;
        }
    }
}