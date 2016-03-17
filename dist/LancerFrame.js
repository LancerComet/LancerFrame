(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 *  LancerFrame directive common functions By LancerComet at 15:11, 2016.03.05.
 *  # Carry Your World #
 *  ---
 *  指令模块通用函数文件.
 */

module.exports = {
    syncData: syncData
};

// Definition: 数据绑定函数.
// 将在 getter / setter 中调用以进行如 lc-model、lc-text 等指令的数据同步.
function syncData (ctrlName, key, newValue) {

    // 获取所有控制器节点.
    var ctrlDom = document.querySelectorAll("[lc-controller=" + ctrlName + "]");

    // 循环控制器节点.
    for (var i = 0, length = ctrlDom.length; i < length; i++) {

        // 在每个控制器节点中初始化各指令.
        (function bindData(children) {
            for (var i = 0, length = children.length; i < length; i++) {
                var child = children[i];

                if (!child.attributes["lc-text"] && !child.attributes["lc-model"]) {
                    child.children.length > 0 && bindData(child.children);
                    continue;
                }

                // 开始初始化指令.
                (child.attributes["lc-text"] && child.attributes["lc-text"].value === key) && lcText(child, newValue);
                (child.attributes["lc-model"] && child.attributes["lc-model"].value === key) && lcModel(child, newValue);
            }
        })(ctrlDom[i].children);

    }

    // TODO: 观察在函数中创建函数是否引起内存溢出问题.
    // 进行 lc-text 的数据绑定.
    function lcText (target, newValue) {
        target.innerText = newValue;
    }
    
    
    // 进行 lc-model 的数据绑定.
    function lcModel (target, newValue) {
        target.value = newValue;
    }

}

function findChildren (parent, attr, value) {
    var children = parent.children;
    var result = [];

     for (var i = 0, length = children.length; i < length; i++) {
         var child = children[i];
         
         // 如果匹配到了 attr = value.
         console.log(child.attributes[attr] ? child.attributes[attr].value : "no this attr")
         if (child.attributes[attr] && child.attributes[attr].value === value) {
             result.push(child);
         }
         
         if (child.children.length) {
             result = result.concat(findChildren(child, attr, value));
         }
         
     }
     
     return result;     
}
},{}],2:[function(require,module,exports){
/*
 *  LancerFrame Click directive By LancerComet at 2:11, 2016.03.06.
 *  # Carry Your World #
 *  ---
 *  lc-click 指令模块.
 */

module.exports = function bindLcClick (elements, scopeObj) {
    for (var i = 0, length = elements.length; i < length; i++) {
        var element = elements[i];
        
        if (!element.attributes["lc-click"]) {
            element.children.length && bindLcClick(element.children, scopeObj);
            continue; 
        }
        
        var clickEvent = scopeObj[element.attributes["lc-click"].value];
        element.addEventListener("click", clickEvent, false);
        
    }
}
},{}],3:[function(require,module,exports){
/*
 *  LancerFrame Model directive By LancerComet at 15:10, 2016.03.05.
 *  # Carry Your World #
 *  ---
 *  lc-model 指令模块.
 */

// Definition: lc-model 指令绑定.
module.exports = function bindLcModel (children, scopeObj) {    
    for (var i = 0, length = children.length; i < length; i++) {
        var child = children[i];
        
        if (!child.attributes["lc-model"]) {
            child.children.length > 0 && bindLcModel(child.children, scopeObj);
            continue;
        }
            
        var keyName = child.attributes["lc-model"].value;
        child.value = scopeObj[keyName] ? scopeObj[keyName] : "";
        
        // OnInput 时候进行双向数据绑定.
        // Windows 8 的 IE11 下存在输入法无法输入中文的问题, 这里使用 KeyUp 加清理计时器的方式进行.
        var ua = navigator.userAgent;
        var exp = /Windows NT 6.3.*.Trident\/7.0/;
        if (ua.match(exp)) {
            var inputTimeout = null;
            child.addEventListener("keydown", function (event) {
                clearTimeout(inputTimeout);
                inputTimeout = setTimeout(function () {
                    var target = event.target || event.srcElement;
                    scopeObj[keyName] = target.value;
                }, 200);
            });
        } else {
            child.addEventListener("input", function (event) {
                console.log(event)
                var target = event.target || event.srcElement;
                console.log(scopeObj);
                console.log(keyName)
                scopeObj[keyName] = target.value;
            }, false);
        }


    }
};
},{}],4:[function(require,module,exports){
/*
 *  LancerFrame Text directive By LancerComet at 15:03, 2016.03.05.
 *  # Carry Your World #
 *  ---
 *  lc-text 指令模块.
 */

// lc-text 指令初始化函数(绑定数值).
module.exports = function bindLcText (children, scopeObj) {
    for (var i = 0, length = children.length; i < length; i++) {
        var child = children[i];
        
        if (!child.attributes["lc-text"]) {
            child.children.length > 0 && bindLcText(child.children, scopeObj);
            continue;
        }
        
        var value = scopeObj[child.attributes["lc-text"].value];
        child.innerText = value;
        
        // lc-text 不允许有子元素所以不进行子元素递归.
    }
};
},{}],5:[function(require,module,exports){
// Lancer Frame V0.0.1 By LancerComet at 16:44, 2016.02.29.
// # Carry Your World #

(function (root, undefined) {
    "use strict";

    var LancerFrame = {};
    
    // Definition: 常量定义区.
    // =================================
    LancerFrame.VERSION = "0.0.1";
    LancerFrame.AUTHOR = "LancerComet";
    
    
    // Definition: 静态方法定义区.
    // =================================    
    LancerFrame.controller = require("./module-func/controller").controller;  // 模块定义方法.
    
    // Definition: 框架初始化.
    // =================================
    // 让框架在 DomContentLoaded 时进行初始化.
    // 如果没赶上, 则在 window.onload 时进行.
    // 如果还没赶上, 检测 document.readyState 是否为 complete, 是则直接执行.
    (function () {
        LancerFrame.inited = false;
        LancerFrame.init = require("./init/init").bind(null, LancerFrame);
        window.addEventListener("DOMContentLoaded", function () {
            console.log("Init at DOMContentLoaded");
            LancerFrame.init();
        });
        window.addEventListener("load", function () {
            if (LancerFrame.inited) return;
            LancerFrame.init();
        });
        setTimeout(function () {
            if (LancerFrame.inited) return;
            document.readyState === "complete" && LancerFrame.init();
        }, 1);
    })();



    // Definition: 将 LancerFrame 挂载至全局环境.
    // =================================
    root.LancerFrame = root.lc = LancerFrame;

})(window);
},{"./init/init":6,"./module-func/controller":7}],6:[function(require,module,exports){
/*
 *  "Module Define" module By LancerComet at 17:29, 2016.03.04.
 *  # Carry Your World #
 *  ---
 *  框架初始化模块.
 */

// Definition: 所有控制器存储对象.
var controllerMaps = require("./../module-func/controller").controllerMaps;
var bindLcModel = require("./../directives/lc-model");
var bindLcText = require("./../directives/lc-text");
var bindLcClick = require("./../directives/lc-click");


module.exports = function (lc) {
    console.log("init")

    // Step1. 获取所有对象并提取 lc-controller 对象.
    var $ctrls = document.querySelectorAll("[lc-controller]");
    
    // Step2. 遍历所有控制器节点, 并在相应的控制器中带入 controllerMaps 中的控制器数据对象并进行绑定.
    for (var i = 0, length = $ctrls.length; i < length; i++) {
        var $ctrl = $ctrls[i];
        var ctrlName = $ctrl.attributes["lc-controller"].value;
        
        // Definition: 控制器数据对象.
        /*
         *  {
         *      $controllerName: ctrlName,
         *      key1: value,
         *      key2: value,
         *      ...
         *  }
         * 
         */
        var scopeObj = controllerMaps[ctrlName];
        console.log(scopeObj)
        
        // Step3. 在子元素中开始初始化指令.
        var children = $ctrl.children;
        bindLcModel(children, scopeObj);
        bindLcText(children, scopeObj);
        bindLcClick(children, scopeObj);

    }

    LancerFrame.inited = true;

};
},{"./../directives/lc-click":2,"./../directives/lc-model":3,"./../directives/lc-text":4,"./../module-func/controller":7}],7:[function(require,module,exports){
/*
 *  "Module Define" module By LancerComet at 16:52, 2016.02.29.
 *  # Carry Your World #
 *  ---
 *  框架模块处理方法.
 * 
 *  包含方法:
 *  ---
 *   - 模块建立方法.
 *   - 模块引用方法.
 *  
 *  Inspired By http://www.ituring.com.cn/minibook/770.
 */

var syncData = require("./../directives/_common/common").syncData;

var controllerMaps = {};  // 存储所有控制器.

module.exports = {
    controller: controllerDefine,
    controllerMaps: controllerMaps
};

/* Definition goes below. */

// Definition: 框架控制器定义函数.
// lc.controller("ctrlName", ["moduleA"], function (scope) {})
function controllerDefine (ctrlName, dependencies, initFunc) {
    // @ params: 模块名称, 依赖模块, 模块初始化函数.
    
    if (Object.prototype.toString.call(dependencies) !== "[object Array]") {
        initFunc = dependencies;
        dependencies = [];
    }

    controllerMaps[ctrlName] = {
        $controllerctrlName: ctrlName  // 控制器名称.
    };
    
    // initFunc && initFunc(controllerMaps[ctrlName]);

    initFunc && (function () {
        initFunc(controllerMaps[ctrlName]);  // 将对象带入初始化函数中进行初始化.
        // 在 controllerMaps[ctrlName] 初始化完成后, 遍历每个用户设定的属性并设置 getter / setter.
        
        var scope = controllerMaps[ctrlName];  // Definition: 此控制器对象.
        
        // 之后为每个用户定义的属性中设置 getter / setter.
        for (var prop in scope) {
            if (!scope.hasOwnProperty(prop) || prop === "$controllerCtrlName") { continue; }
            
            // 在自执行函数中创建闭包来保留每个属性的 key 与 value 的各自引用 itemKey, itemValue 以避免属性相互干扰.
            (function () {
                var itemKey = prop;                
                var itemValue = scope[prop];
                Object.defineProperty(scope, itemKey, {
                    get: function () {
                        console.log("scope:")
                        console.log(scope)                        
                        return itemValue;
                    },
                    set: function (newValue) {
                        console.log(ctrlName + "." + itemKey + " 从 " + itemValue + " 修改为 " + newValue);
                        itemValue = newValue;
                        syncData(ctrlName, itemKey, newValue);  // 更新控制器下所有 lc-text 和 lc-model 节点数据.
                    }
                });
            })();

        }

    })();

}

},{"./../directives/_common/common":1}]},{},[5])