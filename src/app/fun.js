/**
 * Created by FunTian on 2015/6/7.
 * @file 将模块所有子模块导出为Fun。
 * @author FunTian
 */
(function () {
    if (typeof define === 'function' && define.amd) {
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
                return Fun;
            }
        );
    }
})();

