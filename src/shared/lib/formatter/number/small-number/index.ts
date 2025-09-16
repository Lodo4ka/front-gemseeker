import { toPlainString } from "../toPlainString";
import { uiDefault } from "../ui-default";

function toSubscript(numStr: string): string {
    const subscriptMap: Record<string, string> = {
        '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
        '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
    };
    return numStr.split('').map(char => subscriptMap[char] || char).join('');
}

export function formatSmallNumber(x: number): string {
    if (x >= 0.0001) {
        return uiDefault(x);
    }
    if (x === 0) {
        return '0';
    }

    // Конвертируем в обычную строку
    const str = toPlainString(x);

    const [, decimalPart] = str.split('.');
    if (!decimalPart) return '0';

    // Считаем ведущие нули
    let zeroCount = 0;
    for (const digit of decimalPart) {
        if (digit === '0') zeroCount++;
        else break;
    }

    // Берём 4 значимые цифры
    const significantDigits = decimalPart.slice(zeroCount, zeroCount + 4).padEnd(4, '0');

    if (zeroCount === 0) {
        return `0,${significantDigits}`;
    }

    const subscript = toSubscript(zeroCount.toString());
    return `0,0${subscript}${significantDigits}`;
}