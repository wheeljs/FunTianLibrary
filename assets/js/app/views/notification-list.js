/**
 * Created by Administrator on 2015/3/2.
 */
define(
    [
        'backbone',
        'app/templates'
    ],
    function (Backbone, Templates) {
        /**
         * 通知列表视图，仅作AMD Demo使用。
         *
         * @module NotificationList
         */
        return Backbone.View.extend({
            template: Templates['notifications'],
            /**
             * 初始化视图时会调用该方法。
             *
             * @protected
             * @param {Object} options 初始化视图的选项。
             * @param {Object} options.data 渲染视图使用到的数据。
             */
            initialize: function (options) {
                this.options = options;
            },
            /**
             * 渲染视图。
             *
             * @public
             * @returns {NotificationList}
             */
            render: function () {
                var options = this.options;
                var data = options.data;

                if (typeof data === 'undefined') {
                    data = {
                        name: 'Tester'
                    };
                }

                this.$el.html(this.template(data));

                return this;
            }
        });
    }
);