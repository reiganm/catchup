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
const TEXT_SPEED = 10;

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

    render(context: CanvasRenderingContext2D) {
        if (this.currentImage !== null) {
            context.drawImage(this.currentImage, 0, 0); 
        }
        
        if (this.currentDialogue !== null) {
            const text = this.currentDialogue.slice(
                0,
                Math.floor((this.dialogueTimer?.progress ?? 0) * this.currentDialogue.length)
            );
            context.fillStyle = "white";
            context.font = "8px amiga4ever";
            context.fillText(text, 10, 10);
        }
    }

    afterPush() {
        this.prepareScene(this.currentScene);
    }

}