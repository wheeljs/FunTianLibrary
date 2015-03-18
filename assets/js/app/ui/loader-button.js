/**
 * @file 允许切换状态并对不同状态做出不同响应的按钮。
 * @author FunTian
 */
define(
    [
        'jquery',
        'app/common',
        'app/ui/ui-base'
    ],
    function ($, Common, UIBase) {
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

            if (this instanceof Window == true) {
                return new LoaderButton(options);
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

            if (element.is('[binded]') === false) {
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
                    _this.render(_this.getStateConfigure());

                    if (_this._state === LoaderButton.State.LOADING
                        && _this._proxyPromise == null) {
                        var promise = _this.options.onLoadExecute();
                        promise.always(function () {
                            _this.setState(LoaderButton.State.FINISHED);
                            _this._proxyPromise = null;
                           _this.render(_this.getStateConfigure());
                        });
                        _this._proxyPromise = promise;
                    }
                    else {

                    }
                }).attr('binded', true);
            }
            this.$el = element;
            this.setState(opts.initState, {
                triggerBefore: false,
                triggerAfter: false
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

            this.dispatch('initialized', {});
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

            this.dispatch('rendered', {});
        };

        /**
         * 设置当前状态，可以指定是否触发相关回调。
         *
         * @private
         * @param {LoaderButton.State} newState 按钮的当前状态。
         * @param {Object} options 设置状态的相关配置。
         * @param {boolean} options.triggerBefore 是否触发'stateChange'事件。
         * @param {boolean} options.triggerAfter 是否触发'stateChanged'事件。
         */
        LoaderButton.prototype.setState = function (newState, options) {
            var prevState = this._state;

            if (typeof options === 'undefined') {
                options = {};
            }

            if (options.triggerBefore !== false) {
                this.dispatch('stateChange', {
                    prevState: prevState,
                    currentState: newState
                });
            }

            this._state = newState;

            if (options.triggerAfter !== false) {
                this.dispatch('stateChanged', {
                    currentState: newState
                })
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
                 * @param {string=} iconClass
                 * @param {string=} text
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

        return LoaderButton;
    }
);