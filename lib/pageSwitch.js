/*
 * pageSwitch
 * @author qiqiboy
 * @github https://github.com/qiqiboy/pageSwitch
 */
;
(function (ROOT, struct, undefined) {
    "use strict";
    //console.log(struct);
    var VERSION = '2.3.2';
    var lastTime = 0,
        nextFrame = ROOT.requestAnimationFrame ||
            ROOT.webkitRequestAnimationFrame ||
            ROOT.mozRequestAnimationFrame ||
            ROOT.msRequestAnimationFrame ||
            function (callback) {
                var currTime = +new Date,
                    delay = Math.max(1000 / 60, 1000 / 60 - (currTime - lastTime));
                lastTime = currTime + delay;
                return setTimeout(callback, delay);
            },
        cancelFrame = ROOT.cancelAnimationFrame ||
            ROOT.webkitCancelAnimationFrame ||
            ROOT.webkitCancelRequestAnimationFrame ||
            ROOT.mozCancelRequestAnimationFrame ||
            ROOT.msCancelRequestAnimationFrame ||
            clearTimeout,
        DOC = ROOT.document,
        divstyle = DOC.createElement('div').style,
        cssVendor = function () {
            var tests = "-webkit- -moz- -o- -ms-".split(" "),
                prop;
            while (prop = tests.shift()) {
                if (camelCase(prop + 'transform') in divstyle) {
                    return prop;
                }
            }
            return '';
        }(),
        transitionEndName = function () {
            var t;
            var el = document.createElement('fakeelement');
            var transitions = {
                'OTransition': 'oTransitionEnd',
                'MozTransition': 'transitionend',
                'WebkitTransition': 'webkitTransitionEnd',
                'MsTransition': 'msTransitionEnd',
                'transition': 'transitionend'
            }
            for (t in transitions) {
                if (el.style[t] !== undefined) {
                    return transitions[t];
                }
            }
            return '';
        }(),
        transition = cssTest('transition'),
        opacity = cssTest('opacity'),
        transform = cssTest('transform'),
        perspective = cssTest('perspective'),
        transformStyle = cssTest('transform-style'),
        transformOrigin = cssTest('transform-origin'),
        backfaceVisibility = cssTest('backface-visibility'),
        preserve3d = transformStyle && function () {
            divstyle[transformStyle] = 'preserve-3d';
            return divstyle[transformStyle] == 'preserve-3d';
        }(),
        toString = Object.prototype.toString,
        slice = [].slice,
        class2type = {},
        event2type = {},
        event2code = {
            click: 4,
            mousewheel: 5,
            dommousescroll: 5,
            keydown: 6
        },
        POINTERTYPES = {
            2: 'touch',
            3: 'pen',
            4: 'mouse',
            pen: 'pen'
        },
        STARTEVENT = [],
        MOVEEVENT = [],
        EVENT = function () {
            var ret = {},
                states = {
                    start: 1,
                    down: 1,
                    move: 2,
                    end: 3,
                    up: 3,
                    cancel: 3
                };
            each("mouse touch pointer MSPointer-".split(" "), function (prefix) {
                var _prefix = /pointer/i.test(prefix) ? 'pointer' : prefix;
                ret[_prefix] = ret[_prefix] || {};
                POINTERTYPES[_prefix] = _prefix;
                each(states, function (endfix, code) {

                    var ev = camelCase(prefix + endfix);
                    ret[_prefix][ev] = code;
                    event2type[ev.toLowerCase()] = _prefix;
                    event2code[ev.toLowerCase()] = code;
                    if (code == 1) {
                        STARTEVENT.push(ev);
                    } else {
                        MOVEEVENT.push(ev);
                    }
                });
            });
            //    console.log(ret,"kkk");
            return ret;
        }(),
        POINTERS = {
            touch: {},
            pointer: {},
            mouse: {}
        },
        EASE = {
            linear: function (t, b, c, d) {
                return c * t / d + b;
            },
            ease: function (t, b, c, d) {
                return -c * ((t = t / d - 1) * t * t * t - 1) + b;
            },
            'ease-in': function (t, b, c, d) {
                return c * (t /= d) * t * t + b;
            },
            'ease-out': function (t, b, c, d) {
                return c * ((t = t / d - 1) * t * t + 1) + b;
            },
            'ease-in-out': function (t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t + 2) + b;
            },
            bounce: function (t, b, c, d) {
                if ((t /= d) < (1 / 2.75)) {
                    return c * (7.5625 * t * t) + b;
                } else if (t < (2 / 2.75)) {
                    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                } else if (t < (2.5 / 2.75)) {
                    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                } else {
                    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
                }
            }
        },
        TRANSITION = {
            /* 更改切换效果
             * @param Element cpage 当前页面
             * @param Float cp      当前页面过度百分比
             * @param Element tpage 前序页面
             * @param Float tp      前序页面过度百分比
             */
            fade: function (cpage, cp, tpage, tp, time, callback) {
                // time = time/2;
                var fn = function () {
                    cpage.removeEventListener(transitionEndName, fn);
                    if (tpage) {
                        tpage.style[transition] = 'none';
                    }
                    cpage.style[transition] = 'none';
                    // document.execCommand('Refresh');
                    callback();
                };
                cpage.addEventListener(transitionEndName, fn);
                if (tpage) {
                    if (opacity) {
                        tpage.style.opacity = 0;
                    } else {
                        tpage.style.filter = 'alpha(opacity=0)';
                    }
                }
                // document.execCommand('Refresh');
                setTimeout(function () {
                    if (tpage) {
                        tpage.style[transition] = 'all ' + time + 'ms';
                    }
                    cpage.style[transition] = 'all ' + time + 'ms';
                    if (opacity) {
                        cpage.style.opacity = 0;
                        if (tpage) {
                            tpage.style.opacity = 1;
                        }
                    } else {
                        cpage.style.filter = 'alpha(opacity=0)';
                        if (tpage) {
                            tpage.style.filter = 'alpha(opacity=100)';
                        }
                    }
                }, 100);
            }
        };

    each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });
    each("X Y ".split(" "), function (name) {
        // console.log("name,",name);
        var XY = {X: 'left', Y: 'top'},
            fire3D = perspective ? ' translateZ(0)' : '';

        TRANSITION['slide' + name] = function (cpage, cp, tpage, tp, time, callback) {
            TRANSITION['slideCoverReverse' + name].apply(this, arguments);
        }
        TRANSITION['scroll' + name] = function (cpage, cp, tpage, tp, time, callback) {
            // time = time*2;
            var prop = name || ['X', 'Y'][this.direction];
            var fn = function () {
                cpage.removeEventListener(transitionEndName, fn);
                if (tpage)
                    transition ? (tpage.style[transition] = 'none') : "";
                transition ? (cpage.style[transition] = 'none') : "";
                // document.execCommand('Refresh');
                callback();
            };
            cpage.addEventListener(transitionEndName, fn);
            //change by fishYu  2016-1-4  预防没有的情况报错
            if (tpage) {
                transform ? tpage.style[transform] = 'translate' + prop + '(' + cp * -100 + '%)' + fire3D : tpage.style[XY[prop]] = cp * -100 + '%';
            }
            // tpage.style[transform]='translate'+prop+'('+cp*-100+'%)'+fire3D;
            setTimeout(function () {
                // document.execCommand('Refresh');
                cpage.style[transition] = 'all ' + time + 'ms';
                if (tpage) {
                    tpage.style[transition] = 'all ' + time + 'ms';
                }
                cpage.style[transform] = 'translate' + prop + '(' + cp * 100 + '%)' + fire3D;
                if (tpage) {
                    tpage.style[transform] = 'translate' + prop + '(0%)' + fire3D;
                }
            }, 100);
        }

        // console.log(type);
        // TRANSITION['flowCover'+type+name]=function(cpage,cp,tpage,tp){
        //     var prop=name||['X','Y'][this.direction],
        //         zIndex=Number(type=='In'||!type&&cp<0||type=='Reverse'&&cp>0);
        //     if(transform){
        //         cpage.style[transform]='translate'+prop+'('+cp*(100-zIndex*50)+'%) scale('+((1-Math.abs(cp))*.5+.5)+')'+fire3D;
        //         cpage.style.zIndex=1-zIndex;
        //         if(tpage){
        //             tpage.style[transform]='translate'+prop+'('+tp*(50+zIndex*50)+'%) scale('+((1-Math.abs(tp))*.5+.5)+')'+fire3D;
        //             tpage.style.zIndex=zIndex;
        //         }
        //     }else TRANSITION['scrollCover'+type+name].apply(this,arguments);
        // }
        TRANSITION['zoom' + name] = function (cpage, cp, tpage, tp, time, callback) {
            var fn = function () {
                tpage.removeEventListener(transitionEndName, fn);
                if (tpage)
                    transition ? (tpage.style[transition] = 'none') : "";
                transition ? (cpage.style[transition] = 'none') : "";
                // document.execCommand('Refresh');
                callback();
            };
            if (tpage) {
                tpage.addEventListener(transitionEndName, fn);
            }
            if (tpage) {
                tpage.style[transform] = 'scale' + name + '(' + 0 + ')' + fire3D;
            }
            setTimeout(function () {
                // document.execCommand('Refresh');
                if (tpage)
                    transition ? (tpage.style[transition] = 'all ' + time / 2 + 'ms') : "";
                transition ? (cpage.style[transition] = 'all ' + time / 2 + 'ms') : "";
                cpage.style[transform] = 'scale' + name + '(' + 0 + ')' + fire3D;
                // setTimeout(function(){
                //     if(tpage){
                //         tpage.style[transform]='scale'+name+'('+Math.abs(1-Math.abs(cp)*2)+')'+fire3D;
                //     }
                // },time/2);

            }, 100);
            var tpageFn = function () {
                cpage.removeEventListener(transitionEndName, tpageFn);
                if (tpage) {
                    tpage.style[transform] = 'scale' + name + '(1)' + fire3D;
                }
            }
            cpage.addEventListener(transitionEndName, tpageFn);
            // var zIndex=Number(Math.abs(cp)<.5);
            // if(transform){
            //     cpage.style[transform]='scale'+name+'('+Math.abs(1-Math.abs(cp)*2)+')'+fire3D;
            //     cpage.style.zIndex=zIndex;
            //     if(tpage){
            //         tpage.style[transform]='scale'+name+'('+Math.abs(1-Math.abs(cp)*2)+')'+fire3D;
            //         tpage.style.zIndex=1-zIndex;
            //     }
            // }else TRANSITION['scroll'+name].apply(this,arguments);
        }
        TRANSITION['bomb' + name] = function (cpage, cp, tpage, tp, time, callback) {
            var fn = function () {
                if (tpage) {
                    tpage.removeEventListener(transitionEndName, fn);
                    transition ? (tpage.style[transition] = 'none') : "";
                }
                transition ? (cpage.style[transition] = 'none') : "";
                // document.execCommand('Refresh');
                callback();
            };
            if (tpage) {
                tpage.addEventListener(transitionEndName, fn);
            }
            if (tpage) {
                tpage.style[transform] = "scale" + name + "(2)" + fire3D;
                tpage.style.opacity = 0;
            }
            // document.execCommand('Refresh');
            setTimeout(function () {
                if (tpage)
                    tpage.style[transition] = 'all ' + time / 2 + 'ms';
                cpage.style[transition] = 'all ' + time / 2 + 'ms';
                cpage.style[transform] = "scale" + name + "(2)" + fire3D;
                cpage.style.opacity = 0;
                // setTimeout(function(){
                //     // if(tpage){
                //     //     tpage.style[transform] = "scale"+name+"(1)"+fire3D;
                //     //     tpage.style.opacity = 1;
                //     // }
                // },time/2);
            }, 100);
            var tpageFn = function () {
                cpage.removeEventListener(transitionEndName, tpageFn);
                if (tpage) {
                    tpage.style[transform] = "scale" + name + "(1)" + fire3D;
                    tpage.style.opacity = 1;
                }
            }
            cpage.addEventListener(transitionEndName, tpageFn);
            // var zIndex=Number(Math.abs(cp)<.5),
            //     val=Math.abs(1-Math.abs(cp)*2);
            // if(transform){
            //     cpage.style[transform]='scale'+name+'('+(2-val)+')'+fire3D;
            //     cpage.style.opacity=zIndex?val:0;
            //     cpage.style.zIndex=zIndex;
            //     if(tpage){
            //         tpage.style[transform]='scale'+name+'('+(2-val)+')'+fire3D;
            //         tpage.style.opacity=zIndex?0:val;
            //         tpage.style.zIndex=1-zIndex;
            //     }
            // }else TRANSITION['scroll'+name].apply(this,arguments);
        }
        each(" Reverse In Out".split(" "), function (type) {

            TRANSITION['slideCover' + type + name] = function (cpage, cp, tpage, tp, time, callback) {
                var prop = name || ['X', 'Y'][this.direction],
                    zIndex  = Number(type == 'In' || !type && cp < 0 || type == 'Reverse' && cp > 0);
                var fn = function () {
                    if (cpage) {
                        cpage.removeEventListener(transitionEndName, fn);
                        tpage.style[transition] = 'none';
                    }
                    cpage.style[transition] = 'none';
                    // document.execCommand('Refresh') ;
                    // debug.log("end");
                    callback();
                };

// alert("GG");
                //change by fishYu  2016-1-4  预防没有的情况报错
                if (cpage) {
                    cpage.addEventListener(transitionEndName, fn);
                }
                cpage.style.zIndex = 1 - zIndex;
                if (tpage) {
                    tpage.style.zIndex = zIndex;
                    tpage.style[transform] = 'translate' + prop + '(' + cp * zIndex * (-100) + '%) scale(' + ((1 - Math.abs(zIndex ? 0 : cp)) * .2 + .8) + ')' + fire3D;
                }
                // debug.log("ddddddd");
                setTimeout(function () {
                    if (tpage)
                        tpage.style[transition] = 'all ' + time + 'ms';
                    cpage.style[transition] = 'all ' + time + 'ms';
                    document.execCommand('Refresh');
                    // document.execCommand('Refresh'););
                    cpage.style[transform] = 'translate' + prop + '(' + cp * (100 - zIndex * 100) + '%) scale(' + ((1 - Math.abs(zIndex && cp)) * .2 + .8) + ')' + fire3D;
                    if (tpage)
                        tpage.style[transform] = 'translate' + prop + '(0%) scale(1)' + fire3D;
                }, 100);

                // var time2 = Date.now();

                // function countTime(){
                //     if(Date.now() - time2 > time){
                //         fn();
                //         return;
                //     }

                //     requestAnimationFrame(countTime);
                // }

                // countTime();
                //     var prop = name || ['X', 'Y'][this.direction],
                //         zIndex = Number(type == 'In' || !type && cp < 0 || type == 'Reverse' && cp > 0);
                //     if (transform) {
                //         cpage.style[transform] = 'translate' + prop + '(' + cp * (100 - zIndex * 100) + '%) scale(' + ((1 - Math.abs(zIndex && cp)) * .2 + .8) + ')' + fire3D;
                //         cpage.style.zIndex = 1 - zIndex;
                //         if (tpage) {
                //             tpage.style[transform] = 'translate' + prop + '(' + tp * zIndex * 100 + '%) scale(' + ((1 - Math.abs(zIndex ? 0 : tp)) * .2 + .8) + ')' + fire3D;
                //             tpage.style.zIndex = zIndex;
                //         }
                //     }
            }
        });

    });

    function type(obj) {
        if (obj == null) {
            return obj + "";
        }

        return typeof obj == 'object' || typeof obj == 'function' ? class2type[toString.call(obj)] || "object" :
            typeof obj;
    }

    function isArrayLike(elem) {
        var tp = type(elem);
        return !!elem && tp != 'function' && tp != 'string' && (elem.length === 0 || elem.length && (elem.nodeType == 1 || (elem.length - 1) in elem));
    }

    function camelCase(str) {
        return (str + '').replace(/^-ms-/, 'ms-').replace(/-([a-z]|[0-9])/ig, function (all, letter) {
            return (letter + '').toUpperCase();
        });
    }

    function cssTest(name) {
        var prop = camelCase(name),
            _prop = camelCase(cssVendor + prop);
        return (prop in divstyle) && prop || (_prop in divstyle) && _prop || '';
    }

    function isFunction(func) {
        return type(func) == 'function';
    }

    function pointerLength(obj) {
        var len = 0, key;
        if (type(obj.length) == 'number') {
            len = obj.length;
        } else if ('keys' in Object) {
            len = Object.keys(obj).length;
        } else {
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    len++;
                }
            }
        }
        return len;
    }

    function pointerItem(obj, n) {
        return 'item' in obj ? obj.item(n) : function () {
            var i = 0, key;
            for (key in this) {
                if (i++ == n) {
                    return this[key];
                }
            }
        }.call(obj, n);
    }

    function each(arr, iterate) {
        if (isArrayLike(arr)) {
            if (type(arr.forEach) == 'function') {
                return arr.forEach(iterate);
            }
            var i = 0, len = arr.length, item;
            for (; i < len; i++) {
                item = arr[i];
                if (type(item) != 'undefined') {
                    iterate(item, i, arr);
                }
            }
        } else {
            var key;
            for (key in arr) {
                iterate(key, arr[key], arr);
            }
        }
    }

    function children(elem) {
        var ret = [];
        each(elem.children || elem.childNodes, function (elem) {
            if (elem.nodeType == 1) {
                ret.push(elem);
            }
        });
        return ret;
    }

    function getStyle(elem, prop) {
        var style = ROOT.getComputedStyle && ROOT.getComputedStyle(elem, null) || elem.currentStyle || elem.style;
        return style[prop];
    }

    function addListener(elem, evstr, handler) {
        if (type(evstr) == 'object') {
            return each(evstr, function (evstr, handler) {
                addListener(elem, evstr, handler);
            });
        }
        each(evstr.split(" "), function (ev) {
            if (elem.addEventListener) {
                elem.addEventListener(ev, handler, false);
            } else if (elem.attachEvent) {
                elem.attachEvent('on' + ev, handler);
            } else elem['on' + ev] = handler;
        });
    }

    function offListener(elem, evstr, handler) {
        if (type(evstr) == 'object') {
            return each(evstr, function (evstr, handler) {
                offListener(elem, evstr, handler);
            });
        }
        each(evstr.split(" "), function (ev) {
            if (elem.removeEventListener) {
                elem.removeEventListener(ev, handler, false);
            } else if (elem.detachEvent) {
                elem.detachEvent('on' + ev, handler);
            } else elem['on' + ev] = null;
        });
    }

    function removeRange() {
        var range;
        if (ROOT.getSelection) {
            range = getSelection();
            if ('empty' in range)range.empty();
            else if ('removeAllRanges' in range)range.removeAllRanges();
        } else {
            DOC.selection.empty();
        }
    }

    var tempIndex = 0;

    function filterEvent(oldEvent) {
        var ev = {},
            which = oldEvent.which,
            button = oldEvent.button,
            pointers, pointer;

        each("wheelDelta detail which".split(" "), function (prop) {
            ev[prop] = oldEvent[prop];
            //console.log(oldEvent[prop]);
        });

        ev.oldEvent = oldEvent;

        ev.type = oldEvent.type.toLowerCase();
        ev.eventType = event2type[ev.type] || ev.type;

        ev.eventCode = event2code[ev.type] || 0;

//        console.log(ev.eventCode);
        ev.pointerType = POINTERTYPES[oldEvent.pointerType] || oldEvent.pointerType || ev.eventType;

        ev.target = oldEvent.target || oldEvent.srcElement || DOC.documentElement;
        if (ev.target.nodeType === 3) {
            ev.target = ev.target.parentNode;
        }

        ev.preventDefault = function () {
            oldEvent.preventDefault && oldEvent.preventDefault();
            ev.returnValue = oldEvent.returnValue = false;
        }

        if (pointers = POINTERS[ev.eventType]) {
            switch (ev.eventType) {
                case 'mouse':
                case 'pointer':
                    var id = oldEvent.pointerId || 0;
                    ev.eventCode == 3 ? delete pointers[id] : pointers[id] = oldEvent;
                    break;
                case 'touch':
                    POINTERS[ev.eventType] = pointers = oldEvent.touches;
                    break;
            }

            if (pointer = pointerItem(pointers, 0)) {
                ev.clientX = pointer.clientX;
                ev.clientY = pointer.clientY;
            }

            ev.button = which < 4 ? Math.max(0, which - 1) : button & 4 && 1 || button & 2; // left:0 middle:1 right:2
            ev.length = pointerLength(pointers);
        }

        return ev;
    }

    struct.prototype = {
        version: VERSION,
        constructor: struct,
        latestTime: 0,
        init: function (config) {
            var self = this,
                handler = this.handler = function (ev) {
                    // debug.log(ev.type);
                    //添加过滤com by guyy 2015/8/28 17:50
                    var isFilterCla = false;
                    if (self.filterCla != "") {
                        //去除jquery
                        //console.log($(ev.srcElement).parents());
                        //$(ev.srcElement).parents().each(function () {
                        //    if ($(this).hasClass(self.filterCla)){
                        //        isFilterCla = true;
                        //    }
                        //});
                        var element = ev.srcElement, cls;
                        var filterClass = self.filterCla;
                        var depth = 0;
                        //modify by fishYu depth < 3  to depth < 5 修改层级新的滑动层级更深
                        while (element.parentNode && depth < 5) {
                            cls = element.parentNode.className;
                            if (cls && cls.indexOf(filterClass) != -1) {
                                isFilterCla = true;
                                break;
                            }
                            depth++;
                            element = element.parentNode;
                        }
                    }
                    !isFilterCla && !self.frozen && self.handleEvent.call(self,ev);
                }

            this.events = {};
            this.duration = isNaN(parseInt(config.duration)) ? 600 : parseInt(config.duration);   //动画时间
            this.direction = parseInt(config.direction) == 0 ? 0 : 1;   //方向
            this.directionFlag = 0; //正负轴方向 -1当前方向的负轴 1当前方向的正轴
            this.current = parseInt(config.start) || 0; //当前页
            this.loop = !!config.loop;    //循环
            this.mouse = config.mouse == null ? true : !!config.mouse;
            this.mousewheel = !!config.mousewheel; //滚轮
            this.interval = parseInt(config.interval) || 5000;
            this.playing = !!config.autoplay; //自动播放
            this.arrowkey = !!config.arrowkey;
            this.frozen = !!config.freeze;
            this.pages = children(this.container);
            this.length = this.pages.length; //总页数
            this._mouseLock = false;
            this.loopPage = true;
            this._isDestroy = false;
            this.isSlideing = false;  //是否正在翻页中;

            this.downMove = false;              //判断鼠标是否是按下的
            this.longPageStartPoint = [0,0];    //记录长页时 手指点击屏幕时的初始坐标位置

            this.longPageMovePoint = [0,0];     //记录长页时 当前手指在屏幕的坐标位置
            this.longPageLastPoint = [0,0];     //记录长页时 最近上次手指在屏幕的作品位置
            this.longPageSpeed = [0,0];         //记录长页时 X轴与Y轴两个方向的速度

            this.longPageTime = 0;              //记录长页时 当前滑动时刻的时间
            this.longPageLastTime = 0;          //记录长页时 最近上次滑动的时间
            this.longPageSpendTime = 0;         //记录长页时 每次滑动偏移距离所花费的时间

            this.longPageTranslateY = 0;        //记录长页时 Y方向当前偏移的距离  距离随着滑动而增加
            this.longPageTranslateYStart = 0;   //记录长页时 Y方向在最初的时候偏移的距离
            this.longPageInterval = null;       //记录长页时 惯性滑动的定时器
            this.longPageObj = null;            //记录长页时 要滑动的长页对象
            this.scrollBarDom = null;           //长页的滚动条DOM对象
            this.canToOtherPage = true;         //是否可以翻到下一页或者上一页

            this.isPullBack = false;            //记录是否在下拉回弹或者上拉回弹
            this.isDownPulBack = false;         //记录下来回弹是否按下
            this.pullBackPageDomObj = null;     //记录打动回弹页的DOM对象
            this.pullBackTranslateY = 0;        //记录回弹页Y方向当前的偏移距离  距离随着滑动而增加
            this.pullBackTranslateYStart = 0;   //记录回弹仪Y方向最初的偏移距离

            this.numFingerOnScreen = 0;

            this.translatYValue = 0; //长页滑动y轴滑动的距离，初始默认为0；
            this.pageData = [];
            this.filterCla = config.filterCla || "";//拖拽过滤类对象
            //add by fishYu 2016-4-8 18:34 增加一个回调函数
            this.callback = config.callback;    //回调方法
            //dms.MagazineDisplay2  ---- obj
            this.dependentObj = config.dependentObj;

            //    console.log(STARTEVENT);
//            addListener(this.container, STARTEVENT.join(" ") + " click" + (this.mousewheel ? " mousewheel DOMMouseScroll" : ""), handler);
            //modify by fishYu 2016-4-27 10:11 阻止滑动滚动事件
            addListener(this.container, STARTEVENT.join(" ") + " click", handler);
            addListener(this.container, MOVEEVENT.join(" ") + (this.arrowkey ? " keydown" : ""), handler);

            each(this.pages, function (page) {
                self.pageData.push({
                    percent: 0,
                    cssText: page.style.cssText || ''
                });
                self.initStyle(page);
            });

            if (this.pages[this.current]) {
                this.pages[this.current].style.display = 'block';
            }

            this.on({
                before: function () {
                    clearTimeout(this.playTimer);
                },
                dragStart: function () {
                    clearTimeout(this.playTimer);
                    removeRange();
                },
                after: this.firePlay,
                update: null
            }).firePlay();

            //this.comment=document.createComment(' Powered by pageSwitch v'+this.version+'  https://github.com/qiqiboy/pageSwitch ');
            //this.container.appendChild(this.comment);

            this.setEase(config.ease);
            // console.log(config.transition);
            this.setTransition(config.transition);
        },
        initStyle: function (elem) {
            var style = elem.style,
                ret;
            each("position:absolute;top:0;left:0;width:100%;height:100%;display:none".split(";"), function (css) {
                ret = css.split(":");
                style[ret[0]] = ret[1];
            });
            return elem;
        },
        mouseLock: {
            get: function () {
                return this._mouseLock;
            },
            set: function (value) {

                this._mouseLock = value;
            }
        },
        setEase: function (ease) {
            this.ease = isFunction(ease) ? ease : EASE[ease] || EASE.ease;
            return this;
        },
        addEase: function (name, func) {
            isFunction(func) && (EASE[name] = func);
            return this;
        },
        setTransition: function (transition) {
            // console.log(TRANSITION);
            // console.log(this.events.update);
            //console.log(TRANSITION[transition],transition);
            this.events.update.splice(0, 1, isFunction(transition) ? transition : TRANSITION[transition] || TRANSITION.slide);
            return this;
        },
        addTransition: function (name, func) {
            isFunction(func) && (TRANSITION[name] = func);
            return this;
        },
        isStatic: function () {
            return !this.timer && !this.drag;
        },
        //重置容器样式
        resetContainerStyle: function () {
            //this.container.style["transform"] = "translateZ(0px) rotateX(0deg)";
        },
        on: function (ev, callback) {
            var self = this;
            if (type(ev) == 'object') {
                // {dragStart:function(){}}
                each(ev, function (ev, callback) {
                    self.on(ev, callback);
                });
            } else {
                if (!this.events[ev]) {
                    this.events[ev] = [];
                }
                this.events[ev].push(callback);
            }
            return this;
        },
        fire: function (ev) {
            var self = this,
                args = slice.call(arguments, 1);
            // console.log(this.events);
            //    console.log(this.events[ev],ev);
            each(this.events[ev] || [], function (func) {
                if (isFunction(func)) {
                    func.apply(self, args);
                }
            });
            return this;
        },
        freeze: function (able) {
            this.frozen = able == null ? true : !!able;
            return this;
        },
        stopAnimat: function (_dom) {
            // var aniList = _dom.find(".animated");
            // for(var i=0;i<aniList.length;i++){
            //     if(aniList[i]&&aniList[i].className.indexOf("animated")>=0){
            //         $(aniList[i]).css({"animation-play-state":"paused","-webkit-animation-play-state":"paused"});
            //         // $(aniList[i]).css("-webkit-animation-play-state","paused");
            //     }
            // }
            // debug.log(11111);
        },
        startAnimat: function (_dom) {
            // var aniList = _dom.find(".animated");
            // for(var i=0;i<aniList.length;i++){
            //     if(aniList[i]&&aniList[i].className.indexOf("animated")>=0){
            //         $(aniList[i]).css({"animation-play-state":"running","-webkit-animation-play-state":"running"});
            //         // $(aniList[i]).css("animation-play-state","running");
            //         // $(aniList[i]).css("-webkit-animation-play-state","running");
            //     }
            // }
            // debug.log(222222222);
        },
        slide: function (index, PcDirFlag) {
            if (this.isSlideing) {
                return;             //上一个动画为播放完
            }
            this.isSlideing = true;
            this.resetContainerStyle();
            var self = this,
                dir = this.direction,
                dirFlag = this.directionFlag,
                duration = this.duration,
                stime = +new Date,
                ease = this.ease,
                current = this.current,
                fixIndex = Math.min(this.length - 1, Math.max(0, this.fixIndex(index))),
                cpage = this.pages[current], //当前页
                percent = this.getPercent(),
                tIndex = this.fixIndex(fixIndex == current ? current + (percent > 0 ? -1 : 1) : fixIndex),
                tpage = this.pages[tIndex];
            this.fixBlock(current, tIndex);
            this.fire('before', current, fixIndex);
            this.current = fixIndex;
            if (fixIndex == current) {
                dirFlag = 0;
                if (tpage) {
                    //modify by fishYu 2016-4-7 21:05 注释掉在android手机的QQ和微信里面会有问题
                    tpage.style.display = "none";
                }
                delete self.timer;
                self.isTransing = false;
                self.isSlideing = false;
                self.fire('after', fixIndex, current);

            } else {
                if ((self.length != 2) && (((fixIndex - current) == 1) || (!fixIndex && ((current + 1) == self.length)))) {
                    dirFlag = -1;
                } else if (self.length != 2) {
                    dirFlag = 1;
                }
                if (PcDirFlag) {
                    dirFlag = PcDirFlag;
                }
                // debug.log("slideeeeeeeee!!!!!!!!!");
                this.events.update[0].call(this, cpage, dirFlag, tpage, 0, duration, function () {
                    self.isTransing = false;
                    self.isSlideing = false;
                    //self.translatYValue = 0;
                    // self.startAnimat($(tpage));
                    self.fire('after', fixIndex, current);
                    //modify by fishYu 2016-4-7 21:05 注释掉在android手机的QQ和微信里面会有问题
//                    cpage.style.display = "none";
                    var gulpBar = $.find("#gulpProgress")[0];
                    gulpBar.style["transition"] = "opacity 800ms";
                    gulpBar.style["transition-delay"] = "1s";
                    gulpBar.style.opacity = "0";

                });
            }

            return this;
        },
        prev: function () {
            return this.slide(this.current - 1);
        },
        next: function () {
            return this.slide(this.current + 1);
        },
        play: function () {
            this.playing = true;
            return this.firePlay();
        },
        firePlay: function () {
            // console.log("firePlay");
            // if(tempIndex == 1){
            //     throw new Error("SB");
            // }
            tempIndex++;
            var self = this;
            if (this.playing) {
                //add by chenshy
                if (!self.loop) {
                    if (self.current == self.pages.length - 1) {
                        return;
                    }
                }

                if (this._isDestroy) return;
                this.playTimer = setTimeout(function () {
                    self.slide((self.current + 1) % (self.loop ? Infinity : self.length));
                }, this.interval);
            }
            return this;
        },
        setInterval: function (interval) {
            window.clearInterval(this.playTimer);
            this.interval = interval;
            //console.log("setInterval");
            this.firePlay();
        },
        pause: function () {
            this.playing = false;
            clearTimeout(this.playTimer);
            return this;
        },
        fixIndex: function (index) {
            return this.length > 1 && this.loop ? (this.length + index) % this.length : index;
        },
        fixBlock: function (cIndex, tIndex) {
            each(this.pages, function (page, index) {
                if (cIndex != index && tIndex != index) {
                    page.style.display = 'none';
                } else {
                    page.style.display = 'block';
                }
            });
            return this;
        },
        fixUpdate: function (cPer, cIndex, tIndex) {
            var pageData = this.pageData,
                cpage = this.pages[cIndex],
                tpage = this.pages[tIndex],
                tPer;
            pageData[cIndex].percent = cPer;
            if (tpage) {
                tPer = pageData[tIndex].percent = cPer > 0 ? cPer - 1 : 1 + cPer;
            }
            return this.fire('update', cpage, cPer, tpage, tPer);
        },
        getPercent: function (index) {
            var pdata = this.pageData[index == null ? this.current : index];
            return pdata && (pdata.percent || 0);
        },
        getOffsetParent: function () {
            var position = getStyle(this.container, 'position');
            if (position && position != 'static') {
                return this.container;
            }
            return this.container.offsetParent || DOC.body;
        },

        checkMouseDown: function (event) {
            return event.type == "touchstart" || event.type == "mousedown";
        },
        checkMouseMove: function (event) {
            return event.type == "touchmove" || event.type == 'mousemove';
        },
        checkMouseUp: function (event) {
            return event.type == "touchend" || event.type == 'mouseup';
        },
        isLongPage: function () {
            var page = this.pages[this.current];
            var parentDom = page.parentNode;
            var id = "";
            if (parentDom){
                id = parentDom.id;
            }
            var container = page.querySelector(("*[data-type='stage']"));
            var containerHeight = 0;
            if (container && id.indexOf("inner-wrapper") > -1 ){
                containerHeight = parseInt(container.getAttribute("data-height"));
                return containerHeight > 1008;
            }
            return false;
        },
        pullBack: function (event) {
            var self = this;
            if(!self.isDownPulBack) return;
            var cHeight = self.pullBackPageDomObj.parentNode.getBoundingClientRect().height;
            var cwidth = self.pullBackPageDomObj.getBoundingClientRect().width;
            var pointX = event.clientX - self.pullBackPageDomObj.getBoundingClientRect().left;
            var pointY = event.clientY - self.pullBackPageDomObj.parentNode.getBoundingClientRect().top;

            self.isPullBack = true;
            var disY = event.clientY -  self.longPageLastPoint[1];
            self.longPageLastPoint[1] = event.clientY;
            var moveDis = Math.abs(self.pullBackTranslateY - self.pullBackTranslateYStart);
            disY = disY * (1- moveDis/336);
            self.pullBackTranslateY += disY;
            if(pointY < 20 || pointY > (cHeight - 20) || pointX < 20 || pointX > (cwidth -20)){
                $(self.pullBackPageDomObj).css({
                    "transition": "all 0.8s",
                    "-webkit-transition": "all 0.8s"
                });
                $(self.pullBackPageDomObj).css({
                    "transform": "translateY(" + (self.pullBackTranslateYStart) + "px)",
                    "-webkit-transform": "translateY(" + (self.pullBackTranslateYStart) + "px)"
                });
                self.isPullBack = false;
                self.isDownPulBack = false;
                return;
            }

            $(self.pullBackPageDomObj).css({"transform": "translateY(" + (self.pullBackTranslateY) + "px)",
                "-webkit-transform": "translateY(" + (self.pullBackTranslateY) + "px)"

            });

        },
        //滑动处理
        handleEvent: function (oldEvent) {
            //console.log(oldEvent);
            var self = this;
            var checkHeight = 1008;
            var page = this.pages[this.current];
            //add by fishYu 2016-4-15 排除非当前显示容器
            var parentDom = page.parentNode;
            // var id = parentDom.id;
            var container = page.querySelector(("*[data-type='stage']"));

            var isLongPage0 = self.isLongPage();
            var eventPoint = oldEvent;
            if (oldEvent.type.indexOf("touch") > -1) {
                eventPoint = oldEvent.changedTouches[0];
            }
            var cHeight = container.parentNode.getBoundingClientRect().height;
            var cwidth = container.getBoundingClientRect().width;
            var pointX = eventPoint.clientX - container.getBoundingClientRect().left;
            var pointY = eventPoint.clientY - container.parentNode.getBoundingClientRect().top;

            //add by fishYu 2016-4-11 9:56用于判断特定的上画显示隐藏子view querySelectorAll
            var meViewport = page.querySelector(("*[data-type='me-viewport']"));
            if(meViewport){
                var meViewportStyle = meViewport.style;
                var isShow = meViewportStyle.display == "none" ? false : true;
                //是长摘要页的时候
                var hasDataBar  = meViewport.getAttribute("data-bar");
            }

            if(self.checkMouseDown(oldEvent)){
//            if(isLongPage0 && self.checkMouseDown(oldEvent)){                                   //长页与拉动回弹的时候 touchstart事件
                //有多个手指的时候不处理
                if(oldEvent && oldEvent.touches && oldEvent.touches.length && oldEvent.touches.length >=2 ){
                    return;
                }
                var transYRegex = /\.*translateY\((.*)px\)/i;
                if(isLongPage0){
                    self.numFingerOnScreen++;
                    self.downMove = true;
                    self.scrollBarDom = $(container).find("#scrollBar").get(0);
                }
                //var cCortainer = cpage.querySelector(("*[data-type='stage']"));
                var firstPage = container.getAttribute("first-page");
                var lastPage = container.getAttribute("last-page");
                window.dms.notHScroll = false;
                window.dms.notVScroll = false;
                if((firstPage || lastPage) &&  !self.isPullBack){
                    self.isDownPulBack = true;
                    self.pullBackPageDomObj = container;
                    if(self.pullBackPageDomObj && self.pullBackPageDomObj.style.transform){
                        self.pullBackTranslateY = parseInt(transYRegex.exec(self.pullBackPageDomObj.style.transform)[1]);
                        self.pullBackTranslateYStart = parseInt(transYRegex.exec(self.pullBackPageDomObj.style.transform)[1]);
                    }
                    else if(self.pullBackPageDomObj && self.pullBackPageDomObj.style.WebkitTransform){
                        self.pullBackTranslateY = parseInt(transYRegex.exec(self.pullBackPageDomObj.style.WebkitTransform)[1]);
                        self.pullBackTranslateYStart = parseInt(transYRegex.exec(self.pullBackPageDomObj.style.WebkitTransform)[1]);
                    } else{
                        self.pullBackTranslateY = 0;
                        self.pullBackTranslateYStart = 0;
                    }
                    $(self.pullBackPageDomObj).css({
                        "transition": "none",
                        "-webkit-transition": "none"
                    });
                }
                clearInterval(self.longPageInterval);
                self.longPageInterval = null;                       //清除长页惯性滑动定时器
                self.longPageStartPoint[0] = eventPoint.clientX;    //初始化开始手指的坐标
                self.longPageStartPoint[1] = eventPoint.clientY;
                self.longPageLastPoint[0] = eventPoint.clientX;     //初始化最近上一次手指的坐标
                self.longPageLastPoint[1] = eventPoint.clientY;
                self.longPageMovePoint[0] = eventPoint.clientX;     //初始化当前手指位置的坐标
                self.longPageMovePoint[1] = eventPoint.clientY;
                self.longPageSpeed[0] = 0;                          //初始化长页滑动的速度
                self.longPageSpeed[1] = 0;
                self.longPageObj = $(container);                    //初始长页对象

                self.longPageLastTime = new Date().getTime();       //初始化最近一次滑动的时刻
                self.longPageTime = self.longPageLastTime;          //初始化当前滑动的时刻
                self.longPageSpendTime = 0;                         //初始化当前滑动所花费的时间

                //if(self.pullBackPageDomObj && self.pullBackPageDomObj.style.transform){
                //    self.longPageTranslateY = parseInt(transYRegex.exec(self.pullBackPageDomObj.style.transform)[1]);
                //    self.longPageTranslateYStart = parseInt(transYRegex.exec(self.pullBackPageDomObj.style.transform)[1]);
                //}

                if(self.longPageObj[0].style.transform){            //初始化长页对象在Y轴上的偏移距离
                    self.longPageTranslateY = parseInt(transYRegex.exec(self.longPageObj[0].style.transform)[1]);
                    self.longPageTranslateYStart = parseInt(transYRegex.exec(self.longPageObj[0].style.transform)[1]);
                }
                else if(self.longPageObj[0].style.WebkitTransform){            //初始化长页对象在Y轴上的偏移距离
                    self.longPageTranslateY = parseInt(transYRegex.exec(self.longPageObj[0].style.WebkitTransform)[1]);
                    self.longPageTranslateYStart = parseInt(transYRegex.exec(self.longPageObj[0].style.WebkitTransform)[1]);
                }
                else{
                    self.longPageTranslateY = 0;
                    self.longPageTranslateYStart = 0;
                }
                self.canToOtherPage = true;
            }
            if(isLongPage0 && self.checkMouseMove(oldEvent)){                                   //长页的时候 touchmove事件
                //有多个手指的时候不处理
                if(oldEvent && oldEvent.touches && oldEvent.touches.length && oldEvent.touches.length >=2 ){
                    return;
                }
//                if(!self.downMove) return;
                if(self.downMove) {
                    oldEvent.preventDefault();
                    var longPageHeight = parseInt(container.getAttribute("data-height"));
                    var longPageParentHeight = 1008;
                    self.longPageMovePoint[0] = eventPoint.clientX;
                    self.longPageMovePoint[1] = eventPoint.clientY;
                    self.longPageTime  = new Date().getTime();
                    self.longPageSpeed[0] = self.longPageMovePoint[0] - self.longPageLastPoint[0];
                    self.longPageSpeed[1] = self.longPageMovePoint[1] - self.longPageLastPoint[1];
                    self.longPageSpendTime = self.longPageTime - self.longPageLastTime;
                    self.longPageLastPoint[0] = eventPoint.clientX;
                    self.longPageLastPoint[1] = eventPoint.clientY;
                    self.longPageLastTime = self.longPageTime;
//                    self.longPageSpeed[0] *= 0;
//                    self.longPageSpeed[1] *= 0;
                    if((Math.abs(self.longPageSpeed[0]) > Math.abs(self.longPageSpeed[1])) && (!window.dms.notHScroll)){              //水平偏移大于垂直偏移的情况下
                        window.dms.notVScroll = true; //禁止垂直
                    }
                    if(pointX < 10 || pointX > (cwidth - 10) || pointY < 10 || pointY > (cHeight - 10)){   // 不在合法区域内
                        self.downMove = false;
                        self.isDownPulBack = false;
                        return;
                    }
                    if((!window.dms.notVScroll)){   //垂直偏移大于水平偏移的情况下
                        if(self.longPageSpeed[1] > 0){      //向上滑动的时候，如果有摘要页，显示，隐藏摘要页
                            if(meViewport) {    //有特殊浮层的时候
                                if (isShow) {    //浮层显示的情况，隐藏否层
                                    $(meViewport).removeClass("slideInFromBottom").addClass("slideOutToBottom");
                                    $(meViewport).on("webkitAnimationEnd", function () {
                                        meViewport.style.display = "none";
                                        //是长摘要页的时候
                                        if (hasDataBar) {
                                            $(meViewport).addClass("pro-wrapper");
                                            $(meViewport).scrollTop(0);
                                        }
                                        $(meViewport).removeClass("slideOutToBottom");
                                        $(meViewport).off("webkitAnimationEnd");
                                    });
                                    self.downMove = false;
                                    self.isDownPulBack = false;
                                    window.dms.notHScroll = false;
                                    window.dms.notVScroll = false;
                                    self.isPullBack = false;
                                    self.isDownPulBack = false;
                                    self.longPageSpeed[1] = 0;
                                    return;
                                }
                            }
                        }
                        if(Math.abs(self.longPageSpeed[0]) <= Math.abs(self.longPageSpeed[1])) {
                            window.dms.notHScroll = true; //禁止水平
                        }
                        if ((self.longPageTranslateYStart >= 0) && (self.longPageSpeed[1] > 0) && self.canToOtherPage) {//初始在顶部并且向下滑时
//                        console.log("翻到上一页");
                            self.downMove = false;
                            self.longPageSpeed[1] = 0;
                            self.drag = false;
                            self.longPageObj.css({"transform": "translateY(" + (0) + "px)",
                                "-webkit-transform": "translateY(" + (0) + "px)"

                            });
                            oldEvent.preventDefault();
                        }
                        else if ((self.longPageTranslateYStart == (longPageParentHeight - longPageHeight))
                            && (self.longPageSpeed[1] < 0) && self.canToOtherPage) { //初始在底部并且向上滑时
//                        console.log("翻到下一页");
                            self.downMove = false;
                            self.longPageSpeed[1] = 0;
                            self.drag = false;
                            oldEvent.preventDefault();
                        }
                        else {
                            //if(pointX < 10 || pointX > (cwidth - 10) || pointY < 10 || pointY > (cHeight - 10)){   // 不在合法区域内
                            //    self.downMove = false;
                            //    self.isDownPulBack = false;
                            //    window.dms.notHScroll = false;
                            //    window.dms.notVScroll = false;
                            //    console.log("ooooooooo");
                            //    return;
                            //}
                            var downArrow = null;
                            var horizontalArrow = null;
                            var leftArrow = null;
                            var rightArrow = null;
                            if($.find("#arrow")){
                                downArrow = $.find("#arrow")[0];
                                horizontalArrow = $.find("#arrowHorizontal")[0];
                                leftArrow = $(horizontalArrow).find("#arrow-left")[0];
                                rightArrow = $(horizontalArrow).find("#arrow-right")[0];
                            }
                            self.canToOtherPage = false;
                            self.longPageTranslateY += self.longPageSpeed[1];
                            $(self.scrollBarDom).css({
                                "opacity": "1",
                                "transition-delay": "0s",
                                "transition": "none"
                            });
                            //debug.log($(self.scrollBarDom).css("opacity"));
                            var scrollBarTranslateY = self.longPageTranslateY/(longPageParentHeight - longPageHeight) * 800 - self.longPageTranslateY; //滚动条的偏移距离
//                            debug.log(self.longPageTranslateY);
                            if (self.longPageTranslateY > 0 || self.longPageTranslateY < (longPageParentHeight - longPageHeight)) {    //滑到顶部或底部
                                self.longPageSpeed[1] = 0;
                                if(self.longPageTranslateY > 0){                                                                        //滑到顶部
                                    self.longPageObj.css({"transform": "translateY(" + (0) + "px)",
                                        "-webkit-transform": "translateY(" + (0) + "px)"

                                    });
                                    $(self.scrollBarDom).css({
                                        "transform": "translateY(" + (0) + "px)",
                                        "-webkit-transform": "translateY(" + (0) + "px)"
                                    });
                                } else{                                                                                                 //滑到底部
                                    self.longPageObj.css({"transform": "translateY(" + (longPageParentHeight - longPageHeight) + "px)",
                                        "-webkit-transform": "translateY(" + (longPageParentHeight - longPageHeight) + "px)"

                                    });
                                    $(self.scrollBarDom).css({
                                        "transform": "translateY(" + (810 - longPageParentHeight + longPageHeight) + "px)",
                                        "-webkit-transform": "translateY(" + (810 - longPageParentHeight + longPageHeight) + "px)"
                                    });
                                    //最后一页并且滑到底部的时候，底部的箭头消失，如果右边还有组就右侧箭头出现
                                    var lastPage = container.getAttribute("last-page");
                                    var bookIndex = this.dependentObj.bookIndex + 1;
                                    var bookLength = this.dependentObj.bookLength;
                                    if(lastPage){
                                        downArrow && $(downArrow).hide();
                                        //f_slip_status获取组的是否禁止翻组的开关字段
                                        var slipStatus = self.dependentObj.getGroupFreezeStatus(self.dependentObj.bookIndex);
                                        if (bookIndex < bookLength ) {
                                            if (!slipStatus){   //增加对长页的提示显示判断
                                                horizontalArrow && $(horizontalArrow).show();
                                            }
                                            leftArrow && $(leftArrow).hide();
                                            rightArrow && $(rightArrow).show();
                                        }
                                    }
                                }
                                return;
                            }


                            //在滑动过程中
                            downArrow && $(downArrow).show();
                            horizontalArrow && $(horizontalArrow).hide();
                            $(self.scrollBarDom).css({
                                "transform": "translateY(" + (scrollBarTranslateY) + "px)",
                                "-webkit-transform": "translateY(" + (scrollBarTranslateY) + "px)"
                            });
                            self.longPageObj.css({
                                "transform": "translateY(" + (self.longPageTranslateY) + "px)",
                                "-webkit-transform": "translateY(" + (self.longPageTranslateY) + "px)"
                            });
                            return;
                        }
                    }
                }
            }
            if(isLongPage0 && self.checkMouseUp(oldEvent)){                                     //长页的时候 touchend事件
                var longPageHeight = parseInt(container.getAttribute("data-height"));
                var longPageParentHeight = 1008;
                self.downMove = false;
                self.isDownPulBack = false;
                window.dms.notHScroll = false;
                window.dms.notVScroll = false;
                if(!self.isPullBack){
                    if(self.longPageObj && self.longPageObj.get(0) != container) {
                        self.scrollBarDom && $(self.scrollBarDom).css({
                            "opacity": "0",
                            "transition": "opacity 800ms",
                            "transition-delay": "500ms"
                        });
                        return;
                    }
                    if(self.longPageSpeed[1] == 0) {
                        self.scrollBarDom && $(self.scrollBarDom).css({
                            "opacity": "0",
                            "transition": "opacity 800ms",
                            "transition-delay": "500ms"
                        });
                        return;
                    }

                    //// 滑动惯性最大为100
                    //if(Math.abs(self.longPageSpeed[1]) > 100){
                    //    self.longPageSpeed[1] = 100*Math.abs(self.longPageSpeed[1])/self.longPageSpeed[1];
                    //}

                    //Y轴方向每8毫秒位移的距离
                    self.longPageSpeed[1] = self.longPageSpeed[1]/self.longPageSpendTime * 8 ;

                    //var speedA = Math.abs(self.longPageSpeed[1])/70;
                    //speedA = speedA > 0.5 ? 0.5 : speedA;

                    self.longPageInterval = setInterval(function () {
                        var speedA = Math.abs(self.longPageSpeed[1])/60;
                        if(self.longPageSpeed[1] > 0){
                            self.longPageSpeed[1] -= speedA;
                        }
                        else if(self.longPageSpeed[1] < 0){
                            self.longPageSpeed[1] += speedA;
                        }

                        self.longPageTranslateY += self.longPageSpeed[1];


                        if(Math.abs(self.longPageSpeed[1]) < 0.5){
                            self.longPageSpeed[1] = 0;
                            clearInterval(self.longPageInterval);
                            self.longPageInterval = null;
//                        console.log("速度过小，停止滑动");
                            $(self.scrollBarDom).css({
                                "opacity": "0",
                                "transition": "opacity 800ms",
                                "transition-delay": "500ms"
                            });
                        }
                        if(self.longPageTranslateY >= 0) {
                            self.longPageTranslateY = 0;
                            self.longPageSpeed[1] = 0;
                            clearInterval(self.longPageInterval);
                            self.longPageInterval = null;
//                        console.log("到达顶部，停止滑动");
                            self.longPageObj.css({"transform": "translateY(" + (self.longPageTranslateY) + "px)",
                                "-webkit-transform": "translateY(" + (self.longPageTranslateY) + "px)"
                            });
                            $(self.scrollBarDom).css({
                                "transform": "translateY(" + (0) + "px)",
                                "-webkit-transform": "translateY(" + (0) + "px)",
                                "opacity": "0",
                                "transition": "opacity 800ms",
                                "transition-delay": "500ms"
                            });
                        } else if(self.longPageTranslateY <= (longPageParentHeight - longPageHeight)){
                            self.longPageTranslateY = longPageParentHeight - longPageHeight;
                            //self.longPageTranslateY = 0;
                            self.longPageSpeed[1] = 0;
                            clearInterval(self.longPageInterval);
                            self.longPageInterval = null;
//                        console.log("到达底部，停止滑动");
                            self.longPageObj.css({"transform": "translateY(" + (self.longPageTranslateY) + "px)",
                                "-webkit-transform": "translateY(" + (self.longPageTranslateY) + "px)"

                            });
                            $(self.scrollBarDom).css({
                                "transform": "translateY(" + (810 - longPageParentHeight + longPageHeight) + "px)",
                                "-webkit-transform": "translateY(" + (810 - longPageParentHeight + longPageHeight) + "px)",
                                "opacity": "0",
                                "transition": "opacity 800ms",
                                "transition-delay": "500ms"
                            });

                            //最后一页并且滑到底部的时候，底部的箭头消失，如果右边还有组就右侧箭头出现
                            var lastPage = container.getAttribute("last-page");
                            var bookIndex = self.dependentObj.bookIndex + 1;
                            var bookLength = self.dependentObj.bookLength;
                            var horizontalArrow = null;
                            var leftArrow = null;
                            var rightArrow = null;
                            if($.find("#arrowHorizontal")){
                                horizontalArrow = $.find("#arrowHorizontal")[0];
                                leftArrow = $(horizontalArrow).find("#arrow-left")[0];
                                rightArrow = $(horizontalArrow).find("#arrow-right")[0];
                            }
                            if(lastPage){
                                var downArrow = null;
                                if($.find("#arrow")){
                                    downArrow = $.find("#arrow")[0];
                                }
                                downArrow && $(downArrow).hide();
                                 //f_slip_status获取组的是否禁止翻组的开关字段
                                var slipStatus = self.dependentObj.getGroupFreezeStatus(self.dependentObj.bookIndex);
                                if (bookIndex < bookLength) {
                                    if (!slipStatus){       //增加一个长页滚动显示的判断
                                        horizontalArrow && $(horizontalArrow).show();
                                    }
                                    leftArrow && $(leftArrow).hide();
                                    rightArrow && $(rightArrow).show();
                                }
                            }
                        }else{
                            self.longPageObj.css({"transform": "translateY(" + (self.longPageTranslateY) + "px) translateZ(0px)",
                                "-webkit-transform": "translateY(" + (self.longPageTranslateY) + "px)  translateZ(0px)"

                            });
                            var scrollBarTranslateY = self.longPageTranslateY/(longPageParentHeight - longPageHeight) * 800 - self.longPageTranslateY; //滚动条的偏移距离
                            $(self.scrollBarDom).css({
                                "transform": "translateY(" + (scrollBarTranslateY) + "px) translateZ(0px)",
                                "-webkit-transform": "translateY(" + (scrollBarTranslateY) + "px) translateZ(0px)"
                            });
                        }
                    }, 8);
                }

            }
            this.isDown = true;
            var ev = filterEvent(oldEvent),
                canDrag = ev.button < 1 && ev.length < 2 && (!this.pointerType || this.pointerType == ev.eventType) && (this.mouse || ev.pointerType != 'mouse');
            // debug.log(ev.eventCode);
            //modify by  fishYu  2016-2-23 14：42 防止在微信或者QQ中下拉回弹。
            //add by fishYu 2016-3-16 16:23 为了使封面能滑动,通过判断can-move can属性来区分
            var canMove = ev.target.getAttribute("can-move") || "";
            if (ev.type == "touchmove" && !canMove) {
                  //TODO  后期会有个在微信或者QQ中下拉回弹。
                ev.preventDefault();
            }
            switch (ev.eventCode) {
                case 2:
                    //add by fishYu 是否可以翻页
                    var isFreeae = this.callback(ev);
                    if(!isFreeae) {
                        if (canDrag && this.rect && !this.isTransing) {
                            var cIndex = this.current, //当前第几页
                                dir = this.direction,
                                rect = [ev.clientX, ev.clientY],
                                _rect = this.rect,
                                offset = rect[dir] - _rect[dir],
                                cpage = this.pages[cIndex],
                                total = this.offsetParent[dir ? 'clientHeight' : 'clientWidth'],
                                tIndex, percent;
                            if (!this.drag && _rect.toString() != rect.toString()) {// && !this.isTransing
                                if (this.mouseLock && this.isTransing) {
                                    return;
                                }
                                this.resetContainerStyle();
                                var oo = rect[1 - dir] - _rect[1 - dir];
                                if (Math.abs(offset) > 40) {
                                    //this.drag = Math.abs(offset) >= Math.abs(oo);
                                    this.drag = (Math.abs(offset)/Math.abs(oo)) >= 2;    //判断滑动的角度，如果介于30度与60度之间 视为无法确定是水平滑还是垂直化，不做处理
                                }
                                this.directionFlag = 0;
                                //console.log(dir,"ddddddd");
                                if (this.drag &&( (dir && !window.dms.notVScroll) || (!dir && !window.dms.notHScroll) ) ) {
                                    if(dir == 1){           //如果垂直 就禁止水平
                                        window.dms.notHScroll = true;
                                    }
                                    if(dir == 0) {          //如果水平 就禁止垂直
                                        window.dms.notVScroll = true;
                                    }
                                    this.isTransing = true;
                                    this.directionFlag = offset > 0 ? 1 : -1;
                                    //add by fishYu 2016-4-11 9:56用于判断特定的上画显示隐藏子view querySelectorAll
//                                    var meViewport = cpage.querySelector(("*[data-type='me-viewport']"));
//                                    if(meViewport){
//                                        var meViewportStyle = meViewport.style;
//                                        var isShow = meViewportStyle.display == "none" ? false : true;
//                                        //是长摘要页的时候
//                                        var hasDataBar  = meViewport.getAttribute("data-bar");
//                                    }
                                    //TODO 向上1: -1 ，  向下 1:1,  需要变成数组，可能多个
                                    //垂直翻页的时候

                                    if(dir == 1 ){
                                        //add by fishYu 2016-4-22 11:22 判断是否是第一页或者最后一页
                                        var cCortainer = cpage.querySelector(("*[data-type='stage']"));
                                        var firstPage = cCortainer.getAttribute("first-page");
                                        var lastPage = cCortainer.getAttribute("last-page");
                                        //if(firstPage || lastPage){
                                        //    self.pullBackPageDomObj = cCortainer;
                                        //
                                        //}
                                        if(this.directionFlag == -1){   //向上滑页
                                            if(meViewport) {    //有特殊浮层的时候
                                                if (!isShow) {    //浮层隐藏的情况，显示否层
//                                                    meViewportStyle.display = "block";
                                                    //add by fishYu 2016-4-22 14:15 添加导览页的动画
                                                    meViewport.style.display = "block";
//                                                    meViewport.className = "slideInFromBottom";
                                                    $(meViewport).removeClass("slideOutToBottom").addClass("slideInFromBottom");
                                                    $(meViewport).on("webkitAnimationEnd",function(){
//                                                        meViewport.className = "";
                                                        $(meViewport).removeClass("slideInFromBottom");
                                                        $(meViewport).off("webkitAnimationEnd");
                                                    });
                                                    this._changeSlideStatus();

                                                } else {
                                                    if(lastPage){
                                                        //TODO 上拉回弹
                                                        this.drag = false;
                                                        //console.log("上拉回弹");
                                                        self.pullBack(ev);
                                                        this._changeSlideStatus();
                                                    }else{
                                                        this._dragStartAndSlide(cIndex,ev);
                                                    }
                                                    //是长摘要页的时候
                                                    setTimeout(function(){
                                                        if(hasDataBar){
                                                            $(meViewport).addClass("pro-wrapper");
                                                            $(meViewport).scrollTop(0);
                                                        }
                                                    }, 800);
                                                }
                                            }else{
                                                if(lastPage){
                                                    //TODO 上拉回弹
                                                    this.drag = false;
                                                    //console.log("上拉回弹");
                                                    self.pullBack(ev);
                                                    this._changeSlideStatus();
                                                }else{
                                                    this._dragStartAndSlide(cIndex,ev);
                                                }
                                            }
                                        }else if(this.directionFlag == 1){  //向下滑页
                                            if(meViewport) {    //有特殊浮层的时候
                                                if (isShow) {    //浮层显示的情况，隐藏否层
//                                                    meViewportStyle.display = "none";
                                                    //add by fishYu 2016-4-22 14:15 添加导览页的动画
//                                                    meViewport.className = "slideOutToBottom";
                                                    $(meViewport).removeClass("slideInFromBottom").addClass("slideOutToBottom");
                                                    $(meViewport).on("webkitAnimationEnd",function(){
                                                        meViewport.style.display = "none";
                                                        //是长摘要页的时候
                                                        if(hasDataBar){
                                                            $(meViewport).addClass("pro-wrapper");
                                                            $(meViewport).scrollTop(0);
                                                        }
//                                                        meViewport.className = "";
                                                        $(meViewport).removeClass("slideOutToBottom");
                                                        $(meViewport).off("webkitAnimationEnd");
                                                    });
                                                    this._changeSlideStatus();
                                                } else {
                                                    if(firstPage){
                                                        //TODO 下拉回弹
                                                        this.drag = false;
                                                        //console.log("下拉回弹");
                                                        self.pullBack(ev);
                                                        this._changeSlideStatus();
                                                    }else{
                                                        this._dragStartAndSlide(cIndex,ev);
                                                    }
                                                }
                                            }else{
                                                if(firstPage){
                                                    //TODO 下拉回弹
                                                    this.drag = false;
                                                    //console.log("下拉回弹");
                                                    self.pullBack(ev);
                                                    this._changeSlideStatus();
                                                }else{
                                                    this._dragStartAndSlide(cIndex,ev);
                                                }
                                            }
                                        }
                                    }else{
                                        //console.log("当前组----",this.dependentObj.bookIndex - this.directionFlag +1);
                                        //console.log("当前组----总页数",this.dependentObj.pageLength);
                                        //console.log("当前组----当前页",this.dependentObj.currentPage);
                                        //console.log("总组数",this.dependentObj.bookLength);
                                        //console.log("总页数",this.dependentObj.getAllPagesLength());
                                        var gulpBar = $.find("#gulpProgress")[0];
                                        var width = 100/this.dependentObj.bookLength;
                                        var bookIndex = this.dependentObj.bookIndex - this.directionFlag;
                                        bookIndex = bookIndex < 0 ? 0 : bookIndex;
                                        bookIndex = bookIndex >= this.dependentObj.bookLength ? this.dependentObj.bookLength - 1 : bookIndex;

                                        gulpBar.style["transition"] = "transform 800ms";
                                        gulpBar.style["-webkit-transition"] = "-webkit-transform 800ms";
                                        gulpBar.style.width = width+"%";
                                        gulpBar.style.opacity = "1";
                                        // 防止过渡失效，延迟一会再改变位置
                                        setTimeout(function(){
                                            gulpBar.style["transform"] = "translateX("+(bookIndex*100)+"%)";
                                            gulpBar.style["-webkit-transform"] = "translateX("+(bookIndex*100)+"%)";
                                        },10);
                                        this._dragStartAndSlide(cIndex,ev);
                                    }
                                }
                            }
                            if (this.drag && !this.isTransing) {
                                ev.preventDefault();
                            }
                        }
                    }
                    break;
                case 1:
                case 3:
                    if (canDrag) {
                        var self = this,
                            index = this.current,
                            percent = this.getPercent(),
                            isDrag, offset, tm, nn;
                        if (ev.length && (ev.eventCode == 1 || this.drag) && !this.isTransing) {
                            nn = ev.target.nodeName.toLowerCase();
                            clearTimeout(this.eventTimer);
                            if (!this.pointerType) {
                                this.pointerType = ev.eventType;
                            }
                            if (this.timer) {
                                cancelFrame(this.timer);
                                delete this.timer;
                            }
                            this.rect = [ev.clientX, ev.clientY];
                            this.percent = percent;
                            this.time = (+new Date);
                            this.offsetParent = this.getOffsetParent();
                            if (ev.eventType != 'touch' && (nn == 'img')) {//nn=='a' ||
                                ev.preventDefault();
                            }
                            //modify bu fishYu 2016-2-22 11:58 修改android不能解析二维码的BUG // && (ev.eventType!='touch' && nn=='img')
                            if (nn != "a" && nn != "input" && nn != "label" && nn != "textarea" && (ev.eventType != 'touch' && nn == 'img')) { //&& isPrevent
                                ev.preventDefault();
                            }
                            // isPrevent = true;
                            window.dms.notHScroll = false;
                            window.dms.notVScroll = false;
                        } else if (tm = this.time) {
                            window.dms.notHScroll = false;
                            window.dms.notVScroll = false;
                            self.isDownPulBack = false;
                            offset = this._offset;
                            isDrag = this.drag;
                            each("rect drag time percent _offset offsetParent".split(" "), function (prop) {
                                delete self[prop];
                            });
                            nn = ev.target.nodeName.toLowerCase();
                            if (nn != "a" && nn != "input" && nn != "label" && nn != "textarea") {
                                //modify by fishYu 2016-4-29 17:17 兼容三星手机点击不灵敏。
//                                ev.preventDefault();
                            }
                            if (percent) {
                                //            this.slide(index);
                            } else if (isDrag) {
                                //           this.firePlay()
                            }

                            this.eventTimer = setTimeout(function () {
                                delete self.pointerType;
                            }, 400);
                            if(self.isPullBack) {
                                $(self.pullBackPageDomObj).css({
                                    "transition": "all 0.8s",
                                    "-webkit-transition": "all 0.8s"
                                });
                                $(self.pullBackPageDomObj).css({
                                    "transform": "translateY(" + (self.pullBackTranslateYStart) + "px)",
                                    "-webkit-transform": "translateY(" + (self.pullBackTranslateYStart) + "px)"
                                });
                                self.isPullBack = false;
                            }
                        }
                    }
                    break;

                case 4:
                    if (this.timer) {
                        ev.preventDefault();
                    }
                    break;

                case 5:
                    ev.preventDefault();
                    if (this.isStatic() && +new Date - this.latestTime > Math.max(1000 - this.duration, 0)) {
                        var wd = ev.wheelDelta || -ev.detail;
                        Math.abs(wd) >= 3 && this[wd > 0 ? 'prev' : 'next']();
                    }
                    break;

                case 6:
                    var nn = ev.target.nodeName.toLowerCase();
                    if (this.isStatic() && nn != 'input' && nn != 'textarea' && nn != 'select') {
                        switch (ev.keyCode || ev.which) {
                            case 33:
                            case 37:
                            case 38:
                                this.prev();
                                break;
                            case 32:
                            case 34:
                            case 39:
                            case 40:
                                this.next();
                                break;
                            case 35:
                                this.slide(this.length - 1);
                                break;
                            case 36:
                                this.slide(0);
                                break;
                        }
                    }
                    break;
            }
        },
        _dragStartAndSlide: function(cIndex,ev){
            this.fire('dragStart', ev);
            if(this.loopPage){
                var tIndex = this.fixIndex(cIndex - this.directionFlag);
                this.slide(tIndex);

            }else{
                this._changeSlideStatus();
                this.loopPage = true;
            }
        },
        _changeSlideStatus : function(){
            this.isTransing = false;
            this.isSlideing = false;
        },
        destroy: function () {
            var pageData = this.pageData;
            this._isDestroy = true;
//            offListener(this.container, STARTEVENT.join(" ") + " click" + (this.mousewheel ? " mousewheel DOMMouseScroll" : ""), this.handler);
            //modify by fishYu 2016-4-27 10:12 阻止滑轮滚动事件
            offListener(this.container, STARTEVENT.join(" ") + " click", this.handler);
            offListener(DOC, MOVEEVENT.join(" ") + (this.arrowkey ? " keydown" : ""), this.handler);

            each(this.pages, function (page, index) {
                page.style.cssText = pageData[index].cssText;
            });

            this.length = 0;

            return this.pause();
        },
        append: function (elem, index) {
            if (null == index || index === undefined) {
                index = this.pages.length;
            }
            this.pageData.splice(index, 0, {
                percent: 0,
                cssText: elem.style.cssText
            });
            this.pages.splice(index, 0, elem);
            this.container.appendChild(this.initStyle(elem));

            this.length = this.pages.length;

            if (index <= this.current) {
                this.current++;
            }

            return this;
        },
        prepend: function (elem) {
            return this.append(elem, 0);
        },
        insertBefore: function (elem, index) {
            return this.append(elem, index - 1);
        },
        insertAfter: function (elem, index) {
            return this.append(elem, index + 1);
        },
        remove: function (index) {
            this.container.removeChild(this.pages[index]);
            this.pages.splice(index, 1);
            this.pageData.splice(index, 1);

            this.length = this.pages.length;

            if (index <= this.current) {
                this.slide(this.current = Math.max(0, this.current - 1));
            }

            return this;
        }
    }

    each("Ease Transition".split(" "), function (name) {
        struct['add' + name] = struct.prototype['add' + name];
    });
    ROOT.pageSwitch = struct;

})(window, function (wrap, config) {
    this.container = typeof wrap == 'string' ? document.getElementById(wrap) : wrap;
    this.init(config || {});
});
