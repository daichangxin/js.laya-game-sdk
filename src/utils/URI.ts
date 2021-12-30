const addQueryStr = (url: string, strQuery: string) => {
    if (!url) return `?${strQuery}`;
    const newUrl = url + (url.indexOf('?') === -1 ? '?' : '&');
    return newUrl + strQuery;
};

const addQuery = (url: string, key: string, value: string) => {
    return addQueryStr(url, `${key}=${value}`);
};

export const URLUtils = {
    addQuery,
    addQueryStr,
};
