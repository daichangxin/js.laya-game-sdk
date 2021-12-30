export interface MoneyFormat {
    count: number;
    des: string;
    digits: number;
}

const cnMoneyFormat: MoneyFormat[] = [
    { count: 1000, des: '千', digits: 1 },
    { count: 10000, des: '万', digits: 2 },
    { count: 1000000, des: '百万', digits: 3 },
    { count: 10000000, des: '千万', digits: 3 },
    { count: 100000000, des: '亿', digits: 3 },
];

const formatMoney = (format: MoneyFormat[], value: number) => {
    format.sort((a, b) => {
        return a.count < b.count ? 1 : -1;
    });

    for (let i = 0, len = format.length; i < len; i++) {
        const itemFormat = format[i];
        if (value < itemFormat.count) continue;
        const strCount = (value / itemFormat.count).toFixed(itemFormat.digits);
        const floatCount = parseFloat(strCount);
        const intCount = parseInt(strCount, 10);
        const count = floatCount === intCount ? intCount : floatCount;
        return count + itemFormat.des;
    }
    return `${value}`;
};

const formatCNMoney = (value: number) => {
    return formatMoney(cnMoneyFormat, value);
};

export const Numberf = {
    format: formatMoney,
    formatCNMoney,
};
