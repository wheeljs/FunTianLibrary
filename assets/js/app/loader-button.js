/**
 * @file 可以切换状态的按钮，AMD 版本。
 * @author FunTian
 */
define(['jquery'], function ($) {
    'use strict';

    /**
     * 可以切换状态的按钮。
     *
     * @alias window.LoaderButton
     * @class
     * @constructor
     * @param element {*} 允许切换状态的按钮。
     * @param options {Object} 实例化按钮的配置项。
     * @param options.initState {LoaderButton.State} 按钮的初始状态。
     * @param options.type {LoaderButton.Types} 按钮的切换方式。
     * @param options.configure {Map.<LoaderButton.Configure>}
     * @param options.onLoadExecute {Function():$.Deferred} 在状态为LOADING时执行的函数，必须返回一个$.Deferred对象。
     *
     */
    function LoaderButton(element, options) {
        var _this = this;
        var opts = $.extend({}, LoaderButton.defaults, options);

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
                _this._state = newState;
                _this.render(_this.getStateConfigure());

                if (_this._state === LoaderButton.State.LOADING) {
                    var promise = _this.options.onLoadExecute();
                    promise.always(function () {
                        _this._state = LoaderButton.State.FINISHED;
                       _this.render(_this.getStateConfigure());
                    });
                }
            }).attr('binded', true);
        }
        this.$el = element;
        this.options = opts;
        this._state = opts.initState;
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
    };

    /**
     * 获得当前状态对应的配置对象。
     *
     * @public
     * @return {LoaderButton.Configure} 当前状态对应的配置对象。
     */
    LoaderButton.prototype.getStateConfigure = function () {
        var conf = this.options.configure[this._state];

        return conf;
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
        console.log(configure);

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
});