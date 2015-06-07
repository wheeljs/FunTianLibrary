define(['./core'], function (Fun) {
    'use strict';

    /**
     * 通用的处理方法。
     *
     * @exports common
     */
    Fun.Common = {
        /**
         * 创建并初始化事件，可以将数据设置到事件对象上。
         *
         * @public
         * @param {string} eventType 事件类型。
         * @param {boolean} canBubble 指定事件是否可以冒泡。
         * @param {boolean} cancelBubble 指定事件是否可以被取消。
         * @param {Object=} data 事件对象要携带的数据。
         * @return {Event} 创建并完成初始化的Event对象。
         */
        createEvent: function (eventType, canBubble, cancelBubble, data) {
            var evt = document.createEvent('Events');
            evt.initEvent(eventType, canBubble, cancelBubble);

            if (typeof data !== 'undefined') {
                evt.data = data;
            }

            return evt;
        },
        /**
         * 实现两个类的继承关系，可以使用instanceof运算符进行判断。调用该方法会使用Parent.prototype覆盖Child.prototype，
         * 所以当子类需要添加方法时，请在添加方法之前调用该方法实现继承关系。
         *
         * @public
         * @param {Object} Child 子类。
         * @param {Object} Parent 父类。
         */
        extend: function (Child, Parent) {
            var F = function () {
            };
            F.prototype = Parent.prototype;
            Child.prototype = new F();
            Child.prototype.constructor = Child;
            Child.super = Parent.prototype;
        },
        /**
         * String相关处理。
         *
         * @namespace
         */
        String: {
            /**
             * 判断字符串是否为空字符串。
             *
             * @public
             * @param {string} str 源字符串。
             * @return {boolean} 源字符串为空字符串返回true，否则返回false。
             */
            isNullOrEmpty: function (str) {
                return str == null || str.length === 0;
            }
        }
    };

    return Fun.Common;
});
