type TimerMode = "once" | "repeat";

export class Timer {
    mode: TimerMode;
    resetValue: number;
    currentValue: number;
    action: () => void;
    /** Will not execute action if true */
    isHolding: boolean;
    /** Will not count time if true */
    isSleeping: boolean;
    
    constructor(mode: TimerMode, resetValue: number, action: () => void) {
        this.mode = mode;
        this.resetValue = resetValue;
        this.currentValue = resetValue;
        this.action = action;
        this.isHolding = false;
    }

    /** Feed milliseconds to timer. */
    update(dt: number) {
        if (this.isSleeping) return;
        this.currentValue = Math.max(this.currentValue - dt, 0);
        if (!this.isHolding && this.currentValue === 0) {
            this.action();
            
            if (this.mode === "once") {
                this.isSleeping = true;
            } else {
                this.currentValue = this.resetValue;
            }
        }
    }

    /** Awake and reset the timer. Only use this to reset a timer that uses "once" mode. */
    reset() {
        this.currentValue = this.resetValue;
        this.isSleeping = false;
    }

    /** A number in range [0; 1] that represents how close timer value is to completion. */
    get progress(): number {
        return 1 - this.currentValue / this.resetValue;
    }
}
