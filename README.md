# FunTian Library

---

## 简介

该项目主要用来将开发中常用的库和工具进行封装，使用基于 `AMD` 模块规范的 `requirejs` 作为加载器。
项目中部分工具依赖第三方库实现，具体请查看 [工具](#工具) 部分。


## 工具

该项目主要包含以下工具（简单介绍），如不指明，则文件名即 AMD 模块名称：

- cache.js: 依赖jquery。基于 `localStorage` 的缓存工具。

- common.js: 通用工具类。

- loader-button.js: 依赖jquery。使按钮具有状态，不同的状态可以显示不同的图标和文字。

- template-helper.js: 依赖common。模板的帮助方法类。

- templates.js: 依赖common, jquery, underscore。自动编译并缓存需要的模板。



### cache.js

#### 常用 API

`constructor: Cache(options)` 实例化 Cache。

- `{Object} options`: 指定了该实例的配置。
- `{number} options.invalidSeconds`: 每个缓存项的过期时间（秒）。


`get(key): *` 根据缓存的键获得缓存项，如果缓存过期或未被缓存返回null。

- `{string} key`: 缓存的键。
- `return {Object|null}`: 缓存项，缓存过期或未被缓存返回null。

`set(key, value, options): boolean` 根据缓存的键、值设置缓存项，也可以指定本次使用的配置项。

- `{string} key`: 缓存的键。
- `{*} value`: 被缓存的值。
- `{Object=} options`: 本次缓存使用的配置项，优先级高于实例配置。
- `{number} options.invalidSeconds`: 缓存过期时间（秒），`0` 为永不过期。
- `return {boolean}`: 成功加入缓存返回 `true`，否则返回 `false`。


`removeAll(reg): number` 根据正则表达式匹配缓存的键，删除所有匹配的项。

- `{RegExp=} reg`: 匹配的正则表达式。
- `return {number}`: 移除缓存项的数量。
