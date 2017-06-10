// 文件名称: LabelCreator
//
// 创 建 人: fishYu
// 创建日期: 2015/12/30 18:51
// 描    述: 标签创作者
// 文件名称: LabelCreator
(function(dms){
    /**
     *
     * @param container 添加复选框的容器 DOM对象
     * @param data   复选框对象的数据
     * @constructor
     */
    var LabelCreator = function(container,data) {
        this.__container = container;
        var self = this;
        var itemVal = data.item_val;
        var itemSubVal = data.item_val_sub;
        var itemWidth = data.item_width;
        var itemHeight = data.item_height;
        var direction = data.ext_attr;      //左或者右
        var fontSize = data.font_size;
        var itemColor = data.item_color;

        itemSubVal = JSON.parse(itemSubVal);
        var preDivBg = "";
        for(var key in itemSubVal){
            preDivBg = itemSubVal[key];
        }
        //动画模块
        var labelAnimateDiv = document.createElement("div");
        labelAnimateDiv.setAttribute("data-label", "label");
        var labelAnimateDivStyle = labelAnimateDiv.style;
        labelAnimateDivStyle.position = "relative";
        labelAnimateDivStyle.width = "32px";
        labelAnimateDivStyle.height = itemHeight + "px";
        labelAnimateDivStyle.float = direction;

        var preDiv = document.createElement("div");
        preDiv.setAttribute("data-label", "label");
        preDiv.setAttribute("data-label-sub", "label-animate");
        var preDivStyle = preDiv.style;
        preDivStyle.position = "absolute";
        preDivStyle.zIndex = 2;
        preDivStyle.width =  "100%";
        preDivStyle.height = "100%";
        preDivStyle.background = "url("+preDivBg+") no-repeat center";

        var preAnimateDiv = document.createElement("div");
        var preAnimateDivStyle = preAnimateDiv.style;
        preAnimateDivStyle.position = "absolute";
        preAnimateDivStyle.zIndex = 1;
        preAnimateDivStyle.width =  "32px";
        preAnimateDivStyle.height = "32px";
        preAnimateDivStyle.top = "calc(50% - 16px)";
        preAnimateDivStyle.left = "calc(50% - 16px)";
        preAnimateDivStyle.top = "-webkit-calc(50% - 16px)";
        preAnimateDivStyle.left = "-webkit-calc(50% - 16px)";
        preAnimateDivStyle.background = "rgba(0, 0, 0, 0.7)";
        preAnimateDivStyle.margin = "0 auto";
        preAnimateDivStyle.WebkitAnimationName = "player-button";
        preAnimateDivStyle.WebkitAnimationDuration = "1.6s";
        preAnimateDivStyle.WebkitAnimationIterationCount = "infinite";
        preAnimateDivStyle.WebkitAnimationTimingFunction = "linear";
        preAnimateDivStyle.borderRadius = "100%";



        //标签内容
        var labelDiv = document.createElement("div");
        labelDiv.innerHTML = itemVal;
        labelDiv.setAttribute("data-label", "label");
        var labelDivStyle = labelDiv.style;
        labelDivStyle.width = (itemWidth - 33) +"px";
        labelDivStyle.height = itemHeight + "px";
        labelDivStyle.fontSize = fontSize;
        labelDivStyle.lineHeight = itemHeight + "px";
        labelDivStyle.textAlign = "center";
        labelDivStyle.color = itemColor;
        labelDivStyle.border = "none";
        if(direction == "left"){
            labelDivStyle.float = "right";
            labelDiv.className = "label-text-left";
            labelDivStyle.borderBottomRightRadius = "10px";
            labelDivStyle.borderTopRightRadius = "10px";
        }else if(direction == "right"){
            labelDivStyle.float = "left";
            labelDiv.className = "label-text-right";
            labelDivStyle.borderBottomLeftRadius = "10px";
            labelDivStyle.borderTopLeftRadius = "10px";
        }
        this.__container.appendChild(labelAnimateDiv);
        labelAnimateDiv.appendChild(preDiv);
        labelAnimateDiv.appendChild(preAnimateDiv);
        this.__container.appendChild(labelDiv);
    };
    dms.LabelCreator = LabelCreator;
})(dms);