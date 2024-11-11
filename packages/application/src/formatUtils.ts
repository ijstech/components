import { moment } from '@ijstech/moment';

type RoundingMethod = 'floor' | 'round' | 'ceil';
export interface IFormatNumberOptions {
    useSeparators?: boolean;
    roundingMethod?: RoundingMethod;
    decimalFigures?: number;
    minValue?: number|string;
    shortScale?: boolean;
    hasTrailingZero?: boolean;
}

export class FormatUtils {
    public static unixToFormattedDate(unixTimestamp: number): string {
        return moment.unix(unixTimestamp).format('YYYY-MM-DD HH:mm:ss');
    }

    public static truncateTxHash(hash: string, length: number = 20): string {
        return hash.substring(0, length) + '...';
    }

    public static truncateWalletAddress(address: string): string {
        return address.substring(0, 6) + '...' + address.substring(address.length - 4);
    }

    public static formatNumber(value: BigInt | string | number, options?: IFormatNumberOptions): string {
        if (!value) return '0';
        const { decimalFigures, useSeparators = true, roundingMethod = 'round', minValue, shortScale = false } = options || {};
        let stringValue: string = (typeof value === 'string') ? value : value.toString();
        stringValue = stringValue.trim();
        if (stringValue === '0') return '0';

        if (minValue !== undefined) {
            const compareResult = this.compareToMinValue(stringValue, minValue.toString());
            if (compareResult === -1) return `<${minValue}`;
        }

        const hasExponential = stringValue.includes('e');
        stringValue = hasExponential ? this.removeExponential(stringValue) : stringValue;
        
        let suffix = '';
        if (shortScale) {
            const { value: newValue, suffix: newSuffix } = this.scaleValue(stringValue);
            if (newValue) stringValue = newValue;
            suffix = newSuffix;
        }

        let [integerPart, decimalPart] = stringValue.split('.');

        const formattedInteger = useSeparators ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : integerPart;
        if (decimalFigures === undefined || decimalFigures < 0) {
            return (decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger) + suffix;
        }

        let newValue = '';
        if (decimalFigures && decimalFigures > 0) {
            const { newDecimal, newInteger } = this.processDecimalPart(decimalPart, integerPart, options);
            const formattedInteger = useSeparators ? newInteger.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : newInteger;
            newValue = newDecimal ? `${formattedInteger}.${newDecimal}` : formattedInteger;
        } else {
            const newInteger = this.roundIntegerPart(decimalPart, integerPart, roundingMethod);
            newValue = useSeparators ? newInteger.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : newInteger;
        }
        return (newValue.length > 18 ? newValue.substring(0, 18) + '...' : newValue) + suffix;
    }

    private static scaleValue(value: string) {
        let [integerPart] = value.split('.');
        const absBigInteger = BigInt(integerPart.replace(/\-|\s+/g, ''));
        const newBigValue = new BigDecimal(value);
        let newValue = '';
        let suffix = '';
        if (absBigInteger >= 1000000000) {
            newValue = newBigValue.divide(new BigDecimal('1000000000')).toString();
            suffix = 'B';
        } else if (absBigInteger >= 1000000) {
            newValue = newBigValue.divide(new BigDecimal('1000000')).toString();
            suffix = 'M';
        } else if (absBigInteger >= 1000) {
            newValue = newBigValue.divide(new BigDecimal('1000')).toString();
            suffix = 'K';
        }
        return { value: newValue, suffix };
    }

    private static removeExponential(value: string) {
        let [numberPart, ePart] = value.split('e');
        numberPart = numberPart.replace('.', '');
        const powValue = Number(ePart) > 0 ? Number(ePart) : Number(ePart) * -1;
        const eValue = (10 ** powValue).toLocaleString('en-US', { useGrouping: false });
        const rightPart = Math.abs(numberPart.length - eValue.length);
        if (Number(ePart) < 0) {
            return '0.' + '0'.repeat(Math.abs(rightPart) - 1) + numberPart;
        } else {
            return numberPart + '0'.repeat(rightPart);
        }
    }

    private static compareToMinValue(stringValue: string, minValue: string) {
        let [integerPart1, decimalPart1 = ''] = stringValue.split('.');
        let [integerPart2, decimalPart2 = ''] = minValue.split('.');
        const maxDecimals = Math.max(decimalPart1.length, decimalPart2.length);
        const bigValue1 = BigInt(integerPart1 + decimalPart1.padEnd(maxDecimals, '0'));
        const bigValue2 = BigInt(integerPart2 + decimalPart2.padEnd(maxDecimals, '0'));
        if (bigValue1 > bigValue2) {
            return 1;
        } else if (bigValue1 < bigValue2) {
            return -1;
        } else {
            return 0;
        }
    }

    private static processDecimalPart(decimalPart: string, integerPart: string, options?: IFormatNumberOptions) {
        const { decimalFigures = 0, roundingMethod = 'round', hasTrailingZero = true } = options || {};

        let roundingValue = { newDecimal: decimalPart, newInteger: integerPart };
        if (decimalPart) {
            // let count = 0;
            // let endIndex = 0;
            // for (let i = 0; i < decimalPart.length; i++) {
            //     if (count >= decimalFigures) break;
            //     if (decimalPart[i] !== '0') count++;
            //     endIndex = i;
            // }

            const initialDecimalPart = decimalPart.slice(0, decimalFigures).replace(/0+$/g, '');
            switch (roundingMethod) {
                case 'round':
                    roundingValue = this.customRound(decimalPart, integerPart, decimalFigures, 5, hasTrailingZero);
                    break;
                case 'ceil':
                    if (integerPart.startsWith('-')) {
                        roundingValue.newDecimal = initialDecimalPart;
                    } else {
                        roundingValue = this.customRound(decimalPart, integerPart, decimalFigures, 1, hasTrailingZero);
                    }
                    break;
                default:
                    roundingValue.newDecimal = initialDecimalPart;
            }
        } else if (hasTrailingZero) {
            roundingValue.newDecimal = '0'.repeat(decimalFigures);
        }
    
        return {...roundingValue};
    }

    private static customRound(decimalPart: string, integerPart: string, decimalFigures: number, roundingNumber: number, hasTrailingZero: boolean) {
        const decimalArr = decimalPart.split('');
        let lastIndex = decimalArr.length - 1;
        let newInteger = integerPart;
        for (let i = decimalArr.length - 1; i >= 0; i--) {
            if (i < decimalFigures)  {
                if (decimalArr[i] === '10' && i === 0) {
                    newInteger = this.incrementLastDigit(integerPart);
                    lastIndex = -1;
                    break;
                } else if (decimalArr[i] !== '10') {
                    lastIndex = i + 1;
                    break;
                }
            }
            if (+decimalArr[i] >= roundingNumber && i - 1 >= 0) {
                decimalArr[i] = '0';
                decimalArr[i - 1] = `${+decimalArr[i - 1] + 1}`;
            }
        }
        const newDecimal = lastIndex >= 0 ? decimalArr.slice(0, lastIndex).join('') : '';
        let roundingValue;
        if (hasTrailingZero && newDecimal.length < decimalFigures) {
            roundingValue = newDecimal + '0'.repeat(decimalFigures - newDecimal.length);
        } else {
            roundingValue = newDecimal.replace(/0+$/g, '');
        }
        return { newDecimal: roundingValue, newInteger };
    }

    private static roundIntegerPart(decimalPart: string, integerPart: string, roundingMethod: string): string {
        const firstDecimal = decimalPart && decimalPart.charAt(0);
        const notRounding = (integerPart.startsWith('-') && roundingMethod === 'ceil') ||
            roundingMethod === 'floor' ||
            !firstDecimal ||
            (roundingMethod === 'round' && +firstDecimal < 5) ||
            (roundingMethod === 'ceil' && +firstDecimal < 1);

        return notRounding ? integerPart : this.incrementLastDigit(integerPart);
    }

    private static incrementLastDigit(integerPart: string): string {
        let chars = integerPart.split('') || [];
        let isNegative = chars[0] === '-';
        isNegative && chars.shift();
        if (chars[chars.length - 1] === '9') {
            for (let i = chars.length - 1; i > 0; i--) {
                const num = +chars[i];
                if (num >= 9 && i - 1 > 0) {
                    chars[i] = '0';
                    chars[i - 1] = `${+chars[i - 1] + 1}`;
                }
            }
        } else {
            chars[chars.length - 1] = `${(+chars[chars.length - 1]) + 1}`;
        }
        if (isNegative) chars.unshift('-');
        return chars.join('');
    }
}


export class BigDecimal {
    static decimals: number = 18;
    private bigVal: bigint;

    constructor(value: string) {
        let [integerPart, decimalPart = ''] = value.split('.');
        decimalPart = decimalPart.padEnd(BigDecimal.decimals, '0');
        this.bigVal = BigInt(integerPart + decimalPart);
    }

    static fromBigInt(bigVal: bigint) {
        return Object.assign(Object.create(BigDecimal.prototype), { bigVal });
    }

    toString() {
        const str = this.bigVal.toString().padStart(BigDecimal.decimals + 1, '0');
        return str.slice(0, -BigDecimal.decimals) + '.' + str.slice(-BigDecimal.decimals).replace(/\.?0+$/, "");
    }

    divide(value: BigDecimal) {
        if (!value) throw new Error('Cannot divide to empty value');
        return BigDecimal.fromBigInt((this.bigVal * BigInt('1' + '0'.repeat(BigDecimal.decimals)) / value.bigVal));
    }
}
