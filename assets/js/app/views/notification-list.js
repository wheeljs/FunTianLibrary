/**
 * Created by Administrator on 2015/3/2.
 */
define(
    [
        'backbone',
        'app/templates'
    ],
    function (Backbone, Templates) {
        return Backbone.View.extend({
            template: Templates['notifications'],
            initialize: function (options) {
                this.options = options;
            },
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