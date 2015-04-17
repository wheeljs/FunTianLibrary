# FunTian Library

---

## 简介

该项目主要用来将开发中常用的库和工具进行封装。
（现仅）支持使用基于 `AMD` 模块规范的 `requirejs` 作为加载器。
项目中部分工具依赖第三方库实现，具体请查看 [工具](#工具) 部分。


## 工具

该项目主要包含以下工具（简单介绍），如不指明，则文件名即 AMD 模块名称：

- cache.js: 依赖jquery。基于 `localStorage` 的面向简单对象的缓存工具。

- common.js: 包含部分通用的对象和方法。

- loader-button.js: 依赖jquery。使按钮具有状态，可以指定不同状态具有的类样式和文字。

- template-helper.js: 依赖common。管理模板内常用方法。

- templates.js: 依赖common, jquery。在初始化时通过指定编译器编译并缓存带有 `[cache-template]` 属性的模板。


## common

该模块 `export` 一个对象，主要包含了常用逻辑方法。

##### 示例

``` javascript
var Common = require('common');
var evt = Common.createEvent('customerEvent', true, true, {
	element: someElement
});  // 创建一个 `Event` 对象并将其初始化，前三个参数与 `Event` 构造函数意义一致，最后一个参数为可选参数，如果该参数有值，则会被设置在返回的 `Event` 实例的 `data` 属性上。

var str1 = 'Hello World';
var str2 = '';
console.log(Common.String.isNullOrEmpty(str1));  // 判断字符串是否为空或者空字符串
// output false
console.log(Common.String.isNullOrEmpty(str2)); // output true
```


## cache

`Cache` 类提供了使用 `localStorage` 管理简单对象的方法，允许指定缓存的过期时间以及缓存前缀。

##### 示例

``` javascript
var Cache = require('cache');
var cache = new Cache({
    invalidMilliseconds: 30 * 60 * 1000, // 缓存项的过期时间，默认为 30 * 60 * 1000 毫秒
    prefix: 'your.prefix.' // 缓存项的前缀，在调用 set 方法设置缓存时与 key 组合成为缓存的键。默认为 cache.
});

cache.set('simple-object', {
	name: 'John',
	age: 73,
	gender: 1
});
// `your.prefix.simple-object` 即在 `localStorage` 中该项对应的键
var obj = cache.get('simple-object'); // 通过键取得缓存项的值，如果缓存过期，将返回 `null`。
console.dir(obj);

cache.remove('simple-object'); // 从缓存中移除该项

cache.set('simple-string-1', 'hello world', {
	invalidMilliseconds: 0
});
cache.set('simple-string-2', 'HELLO WORLD');
cache.set('simple-string-3', 'HeLlO wOrLd');

var cnt = cache.removeAll(/simple-string-\d+/); // 从缓存中移除所有键与表达式匹配的项。参数为空指定前缀的，将构造一个以前缀字符串起始的正则表达式进行匹配，否则不会移除任何项
console.log(cnt); // output 3
```