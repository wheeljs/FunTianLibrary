define(['app/common'], function (Common) {
    'use strict';

    /**
     * 为模板提供帮助方法。
     *
     * @module template-helper
     */
    return {
        /**
         * 根据名称获取相应命名空间对象。
         *
         * @private
         * @param {string} name 命名空间的名称。
         * @return {Object|null} 命名空间对象。
         */
        getNamespace: function (name) {
            var namespace = this[name];
            return namespace;
        },
        /**
         * 设置命名空间对象。
         *
         * @private
         * @param {string} name 命名空间的名称。
         * @param {Object} nsobj 命名空间对象。
         */
        setNamespace: function (name, nsobj) {
            this[name] = nsobj;
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
         */
        unRegister: function (namespace, key) {
            var nsobj = null;
            switch (typeof namespace) {
                case 'string':
                    var nspath = namespace.split(/\./);
                    nsobj = this.getNamespace(nspath[0]);
                    key = nspath[nspath.length - 1];
                    break;
                case 'object':
                    nsobj = namespace;
                    break;
            }

            if (nsobj != null) {
                delete nsobj[key];
            }
        }
    };
});