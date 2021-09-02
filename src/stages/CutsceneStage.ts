import { Stage } from "../engine/Stage";
import { Timer } from "../util/Timer";
import { Vector } from "../util/Vector";
import { elt } from "../util/elt";
import { loadImage } from "../util/loadImage";

type SceneDefinition = {
    imageSrc: string,
    dialogue: string[]
}

/** Text speed: characters per second */
const TEXT_SPEED = 30;

const DIALOGUE_HEIGHT = 100;

export class CutsceneStage extends Stage {
    scenes: SceneDefinition[]
    currentSceneIndex: number;
    currentDialogueIndex: number;
    currentImage: HTMLImageElement;
    onCutsceneFinished: () => void;
    dialogueTimer: Timer;

    constructor(scenes: SceneDefinition[], screenDimensions: Vector) {
        super(screenDimensions);

        this.scenes = scenes;
        this.currentSceneIndex = 0;
        this.currentDialogueIndex = 0;
        this.currentImage = null;
        this.onCutsceneFinished = null;
        this.dialogueTimer = null;
    }

    private get currentScene(): SceneDefinition {
        return this.scenes[this.currentSceneIndex] ?? null;
    }

    private get currentDialogue(): string {
        return this.currentScene?.dialogue[this.currentDialogueIndex] ?? null;
    }

    private goToNextScene() {
        this.currentSceneIndex += 1;
        if (this.currentSceneIndex >= this.scenes.length) {
            this.onCutsceneFinished();
            return;
        }

        this.currentDialogueIndex = 0;
    }

    private async prepareScene(scene: SceneDefinition) {
        const currentScene = this.currentScene;

        try {
            this.currentImage = await loadImage(currentScene.imageSrc);
        } catch (error) {
            console.error(error);
        }

        this.dialogueTimer = new Timer(
            "once",
            this.currentDialogue.length * 1000 / TEXT_SPEED,
            () => {
                // TODO: allow skipping to the next scene
            }
        );
        this.dialogueTimer.reset();
    }

    update(dt: number) {
        if (this.dialogueTimer !== null) {
            this.dialogueTimer.update(dt);
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

        if (this.currentImage !== null) {
            context.drawImage(this.currentImage, 0, 0); 
        }
        
        if (this.currentDialogue !== null) {
            const text = this.currentDialogue.slice(
                0,
                Math.floor((this.dialogueTimer?.progress ?? 0) * this.currentDialogue.length)
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

            context.restore();
        }
    }

    afterPush() {
        this.prepareScene(this.currentScene);
    }

}