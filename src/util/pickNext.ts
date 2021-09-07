/** Returns an item following `item` in `array` or first item */
export function pickNext<T>(item: T, array: T[]) {
    const index = array.findIndex(x => x === item);  
    return array[index + 1] ?? array[0];
}