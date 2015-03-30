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
