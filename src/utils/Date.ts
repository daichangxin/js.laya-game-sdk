export enum Time {
    /**
     * 一秒
     */
    ONE_SECOND = 1000,
    /**
     * 五秒
     */
    FIVE_SECOND = 5000,
    /**
     * 一分种
     */
    ONE_MINUTE = 60000,
    /**
     * 五分种
     */
    FIVE_MINUTE = 300000,
    /**
     * 半小时
     */
    HALF_HOUR = 1800000,
    /**
     * 一小时
     */
    ONE_HOUR = 3600000,
    /**
     * 一天
     */
    ONE_DAY = 86400000,
}

export const tempDate = new Date();

const _tempDate = new Date();
const format = (pattern: string, time: number) => {
    const d = _tempDate;
    d.setTime(time);

    const o = {
        'M+': d.getMonth() + 1,
        'd+': d.getDate(),
        'h+': d.getHours(),
        'm+': d.getMinutes(), // 分
        's+': d.getSeconds(), // 秒
        'q+': Math.floor((d.getMonth() + 3) / 3), // 季度
        S: d.getMilliseconds(), // 毫秒
    };
    const hasYear = /(y+)/.test(pattern);
    let usePattern = hasYear
        ? pattern.replace(RegExp.$1, `${d.getFullYear()}`.substring(4 - RegExp.$1.length - 1))
        : pattern;
    // eslint-disable-next-line no-restricted-syntax
    for (const k in o) {
        if (new RegExp(`(${k})`).test(usePattern)) {
            usePattern = usePattern.replace(
                RegExp.$1,
                RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length),
            );
        }
    }
    return usePattern;
};

const formatLeft = (pattern: string, time: number) => {
    return format(pattern, time + _tempDate.getTimezoneOffset() * 60000);
};

/** 字符串日期转换为日期毫秒值 */
const parseDate = (strDate: string) => {
    if (!strDate) return 0;
    const reg = /(\d+)/g;
    const arr = strDate.match(reg);
    if (!arr || !arr.length) return 0;
    const year = arr[0] ? parseInt(arr[0], 10) : 0;
    const month = arr[1] ? Math.max(0, parseInt(arr[1], 10) - 1) : 0;
    const date = arr[2] ? Math.max(1, parseInt(arr[2], 10)) : 0;
    const hours = arr[3] ? parseInt(arr[3], 10) : 0;
    const min = arr[4] ? parseInt(arr[4], 10) : 0;
    const sec = arr[5] ? parseInt(arr[5], 10) : 0;

    _tempDate.setFullYear(year, month, date);
    _tempDate.setHours(hours, min, sec);
    return _tempDate.getTime();
};

const parseTime = (strTime: string, withDate?: Date) => {
    const d = _tempDate;
    if (!withDate) {
        d.setTime(Date.now());
    } else {
        d.setFullYear(withDate.getFullYear(), withDate.getMonth(), withDate.getDate());
    }
    const reg = /(\d+)/g;
    const arr = strTime.match(reg);
    const hours = arr[0] ? parseInt(arr[0], 10) : 0;
    const min = arr[1] ? parseInt(arr[1], 10) : 0;
    const sec = arr[2] ? parseInt(arr[2], 10) : 0;
    d.setHours(hours, min, sec);
    return d.getTime();
};

const parseTimeDuration = (strTime: string) => {
    const reg = /(\d+)/g;
    const arr = strTime.match(reg);
    const hours = arr[0] ? parseInt(arr[0], 10) : 0;
    const min = arr[1] ? parseInt(arr[1], 10) : 0;
    const sec = arr[2] ? parseInt(arr[2], 10) : 0;
    return hours * Time.ONE_HOUR + min * Time.ONE_MINUTE + sec * Time.ONE_SECOND;
};

export const Datef = {
    /**
     * 日期格式化
     * ("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
     * ("yyyy-M-d h:m:s.S")  ==> 2006-7-2 8:9:4.18
     */
    format,
    formatLeft,
    parseDate,
    parseTime,
    parseTimeDuration,
};
