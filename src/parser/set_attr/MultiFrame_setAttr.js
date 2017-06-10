// 文件名称: MultiFrame_setAttr
//
// 创 建 人: chenshy
// 创建日期: 2015/6/11 19:24
// 描    述: MultiFrame_setAttr
dms.MultiFrame.createObject = function(item,scriptParser){
//    console.log("哈哈");
    var groupId = item.group_id;
    var objects = scriptParser.__currentPageObjects;



    var tmpObj;
    var groupObjs = [];
    var i;
    //找出groupId相同的元素
    for(i = objects.length - 1; i >= 0; i--){
        tmpObj = objects[i];
//		console.log(tmpObj.item_type,item.item_type)
        if(tmpObj.group_id == groupId && tmpObj != item && item.item_type != tmpObj.item_type){
            groupObjs.push(tmpObj);
        }
    }



    //根据item_layer排序
    groupObjs = groupObjs.sort(function(a,b){
        var aLayer = parseInt(a.item_layer);
        var bLayer = parseInt(b.item_layer);
        return aLayer - bLayer;
    });

    var width = item.item_width;
    var height = item.item_height;

    var borderFrame = new dms.MultiFrame();
    //borderFrame.userData = item;
    //
    //ROSetItemId.call(borderFrame,item, scriptParser);

    //var tempStageSize = ms.currentStageSize;
    var tempStage = scriptParser.__currentStage;

    scriptParser.__currentStage = new dms.Stage();
    scriptParser.__currentStage.pageLoadManager = tempStage.pageLoadManager;
    scriptParser.__currentStage.pageIndex = tempStage.pageIndex;
    scriptParser.__currentStage.width = width;
    scriptParser.__currentStage.height = height;
//
////        console.log
    if(groupObjs.length > 0){
        var displayObject = null;
        for(i = 0;i < groupObjs.length;i++){
            var obj = groupObjs[i];
            displayObject = scriptParser._createDisplayObject(obj);
            if(displayObject){
//                    displayObject.userData = obj;
                borderFrame.addChildAt(displayObject,i);
            }
        }
    }

    scriptParser.__currentStage = tempStage;
    return borderFrame;
};
dms.MultiFrame.prototype.resetAttribute = function(){
    dms.RenderObject.prototype.resetAttribute.call(this);
    if(this.userData){
        var object = this.userData;
        var width = object.item_width;
        var height = object.item_height;
        var borderWidth = object.item_border;
        var borderColor = object.item_color;
        var imageUrl = object.item_val;

        var left = object.item_left;
        var top  = object.item_top;

        this.width = width;
        //modify by fishYu 2016-5-6 17:37 修改如果摘要页是长页的情况，外围不设置超出1008的高度
        if(object.abstract_setting == "1"){
            if(height > 1008){
                height = 1008;
            }
        }
        this.height = height;

        if(imageUrl && imageUrl != 'none'){
            //borderFrame.setImageUrl(imageUrl);
        }else{
//            borderFrame.setBorderColor(borderColor);
//            borderFrame.setBorderWidth(borderWidth);
        }
//

    }

    var children = this.children;
//    console.log(children);
    for(var i = 0;i < children.length;i++){
        children[i].resetAttribute();
    }
};