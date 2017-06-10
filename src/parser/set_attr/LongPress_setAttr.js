// 文件名称: LongPress_setAttr
//
// 创 建 人: fishYu
// 创建日期: 2015/10/28 19:05
// 描    述: LongPress_setAttr
dms.LongPress.createObject = function(item, scriptParser){
    var displayObject = new dms.LongPress();
    //displayObject.userData = item;
    //ROSetItemId.call(displayObject,item, scriptParser);
    return displayObject;
};
dms.LongPress.prototype.resetAttribute = function(){
    dms.RenderObject.prototype.resetAttribute.call(this);
    this.timeOutEvent = 0;//定时器
    var self = this;
    if(this.userData){
        var item = this.userData;
        var el = this.contentElement;
        var color = item.item_color;    //备注长按的颜色必须是rgb(125,147,236);的形式
        var fontSize = item.font_size;
        var itemVal = item.item_val;
        var itemBorder = item.item_border;  //边框宽度
        var bdRadius = item.bd_radius;      //边框圆角
        el.style.width = item.item_width + "px";
        el.style.height = item.item_height + "px";
        if(color){
            el.style.color = color;
        }
        if(fontSize){
            el.style.fontSize = fontSize;
        }
        el.style.userSelect = "none";
        el.style.WebkitUserSelect = "none";
//        el.parentNode.className = "noDownLoad";
        $(el.parentNode).addClass("noDownLoad");
//        el.className = "icon-fingerprint noDownLoad";  //固定死的 指纹信息

//        $(el).addClass("icon-fingerprint noDownLoad");    //为了多段动画修改 created by fishYu 2016-1-19
        $(el).attr("data-type","me-fingerprint");
        //四个角的边框
        var corner1 = document.createElement("div");
        var corner1Style = corner1.style;
        corner1Style.position = "absolute";
        corner1Style.zIndex = "5"
        corner1Style.left = "0";
        corner1Style.top = "0";
        corner1Style.width = item.item_width / 6 + "px";
        corner1Style.height = item.item_height / 6 + "px";
        if(bdRadius){
            corner1Style.borderTopLeftRadius = bdRadius;
        }
        corner1Style.border = "0";
        corner1Style.borderTop = itemBorder + "px solid " + color;
        corner1Style.borderLeft = itemBorder + "px solid " + color;
        el.appendChild(corner1);

        var corner2 = document.createElement("div");
        var corner2Style = corner2.style;
        corner2Style.position = "absolute";
        corner2Style.zIndex = "5"
        corner2Style.top = "0";
        corner2Style.right = "0";
        corner2Style.width = item.item_width / 6 + "px";
        corner2Style.height = item.item_height / 6 + "px";
        corner2Style.border = "0";
        if(bdRadius){
            corner2Style.borderTopRightRadius = bdRadius;
        }
        corner2Style.borderTop = itemBorder + "px solid " + color;
        corner2Style.borderRight = itemBorder + "px solid " + color;
        el.appendChild(corner2);

        var corner3 = document.createElement("div");
        var corner3Style = corner3.style;
        corner3Style.position = "absolute";
        corner3Style.zIndex = "5"
        corner3Style.left = "0";
        corner3Style.bottom = "0";
        corner3Style.width = item.item_width / 6 + "px";
        corner3Style.height = item.item_height / 6 + "px";
        if(bdRadius){
            corner3Style.borderBottomLeftRadius = bdRadius;
        }
        corner3Style.border = "0";
        corner3Style.borderBottom = itemBorder + "px solid " + color;
        corner3Style.borderLeft = itemBorder + "px solid " + color;
        el.appendChild(corner3);

        var corner4 = document.createElement("div");
        var corner4Style = corner4.style;
        corner4Style.position = "absolute";
        corner4Style.zIndex = "5"
        corner4Style.bottom = "0";
        corner4Style.right = "0";
        corner4Style.width = item.item_width / 6 + "px";
        corner4Style.height = item.item_height / 6 + "px";
        if(bdRadius){
            corner4Style.borderBottomRightRadius = bdRadius;
        }
        corner4Style.border = "0";
        corner4Style.borderBottom = itemBorder + "px solid " + color;
        corner4Style.borderRight = itemBorder + "px solid " + color;
        el.appendChild(corner4);
        var rgbaColor = color.substring(3, color.lastIndexOf(")"));
        //动画线条
        if(!this.popupDiv){
            this.popupDiv = document.createElement("div");
        }
        this.popupDiv.className = "noDownLoad fingerprint-move";
        this.popupDiv.style.width = (item.item_width - 30) + "px";
        this.popupDiv.style.height = "1px";
        this.popupDiv.style.position = "absolute";
        this.popupDiv.style.zIndex = "6";
        this.popupDiv.style.top = "97%";
        this.popupDiv.style.left = "15px";
//        this.popupDiv.style.border = "1px solid " + color;
        this.popupDiv.style.boxShadow = "0px 2px 4px "+ ("rgba" + rgbaColor+", .35)");
        this.popupDiv.style.WebkitBoxShadow = "0px 2px 4px "+ ("rgba" + rgbaColor+", .35)");
        this.popupDiv.style.background = "-webkit-linear-gradient(left, "+("rgba" + rgbaColor+", 0)")+", "+color+" 50%, "+("rgba" + rgbaColor+", 0)")+")";
        el.appendChild(this.popupDiv);
        //最上层
        var topDiv = document.createElement("div");
        topDiv.className  = "noDownLoad";
        var topDivStyle = topDiv.style;
        topDivStyle.position = "absolute";
        topDivStyle.zIndex = "7"
        topDivStyle.left = "0";
        topDivStyle.top = "0";
        topDivStyle.width = item.item_width + "px";
        topDivStyle.height = item.item_height  + "px";
        topDivStyle.border = "0";
        el.appendChild(topDiv);
        var itemHref = item.item_href;
        //modify by fishYu 2016-3-3 16:41 打开网页方式
        var openLinkWay = item.open_link_way;
    }
    //有长按元素的页面图片点击事件穿透
    $(this.parent.element).find("img").css("pointer-events", "none");
    var hastouch = dms.isPC() ? false : true;
    var tapstart = hastouch ? "touchstart" : "mousedown",
        tapmove = hastouch ? "touchmove" : "mousemove",
        tapend = hastouch ? "touchend" : "mouseup";
    this.addEventListener(tapstart, function (e) {
        e.preventDefault();
        e.stopPropagation();
        //modify by fishYu 2016-3-3 16:41 打开网页方式
        //modify by fishYu 2016-4-18 19:07 兼容之前的长按点击事件
        self.goTouchStart(self.eventList['meTap']);
        return false;
    });

    this.addEventListener(tapmove, function (e) {
        e.preventDefault();
        e.stopPropagation();
        self.goTouchMove();
        return false;
    });

    this.addEventListener(tapend, function (e) {
        e.preventDefault();
        e.stopPropagation();
        self.goTouchEnd();
        return false;
    });
};
