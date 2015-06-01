/**
 * Created by Fang on 2015/4/21.
 *
 * 在测试文件夹中使requirejs指向正确的路径。
 */
(function (requirejs) {
    if (typeof requirejs !== 'undefined') {
        requirejs.config({
            baseUrl: '../src/',
            paths: {
                jquery: 'jquery-1.9.1.min',
                underscore: '../test/unit/underscore-min'
            }
        });
    }
})(requirejs);
