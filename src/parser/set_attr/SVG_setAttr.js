// 文件名称: SVG_setAttr
//
// 创 建 人: fishYu
// 创建日期: 2015/12/31 17:02
// 描    述: 设置SVG的属性
dms.SVG.createObject = function(item, scriptParser){
    var displayObject = new dms.SVG();
    //displayObject.userData = item;
    //ROSetItemId.call(displayObject,item, scriptParser);
    return displayObject;
};
dms.SVG.prototype.resetAttribute = function(){
    dms.RenderObject.prototype.resetAttribute.call(this);
	var self = this;
    if(this.userData){
		var item = this.userData;
		var el = this.contentElement;
        var style = el.style;
		style.width = item.item_width + "px";
		style.height = item.item_height + "px";
        var itemVal = item.item_val;
        if(!itemVal){
            return;
        }
        //modify by fishYu 2016-12-30 13:04 替换回来<>
        itemVal = itemVal.replace(/&lt;/g,"<").replace(/&gt;/g,">");
        el.innerHTML = itemVal;
        //modify by fishYu 2016-3-3 16:18 设置SVG的宽高
        var mySVG = el.querySelector("svg");
        mySVG.style.height = "100%";
        mySVG.style.width = "100%";
        var itemValSub = item.item_val_sub;
        //转换成JSON对象
        itemValSub = dms.toJSON(itemValSub);
        var delay = 0;
        if(itemValSub.delay){
            delay = itemValSub.delay
        }
        var duration = 1;
        if(itemValSub.duration){
            duration = itemValSub.duration;
        }
        var infinite = "1";
        if(itemValSub.infinite){
            infinite = itemValSub.infinite;
        }
        var a1 = 0;
        if(itemValSub.a1){
            a1 = parseInt(itemValSub.a1);
        }
        var a2 = 0;
        if(itemValSub.a2){
            a2 = parseInt(itemValSub.a2);
        }
        var b1 = 0;
        if(itemValSub.b1){
            b1 = parseInt(itemValSub.b1);
        }
        var b2 = 0;
        if(itemValSub.b2){
            b2 = parseInt(itemValSub.b2);
        }
        //获取SVG的路径
        //TODO 目前只支持路径的绘制动画
        var path = el.querySelector('path');
        if(!path){
            return;
        }
        var length = path.getTotalLength();
        var p0 = a1 / 100 * length;
        var p1 = a2/ 100 * length;
        var p2 = b1 / 100 * length;
        var p3 = b2 / 100 * length;
        path.style.transform = "matrix(1, 0, 0, 1, 0, 0)";
        path.style.strokeDasharray =  length;   //动画的总长度
        path.style.strokeDashoffset =  length;     //从多少长度开始动画
//        path.style.strokeDashoffset =  p0;     //从多少长度开始动画
//        path.style.strokeDasharray =  (p2-p1) +" , " +length; //动画的总长度
        //代码里面自定义，动态帧动画
        var cssArr = [];
        var dashName = "dash"+dms.getNewID();
        cssArr.push("@-webkit-keyframes "+dashName+" { " +
            "to {"+
                "stroke-dashoffset: -" +p2+ ";"+
                "stroke-dasharray: "+(p3-p2) +" , " +length+";"+
            "}"+
        "}"+
        "@keyframes "+dashName+" { " +
            "to {"+
                "stroke-dashoffset: -" +p2+ ";"+
                "stroke-dasharray: "+(p3-p2) +" , " +length+";"+
            "}"+
        "}");
        var styleNode = document.createElement("style");
        styleNode.type = "text/css";
        styleNode.id = "svg-animation-keyframes" +dms.getNewID();
        styleNode.innerHTML = cssArr.join("");
        document.head.appendChild(styleNode);

//        path.style.animation =  dashName + " "+duration+"s linear "+delay+"s "+infinite+" forwards";
//        path.style.WebkitAnimation =  dashName + " "+duration+"s linear "+delay+"s "+infinite+" forwards";
        path.style.WebkitAnimationName = dashName;
        path.style.WebkitAnimationDuration = duration + "s";
        path.style.WebkitAnimationTimingFunction = "linear";
        path.style.WebkitAnimationDelay = delay + "s";
        path.style.WebkitAnimationIterationCount= infinite;
        path.style.WebkitAnimationFillMode= "forwards";
        path.style.animationName = dashName;
        path.style.animationDuration = duration + "s";
        path.style.animationTimingFunction = "linear";
        path.style.animationDelay = delay + "s";
        path.style.animationIterationCount= infinite;
        path.style.animationFillMode= "forwards";
    }
};


