
export function toPlainString(num: number | null | undefined): string {
    if (num === null || num === undefined || isNaN(num as number)) {
        return "0";
    }

    const str = Number(num).toString();

    // Если нет e-нотации — возвращаем как есть
    if (!/e/i.test(str)) return str;

    const [base = "0", expPart = "0"] = str.split('e');
    const exponent = parseInt(expPart, 10);

    const [intPart = "0", fracPart = ""] = base.split('.');
    const digits = intPart + fracPart;

    if (exponent > 0) {
        return digits + '0'.repeat(exponent - fracPart.length);
    } else {
        const zeros = '0'.repeat(Math.abs(exponent) - 1);
        return '0.' + zeros + digits;
    }
}

