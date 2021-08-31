type InputEventState = "up" | "down" | "press";

export type GameInputEvent = {
    key: String,
    state: InputEventState
}

export function inputEventFromKeyboardEvent(event: KeyboardEvent): GameInputEvent {
    let state: InputEventState = null;
    switch (event.type) {
        case "keydown":
            state = "down";
            break;
        case "keyup":
            state = "up";
            break;
        case "keypress":
            state = "press";
            break;
    }

    if (state == null) {
        return null;
    }

    return {
        key: event.key,
        state,
    };
}