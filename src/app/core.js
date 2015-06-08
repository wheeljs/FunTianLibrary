/**
 * Created by FunTian on 2015/6/7.
 * @file 导出模块的对象（命名空间），其他所有子模块均扩展该命名空间。
 * @author FunTian
 */
define(function () {
    /**
     * 模块的核心对象，其他子模块都扩展该对象。
     *
     * @type {{version: string}}
     *
     * @exports Fun
     */
    return (window.Fun = {
        version: '0.1.0'
    });
});
