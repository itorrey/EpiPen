epi = {
    currentEpiValue: "",

    // Get the data inside the EpiInjector object and create tags from it.
    inject: function() {
        $axure('@EpiPen').each(function(index, value){
            $(index.data).each(function(index, value) {
                if(!value.type) {
                    return;
                }
                var type = value.type.text;
                var src = value.src.text;
                var target = value.target.text;
                epi.createTag(type, src, target);
            });
        });
    },

    createTag: function(type, src, target) {
        var tag;
        if(!target) { target = "head"; }
        switch(type) {
            case "css":
                if(target == "inline") {
                    tag = document.createElement("style");
                    if(src.substring(0,2) == "[[") {
                        //This doesn't currently work. Always getting undefined.
                        tag.innerHTML = $axure.getGlobalVariable(src.slice(2, -2));
                    } else {
                        tag.innerHTML = src;
                    }
                } else {
                    tag = document.createElement("link");
                    tag.href = src;
                }
                tag.type = "text/css";
                tag.rel = "stylesheet";
                break;

            case "js":
                tag = document.createElement("script");
                if(target == "inline") {
                    tag.innerHTML = src;
                } else {
                    tag.src = src;
                }
                break;

            case "html":
                tag = document.createDocumentFragment(src);
                break;

        }
        if(target.substring(0,1) == "@") {
            $axure(target).$()[0].innerHTML = src;
        } else {
            var head = document.getElementsByTagName("head")[0];
            head.appendChild(tag);
        }
    },

    //Listen for changes to epi variable from Axure.
    listen: function() {
        $('#axureEventReceiverDiv').bind("DOMSubtreeModified",function(){

            var request = JSON.parse($(this).text());

            if(request.data.epi && request.data.epi != epi.currentEpiValue) {
                epi.currentEpiValue = request.data.epi;
                eval(epi.currentEpiValue);
            }
        });
    },

    init: function() {
        this.inject();
        this.listen();
    }
};

(function () {
    $axure.internal(function($ax){
        //Fix for axure's bug where this function doesn't return anything.
        $ax.public.getGlobalVariable = $ax.getGlobalVariable = function(name) {
            return $ax.globalVariableProvider.getVariableValue(name);
        };

        //Currently setting the text on an input widget throws an error that SetWidgetFormText doesn't exist.
        // This shim fixes that error
        SetWidgetFormText = function(elementIds, value) {
            //Need to check if elementIds is a string or array. If it's a string this will never work.
            if(typeof elementIds == "string") {
                elementIds = Array(elementIds);
            }
            //This is the original function from Axure's expr.js
            for(var i = 0; i < elementIds.length; i++) {
                var elementId = elementIds[i];
                var inputId = $ax.repeater.applySuffixToElementId(elementId, '_input');
                var obj = $jobj(inputId);
                if(obj.val() == value || (value == '' && $ax.placeholderManager.isActive(elementId))) return;
                obj.val(value);
                $ax.placeholderManager.updatePlaceholder(elementId, !value);
                if($ax.event.HasTextChanged($ax.getObjectFromElementId(elementId))) $ax.event.TryFireTextChanged(elementId);
            }
        };

        epi.repeater = $ax.repeater;
        epi.deepCopy = $ax.deepCopy;
        epi.repeaterToCurrentDataSet = $ax.repeaterToCurrentDataSet;
        epi.repeaterToLocalDataSet = $ax.repeaterToLocalDataSet;
        epi.action = $ax.action;
        epi.event = $ax.event;


    });
    epi.init();
})();

//Watch.js
//"use strict";(function(e){if(typeof exports==="object"){module.exports=e()}else if(typeof define==="function"&&define.amd){define(e)}else{window.WatchJS=e();window.watch=window.WatchJS.watch;window.unwatch=window.WatchJS.unwatch;window.callWatchers=window.WatchJS.callWatchers}})(function(){var e={noMore:false},t=[];var n=function(e){var t={};return e&&t.toString.call(e)=="[object Function]"};var r=function(e){return e%1===0};var i=function(e){return Object.prototype.toString.call(e)==="[object Array]"};var s=function(e,t){var n=[],r=[];if(!(typeof e=="string")&&!(typeof t=="string")){if(i(e)){for(var s=0;s<e.length;s++){if(t[s]===undefined)n.push(s)}}else{for(var s in e){if(e.hasOwnProperty(s)){if(t[s]===undefined){n.push(s)}}}}if(i(t)){for(var o=0;o<t.length;o++){if(e[o]===undefined)r.push(o)}}else{for(var o in t){if(t.hasOwnProperty(o)){if(e[o]===undefined){r.push(o)}}}}}return{added:n,removed:r}};var o=function(e){if(null==e||"object"!=typeof e){return e}var t=e.constructor();for(var n in e){t[n]=e[n]}return t};var u=function(e,t,n,r){try{Object.observe(e[t],function(e){r(e)})}catch(i){try{Object.defineProperty(e,t,{get:n,set:r,enumerable:true,configurable:true})}catch(s){try{Object.prototype.__defineGetter__.call(e,t,n);Object.prototype.__defineSetter__.call(e,t,r)}catch(o){throw new Error("watchJS error: browser not supported :/")}}}};var a=function(e,t,n){try{Object.defineProperty(e,t,{enumerable:false,configurable:true,writable:false,value:n})}catch(r){e[t]=n}};var f=function(){if(n(arguments[1])){l.apply(this,arguments)}else if(i(arguments[1])){c.apply(this,arguments)}else{h.apply(this,arguments)}};var l=function(e,t,n,r){if(typeof e=="string"||!(e instanceof Object)&&!i(e)){return}var s=[];if(i(e)){for(var o=0;o<e.length;o++){s.push(o)}}else{for(var u in e){if(e.hasOwnProperty(u)){s.push(u)}}}c(e,s,t,n,r);if(r){x(e,"$$watchlengthsubjectroot",t,n)}};var c=function(e,t,n,r,s){if(typeof e=="string"||!(e instanceof Object)&&!i(e)){return}for(var o=0;o<t.length;o++){var u=t[o];h(e,u,n,r,s)}};var h=function(e,t,r,s,o){if(typeof e=="string"||!(e instanceof Object)&&!i(e)){return}if(n(e[t])){return}if(e[t]!=null&&(s===undefined||s>0)){l(e[t],r,s!==undefined?s-1:s)}m(e,t,r,s);if(o&&(s===undefined||s>0)){x(e,t,r,s)}};var p=function(){if(n(arguments[1])){d.apply(this,arguments)}else if(i(arguments[1])){v.apply(this,arguments)}else{E.apply(this,arguments)}};var d=function(e,t){if(e instanceof String||!(e instanceof Object)&&!i(e)){return}var n=[];if(i(e)){for(var r=0;r<e.length;r++){n.push(r)}}else{for(var s in e){if(e.hasOwnProperty(s)){n.push(s)}}}v(e,n,t)};var v=function(e,t,n){for(var r in t){if(t.hasOwnProperty(r)){E(e,t[r],n)}}};var m=function(t,n,r,i){var s=t[n];w(t,n);if(!t.watchers){a(t,"watchers",{})}if(!t.watchers[n]){t.watchers[n]=[]}for(var o=0;o<t.watchers[n].length;o++){if(t.watchers[n][o]===r){return}}t.watchers[n].push(r);var f=function(){return s};var c=function(o){var u=s;s=o;if(i!==0&&t[n]){l(t[n],r,i===undefined?i:i-1)}w(t,n);if(!e.noMore){if(u!==o){g(t,n,"set",o,u);e.noMore=false}}};u(t,n,f,c)};var g=function(e,t,n,r,i){if(t!==undefined){for(var s=0;s<e.watchers[t].length;s++){e.watchers[t][s].call(e,t,n,r,i)}}else{for(var t in e){if(e.hasOwnProperty(t)){g(e,t,n,r,i)}}}};var y=["pop","push","reverse","shift","sort","slice","unshift"];var b=function(e,t,n,r){a(e[t],r,function(){var i=n.apply(e[t],arguments);h(e,e[t]);if(r!=="slice"){g(e,t,r,arguments)}return i})};var w=function(e,t){if(!e[t]||e[t]instanceof String||!i(e[t])){return}for(var n=y.length,r;n--;){r=y[n];b(e,t,e[t][r],r)}};var E=function(e,t,n){for(var r=0;r<e.watchers[t].length;r++){var i=e.watchers[t][r];if(i==n){e.watchers[t].splice(r,1)}}T(e,t,n)};var S=function(){for(var e=0;e<t.length;e++){var n=t[e];if(n.prop==="$$watchlengthsubjectroot"){var r=s(n.obj,n.actual);if(r.added.length||r.removed.length){if(r.added.length){c(n.obj,r.added,n.watcher,n.level-1,true)}n.watcher.call(n.obj,"root","differentattr",r,n.actual)}n.actual=o(n.obj)}else{var r=s(n.obj[n.prop],n.actual);if(r.added.length||r.removed.length){if(r.added.length){for(var i=0;i<n.obj.watchers[n.prop].length;i++){c(n.obj[n.prop],r.added,n.obj.watchers[n.prop][i],n.level-1,true)}}g(n.obj,n.prop,"differentattr",r,n.actual)}n.actual=o(n.obj[n.prop])}}};var x=function(e,n,r,i){var s;if(n==="$$watchlengthsubjectroot"){s=o(e)}else{s=o(e[n])}t.push({obj:e,prop:n,actual:s,watcher:r,level:i})};var T=function(e,n,r){for(var i=0;i<t.length;i++){var s=t[i];if(s.obj==e&&s.prop==n&&s.watcher==r){t.splice(i,1)}}};setInterval(S,50);e.watch=f;e.unwatch=p;e.callWatchers=g;return e})

/**
 * DEVELOPED BY
 * GIL LOPES BUENO
 * gilbueno.mail@gmail.com
 *
 * WORKS WITH:
 * IE 9+, FF 4+, SF 5+, WebKit, CH 7+, OP 12+, BESEN, Rhino 1.7+
 *
 * FORK:
 * https://github.com/melanke/Watch.JS
 */

"use strict";
(function (factory) {
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals
        window.WatchJS = factory();
        window.watch = window.WatchJS.watch;
        window.unwatch = window.WatchJS.unwatch;
        window.callWatchers = window.WatchJS.callWatchers;
    }
}(function () {

    var WatchJS = {
        noMore: false
    },
    lengthsubjects = [];

    var isFunction = function (functionToCheck) {
            var getType = {};
            return functionToCheck && getType.toString.call(functionToCheck) == '[object Function]';
    };

    var isInt = function (x) {
        return x % 1 === 0;
    };

    var isArray = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

    var getObjDiff = function(a, b){
        var aplus = [],
        bplus = [];

        if(!(typeof a == "string") && !(typeof b == "string")){

            if (isArray(a)) {
                for (var i=0; i<a.length; i++) {
                    if (b[i] === undefined) aplus.push(i);
                }
            } else {
                for(var i in a){
                    if (a.hasOwnProperty(i)) {
                        if(b[i] === undefined) {
                            aplus.push(i);
                        }
                    }
                }
            }

            if (isArray(b)) {
                for (var j=0; j<b.length; j++) {
                    if (a[j] === undefined) bplus.push(j);
                }
            } else {
                for(var j in b){
                    if (b.hasOwnProperty(j)) {
                        if(a[j] === undefined) {
                            bplus.push(j);
                        }
                    }
                }
            }
        }

        return {
            added: aplus,
            removed: bplus
        }
    };

    var clone = function(obj){

        if (null == obj || "object" != typeof obj) {
            return obj;
        }

        var copy = obj.constructor();

        for (var attr in obj) {
            copy[attr] = obj[attr];
        }

        return copy;

    }

    var defineGetAndSet = function (obj, propName, getter, setter) {
        try {


            Object.observe(obj, function(changes) {
                changes.forEach(function(change) {
                    if (change.name === propName) {
                        setter(change.object[change.name]);
                    }
                });
            });

        } catch(e) {

            try {
                    Object.defineProperty(obj, propName, {
                            get: getter,
                            set: setter,
                            enumerable: true,
                            configurable: true
                    });
            } catch(e2) {
                try{
                    Object.prototype.__defineGetter__.call(obj, propName, getter);
                    Object.prototype.__defineSetter__.call(obj, propName, setter);
                } catch(e3) {
                    throw new Error("watchJS error: browser not supported :/")
                }
            }

        }
    };

    var defineProp = function (obj, propName, value) {
        try {
            Object.defineProperty(obj, propName, {
                enumerable: false,
                configurable: true,
                writable: false,
                value: value
            });
        } catch(error) {
            obj[propName] = value;
        }
    };

    var watch = function () {

        if (isFunction(arguments[1])) {
            watchAll.apply(this, arguments);
        } else if (isArray(arguments[1])) {
            watchMany.apply(this, arguments);
        } else {
            watchOne.apply(this, arguments);
        }

    };


    var watchAll = function (obj, watcher, level, addNRemove) {
        if ((typeof obj == "string") || (!(obj instanceof Object) && !isArray(obj))) { //accepts only objects and array (not string)
            return;
        }

        var props = [];


        if(isArray(obj)) {
            for (var prop = 0; prop < obj.length; prop++) { //for each item if obj is an array
                props.push(prop); //put in the props
            }
        } else {
            for (var prop2 in obj) { //for each attribute if obj is an object
                if (prop2 == "$val") {
                    continue;
                }

                if (Object.prototype.hasOwnProperty.call(obj, prop2)) {
                    props.push(prop2); //put in the props
                }
            }
        }

        watchMany(obj, props, watcher, level, addNRemove); //watch all items of the props

        if (addNRemove) {
            pushToLengthSubjects(obj, "$$watchlengthsubjectroot", watcher, level);
        }
    };


    var watchMany = function (obj, props, watcher, level, addNRemove) {

        if ((typeof obj == "string") || (!(obj instanceof Object) && !isArray(obj))) { //accepts only objects and array (not string)
            return;
        }

        for (var i=0; i<props.length; i++) { //watch each property
            var prop = props[i];
            watchOne(obj, prop, watcher, level, addNRemove);
        }

    };

    var watchOne = function (obj, prop, watcher, level, addNRemove) {
        if ((typeof obj == "string") || (!(obj instanceof Object) && !isArray(obj))) { //accepts only objects and array (not string)
            return;
        }


        if(isFunction(obj[prop])) { //dont watch if it is a function
            return;
        }
        if(obj[prop] != null && (level === undefined || level > 0)){
            watchAll(obj[prop], watcher, level!==undefined? level-1 : level); //recursively watch all attributes of this
        }

        defineWatcher(obj, prop, watcher, level);

        if(addNRemove && (level === undefined || level > 0)){
            pushToLengthSubjects(obj, prop, watcher, level);
        }

    };

    var unwatch = function () {

        if (isFunction(arguments[1])) {
            unwatchAll.apply(this, arguments);
        } else if (isArray(arguments[1])) {
            unwatchMany.apply(this, arguments);
        } else {
            unwatchOne.apply(this, arguments);
        }

    };

    var unwatchAll = function (obj, watcher) {

        if (obj instanceof String || (!(obj instanceof Object) && !isArray(obj))) { //accepts only objects and array (not string)
            return;
        }

        if (isArray(obj)) {
            var props = [];
            for (var prop = 0; prop < obj.length; prop++) { //for each item if obj is an array
                props.push(prop); //put in the props
            }
            unwatchMany(obj, props, watcher); //watch all itens of the props
        } else {
            var unwatchPropsInObject = function (obj2) {
                var props = [];
                for (var prop2 in obj2) { //for each attribute if obj is an object
                    if (obj2.hasOwnProperty(prop2)) {
                        if (obj2[prop2] instanceof Object) {
                            unwatchPropsInObject(obj2[prop2]); //recurs into object props
                        } else {
                            props.push(prop2); //put in the props
                        }
                    }
                }
                unwatchMany(obj2, props, watcher); //unwatch all of the props
            };
            unwatchPropsInObject(obj);
        }
    };


    var unwatchMany = function (obj, props, watcher) {

        for (var prop2 in props) { //watch each attribute of "props" if is an object
            if (props.hasOwnProperty(prop2)) {
                unwatchOne(obj, props[prop2], watcher);
            }
        }
    };

    var defineWatcher = function (obj, prop, watcher, level) {

        var val = obj[prop];

        watchFunctions(obj, prop);

        if (!obj.watchers) {
            defineProp(obj, "watchers", {});
        }

        if (!obj.watchers[prop]) {
            obj.watchers[prop] = [];
        }

        for (var i=0; i<obj.watchers[prop].length; i++) {
            if(obj.watchers[prop][i] === watcher){
                return;
            }
        }


        obj.watchers[prop].push(watcher); //add the new watcher in the watchers array


        var getter = function () {
            return val;
        };


        var setter = function (newval) {
            var oldval = val;
            val = newval;

            if (level !== 0 && obj[prop]){
                // watch sub properties
                watchAll(obj[prop], watcher, (level===undefined)?level:level-1);
            }

            watchFunctions(obj, prop);

            if (!WatchJS.noMore){
                //if (JSON.stringify(oldval) !== JSON.stringify(newval)) {
                if (oldval !== newval) {
                    callWatchers(obj, prop, "set", newval, oldval);
                    WatchJS.noMore = false;
                }
            }
        };

        defineGetAndSet(obj, prop, getter, setter);

    };

    var callWatchers = function (obj, prop, action, newval, oldval) {
        if (prop !== undefined) {
            for (var wr=0; wr<obj.watchers[prop].length; wr++) {
                obj.watchers[prop][wr].call(obj, prop, action, newval, oldval);
            }
        } else {
            for (var prop in obj) {//call all
                if (obj.hasOwnProperty(prop)) {
                    callWatchers(obj, prop, action, newval, oldval);
                }
            }
        }
    };

    // @todo code related to "watchFunctions" is certainly buggy
    var methodNames = ['pop', 'push', 'reverse', 'shift', 'sort', 'slice', 'unshift', 'splice'];
    var defineArrayMethodWatcher = function (obj, prop, original, methodName) {
        defineProp(obj[prop], methodName, function () {
            var response = original.apply(obj[prop], arguments);
            watchOne(obj, obj[prop]);
            if (methodName !== 'slice') {
                callWatchers(obj, prop, methodName,arguments);
            }
            return response;
        });
    };

    var watchFunctions = function(obj, prop) {

        if ((!obj[prop]) || (obj[prop] instanceof String) || (!isArray(obj[prop]))) {
            return;
        }

        for (var i = methodNames.length, methodName; i--;) {
            methodName = methodNames[i];
            defineArrayMethodWatcher(obj, prop, obj[prop][methodName], methodName);
        }

    };

    var unwatchOne = function (obj, prop, watcher) {
        for (var i=0; i<obj.watchers[prop].length; i++) {
            var w = obj.watchers[prop][i];

            if(w == watcher) {
                obj.watchers[prop].splice(i, 1);
            }
        }

        removeFromLengthSubjects(obj, prop, watcher);
    };

    var loop = function(){

        for(var i=0; i<lengthsubjects.length; i++) {

            var subj = lengthsubjects[i];

            if (subj.prop === "$$watchlengthsubjectroot") {

                var difference = getObjDiff(subj.obj, subj.actual);

                if(difference.added.length || difference.removed.length){
                    if(difference.added.length){
                        watchMany(subj.obj, difference.added, subj.watcher, subj.level - 1, true);
                    }

                    subj.watcher.call(subj.obj, "root", "differentattr", difference, subj.actual);
                }
                subj.actual = clone(subj.obj);


            } else {

                var difference = getObjDiff(subj.obj[subj.prop], subj.actual);

                if(difference.added.length || difference.removed.length){
                    if(difference.added.length){
                        for (var j=0; j<subj.obj.watchers[subj.prop].length; j++) {
                            watchMany(subj.obj[subj.prop], difference.added, subj.obj.watchers[subj.prop][j], subj.level - 1, true);
                        }
                    }

                    callWatchers(subj.obj, subj.prop, "differentattr", difference, subj.actual);
                }

                subj.actual = clone(subj.obj[subj.prop]);

            }

        }

    };

    var pushToLengthSubjects = function(obj, prop, watcher, level){

        var actual;

        if (prop === "$$watchlengthsubjectroot") {
            actual =  clone(obj);
        } else {
            actual = clone(obj[prop]);
        }

        lengthsubjects.push({
            obj: obj,
            prop: prop,
            actual: actual,
            watcher: watcher,
            level: level
        });
    };

    var removeFromLengthSubjects = function(obj, prop, watcher){

        for (var i=0; i<lengthsubjects.length; i++) {
            var subj = lengthsubjects[i];

            if (subj.obj == obj && subj.prop == prop && subj.watcher == watcher) {
                lengthsubjects.splice(i, 1);
            }
        }

    };

    setInterval(loop, 50);

    WatchJS.watch = watch;
    WatchJS.unwatch = unwatch;
    WatchJS.callWatchers = callWatchers;

    return WatchJS;

}));


