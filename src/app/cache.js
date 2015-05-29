define(['jquery', '/common'], function ($, Common) {
    'use strict';

    /**
     * 基于localStorage的缓存封装，允许缓存字符串之外的值，通过调用JSON.stringify()将对象序列化为JSON后存放在localStorage中。
     *
     * @class
     * @constructor
     * @param {object} options 配置对象，如果不指定该参数，则使用Cache.defaults默认配置对象。
     * @param {number} options.invalidMilliseconds 缓存项的有效毫秒数。
     * @param {string} options.prefix 缓存键的前缀。
     * @exports cache
     */
    function Cache(options) {
        var opts = $.extend({}, Cache.defaults, options);

        this.options = opts;
    }

    /**
     * 缓存的默认配置，当实例化Cache类不指定config参数时将使用默认配置。
     *
     * @property {number} invalidMilliseconds 缓存项的有效毫秒数，默认为1800000毫秒。
     * @property {string} prefix 缓存键的前缀，默认为'cache.'。
     */
    Cache.defaults = {
        invalidMilliseconds: 30 * 60 * 1000,
        prefix: 'cache.'
    };

    /**
     * 将key与配置的前缀字符串拼接，产生对应在缓存中的键。
     * @param {string} key 除前缀部分以外的缓存键。
     * @param {string=} prefix 可选参数，指定组成键的前缀，优先级高于配置项。
     * @return {string} 返回前缀与key拼接的结果。
     */
    Cache.prototype.compileKey = function (key, prefix) {
        prefix = prefix || this.options.prefix;
        if (Common.String.isNullOrEmpty(prefix) === false) {
            return prefix + key;
        }
        return key;
    };

    /**
     * 通过key获取已缓存的值，缓存过期返回null并会被移除，否则返回缓存的值。
     *
     * @public
     * @param {string} key 缓存的键。
     * @return {Object|null} 被缓存的值，如果缓存过期则返回null。
     */
    Cache.prototype.get = function (key) {
        key = this.compileKey(key);
        if (key in localStorage === true) {
            var value = localStorage.getItem(key);
            if (typeof value !== 'undefined') {
                value = JSON.parse(value);
                if (value.invalidTime !== 0
                    && value.invalidTime < new Date().getTime()
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
     * @param {number} options.invalidMilliseconds 缓存项的有效毫秒数，0为永不过期，设为永不过期的缓存项只能通过调用remove或removeAll清除。
     * @param {string} options.prefix 缓存键的前缀。
     * @return {boolean} 是否成功加入缓存，成功返回true，否则返回false。
     */
    Cache.prototype.set = function (key, value, options) {
        if (typeof key === 'undefined') {
            return false;
        }

        if (options == null) {
            options = {};
        }

        var opts = $.extend({}, this.options, options);
        key = this.compileKey(key, opts.prefix);

        var val = {
            invalidTime: new Date().getTime(),
            obj: value
        };
        // 过期时间无效时不设置。
        if (Number.isNaN(opts.invalidMilliseconds) === false) {
            if (opts.invalidMilliseconds === 0) {
                val.invalidTime = 0;
            }
            else {
                val.invalidTime += opts.invalidMilliseconds;
            }

            localStorage.setItem(key, JSON.stringify(val));
            return true;
        }

        return false;
    };

    /**
     * 从缓存中删除指定项。
     *
     * @public
     * @param {string} key 缓存的键。
     * @return {boolean} 返回(key in window.localStorage)的值。
     */
    Cache.prototype.remove = function (key) {
        key = this.compileKey(key);
        if (key in localStorage === true) {
            localStorage.removeItem(key);
            return (key in localStorage) === false;
        }

        return true;
    };

    /**
     * 从缓存中移除所有与参数匹配的项。
     *
     * @public
     * @param {RegExp=} regexp 一个指定要删除项的正则表达式，如果为null，默认删除所有使用配置的前缀作为开头的缓存。
     * @return {number} 移除项的数量。
     */
    Cache.prototype.removeAll = function (regexp) {
        var removeCount = 0;

        if (typeof regexp === 'undefined') {
            var prefix = this.options.prefix;
            if (Common.String.isNullOrEmpty(prefix) === false) {
                regexp = new RegExp('^' + prefix.replace('.', '\\.') + '.+');
            }
            else {
                return removeCount;
            }
        }

        for (var key in localStorage) {
            if (localStorage.hasOwnProperty(key)
                && regexp.test(key)) {
                localStorage.removeItem(key);
                removeCount += 1;
            }
        }

        return removeCount;
    };

    return Cache;
});
