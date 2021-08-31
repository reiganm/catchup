type EltProp = HTMLElement | DocumentFragment | Text | { [key: string]: any };

/** General purpose HTML Element creation Powerhouse!!! */
export function elt(tagName: string, ...props: EltProp[]): HTMLElement {
    const element = document.createElement(tagName);
    for (const prop of props) {
        if (prop instanceof HTMLElement
            || prop instanceof DocumentFragment
            || prop instanceof Text) {
            element.appendChild(prop);
        } else if (typeof prop === "object") {
            for (const key of Object.keys(prop)) {
                if (key === "style") {
                    Object.assign(element.style, prop[key]);
                } else {
                    element[key] = prop[key];
                }
            }
        }
    }

    return element;
}

elt.textNode = function (text: string): Text {
    return document.createTextNode(text);
}

elt.canvas = function (width: number, height: number): HTMLCanvasElement {
    return elt("canvas", { width, height }) as HTMLCanvasElement;
}

elt.image = function (
    src: string,
    onLoad: (image: HTMLImageElement) => void
): HTMLImageElement {
    return elt("img", {
        src,
        onload(event) {
            onLoad(event.target as HTMLImageElement);
        }
    }) as HTMLImageElement;
}