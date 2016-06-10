(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _=exports._={"typeof":function _typeof(target){return Object.prototype.toString.call(target).match(/ \S*/i)[0].replace(" ","").replace("]","").toLowerCase()},browser:function browser(){var result="";var browser=navigator.appVersion;if(window.ScriptEngine||browser.indexOf("Trident")>-1){if(browser.indexOf("MSIE 9.0")>-1)result="IE 9";if(browser.indexOf("MSIE 10.0")>-1||browser.indexOf("Trident/7.0")>-1&&browser.indexOf("rv:11.0")>-1)result="IE Modern";if(browser.indexOf("Edge")>-1)result="Edge"}else if(browser.indexOf("Chrome/")>-1){result="Chrome"}return result},strip:function strip(str,target){return str.replace(new RegExp(""+target,"g"),"")},findFilter:function findFilter(directive){directive=_.strip(directive," ");directive=directive.match(/\|\S*/);if(_.typeof(directive)==="array"&&directive[0])directive=directive[0].replace("|","");return directive},removeFilter:function removeFilter(directive){return directive.substr(0,directive.indexOf("|")-1)}}},{}],2:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.$directivesDataSync=$directivesDataSync;function $directivesDataSync(scope,expr,oldValue,newValue){console.log(scope.$name+"."+expr+" 从 "+oldValue+" 修改为 "+newValue);scope.$directives.forEach(function(directiveObj,index,$directives){return directiveObj.$expr===expr&&directiveObj.$update(newValue)})}},{}],3:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.controller=undefined;var _2=require("../_/_");exports.controller=controller;function controller($lc){"use strict";$lc.controllers={};$lc.controller=function(ctrlName,dependencies,initFunc){if(_2._.typeof(dependencies)!=="array"){initFunc=dependencies;dependencies=[]}$lc.controllers[ctrlName]={$name:ctrlName,$initFunc:initFunc,$dependencies:dependencies}}}},{"../_/_":1}],4:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.directiveMain=undefined;var _internalDirectives=require("./internal-directives");exports.directiveMain=directiveMain;function directiveMain($lc){(0,_internalDirectives.internalDirectives)($lc)}},{"./internal-directives":6}],5:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.directive=undefined;var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _2=require("../_/_");function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function")}}exports.directive=directive;function directive($lc){$lc.directives={};$lc.directive=function(name,options){if(_2._.typeof(name)!=="string"){throw new Error("自定义指令时必须使用字符串作为指令名称.")}$lc.directives["lc-"+name]=function(){function _class(element,scope){_classCallCheck(this,_class);this.$element=element;this.$scope=scope;this.$directiveName="lc-"+name;this.$expr=this.$element.attributes[this.$directiveName].value;options.$init&&options.$init.call(this,this.$element,this.scope);if(options.$done){var _$done=this.$done;_$done.call(this);options.$done.call(this)}else{this.$done.call(this)}if(options.$update){var _$update=this.$update;this.$update=function(){_$update.call(this);options.$update.apply(this,arguments)}}if(options.$destory){var _$destory=this.$destory;this.$destory=function(){_$destory.call(this);options.$destory.apply(this,arguments)}}this.$removeDirective()}_createClass(_class,[{key:"$done",value:function $done(){}},{key:"$update",value:function $update(){}},{key:"$destory",value:function $destory(){}},{key:"$removeDirective",value:function $removeDirective(){this.$element.removeAttribute(this.$directiveName)}}]);return _class}();$lc.directives["lc-"+name].priority=options.priority||1}}},{"../_/_":1}],6:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.internalDirectives=undefined;var _2=require("../_/_");exports.internalDirectives=internalDirectives;function internalDirectives($lc,undefined){$lc.directive("skip",{priority:1e4});$lc.directive("cloak",{priority:0,$done:function $done(){this.$element.removeAttribute(this.$directiveName)}});(function(){$lc.directive("text",{$init:function $init(){setInnterText.call(this)},$update:function $update(newValue){setInnterText.call(this,newValue)}});function setInnterText(value){if(value===undefined){value=this.$scope[this.$expr]||""}if(this.$element.textContent!==undefined){this.$element.textContent=value}else{this.$element.innerText=value}}})();(function(){$lc.directive("html",{$done:func,$update:func});function func(value){if(_2._.typeof(value)==="undefined")value="";this.$element.innerHTML=value}})();$lc.directive("model",{$init:function $init(){var _this=this;var self=this,element=this.$element,scope=this.$scope,imeIgnored=false;this.duplexIgnored=false;$lc.on(element,"compositionstart",function(){imeIgnored=true});$lc.on(element,"compositionend",function(){imeIgnored=false});$lc.on(element,"focus",function(){return _this.duplexIgnored=true});$lc.on(element,"blur",function(){return _this.duplexIgnored=false});element.addEventListener("input",inputEvent,false);if($lc.BROWSER==="IE 9"){$lc.on(element,"cut",function(){return setTimeout(inputEvent,1)});$lc.on(element,"keyup",function(event){event=event||window.event;(event.keyCode===46||event.keyCode===8)&&inputEvent()})}function inputEvent(){if(imeIgnored){return}scope[self.$expr]=element.value}},$update:function $update(newValue){if(this.duplexIgnored)return;this.$element.value=newValue},$done:function $done(){this.$element.value=this.$scope[this.$expr]}});(function(){function initEvent(eventType){this["$"+eventType]=this.$scope[this.$expr];$lc.on(this.$element,eventType,this["$"+eventType])}function updateEvent(eventType,newFunc){$lc.off(this.$element,eventType,this["$"+eventType]);this["$"+eventType]=newFunc;$lc.on(this.$element,eventType,this["$"+eventType])}$lc.directive("mouseenter",{$done:function $done(){initEvent.call(this,"mouseenter")},$update:function $update(newFunc){updateEvent.call(this,"mouseenter",newFunc)}});$lc.directive("mouseleave",{$done:function $done(){initEvent.call(this,"mouseleave")},$update:function $update(newFunc){updateEvent.call(this,"mouseleave",newFunc)}});$lc.directive("mouseover",{$done:function $done(){initEvent.call(this,"mouseover")},$update:function $update(newFunc){updateEvent.call(this,"mouseover",newFunc)}});$lc.directive("mouseout",{$done:function $done(){initEvent.call(this,"mouseout")},$update:function $update(newFunc){updateEvent.call(this,"mouseout",newFunc)}})})();$lc.directive("click",{$init:function $init(){if(this.$expr.indexOf("|")>-1){this.$delegatedElement=_2._.findFilter(this.$expr);this.$expr=_2._.removeFilter(this.$expr);this.$targets=this.$element.querySelectorAll(this.$delegatedElement)}},$done:function $done(){var self=this;if(this.$delegatedElement){this.$clickEvent=function(event){event=window.event||event;var target=event.target||event.srcElement;var targetThis=targetChecking.call(self,target);if(target===self.$element||targetThis===false)return;self.$scope[self.$expr].apply(targetThis,arguments)}}else{this.$clickEvent=function(){self.$scope[self.$expr].apply(this,arguments)}}$lc.on(this.$element,"click",this.$clickEvent)},$update:function $update(newValue){$lc.off(this.$element,"click",this.$clickEvent);var self=this;if(this.$delegatedElement){this.$clickEvent=function(event){event=window.event||event;var target=event.target||event.srcElement;var targetThis=targetChecking.call(self,target);if(target===self.$element||targetThis===false)return;newValue.apply(targetThis,arguments)}}else{this.$clickEvent=function(){newValue.apply(this,arguments)}}$lc.on(this.$element,"click",this.$clickEvent)}})}function targetChecking(target){if(target===this.$element)return false;var found=false;for(var i=0,length=this.$targets.length;i<length;i++){if(target!==this.$targets[i])continue;found=true;return target}if(!found)return targetChecking.call(this,target.parentNode)}},{"../_/_":1}],7:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.domInit=undefined;var _$directivesDataSync=require("../controller/$directives-data-sync");exports.domInit=domInit;function domInit($lc){"use strict";var _loop=function _loop(controller){if(!$lc.controllers.hasOwnProperty(controller))return"continue";(function(){var ctrl=controller;var scope=$lc.controllers[ctrl];if(!scope.$ctrlDoms){scope.$ctrlDoms=document.querySelectorAll("[lc-controller="+scope.$name+"]")}if(!scope.$directives){scope.$directives=[]}scope.$initFunc&&function(){var $dependencies=[];if(scope.$dependencies){scope.$dependencies.forEach(function(dependency,index,dependencies){$dependencies[index]=$lc.controllers[dependency]?$lc.controllers[dependency]:$lc.services[dependency]?$lc.services[dependency]:null})}scope.$initFunc.apply(scope,[scope].concat($dependencies));for(var prop in scope){if(!scope.hasOwnProperty(prop)||prop==="$name"||prop==="$directives"||prop==="$initFunc"||prop==="$ctrlDoms"||prop==="$dependencies"){continue}$lc.observe(scope,prop,null,_$directivesDataSync.$directivesDataSync)}}();var _loop2=function _loop2(i,length){directivesOfCtrl=$lc.getDirectives(scope.$ctrlDoms[i]);if(directivesOfCtrl){directivesOfCtrl.forEach(function(directive,index,directives){if(directive==="lc-cloak")return;$lc.directives[directive]&&new $lc.directives[directive](scope.$ctrlDoms[i])})}initController(scope.$ctrlDoms[i],scope);scope.$ctrlDoms[i].setAttribute("lc-ctrl",scope.$name);scope.$ctrlDoms[i].removeAttribute("lc-controller");scope.$ctrlDoms[i].removeAttribute("lc-cloak")};for(var i=0,length=scope.$ctrlDoms.length;i<length;i++){var directivesOfCtrl;_loop2(i,length)}})()};for(var controller in $lc.controllers){var _ret=_loop(controller);if(_ret==="continue")continue}function initController(ctrlDom,scope){(function initChilden(ctrlChildren){for(var i=0,length=ctrlChildren.length;i<length;i++){var child=ctrlChildren[i];if(child.attributes["lc-controller"]){return}var directiveList=$lc.getDirectives(child);for(var _i=0,_length=directiveList.length;_i<_length;_i++){scope.$directives.push(new $lc.directives[directiveList[_i]](child,scope));if($lc.directives[directiveList[_i]].priority===1e4){break}}if(child.children.length>0){initChilden(child.children)}}})(ctrlDom.children)}}},{"../controller/$directives-data-sync":2}],8:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.initFunc=undefined;var _main=require("./directives/_main");var _main2=require("./service/_main");var _main3=require("./dom-init/_main");exports.initFunc=initFunc;function initFunc($lc){(0,_main.directiveMain)($lc);(0,_main2.serviceMain)($lc);(0,_main3.domInit)($lc)}},{"./directives/_main":4,"./dom-init/_main":7,"./service/_main":10}],9:[function(require,module,exports){"use strict";var _2=require("./_/_");var _main=require("./static-func/_main");var _init=require("./init.js");(function(root,undefined){"use strict";var $lc={};$lc.VERSION="0.0.1";$lc.AUTHOR="LancerComet";$lc.BROWSER=_2._.browser();(0,_main.setStaticFunc)($lc);(function(){$lc.inited=false;$lc.on(window,"DOMContentLoaded",function(){if($lc.inited)return;console.log("Init at DOMContentLoaded");(0,_init.initFunc)($lc);$lc.inited=true});$lc.on(window,"load",function(){if($lc.inited)return;console.log("Init at window.onload");(0,_init.initFunc)($lc);$lc.inited=true});setTimeout(function(){document.readyState==="complete"&&function(){if($lc.inited)return;console.log("Init at readyState = complete");(0,_init.initFunc)($lc);$lc.inited=true}()},1)})();root.LancerFrame=root.$lc=$lc})(window)},{"./_/_":1,"./init.js":8,"./static-func/_main":13}],10:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.serviceMain=serviceMain;var _service=require("./service");var _internalService=require("./internal-service");function serviceMain($lc){(0,_service.service)($lc);(0,_internalService.internalSerivces)($lc)}},{"./internal-service":11,"./service":12}],11:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.internalSerivces=internalSerivces;function internalSerivces($lc){(function(){if(!window.Promise)return;$lc.service("$q",function(){return function(asyncFunc){return new Promise(function(resolve,reject){asyncFunc&&asyncFunc(resolve,reject)})}})})();$lc.service("$http",function(){return{get:function get(url,data){},post:function post(url,data){},jsonp:function jsonp(url,data,callbackName,callback){}}})}},{}],12:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.service=service;function service($lc){$lc.services={};$lc.service=function(name,initFunc){$lc.services[name]=initFunc()}}},{}],13:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.setStaticFunc=undefined;var _observe=require("./observe");var _controller=require("../controller/controller");var _directive=require("../directives/directive");var _getDirectives=require("./get-directives");var _css=require("./css");var _onOff=require("./on-off");exports.setStaticFunc=staticFunc;function staticFunc($lc){(0,_observe.observe)($lc);(0,_controller.controller)($lc);(0,_directive.directive)($lc);(0,_getDirectives.getDirectives)($lc);(0,_css.css)($lc);(0,_onOff.on)($lc);(0,_onOff.off)($lc)}},{"../controller/controller":3,"../directives/directive":5,"./css":14,"./get-directives":15,"./observe":16,"./on-off":17}],14:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.css=css;function css($lc){$lc.css=function(element,prop,value){if(element.style.prop===undefined)return;element.style.prop=value}}},{}],15:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.getDirectives=getDirectives;function getDirectives($lc){$lc.getDirectives=function(element){var directiveList=[];for(var i=0,length=element.attributes.length;i<length;i++){var directiveName=element.attributes[i].name;if(directiveName.indexOf("lc-")<0){continue}if($lc.directives[directiveName]){directiveList.push(directiveName)}}for(var sortTime=0,_length=directiveList.length;sortTime<_length;sortTime++){for(var _i=0;_i<_length;_i++){if(_i===_length-1)continue;if($lc.directives[directiveList[_i]].priority<$lc.directives[directiveList[_i+1]].priority){var swap=directiveList[_i];directiveList[_i]=directiveList[_i+1];directiveList[_i+1]=swap}}}return directiveList}}},{}],16:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.observe=observe;var _2=require("../_/_");function observe($lc){(function(undefined){$lc.observe=function(obj,prop,getCallback,setCallback){var propKey=prop,propValue=obj[prop],oldValue=obj[prop],newValue=null;if(propValue===undefined){console.error("不存在监听属性 "+prop+".");return}if(getCallback&&_2._.typeof(getCallback)!=="function"){console.error(errorText("getCallback"));return}if(setCallback&&_2._.typeof(setCallback)!=="function"){console.error(errorText("setCallback"));return}Object.defineProperty(obj,propKey,{get:function get(){getCallback&&getCallback(oldValue,newValue);return propValue},set:function set(newVal){oldValue=propValue;newValue=newVal;propValue=newValue;setCallback&&setCallback(obj,propKey,oldValue,newValue)}})}})()}function errorText(type){return"$lc.observe 注册 "+type+" 时类型必须为 Function."}},{"../_/_":1}],17:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.on=on;exports.off=off;function on($lc){$lc.on=function(element,eventType,eventHanler,useCapture){if(element.addEventListener){element.addEventListener(eventType,eventHanler,useCapture||false)}else if(element.attachEvent){element.attachEvent("on"+eventType,eventHanler)}else{element["on"+eventType]=eventHanler}}}function off($lc){$lc.off=function(element,eventType,eventHanler,useCapture){if(element.removeEventListener){element.removeEventListener(eventType,eventHanler,useCapture||false)}else if(element.detachEvent){element.detachEvent("on"+eventType,eventHanler)}else{element["on"+eventType]=null}}}},{}]},{},[9]);
//# sourceMappingURL=LancerFrame.js.map
