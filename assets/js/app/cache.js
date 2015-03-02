define(['jquery'], function ($) {
    'use strict';

    /**
     * 基于localStorage的缓存封装，允许缓存字符串之外的值，通过调用JSON.stringify()将对象序列化为JSON后存放在localStorage中。
     *
     * @class
     * @constructor
     * @param {object} options 配置对象，如果不指定该参数，则使用Cache.defaults默认配置对象。
     * @param {number} options.invalidSeconds 缓存过期时间（秒）。
     * @exports cache
     */
    function Cache(options) {
        var opts = $.extend({}, Cache.defaults, options);

        this.options = opts;
    }

    /**
     * 通过key获取已缓存的值，缓存过期返回null并会被移除，否则返回缓存的值。
     *
     * @public
     * @param {string} key 缓存的键。
     * @return {Object|null} 被缓存的值，如果缓存过期则返回null。
     */
    Cache.prototype.get = function (key) {
        if (key in window.localStorage == true) {
            var value = window.localStorage.getItem(key);
            if (value != undefined) {
                value = JSON.parse(value);
                if (value.invalidtime != 0
                    && value.invalidtime < new Date().getTime()
                ) {
                    this.remove(key);
                    return null;
                }

                return value.obj;
            }
        }

        return null;
    };

    /**
     * 设置缓存，key指定了缓存的键，value指定了缓存的值，options指定了本次的配置。
     *
     * @public
     * @param {string} key 缓存的键。
     * @param {*} value 缓存的值。
     * @param {Object=} options 本次设置使用的配置，优先级高于实例的配置。
     * @param {number} options.invalidSeconds 缓存过期时间（分钟），0为永不过期，设为永不过期的缓存项只能通过调用remove或removeAll清除。
     * @return {boolean} 是否成功加入缓存，成功返回true，否则返回false。
     */
    Cache.prototype.set = function (key, value, options) {
        if (key == undefined) {
            return false;
        }

        if (options == undefined) {
            options = {};
        }

        var opts = this.options;

        var val = {
            'invalidtime': new Date().getTime(),
            'obj': value
        };
        if (isNaN(options.invalidSeconds) == false) {
            if (options.invalidSeconds == 0) {
                val.invalidtime = 0;
            }
            else {
                val.invalidtime += (options.invalidSeconds * 1000);
            }
        }
        else {
            val.invalidtime += (opts.invalidSeconds * 1000);
        }

        window.localStorage.setItem(key, JSON.stringify(val));
        return true;
    };

    /**
     * 从缓存中删除指定项。
     *
     * @public
     * @param {string} key 缓存的键。
     * @return {boolean} 返回(key in window.localStorage)的值。
     */
    Cache.prototype.remove = function (key) {
        if (key in window.localStorage == true) {
            window.localStorage.removeItem(key);
            return key in window.localStorage == false;
        }

        return true;
    };

    /**
     * 从缓存中移除所有与参数匹配的项。
     *
     * @public
     * @param {RegExp} reg 确定要移除的项，正则表达式。
     * @return {number} 移除项的数量。
     */
    Cache.prototype.removeAll = function (reg) {
        var removeCount = 0;

        for (var key in window.localStorage) {
            if (window.localStorage.hasOwnProperty(key)) {
                if (reg.test(key) == true) {
                    window.localStorage.removeItem(key);
                    removeCount += 1;
                }
            }
        }

        return removeCount;
    };

    /**
     * 缓存的默认配置，当实例化Cache类不指定config参数时将使用默认配置。
     *
     * 可配置项：
     * <ul>
     *        <li>invalidSeconds：缓存过期时间（秒），默认为1800秒。</li>
     * </ul>
     */
    Cache.defaults = {
        'invalidSeconds': 30 * 60
    };

    return Cache;
});
