/**
 * Created by FunTian on 2015/6/7.
 * @file 导出模块的对象（命名空间），其他所有子模块均扩展该命名空间。
 * @author FunTian
 */
define('core',[],function () {
    /**
     * 模块的核心对象，其他子模块都扩展该对象。
     *
     * @type {{version: string}}
     *
     * @exports Fun
     */
    return {
        version: '0.1.0'
    };
});

define('common',['./core'], function (Fun) {
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

define('cache',[
    './core',
    './common',
    'jquery'
], function (Fun, Common, $) {
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

    return (Fun.Cache = Cache);
});

define('templates',[
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

define('template-helper',[
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

/**
 * @file UI组件的基类，包含部分使用的方法。所有UI组件都继承自该类。
 * @author FunTian
 */
//(function (window, Fun, undefined) {
define('ui/ui-base',[
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

/**
 * @file 允许切换状态并对不同状态做出不同响应的按钮。
 * @author FunTian
 */
//(function (window, Fun, undefined) {
define('ui/loader-button',[
    '../core',
    '../common',
    './ui-base',
    'jquery'
], function (Fun, Common, UIBase, $) {
    'use strict';

    /**
     * 可以切换状态的按钮。
     *
     * @class
     * @extends ui-base
     * @exports loader-button
     * @param element {*} 允许切换状态的按钮。
     * @param options {Object} 实例化按钮的配置项。
     * @param options.initState {LoaderButton.State} 按钮的初始状态。
     * @param options.type {LoaderButton.Types} 按钮的切换方式。当切换方式含有图标时，建议使用Font-Awesome图标库。
     * @param options.configure {Map.<LoaderButton.Configure>}
     * @param options.onLoadExecute {Function():$.Deferred} 在状态为LOADING时执行的函数，必须返回一个$.Deferred对象。
     */
    function LoaderButton(element, options) {
        // 调用父类方法合并选项
        this.mergeOptions(true, {}, LoaderButton.defaults, options);

        var _this = this;
        var opts = this.options;

        if (this instanceof Window === true) {
            return new LoaderButton(element, options);
        }

        // 处理type=LoaderButton.Types.TEXT时覆盖图标的问题
        if (opts.type === LoaderButton.Types.TEXT) {
            var conf = $.extend(true, {}, opts.configure);

            var $icon = element.find('[btn-icon],[class*="icon-"]');
            var cls = $icon.attr('class');
            $.each(conf, function (index, item) {
                item.iconClass = cls;
            });
            opts.configure = conf;
        }

        if (element.is('[binding]') === false) {
            element.on('click', function () {
                var state = _this._state;
                var newState = state;

                switch (state) {
                    case LoaderButton.State.NORMAL:
                        newState = LoaderButton.State.LOADING;
                        break;

                    case LoaderButton.State.FINISHED:
                        newState = LoaderButton.State.NORMAL;
                        break;
                }

                _this.setState(newState);

                if (_this._state === LoaderButton.State.LOADING
                    && _this._proxyPromise == null) {
                    var promise = _this.options.onLoadExecute();
                    promise.always(function () {
                        _this.setState(LoaderButton.State.FINISHED);
                        _this._proxyPromise = null;
                    });
                    _this._proxyPromise = promise;
                }
                else {

                }
            }).attr('binding', true);
        }
        this.$el = element;
        this.setState(opts.initState, {
            triggerBefore: false,
            triggerAfter: false,
            render: false
        });
        this.init();
    }

    /**
     * 按钮状态的枚举。
     *
     * @readonly
     * @enum {number}
     */
    LoaderButton.State = {
        /**
         * 按钮状态为正常。
         */
        NORMAL: 1,
        /**
         * 按钮状态为加载中。
         */
        LOADING: 2,
        /**
         * 按钮状态为已完成。
         */
        FINISHED: 4
    };

    /**
     * 按钮的切换类型，分为仅图标、仅文字和全部。
     *
     * @readonly
     * @enum {number}
     */
    LoaderButton.Types = {
        /**
         * 按钮的视图类型为图标。
         */
        ICON: 1,
        /**
         * 按钮的视图类型为图标。
         */
        TEXT: 2,
        /**
         * 按钮的视图类型为图标和文字。
         */
        ALL: 3
    };

    Common.extend(LoaderButton, UIBase);

    /**
     * 初始化按钮为指定的状态。
     *
     * @public
     */
    LoaderButton.prototype.init = function () {
        var $el = this.$el;
        var opts = this.options;
        var cache = $el.clone();
        var cfg = opts.configure[opts.initState];

        var $icon = $('<span>').attr('btn-icon', '');
        // 将Button中的文字使用span包裹。
        var $text = $('<span>').attr('btn-text', '');
        $text.text($el.text());
        $el.empty()
            .append($icon)
            .append(' ')
            .append($text);

        this.render(cfg);

        this.fire('initialized', {});
    };

    /**
     * 获得当前状态对应的配置对象。
     *
     * @public
     * @return {LoaderButton.Configure} 当前状态对应的配置对象。
     */
    LoaderButton.prototype.getStateConfigure = function () {
        return this.options.configure[this._state];
    };

    /**
     * 根据配置重新渲染Button的样式。
     *
     * @private
     * @param configure {LoaderButton.Configure} 样式配置文件。
     */
    LoaderButton.prototype.render = function (configure) {
        var type = this.options.type;
        var $el = this.$el;

        var $icon = $el.find('[btn-icon]');
        var $text = $el.find('[btn-text]');
        if (type === LoaderButton.Types.ICON
            || type === LoaderButton.Types.ALL) {
            $icon.prop('class', configure.iconClass);
        }
        if (type === LoaderButton.Types.TEXT
            || type === LoaderButton.Types.ALL) {
            $text.text(configure.text);
        }

        this.fire('rendered', {});
    };

    /**
     * 设置当前状态，可以指定是否触发相关回调。
     *
     * @private
     * @param {LoaderButton.State} newState 按钮的当前状态。
     * @param {Object=} options 设置状态的相关配置。
     * @param {boolean} options.triggerBefore 是否触发'stateChange'事件。
     * @param {boolean} options.triggerAfter 是否触发'stateChanged'事件。
     * @param {boolean} options.render 是否直接按照当前状态渲染按钮。
     */
    LoaderButton.prototype.setState = function (newState, options) {
        var prevState = this._state;

        if (typeof options === 'undefined') {
            options = {};
        }

        if (options.triggerBefore !== false) {
            this.fire('stateChange', {
                prevState: prevState,
                currentState: newState
            });
        }

        this._state = newState;

        if (options.triggerAfter !== false) {
            this.fire('stateChanged', {
                currentState: newState
            });
        }

        if (options.render !== false) {
            this.render(this.getStateConfigure());
        }
    };

    /**
     * 实例化按钮的默认配置，将和用户配置合并。
     *
     * @property {LoaderButton.State} initState
     * @property {LoaderButton.Types} type
     * @property {Map.<LoaderButton.Configure>} configure
     * @property {Function(): $.Deferred} onLoadExecute
     */
    LoaderButton.defaults = {
        initState: LoaderButton.State.NORMAL,
        type: LoaderButton.Types.ICON,
        configure: (function () {
            var obj = {};

            /**
             * 按钮对应状态的样式配置对象。
             *
             * @type LoaderButton.Configure
             * @property {string=} iconClass
             * @property {string=} text
             */
            obj[LoaderButton.State.NORMAL] = {};
            obj[LoaderButton.State.LOADING] = {};
            obj[LoaderButton.State.FINISHED] = {};

            return obj;
        })(),
        onLoadExecute: function () {
            var defe = $.Deferred(function () {
                setTimeout(function () {
                    defe.resolve();
                }, 2000);
            });
            return defe;
        }
    };

    return (Fun.LoaderButton = LoaderButton);
});

/**
 * Created by FunTian on 2015/6/7.
 * @file 将模块所有子模块导出为Fun。
 * @author FunTian
 */
define(
    'fun',[
        './core',
        './common',
        './cache',
        './templates',
        './template-helper',
        './ui/ui-base',
        './ui/loader-button'
    ],
    function (Fun) {
        return (window.Fun = Fun);
    }
);

