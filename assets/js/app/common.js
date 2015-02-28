define(function () {
    'use strict';

    /**
     * 通用的处理方法。
     *
     * @module common
     */
    return {
        /**
         * 创建并初始化事件，可以将数据设置到事件对象上。
         *
         * @public
         * @param {string} eventType 事件类型。
         * @param {boolean} canBubble 指定事件是否可以冒泡。
         * @param {boolean} cancelBubble 指定事件是否可以被取消。
         * @param {Object=} data 事件对象要携带的数据。
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
                return str == undefined || str.length == 0;
            }
        }
    };
});