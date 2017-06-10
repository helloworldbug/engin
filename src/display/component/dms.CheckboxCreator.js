// 文件名称: CheckboxCreator
//
// 创 建 人: fishYu
// 创建日期: 2015/8/4 16:22
// 描    述: 复选框创作者
// 文件名称: CheckboxCreator
(function(dms){
    /**
     *
     * @param container 添加复选框的容器 DOM对象
     * @param data   复选框对象的数据
     * @constructor
     */
    var CheckboxCreator = function(container,data) {
        this.__container = container;
        var self = this;
        var itemVal = null;
        //预防JSON字符串解析出问题
        try{
            itemVal = JSON.parse(data.item_val);
        }catch (e){
            console.log(e.name + ": " + e.message);
            return;
        }
        if(itemVal == null){
            return;
        }
        //属性
        var title = itemVal.title;
        var options = itemVal.options;
        var bgColor = data.bg_color;
        var bdColor = data.bd_color || "#000000";
        var bdStyle = data.bd_style || "solid";
        var itemBorder = data.item_border;
        var itemColor = data.item_color;
        var fontSize = data.font_size;
        var fbField = data.fb_field;
        var objectId = data.objectId;
        //标题DIV
        var titleDiv = document.createElement("div");
        titleDiv.innerHTML = title+"（可多选）";
        var titleDivStyle = titleDiv.style;
        titleDivStyle.width = "100%";
        titleDivStyle.height = "100px";
        titleDivStyle.background = bgColor;
        titleDivStyle.fontSize = fontSize;
        titleDivStyle.color = itemColor;
        titleDivStyle.lineHeight = "100px";
        titleDivStyle.paddingLeft = "10px";
        titleDivStyle.boxSizing = "border-box";
        this.__container.appendChild(titleDiv);
        //选项DIV
        var len =  options.length;
        var checkboxName = "checkbox" + dms.getNewID();
        for(var i = 0; i <len; i++){
            var optionDiv = document.createElement("div");
            var optionDivStyle = optionDiv.style;
            optionDivStyle.width = "100%";
            optionDivStyle.height = "87px";
            optionDivStyle.fontSize = fontSize;
            optionDivStyle.color = "#000";
            optionDivStyle.lineHeight = "87px";
            optionDivStyle.paddingLeft = "10px";
            optionDivStyle.boxSizing = "border-box";
            optionDivStyle.verticalAlign = "middle";
            if(itemBorder && i !=(len-1) ){ //最后一项不添加边框
                optionDivStyle.borderBottom = itemBorder + "px " + bdStyle + " " + bdColor;
            }
            //多选框
            var checkboxId = "checkbox" + dms.getNewID();
            var optionCheck = document.createElement("input");
            optionCheck.setAttribute("data-type", "common-check-radio");
            optionCheck.type = "checkbox";
            optionCheck.name = checkboxName;
            optionCheck.value = options[i];
            optionCheck.id = checkboxId;
            var optionCheckStyle = optionCheck.style;
            optionCheckStyle.display = "none";
//            optionCheckStyle.width = "40px";
//            optionCheckStyle.height = "87px";
//            optionCheckStyle.background = bdColor;
//            optionCheckStyle.marginRight = "10px";
//            optionCheckStyle.float = "left";
//            if( i == 0){
//                optionCheck.setAttribute("checked", "checked");
//            }
            optionCheck.setAttribute("data-checkbox", "user-checkbox");	//添加字段输入
            optionCheck.setAttribute("data-objectId", objectId);	//添加元素 ID
            if(fbField){
                optionCheck.setAttribute("data-fb-field", fbField);
            }
            
            var optionLabel = document.createElement("label");
            optionLabel.innerText = options[i];
            optionLabel.setAttribute("for", checkboxId);
            optionLabel.setAttribute("data-type", "common-label");
            var optionLabelStyle =  optionLabel.style;
            optionLabelStyle.display = "inline-block";
            optionLabelStyle.width = "80%";
            optionLabelStyle.height = "100%";

            optionDiv.appendChild(optionCheck);
            optionDiv.appendChild(optionLabel);
            this.__container.appendChild(optionDiv);
        }
    };
    dms.CheckboxCreator = CheckboxCreator;
})(dms);