define(function () {
    'use strict';

    /**
     * 通用的处理方法。
     *
     * @module common
     */
    return {
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