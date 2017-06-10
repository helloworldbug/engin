// 文件名称: VideoPlayer
//
// 创 建 人: fishYu
// 创建日期: 2015/8/4 16:22
// 描    述: 视频播放器
// 文件名称: VideoPlayer
(function(dms){
    /**
     *
     * @param container 插入消息框的容器 DOM对象
     * @param content   消息提示的内容
     * @param msgBtnTxt   消息提示按钮的内容
     *@param callback   消息点击按钮的回调
     * @constructor
     */
    var MsgBox = function(container,content, msgBtnTxt, callback){
        this.__container = container;
        var self = this;
        //整个视频浮层
        if(!this._supernatantDiv){
            this._supernatantDiv = document.createElement("div");
        }
        var tapName = dms.getEventName();
        var style = this._supernatantDiv.style;
        style.position = "absolute";
        style.zIndex = "100000";
        style.left = "0";
        style.top = "0";
        style.width = "100%";
        style.height = "100%";
        style.backgroundColor = "rgba(0,0,0,.4)";

        //展示消息的div
        var msgDiv = document.createElement("div");
        var msgDivStyle = msgDiv.style;
        msgDivStyle.position = "relative";
        msgDivStyle.width = "460px";
        msgDivStyle.height = "246px";
        msgDivStyle.margin = "0 auto";
        msgDivStyle.top = "38%";
        msgDivStyle.background = "#FFFFFF";
        msgDivStyle.borderRadius = "12px";
        //消息标题的div
        var titleDiv = document.createElement("div");
        titleDiv.innerHTML = content;
        var titleDivStyle = titleDiv.style;
        titleDivStyle.fontSize = "32px";
        titleDivStyle.textAlign = "center";
        titleDivStyle.color = "#000";
        titleDivStyle.width = "100%";
        titleDivStyle.height = "171px";
        titleDivStyle.lineHeight = "171px";
        titleDivStyle.position = "absolute";
        titleDivStyle.top = "0";
        //消息内容的div
//        var msgContentDiv = document.createElement("div");
//        msgContentDiv.innerHTML = content;
//        var msgContentDivStyle = msgContentDiv.style;
//        msgContentDivStyle.fontSize = "24px";
//        msgContentDivStyle.textAlign = "center";
//        msgContentDivStyle.color = "#000";
//        msgContentDivStyle.width = "100%";
//        msgContentDivStyle.position = "absolute";
//        msgContentDivStyle.top = "106px";
        //消息按钮的div
        var msgBtnDiv = document.createElement("div");
        msgBtnDiv.innerHTML = msgBtnTxt || "确认";
        var msgBtnDivStyle = msgBtnDiv.style;
        msgBtnDivStyle.position = "absolute";
        msgBtnDivStyle.bottom = "0";
        msgBtnDivStyle.fontSize = "28px";
        msgBtnDivStyle.textAlign = "center";
        msgBtnDivStyle.color = "#005BFF";
        msgBtnDivStyle.width = "100%";
        msgBtnDivStyle.height = "75px";
        msgBtnDivStyle.lineHeight = "75px";
        msgBtnDivStyle.border = "none";
        msgBtnDivStyle.borderTopWidth = "1px";
        msgBtnDivStyle.borderTopStyle = "solid";
        msgBtnDivStyle.borderTopColor = "#D3D3D7";
        msgBtnDivStyle.background  = "transparent";
        msgBtnDivStyle.outline = "0";	//取消聚焦边框：
        msgBtnDivStyle.WebkitUserSelect = "none";
        msgBtnDivStyle.userSelect = "none";
        msgBtnDivStyle.boxSizing = "border-box";
        msgBtnDivStyle.borderBottomRightRadius =  "12px";
        msgBtnDivStyle.borderBottomLeftRadius =  "12px";
        msgBtnDivStyle.letterSpacing = "2em";
        msgBtnDivStyle.paddingLeft = "55px";
//        msgBtnDiv.onclick = function(e){
        $(msgBtnDiv).on(tapName, function(e){
            e.stopPropagation();
            e.preventDefault();
            $(this).blur();
            self._destroy();
            if(callback)callback();
        });

        msgDiv.appendChild(titleDiv);
//        msgDiv.appendChild(msgContentDiv);
        msgDiv.appendChild(msgBtnDiv);
        this._supernatantDiv.appendChild(msgDiv);
        this.__container.appendChild(this._supernatantDiv);
    };

    MsgBox.prototype._destroy = function(content){
        if(this._supernatantDiv){
            this.__container.removeChild(this._supernatantDiv);
            this._supernatantDiv = null;
        }
    };
    dms.MsgBox = MsgBox;
})(dms);