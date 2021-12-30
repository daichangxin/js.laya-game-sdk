module.exports = {
    extends: ['@shm-open/eslint-config-bundle'],
    parserOptions: {
        project: './tsconfig.json',
    },
    rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off', // 启用不强制函数的返回定义
        'no-underscore-dangle': 'off', // 启用局部变量使用下划线
        'no-plusplus': 'off', // 启用++写法
        'no-bitwise': 'off', // 启用位运算
        'import/no-unused-modules': 'off',
        'import/no-cycle': 'off', // 循环引用，TODO 处理并删掉
        'no-continue': 'off', // TODO 处理并删掉
    },
};

// TIPS
// 下一行禁用检查
// eslint-disable-next-line

// 整个文件禁用检查
/* eslint-disable */
