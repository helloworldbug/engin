(function(dms){
    // 文件名称: dms.DisplayObject
//
// 创 建 人: chenshy
// 创建日期: 2015/6/15 16:25
// 描    述: 显示对象基类
    var DisplayObject = function(){
        if(!this.element){
            this.element = document.createElement("div");
        }

        var style = this.element.style;
        this._style = style;

        style.position = "absolute";
        //style.
//    style.overflow = "hidden";

        /**3d坐标**/
        this._x = 0;
        this._y = 0;
        this._z = 0;

        /**2d坐标**/
        this._left = 0;
        this._top = 0;

        /**透明度**/
        this._alpha = 1;

        /**3d旋转角度，如果只在2d平面旋转，只需设置rotationZ的值**/
        this._rotationX = 0;
        this._rotationY = 0;
        this._rotationZ = 0;

        /**缩放**/
        this._scaleX = 1;
        this._scaleY = 1;
        this._scaleZ = 1;

        /**宽度，高度**/
        this._width = 0;
        this._height = 0;

        /**大于这个宽高，加滚动事件**/
        this._scWidth = 640;
        this._scHeight = 1008;

        /**注册点，null为浏览器默认**/
        this._regX = null;
        this._regY = null;
        this._regZ = null;

        this._zIndex = dms.defaultDepth;
        this.maxChildrenDepth = 0;

        this.zIndex = this._zIndex;

        this.parent = null;

        /**背景图**/
        this._backgroundImage = null;

        /**背景颜色**/
        this._backgroundColor = null;

        this.children = [];
        this.numChildren = 0;

        this.left = 0;
        this.top = 0;

//    this._animateClassObjects = [];
    };
    /**
     *
     * 属性的getter setter 方法
     */
    DisplayObject.prototype = {
        /***********left**************/
        get left(){
            return this._left;
        },
        set left(value){
            this._left = value;
//        console.log(value);
            this._style.left = value + "px";
        },

        /***top****/
        get top(){
            return this._top;
        },
        set top(value){
            this._top = value;
            this._style.top = value + "px";
        },

        /**************x****************/
        get x(){
            return this._x;
        },
        set x(value){
            this._x = value;
            this.transform();
        },

        /**************y***************/
        get y(){
            return this._y;
        },
        set y(value){
            this._y = value;
            this.transform();
        },

        /**************z***************/
        get z(){
            return this._z;
        },
        set z(value){
            this._z = value;
            this.transform();
        },

        get width(){
            return this._width;
        },
        set width(value){
            this._width = value;
            this.element.style.width = value + "px";
        },

        get height(){
            return this._height;
        },
        set height(value){
            this._height = value;
            this.element.style.height = value + "px"
            //console.log("gg");
            //this.element.onscroll = function(){
            //    console.log("scroll");
            //};
        },

        get backgroundImage(){
            return this._backgroundImage;
        },

        set backgroundImage(value){
            this._backgroundImage = value;
            this.element.style.backgroundImage = "url("+value+")";
        },

        get backgroundColor(){
            return this._backgroundColor;
        },

        set backgroundColor(value){
            this._backgroundColor = value;
            this.element.style.backgroundColor = value;
        },

        get alpha(){
            return this._alpha;
        },
        set alpha(value){
            this._alpha = value;
            this.element.style.opacity = value;
        },

        get rotationX(){
            return this._rotationX;
        },
        set rotationX(value){
            this._rotationX = value;
            this.transform();
        },

        get rotationY(){
            return this._rotationY;
        },
        set rotationY(value){
            this._rotationY = value;
            this.transform();
        },

        get rotationZ(){
            return this._rotationZ;
        },
        set rotationZ(value){
            this._rotationZ = value;
            this.transform();
        },

        get rotation(){
            return this.rotationZ;
        },
        set rotation(value){
            this.rotationZ = value;
        },

        get scaleX(){
            return this._scaleX;
        },
        set scaleX(value){
            this._scaleX = value;
            this.transform();
        },

        get scaleY(){
            return this._scaleY;
        },
        set scaleY(value){
            this._scaleY = value;
            this.transform();
        },

        get scaleZ(){
            return this._scaleZ;
        },
        set scaleZ(value){
            this._scaleZ = value;
            this.transform();
        },

        get regX(){
            return this._regX;
        },
        set regX(value){
            this._regX = value;
            this.resetReg();
        },

        get regY(){
            return this._regY;
        },
        set regY(value){
            this._regY = value;
            this.resetReg();
        },

        get zIndex(){
            return this._zIndex;
        },
        set zIndex(value){
            this._zIndex = value;
            this.css2('zIndex', this.zIndex);
        }
//    ,
//
//    get regZ(){
//        return this._regZ;
//    },
//    set regZ(value){
//        this._regZ = value;
//        this.resetReg();
//    }

    };

    var p = DisplayObject.prototype;

    /**
     * 添加子对象
     * @param child
     */
    p.addChild = function(child){
        //this.maxChildrenDepth++;
        //child.zIndex = dms.defaultDepth + this.maxChildrenDepth;
        //
        //if(child.parent != this){
        //    this.children.push(child);
        //    this.numChildren++;
        //    this.element.appendChild(child.element);
        //    child.parent = this;
        //}

        this._setChild(child);
        this.contentElement.appendChild(child.element);
    };

    p._setChild = function(child){
        this.maxChildrenDepth++;
        child.zIndex = dms.defaultDepth + this.maxChildrenDepth;

        if(child.parent != this){
            this.children.push(child);
            this.numChildren++;
            child.parent = this;
        }
    };

    /**
     * 添加多个子节点
     * @param arrChild
     */
    p.addChildren = function(arrChild){
        var fragment = document.createDocumentFragment(),len = arrChild.length,
            child;
        for(var i = 0;i < len;i++){
            child = arrChild[i];
            this._setChild(child);
            fragment.appendChild(child.element);
        }

        //console.log(fragment);

        this.element.appendChild(fragment);
    };

    p.addChildAt = function(child,index){
        this.addChild(child);
        child.zIndex = index;
    };

    p.removeChild = function(child){
        var index;
        if((index = this.children.indexOf(child)) > -1){
            this.children.splice(index,1);
            this.numChildren--;
            this.element.removeChild(child.element);

            child.zIndex = dms.defaultDepth;
            child.parent = null;
//        obj.transform();
        }
    };

    p.addClass = function(className){
        dms.Css.addClass(this.element,className);
    };

    p.removeClass = function(className){
        dms.Css.removeClass(this.element,className);
    };

//dms.RenderObject.prototype.addAnimateClass = function(className){
//    this.addClass(className);
//};

    p.transform = function(){
        var translate = 'translate3d(' + (this._x) + 'px,' + (this._y) + 'px,' + this._z + 'px) ';
        var rotate = 'rotateX(' + this._rotationX + 'deg) ' + 'rotateY(' + this._rotationY + 'deg) ' + 'rotateZ(' + this._rotationZ + 'deg) ';
        var scale = 'scale3d(' + this._scaleX + ',' + this._scaleY + ',' + this._scaleZ + ') ';
//    var skew = 'skew(' + this.skewX + 'deg,' + this.skewY + 'deg)';
        this.css3('transform', translate + rotate + scale);
    };

    p.resetReg = function(){
        if(this._regX == 0 && this._regY == 0){
            throw new Error("SB");
        }
        if(this._regX === null && this._regY === null){
            this.css3('transformOrigin', "");
        }else{
            this._regX = this._regX || 0;
            this._regY = this._regY || 0;
            var regX = parseFloat(this._regX) * 100 + '%';
            var regY = parseFloat(this._regY) * 100 + '%';
//        console.log(regX,"哈哈",regY);
            this.css3('transformOrigin', regX + ' ' + regY);
        }
    };
//gyy by 2015/7/9 transformTime动画执行时间
    p.css3d = function(transformTime){
        this.element.parentNode.parentNode.style.webkitPerspective = "1000px";
        this.element.parentNode.parentNode.style.perspective = "1000px";
        this.element.parentNode.parentNode.style.overflow = "hidden";
        this.element.parentNode.style.backfaceVisibility = "hidden";
        this.element.parentNode.style.webkitTransformStyle = "preserve-3d";
        this.element.parentNode.style.transformStyle = "preserve-3d";
        this.element.parentNode.style.webkitTransition = "webkit-transform "+transformTime+"s";
        this.element.parentNode.style.transition = "transform "+transformTime+"s";
    }
//gyy by 2015/7/9 transformTime动画执行时间
    p.css2d = function(){
        this.element.parentNode.style.webkitTransformStyle = "flat";
        this.element.parentNode.style.transformStyle = "flat";
        this.element.parentNode.style.webkitTransition = "all 0s";
        this.element.parentNode.style.transition = "all 0s";
    }
//gyy by 2015/7/9  设置父类样式
    p.parentCss3 = function(style,value){
        dms.Css.css3(this.element.parentNode,style,value);
    }
    p.css3 = function(style,value){
        dms.Css.css3(this.element,style,value);
    };
    p.parentCss2 = function(style,value){
        dms.Css.css2(this.element.parentNode,style,value);
    }
    p.css2 = function(style,value){
        dms.Css.css2(this.element,style,value);
    };

    p.addEventListener = function(type, listener, useCapture) {
        this.element.addEventListener(type, listener, useCapture);
    };

    p.removeEventListener = function(type, listener, useCapture) {
        this.element.removeEventListener(type, listener, useCapture);
    };

    p.pp3D = function(element){
        element.style["-webkit-perspective"] = "1000";
        //可能会导致上下显示白边
        element.style["-webkit-backface-visibility"] = "hidden";
    };

    p.destroy = function(){
        for(var i = this.children.length - 1;i >= 0;i--){
            this.children[i].destroy();
        }
        this.children = [];
        this._animateClassObjects = [];
        this.element = null;
    };

    dms.DisplayObject = DisplayObject;
})(dms);