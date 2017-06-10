// 文件名称: TextInText_setAttr
//
// 创 建 人: chenshy
// 创建日期: 2015/10/30 13:58
// 描    述: TextInText_setAttr

dms.TextInText.createObject = function(item,scriptParser){
    var groupId = item.group_id;
    var objects = scriptParser.__currentPageObjects;

    var tmpObj;
    var i,
        textObj = null;
    //找出groupId相同的元素
    for(i = objects.length - 1; i >= 0; i--){
        tmpObj = objects[i];
        if(tmpObj.group_id == groupId && tmpObj != item && item.item_type != tmpObj.item_type){
            textObj = tmpObj;
            break;
        }
    }

    var inText = new dms.TextInText();
    //ROSetItemId.call(inText,item, scriptParser);
    //inText.userData = item;
    inText._backText.userData = item;

    if(textObj){
        var displayObject = scriptParser._createDisplayObject(textObj);
        if(displayObject){
            inText.addFrontText(displayObject);
        }
    }

    return inText;
};

dms.TextInText.prototype.resetAttribute = function(){
    this._backText.resetAttribute();
    this._frontText.resetAttribute();

    //var backText = this._backText;
    //var frontText = this._frontText;
    //
    //console.log(backText._text.element);
    //console.log(frontText._text.element);

    this.resetClip();
};