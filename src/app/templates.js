define([
    './core',
    './common',
    'jquery'
], function (Fun, Common, $) {
    'use strict';

    var initialized = false;
    /**
     * 预编译并保存需要缓存的模板。
     *
     * @exports templates
     */
    var Templates = {
        /**
         * 扫描并缓存带有cache-template属性的模板，并将所有缓存的模板存放到对象上。
         * @public
         */
        init: function (compiler) {
            if (typeof compiler === 'undefined') {
                console.error('Cannot initialize, cause compiler is invalid.');
                return;
            }
            var _this = this;

            if (initialized !== true) {
                console.log('Compiling and caching templates...');
                var scripts = $('script[type="text/template"][cache-template]');
                scripts.each(function (index, item) {
                    var id = item.id;
                    var name = id.replace(/^tpl-/, '');
                    var tpl = compiler(item.innerHTML);
                    _this.add(name, tpl);
                });

                initialized = true;
            }
        },
        /**
         * 检查模板名称是否为有效名称。
         *
         * @private
         * @param {string} name 模板的名称。
         * @return {boolean} 模板名称为有效名称时返回true，否则返回false。
         */
        isValidName: function (name) {
            if (Common.String.isNullOrEmpty(name) === false) {
                var filtered = protectedNames.filter(function (value) {
                    return value === name;
                });
                return filtered.length === 0;
            }
            return false;
        },
        /**
         * 将模板添加到缓存中。
         *
         * @public
         * @param {string} name 模板在缓存中的名称，唯一标识模板。
         * @param {function} tpl 编译模板后的函数。
         */
        add: function (name, tpl) {
            if (this.isValidName(name)) {
                this[name] = tpl;
            }
        },
        /**
         * 将模板从缓存中删除。
         *
         * @public
         * @param {string} name 模板在缓存中的名称。
         */
        remove: function (name) {
            if (this.isValidName(name)) {
                delete this[name];
            }
        }
    };

    var protectedNames = [];
    for (var name in Templates) {
        if (Templates.hasOwnProperty(name)) {
            protectedNames.push(name);
        }
    }

    return (Fun.Templates = Templates);
});
