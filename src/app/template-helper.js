﻿define([
    './core',
    './common'
], function (Fun, Common) {
    'use strict';

    /**
     * 为模板提供帮助方法。
     *
     * @exports template-helper
     */
    var TemplateHelper = {
        /**
         * 根据名称获取相应命名空间对象。
         *
         * @private
         * @param {string} name 命名空间的名称。
         * @return {Object|null} 命名空间对象。
         */
        getNamespace: function (name) {
            return this[name];
        },
        /**
         * 设置命名空间对象。
         *
         * @private
         * @param {string} name 命名空间的名称。
         * @param {Object} nsobj 命名空间对象。
         */
        setNamespace: function (name, nsobj) {
            if (this.isValidName(name)) {
                this[name] = nsobj;
            }
        },
        /**
         * 删除命名空间及其包含的所有项。
         *
         * @param {string} name 已经存在的命名空间名称。
         * @return {boolean} 删除是否成功。
         */
        removeNamespace: function (name) {
            if (this.getNamespace(name) != null) {
                delete this[name];
            }
            return name in this;
        },
        /**
         * 检查命名空间名称是否为有效名称。
         *
         * @private
         * @param {string} name 模板的名称。
         * @return {boolean} 模板名称为有效名称时返回true，否则返回false。
         */
        isValidName: function (name) {
            if (Common.String.isNullOrEmpty(name) === false) {
                var filtered = methodNames.filter(function (value) {
                    return value === name;
                });
                return filtered.length === 0;
            }
            return false;
        },
        /**
         * 在命名空间中添加一项。
         *
         * @public
         * @param {string} namespace 命名空间的名称。
         * @param {string} key 新增项的键。
         * @param {*} value 新增项。
         */
        register: function (namespace, key, value) {
            if (Common.String.isNullOrEmpty(namespace)
                || Common.String.isNullOrEmpty(key)
            ) {
                return;
            }
            var ns = this.getNamespace(namespace);
            if (ns == null) {
                ns = {};
                this.setNamespace(namespace, ns);
            }

            this._register(ns, key, value);
        },
        /**
         * 在命名空间中添加一项。
         *
         * @private
         * @param {Object} nsobj 命名空间。
         * @param {string} key 新增项的键。
         * @param {*} value 新增项。
         */
        _register: function (nsobj, key, value) {
            nsobj[key] = value;
        },
        /**
         * 从命名空间中移除指定项。
         *
         * @public
         * @param {string|Object} namespace 要移除的项的完整路径（Path.To.Item）或命名空间对象。
         * @param {string=} key 要移除的项的键，如果namespace传递了被移除项的完整路径，该参数可以忽略。
         * @return {boolean} 删除是否成功。
         */
        unRegister: function (namespace, key) {
            var nsobj = null;
            switch (typeof namespace) {
                case 'string':
                    var nspath = namespace.split(/\./);
                    nsobj = this.getNamespace(nspath[0]);
                    if (nspath.length > 1
                        && typeof key === 'undefined') {
                        key = nspath[nspath.length - 1];
                    }
                    break;
                case 'object':
                    nsobj = namespace;
                    break;
            }

            if (nsobj != null) {
                delete nsobj[key];
            }

            return key in nsobj;
        }
    };

    var methodNames = [];
    for (var name in TemplateHelper) {
        if (TemplateHelper.hasOwnProperty(name)) {
            methodNames.push(name);
        }
    }

    return (Fun.TemplateHelper = TemplateHelper);
});
