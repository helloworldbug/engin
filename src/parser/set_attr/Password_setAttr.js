// 文件名称: Password_setAttr
//
// 创 建 人: fishYu
// 创建日期: 2015/11/27 15:27
// 描    述: 设置密码属性
dms.Password.createObject = function(item, scriptParser){
    var displayObject = new dms.Password();
    //displayObject.userData = item;
    //ROSetItemId.call(displayObject,item, scriptParser);
    return displayObject;
};
dms.Password.prototype.resetAttribute = function(){
    dms.RenderObject.prototype.resetAttribute.call(this);
	var self = this;
    if(this.userData) {
        var item = this.userData;
        var itemVal = item.item_val;
        var itemValSub = item.item_val_sub || "";
        var itemHref = item.item_href || "请在此处输入密码";
        var itemWidth = item.item_width;
        var itemHeight = item.item_height;
        var fontSize = item.font_size;
        var itemColor = item.item_color;
        var borderWidth = item.item_border; //边框宽度
        var borderColor = item.bd_color || "#000";  //边框颜色
        var borderStyle = item.bd_style || "solid";
        self.endScript = item.animate_end_act;  //密码正确之后的操作
        //设置元素显示
        var el = this.contentElement;
        var style = el.style;
        style.width = itemWidth + "px";
        style.height = itemHeight + "px";
        //输入框
        var inputStyle  = this._passwordTxt.style;
        this._passwordTxt.placeholder = itemHref;
        inputStyle.width = itemWidth+ "px";
        inputStyle.fontSize = fontSize;
        inputStyle.lineHeight = itemHeight + "px";
        inputStyle.color = itemColor;
        inputStyle.height =itemHeight + "px";
        inputStyle.border = "none";
        inputStyle.textAlign = "center";
        inputStyle.background = "transparent";
//        inputStyle.paddingLeft = "30px";
        inputStyle.outline = "none";	//取消input和textarea的聚焦边框：
        inputStyle.resize = "none";	//取消textarea可拖动放大：
        //按钮
        var btnStyle = this._passwordBtn.style;
        this._passwordBtn.innerHTML = itemValSub;
        btnStyle.width = itemWidth / 3 + "px";
        btnStyle.height = itemHeight + "px";
        btnStyle.fontSize = fontSize;
        btnStyle.color = itemColor;
        btnStyle.textAlign = "center";
        btnStyle.lineHeight = itemHeight + "px";
        btnStyle.margin = "0 auto";
        btnStyle.marginTop = itemHeight * 0.8 + "px";
        btnStyle.display = "block";
        btnStyle.boxSizing = "border-box";
        btnStyle.borderLeft = borderWidth +  "px " +borderStyle +" "  + borderColor;
        var dataFor = item.data_for;
        var extAttr = item.ext_attr;    //允许输入错误的次数
        this.errorCount = 3;    //默认输入错误三次
        if(extAttr){
            this.errorCount = Number(extAttr);
        }
        if(this.passwordInfor){
            this.tplId = this.passwordInfor.tplId;
            this.tplType = this.passwordInfor.tplType;
            this.invalidDetail = this.passwordInfor.invalidDetail;
        }
        //历史错误信息
        this.historicalErrorCount = 0;
        //有失效详细信息
        if(self.invalidDetail){
            if(dms.isJsonObject(self.invalidDetail)){
                var invalidDetailObj = JSON.parse(self.invalidDetail);
                if(invalidDetailObj.ext_attr_31){
                    this.historicalErrorCount = Number(invalidDetailObj.ext_attr_31);
                }
            }
        }
        self.checkTxt = "123";   //默认密码
        if(dataFor){    //密码比对值
            self.checkTxt  = this.userProperties.item_val;
        }else{
            self.checkTxt = itemVal;
        }
    }
    self.addListener();
};

