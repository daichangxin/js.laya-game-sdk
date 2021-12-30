/** 统一获取资源的方法，之前加入了使用资源计数，后来去掉了因为该方法会重复调用所以不准 */
const getRes = (url: string) => {
    return Laya.loader.getRes(url);
};

const load = (url: string | { url: string; type?: string; priority?: number }[]) => {
    return new Promise((resolve, reject) => {
        if (!url) {
            reject();
            return;
        }
        Laya.loader.load(
            url,
            Laya.Handler.create(null, (res) => {
                if (res) {
                    resolve(res);
                } else {
                    reject(res);
                }
            }),
        );
    });
};

export const RES = {
    getRes,
    load,
};
