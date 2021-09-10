import { loadImage } from "./util/loadImage";

export class ImageLibrary {
    prompt: HTMLImageElement;
    boss1: HTMLImageElement;
    boss2: HTMLImageElement;
    boss3: HTMLImageElement;
    cathead: HTMLImageElement;
    goliath: HTMLImageElement;
    nibbler: HTMLImageElement;
    cat: HTMLImageElement;
    returner: HTMLImageElement;
    waver: HTMLImageElement;
    credits: HTMLImageElement;

    async loadImages() {
        this.prompt = await loadImage("img/prompt.png");
        this.boss1 = await loadImage("img/boss1.png");
        this.boss2 = await loadImage("img/boss2.png");
        this.boss3 = await loadImage("img/boss3.png");
        this.cathead = await loadImage("img/cathead.png");
        this.goliath = await loadImage("img/goliath.png");
        this.nibbler = await loadImage("img/nibbler.png");
        this.cat = await loadImage("img/cat.png");
        this.returner = await loadImage("img/returner.png");
        this.waver = await loadImage("img/waver.png");
        this.credits = await loadImage("img/credits.png"); 
    }

    static get instance(): ImageLibrary {
        return instance;
    }
}

const instance = new ImageLibrary();