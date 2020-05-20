
/**
 * @param num - 0xFFFFFF
 */
export const numberForColor = (num: number) => ('000000' + num.toString(16).slice).slice(-6);