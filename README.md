# FunTian Library



[1 简介](#1-简介)

[2 工具](#2-工具)

[2.1 概览](#21-概览)
		
[2.2 common](#22-common)
	
[2.3 cache](#23-cache)

[2.4 ui-base](#24-ui-base)

[2.5 loader-button](#25-loader-button)

[2.6 templates](#26-templates)

[2.7 template-helper](#27-template-helper)
		



## 1 简介

该项目主要用来将开发中常用的库和工具进行封装。
（现仅）支持使用基于 `AMD` 模块规范的 `requirejs` 作为加载器。
项目中部分工具依赖第三方库实现，具体请查看 [工具](#2-工具) 部分。




## 2 工具



### 2.1 概览

该项目主要包含以下工具，如不指明，则文件名即 AMD 模块名称：

- [common.js](#22-common): 包含部分通用的对象和方法。

- [cache.js](#23-cache): 依赖jquery。基于 `localStorage` 的面向简单对象的缓存工具。

- [ui/ui-base.js](#24-ui-base): 依赖jquery, `common`。UI组件基础类，所有UI组件继承自该类。

- [ui/loader-button.js](#25-loader-button): 继承自UIBase类。使按钮具有状态，可以指定不同状态具有的类样式和文字。

- [templates.js](#26-templates): 依赖jquery, `common`。在初始化时通过指定编译器编译并缓存带有 `[cache-template]` 属性的模板。

- [template-helper.js](#27-template-helper): 依赖 `common`。管理模板内常用方法。



### 2.2 common

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



### 2.3 cache

`export`: `function Cache() {}`

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



### 2.4 ui-base

`namespace`: `ui/`

`export`: `function UIBase() {}`

UI组件的基类，所有UI组件均继承该类。定义常用的UI方法。

#### 方法

`constructor()`: 空构造函数，不应该调用该函数生成UIBase的实例，因为这毫无意义。

`mergeOptions(deepCopy, source, ...others)`: 将others合并到source，并将合并结果设置到实例的options属性，deepCopy指定了是否为深拷贝。子类构造函数中调用该方法合并用户配置和默认配置。

`fire(event, data)`: 触发事件，data指定了事件的数据。如果在配置对象中提供了键为 `on*` 的回调函数，则调用回调函数；否则调用对象持有元素的 `trigger` 方法。

`Object getOptions()`: 获取当前实例的配置对象。



### 2.5 loader-button

`namespace`: `ui/`

`export`: `function LoaderButton() {}` 

继承自 `UIBase`，可以切换状态的按钮。

##### 示例

```javascript
var LoaderButton = require('ui/loader-button');

var loginButton = new LoaderButton($('#js-login-button'), {
	// 默认配置项定义在LoaderButton.defaults中
	type: LoaderButton.Types.ALL, // 指定状态更改时切换的类型（仅文字、仅图标或全部）
	configure: { // 配置状态对应的结果，当切换类型不为全部时，只需要配置对应的项
		1: {
			iconClass: 'icon-save',
			text: 'Click to load'
		},
		2: {
			iconClass: 'icon-spinner icon-spin',
			text: 'Loading'
		},
		4: {
			iconClass: 'icon-ok',
			text: 'Finish'
		}
	}
});
```



### 2.6 templates

`export`: `Templates {...}`

管理模板的缓存和预编译。


##### 示例

使用Underscore作为模板引擎支持。

传统方式：
```html
<script type="text/template" id="tpl-hello">
	<h1>Hello {{name}}.</h1>
</script>
```

```javascript
_.template($('#tpl-hello').html())({name: 'Mike'});
```

缓存模板：
```html
<script type="text/template" id="tpl-hello" cache-template>
<!-- 必须设置type="text/template"和cache-template	 -->
	<h1>Hello {{name}}.</h1>
</script>
```

```javascript
var Templates = require('templates');
Templates.init(_.template);// 已经将模板缓存

// ...

Templates['hello']({name: 'John'}); // 多次调用，模板从缓存中获取。
```



### 2.7 template-helper

`export`: `TemplateHelper {...}`

存储模板中的常用方法。


##### 示例

使用Underscore作为模板引擎。

```html
<script type="text/template" id="tpl-telephone" cache-template>
    <span style="font-size: 1.25em">Telephone: {%=TemplateHelper.Phone.hideMiddle('13112345678') %}.</span><br/>
</script>
```

```javascript
// 注册函数，将逻辑与模板分离
TemplateHelper.register('Phone', 'hideMiddle', function (phone) {
	return phone.replace(/^(1\d{2})(\d{4})(\d{4})$/, '$1****$3');
});

// 注册变量，该变量可以在所有模板中使用
TemplateHelper.register('System', 'debugMode', true);

// ...
_.template(source)({
	TemplateHelper: TemplateHelper
});
```

<span style="font-size: 1.25em">Telephone: 131****5678.</span>