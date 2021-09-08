import { Stage } from "../engine/Stage";

export class LoadingStage extends Stage {
    render(context: CanvasRenderingContext2D) {
        context.fillStyle = "black";
        context.fillRect(0, 0, this.screenDimensions.x, this.screenDimensions.y);

        context.fillStyle = "white";
        context.font = "8px amiga4ever";
        context.textAlign = "center";
        context.fillText(
            "LOADING...",
            this.screenDimensions.x / 2,
            this.screenDimensions.y / 2
        );
        context.textAlign = "left";
    }
}