/**
 * Created by Administrator on 2015/3/9.
 */
define(['app/common'], function (Common) {
   'use strict';

    /**
     * 控件的基类，封装了部分公用方法。
     *
     * @abstract
     * @class
     * @exports UIBase
     */
    function UIBase() {

    }

    /**
     * 在对象上触发对象，如果在配置对象中提供了键为`on*`的回调函数，则调用回调函数；否则调用对象持有元素的`trigger`方法。
     *
     * @protected
     * @param {string} event 事件名称。调用回调函数时将首字母大写并添加`on`前缀，调用`trigger`方法时将添加`.ui`后缀。
     * @param {Object=} data 事件的数据。
     */
    UIBase.prototype.dispatch = function (event, data) {
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

    return UIBase;
});