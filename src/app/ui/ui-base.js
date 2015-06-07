/**
 * @file UI组件的基类，包含部分使用的方法。所有UI组件都继承自该类。
 * @author FunTian
 */
//(function (window, Fun, undefined) {
define([
    '../core',
    '../common',
    'jquery'
], function (Fun, Common, $) {
    'use strict';

    var mSlice = [].slice;

    /**
     * 控件的基类，封装了部分公用方法。
     *
     * @abstract
     * @class
     * @exports ui-base
     */
    function UIBase() {
    }

    /**
     * 合并所有参数，并设置实例的`options`属性。第一个参数指定了是否是深拷贝。
     *
     * @protected
     * @param {boolean} deepCopy 指定了是否进行深拷贝。
     * @param {Object=} source 源对象。
     * @param {...Object} others 将要合并到源对象的对象。
     */
    UIBase.prototype.mergeOptions = function (deepCopy, source, others) {
        var opts = mSlice.apply(arguments);
        opts.shift();
        this.options = $.extend.apply($, [deepCopy, {}].concat(opts));
    };

    /**
     * 在对象上触发对象，如果在配置对象中提供了键为`on*`的回调函数，则调用回调函数；否则调用对象持有元素的`trigger`方法。
     *
     * @protected
     * @param {string} event 事件名称。调用回调函数时将首字母大写并添加`on`前缀，调用`trigger`方法时将添加`.ui`后缀。
     * @param {Object=} data 事件的数据。
     */
    UIBase.prototype.fire = function (event, data) {
        if (typeof data === 'undefined') {
            data = {};
        }

        if (Common.String.isNullOrEmpty(event) === false) {
            // 触发事件
            var opts = this.getOptions();
            var evtName = event[0].toUpperCase().concat(event.substr(1));
            var callback = opts['on' + evtName];

            if (typeof callback === 'function') {
                callback.call(this, data);
            }
            else if (typeof this.$el.trigger === 'function') {
                this.$el.trigger(event + '.ui', data);
            }
        }
    };

    /**
     * 获得配置对象。
     *
     * @public
     * @returns {Object|null} 返回当前示例的配置对象。
     */
    UIBase.prototype.getOptions = function () {
        return this.options;
    };

    return (Fun.UIBase = UIBase);
});
