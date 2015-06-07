/**
 * Created by FunTian on 2015/6/7.
 * @file 将模块所有子模块导出为Fun。
 * @author FunTian
 */
define(
    [
        './core',
        './common',
        './cache',
        './templates',
        './template-helper',
        './ui/ui-base',
        './ui/loader-button'
    ],
    function (Fun) {
        return (window.Fun = Fun);
    }
);
