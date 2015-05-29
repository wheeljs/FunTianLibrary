define("app/common",[],function(){"use strict";return{createEvent:function(e,t,n,r){var i=document.createEvent("Events");return i.initEvent(e,t,n),typeof r!="undefined"&&(i.data=r),i},extend:function(e,t){var n=function(){};n.prototype=t.prototype,e.prototype=new n,e.prototype.constructor=e,e.super=t.prototype},String:{isNullOrEmpty:function(e){return e==null||e.length===0}}}}),define("app/ui/ui-base",["jquery","../src/app/common"],function(e,t){"use strict";function r(){}var n=[].slice;return r.prototype.mergeOptions=function(t,r,i){var s=n.apply(arguments);s.shift(),this.options=e.extend.apply(e,[t,{}].concat(s))},r.prototype.fire=function(e,n){typeof n=="undefined"&&(n={});if(t.String.isNullOrEmpty(e)===!1){var r=this.getOptions(),i=e[0].toUpperCase().concat(e.substr(1)),s=r["on"+i];typeof s=="function"?s.call(this,n):typeof this.$el.trigger=="function"&&this.$el.trigger(e+".ui",n)}},r.prototype.getOptions=function(){return this.options},r}),define("app/ui/loader-button",["jquery","../src/app/common","../src/app/ui/ui-base"],function(e,t,n){"use strict";function r(t,n){this.mergeOptions(!0,{},r.defaults,n);var i=this,s=this.options;if(this instanceof Window==1)return new r(t,n);if(s.type===r.Types.TEXT){var o=e.extend(!0,{},s.configure),u=t.find('[btn-icon],[class*="icon-"]'),a=u.attr("class");e.each(o,function(e,t){t.iconClass=a}),s.configure=o}t.is("[binding]")===!1&&t.on("click",function(){var e=i._state,t=e;switch(e){case r.State.NORMAL:t=r.State.LOADING;break;case r.State.FINISHED:t=r.State.NORMAL}i.setState(t);if(i._state===r.State.LOADING&&i._proxyPromise==null){var n=i.options.onLoadExecute();n.always(function(){i.setState(r.State.FINISHED),i._proxyPromise=null}),i._proxyPromise=n}}).attr("binding",!0),this.$el=t,this.setState(s.initState,{triggerBefore:!1,triggerAfter:!1,render:!1}),this.init()}return r.State={NORMAL:1,LOADING:2,FINISHED:4},r.Types={ICON:1,TEXT:2,ALL:3},t.extend(r,n),r.prototype.init=function(){var t=this.$el,n=this.options,r=t.clone(),i=n.configure[n.initState],s=e("<span>").attr("btn-icon",""),o=e("<span>").attr("btn-text","");o.text(t.text()),t.empty().append(s).append(" ").append(o),this.render(i),this.fire("initialized",{})},r.prototype.getStateConfigure=function(){return this.options.configure[this._state]},r.prototype.render=function(e){var t=this.options.type,n=this.$el,i=n.find("[btn-icon]"),s=n.find("[btn-text]");(t===r.Types.ICON||t===r.Types.ALL)&&i.prop("class",e.iconClass),(t===r.Types.TEXT||t===r.Types.ALL)&&s.text(e.text),this.fire("rendered",{})},r.prototype.setState=function(e,t){var n=this._state;typeof t=="undefined"&&(t={}),t.triggerBefore!==!1&&this.fire("stateChange",{prevState:n,currentState:e}),this._state=e,t.triggerAfter!==!1&&this.fire("stateChanged",{currentState:e}),t.render!==!1&&this.render(this.getStateConfigure())},r.defaults={initState:r.State.NORMAL,type:r.Types.ICON,configure:function(){var e={};return e[r.State.NORMAL]={},e[r.State.LOADING]={},e[r.State.FINISHED]={},e}(),onLoadExecute:function(){var t=e.Deferred(function(){setTimeout(function(){t.resolve()},2e3)});return t}},r}),require.config({paths:{backbone:"backbone-min",jquery:"jquery-1.9.1.min",underscore:"underscore-min"}}),require(["jquery","../src/app/ui/loader-button"],function(e,t){var n=new t(e("#js-all-button"),{type:t.Types.ALL,configure:{1:{iconClass:"icon-save",text:"Click to load"},2:{iconClass:"icon-spinner icon-spin",text:"Loading"},4:{iconClass:"icon-ok",text:"Finish"}},onInitialized:function(e){console.group("options.onInitialize"),console.dir(e),console.groupEnd("options.onInitialize")},onStateChange:function(e){console.group("options.onStateChange"),console.dir(e),console.groupEnd("options.onStateChange")},onStateChanged:function(e){console.group("options.onStateChanged"),console.dir(e),console.groupEnd("options.onStateChanged")}})}),define("main",function(){});