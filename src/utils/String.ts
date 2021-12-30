/* eslint-disable */
const format = (str: string, args: any[] | Object) => {
    if (!args || !str) return str;
    var reg: RegExp;
    if (args instanceof Array) {
        for (let i = 0; i < args.length; i++) {
            reg = new RegExp("({)" + i + "(})", "g");
            str = str.replace(reg, args[i]);
        }
    }
    else {
        for (let key in args) {
            reg = new RegExp("({" + key + "})", "g");
            str = str.replace(reg, args[key]);
        }
    }
    return str;
}

const limit = (str: string, maxChar: number, backChar = '..') => {
    if (!str) return str;
    let len = str.length;
    if (len <= maxChar + backChar.length) return str;
    return str.substr(0, Math.min(len, maxChar)) + backChar;
}

const stringify = (obj: any) => {
    if (!obj || typeof (obj) != 'object') return obj + '';
    let str_obj = '';
    for (let key in obj) {
        if (typeof obj[key] == 'function') continue;
        if (str_obj.length) {
            str_obj += "&";
        }
        str_obj += (key + '=' + obj[key]);
    }
    return str_obj;
}

const parseQuery = (str_query: string) => {
    if (!str_query) return {};
    const all = str_query.split('&');
    const result = {};
    for (let item of all) {
        if (!item) continue;
        const arr_item = item.split('=');
        const key = arr_item[0];
        let value = arr_item.length == 1 ? key : arr_item[1];
        result[key] = value;
    }
    return result;
}

const html2ubb = (str: string) => {
    str = str.replace(/<br[^>]*>/ig, '\n');
    str = str.replace(/<p[^>\/]*\/>/ig, '\n');
    str = str.replace(/\son[\w]{3,16}\s?=\s*([\'\"]).+?\1/ig, '');
    str = str.replace(/<hr[^>]*>/ig, '[hr]');
    str = str.replace(/<(sub|sup|u|strike|b|i|pre)>/ig, '[$1]');
    str = str.replace(/<\/(sub|sup|u|strike|b|i|pre)>/ig, '[/$1]');
    str = str.replace(/<(\/)?strong>/ig, '[$1b]');
    str = str.replace(/<(\/)?em>/ig, '[$1i]');
    str = str.replace(/<(\/)?blockquote([^>]*)>/ig, '[$1blockquote]');
    str = str.replace(/<img[^>]*smile=\"(\d+)\"[^>]*>/ig, '[s:$1]');
    str = str.replace(/<img[^>]*src=[\'\"\s]*([^\s\'\"]+)[^>]*>/ig, '[img]$1[/img]');
    str = str.replace(/<a[^>]*href=[\'\"\s]*([^\s\'\"]*)[^>]*>(.+?)<\/a>/ig, '[url=$1]$2[/url]');
    str = str.replace(/<[^>]*?>/ig, '');
    str = str.replace(/&amp;/ig, '&');
    str = str.replace(/&lt;/ig, '<');
    str = str.replace(/&gt;/ig, '>');
    return str;
}

const ubb2html = (str: string) => {
    str = str.replace(/</ig, '&lt;');
    str = str.replace(/>/ig, '&gt;');
    str = str.replace(/\n/ig, '<br />');
    // str = str.replace(/\[code\](.+?)\[\/code\]/ig, function ($1, $2) {
    // 	return phpcode($2)
    // });
    str = str.replace(/\[hr\]/ig, '<hr />');
    str = str.replace(/\[\/(size|color|font|backcolor)\]/ig, '</font>');
    str = str.replace(/\[(sub|sup|u|i|strike|b|blockquote|li)\]/ig, '<$1>');
    str = str.replace(/\[\/(sub|sup|u|i|strike|b|blockquote|li)\]/ig, '</$1>');
    str = str.replace(/\[\/align\]/ig, '</p>');
    str = str.replace(/\[(\/)?h([1-6])\]/ig, '<$1h$2>');
    str = str.replace(/\[align=(left|center|right|justify)\]/ig, '<p align="$1">');
    str = str.replace(/\[size=(\d+?)\]/ig, '<font size="$1">');
    str = str.replace(/\[color=([^\[\<]+?)\]/ig, '<font color="$1">');
    str = str.replace(/\[backcolor=([^\[\<]+?)\]/ig, '<font style="background-color:$1">');
    str = str.replace(/\[font=([^\[\<]+?)\]/ig, '<font face="$1">');
    str = str.replace(/\[list=(a|A|1)\](.+?)\[\/list\]/ig, '<ol type="$1">$2</ol>');
    str = str.replace(/\[(\/)?list\]/ig, '<$1ul>');
    // str = str.replace(/\[s:(\d+)\]/ig, function ($1, $2) {
    // 	return smilepath($2)
    // });
    str = str.replace(/\[img\]([^\[]*)\[\/img\]/ig, '<img src="$1" border="0" />');
    str = str.replace(/\[url=([^\]]+)\]([^\[]+)\[\/url\]/ig, '<a href="$1">$2</a>');
    str = str.replace(/\[url\]([^\[]+)\[\/url\]/ig, '<a href="$1">$1</a>');
    return str
}

const fillZero = (num: number, len: number) => {
    let result = num + '';
    while (result.length < len) {
        result = '0' + result;
    }
    return result;
}

const arrayBuffer2String = (buf: ArrayBuffer) => {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

const string2ArrayBuffer = (str: string) => {
    var array = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) {
        array[i] = str.charCodeAt(i);
    }
    return array.buffer;
}

export const Stringf = {
    format: format,
    limit: limit,
    stringify: stringify,
    parseQuery: parseQuery,
    html2ubb: html2ubb,
    ubb2html: ubb2html,
    fillZero: fillZero,
    arrayBuffer2String: arrayBuffer2String,
    string2ArrayBuffer: string2ArrayBuffer
}