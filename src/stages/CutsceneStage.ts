import { Stage } from "../engine/Stage";
import { Timer } from "../util/Timer";
import { Vector } from "../util/Vector";
import { elt } from "../util/elt";
import { loadImage } from "../util/loadImage";
import { GameInputEvent } from "../engine/GameInputEvent";

type SceneDefinition = {
    imageSrc: string,
    dialogues: string[]
}

type Px = number;
type Index = number;
type CharsPerSecond = number;
type PxPerSecond = number;

const NORMAL_TEXT_SPEED: CharsPerSecond = 30;
const FASTER_TEXT_SPEED: CharsPerSecond = 300;
const PAN_SPEED: PxPerSecond = 20;

const DIALOGUE_HEIGHT = 100;

export class CutsceneStage extends Stage {
    scenes: SceneDefinition[]
    currentSceneIndex: Index;
    currentDialogueIndex: Index;
    imageHorizontalOffset: Px;
    currentImage: HTMLImageElement;
    promptImage: HTMLImageElement;
    onCutsceneFinished: () => void;
    dialogueTimer: Timer;
    promptTimer: Timer;
    textSpeed: CharsPerSecond;

    constructor(
        scenes: SceneDefinition[],
        screenDimensions: Vector,
        onCutsceneFinished: () => void
    ) {
        super(screenDimensions);

        this.scenes = scenes;
        this.currentSceneIndex = 0;
        this.currentDialogueIndex = 0;
        this.imageHorizontalOffset = 0;
        this.currentImage = null;
        this.promptImage = elt.image("img/prompt.png", () => {}, () => {});
        this.onCutsceneFinished = onCutsceneFinished;
        this.dialogueTimer = null;
        this.promptTimer = new Timer("repeat", 500, () => {});
        this.textSpeed = NORMAL_TEXT_SPEED;
    }

    private get currentScene(): SceneDefinition {
        return this.scenes[this.currentSceneIndex] ?? null;
    }

    private get currentDialogue(): string {
        return this.currentScene?.dialogues[this.currentDialogueIndex] ?? null;
    }

    private get isDialogueFinished(): boolean {
        return (this.dialogueTimer?.progress ?? 0) === 1;
    }

    private async goToNextScene() {
        this.currentSceneIndex += 1;
        if (this.currentSceneIndex >= this.scenes.length) {
            this.onCutsceneFinished();
            return;
        }

        this.currentDialogueIndex = 0;
        this.imageHorizontalOffset = 0;

        await this.prepareScene(this.currentScene);
    }

    private goToNextDialogue() {
        if (this.currentScene === null) return;

        this.currentDialogueIndex += 1;
        if (this.currentDialogueIndex >= this.currentScene.dialogues.length) {
            this.goToNextScene();
        }
        this.recreateDialogueTimer();
    }

    private async prepareScene(scene: SceneDefinition) {
        const currentScene = this.currentScene;

        try {
            this.currentImage = await loadImage(currentScene.imageSrc);
        } catch (error) {
            console.error(error);
        }

        this.recreateDialogueTimer();
    }

    private recreateDialogueTimer() {
        if (this.currentDialogue === null) return;

        this.dialogueTimer = new Timer(
            "once",
            this.currentDialogue.length * 1000 / NORMAL_TEXT_SPEED,
            () => {}
        );
        this.dialogueTimer.reset();
    }

    private enableFastText() {
        this.textSpeed = FASTER_TEXT_SPEED;
    }


    private disableFastText() {
        this.textSpeed = NORMAL_TEXT_SPEED;
    }

    input(event: GameInputEvent) {
        if (event.key === " " && event.state === "down") {
            if (this.isDialogueFinished) {
                this.goToNextDialogue();
                return;
            }

            this.enableFastText();
        }

        if (event.key === " " && event.state === "up") {
            this.disableFastText();
        }
    }

    update(dt: number) {
        if (this.dialogueTimer !== null) {
            this.dialogueTimer.update(dt * this.textSpeed / NORMAL_TEXT_SPEED);
        }
        this.promptTimer.update(dt);
        if (this.imageHorizontalOffset <= this.currentImage.width - this.screenDimensions.x) {
            this.imageHorizontalOffset += (PAN_SPEED / 1000 * dt);
        }
    }

    private splitLines(
        text: string,
        context: CanvasRenderingContext2D,
        targetWidth: number
    ): string[] {
        let result: string[] = [];

        const words = text.split(" ");
        let line = "";

        for (const word of words) {
            if (context.measureText(line + word + " ").width < targetWidth) {
                line += word + " ";
            } else {
                result.push(line);
                line = word + " ";
            }
        }

        result.push(line);

        return result;
    }

    render(context: CanvasRenderingContext2D) {
        context.fillStyle = "black";
        context.fillRect(0, 0, this.screenDimensions.x, this.screenDimensions.y);
        const dialogueProgress = this.dialogueTimer?.progress ?? 0;

        if (this.currentImage !== null) {
            context.drawImage(this.currentImage, Math.floor(-this.imageHorizontalOffset), 0); 
        }
        
        if (this.currentDialogue !== null) {
            const text = this.currentDialogue.slice(
                0,
                Math.floor(dialogueProgress * this.currentDialogue.length)
            );

            context.save();
            context.translate(0, this.screenDimensions.y - DIALOGUE_HEIGHT);

            context.fillStyle = "rgba(0, 0, 0, 50%)";
            context.fillRect(0, 0, this.screenDimensions.x, DIALOGUE_HEIGHT);

            context.fillStyle = "white";
            context.font = "8px amiga4ever";

            const maxWidth = this.screenDimensions.x - 20;
            const lines = this.splitLines(text, context, maxWidth);
            let y = 14;
            for (const line of lines) {
                context.fillText(line, 10, y, maxWidth);
                y += 18;
            }

            if (this.isDialogueFinished) {
                context.globalAlpha = this.promptTimer.progress;
                context.drawImage(
                    this.promptImage,
                    this.screenDimensions.x - 20,
                    DIALOGUE_HEIGHT - 16
                );
            }

            context.restore();
        }
    }

    afterPush() {
        this.prepareScene(this.currentScene);
    }

}