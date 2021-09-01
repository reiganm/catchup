export class Timer {
    resetValue: number;
    currentValue: number;
    action: () => void;
    isHolding: boolean;
    
    constructor(resetValue: number, action: () => void) {
        this.resetValue = resetValue;
        this.currentValue = resetValue;
        this.action = action;
        this.isHolding = false;
    }

    update(dt: number) {
        this.currentValue = Math.max(this.currentValue - dt, 0);
        if (!this.isHolding && this.currentValue === 0) {
            this.action();
            this.currentValue = this.resetValue;
        }
    }
}
