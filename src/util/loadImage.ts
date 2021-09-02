import { elt } from "./elt";

export function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        elt.image(src, (image) => {
            resolve(image);
        }, (error) => {
            reject(error);
        });
    });
}