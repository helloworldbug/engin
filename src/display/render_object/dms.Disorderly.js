// 文件名称: Disorderly
//
// 创 建 人: fishYu
// 创建日期: 2015/11/26 19:13
// 描    述: 颠三倒四文本
dms.Disorderly = function(text, size, align, color){


    if(!this._text){
        this._text = new dms.BaseText(text, size, align, color);
    }

    this.contentElement = this._text.element;
    dms.RenderObject.call(this);

//
//
//	this._text.element.style.position = "relative";
//
//    this._animateClassObjects.push(this._text);
//    this.addChild(this._text);
};

dms.inherit(dms.Disorderly,dms.RenderObject);

/**
 * 错乱数序
 * @param txt   错乱文字
 * @param type  错乱的算法类型
 */
dms.Disorderly.prototype.disorderlyTxt = function(txt, type){
    var newTxt = "";
    var tempArr = txt.split("");
    switch(type){
        case "0" :      //随机打乱
            tempArr = tempArr.sort(function(){
                return Math.random()-0.5;
            });
            break;
        case "1" :      //文字奇偶对换
            var newArr = new Array(tempArr);    //拷贝一份新的数组
            for(var i = 0; i < tempArr.length; i++){
                if(i % 2 == 0){
                    newArr[i+1] = tempArr[i];
                }else{
                    newArr[i-1] = tempArr[i];
                }
            }
            tempArr = newArr;
            break;
        case "2" :      //文字倒叙显示
            tempArr = tempArr.reverse();
            break;
    }
    newTxt = tempArr.join("");
    return newTxt;
};

