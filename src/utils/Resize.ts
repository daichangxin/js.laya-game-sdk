export interface IResize {
    resize: (width: number, height: number) => void;
}

let _width: number;
let _height: number;
let _safeY: number;
// 屏幕缩放比
let _showAllScale: number;
const _all: IResize[] = [];

const add = (target: IResize) => {
    if (_all.indexOf(target) !== -1) return;
    _all.push(target);
    target.resize(_width, _height);
};

const remove = (target: IResize) => {
    const i = _all.indexOf(target);
    if (i === -1) return;
    _all.splice(i, 1);
};

const resize = (width: number, height: number) => {
    if ((_width === width && _height === height) || width === 0 || height === 0) return;
    _width = width;
    _height = height;

    // 安全区域使用16:9来计算
    const { designWidth, designHeight } = Laya.stage;
    // const safeH = Math.max(designHeight, Math.min(height, width * 16 / 9));
    // 计算当前像素比是 ?:9
    const pixelScaleH = Math.ceil((height / 750) * 9);
    // 安全区域使用的像素比，最低16，最高使用设备的像素比减去2, 作为计算留海高度
    const safePixelScaleH = Math.max(16, pixelScaleH - 2);
    let safeH = Math.max(designHeight, Math.min(height, (width * safePixelScaleH) / 9));
    safeH = Math.round(safeH);
    _safeY = Math.max(0, Math.round((height - safeH) * 0.5));

    // 计算缩放比
    // 屏幕比较长，缩放比一律为1
    if (height / width > designHeight / designWidth) {
        _showAllScale = 1;
    } else {
        _showAllScale = height / designHeight;
    }
    _all.forEach((item) => {
        item.resize(width, height);
    });
};

export const Resize = {
    add,
    remove,
    resize,
    getSafeY: () => {
        return _safeY;
    },
    getWidth: () => {
        return _width;
    },
    getHeight: () => {
        return _height;
    },
    getShowAllScale: () => {
        return _showAllScale;
    },
};
