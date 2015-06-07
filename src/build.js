({
    /*
     *  TODO 应该有一个模块，require('fun') 返回所有该库的可用功能，比如Fun.Common, Fun.Cache等等
     *  现在做的只是定义了模块的功能和依赖，而没有将所有模块整合，打包之后的代码同样有此问题。可以参考jquery的实现。
     */
    baseUrl: "./app",
    paths: {
        jquery: "empty:"
    },
	optimize: "none",
    name: "fun",
    out: "../lib/fun-library-0.1.js"
})