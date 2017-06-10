// 文件名称: PanoramicPhoto_setAttr
//
// 创 建 人: guYY
// 创建日期: 2016/1/6 13:20
// 描    述: PanoramicPhoto_setAttr
dms.PanoramicPhoto.createObject = function(item, scriptParser){
    var displayObject = new dms.PanoramicPhoto();
    //displayObject.userData = item;
    //ROSetItemId.call(displayObject,item, scriptParser);
    return displayObject;
};

dms.PanoramicPhoto.prototype.resetAttribute = function(){
    dms.ImageSprite.prototype.resetAttribute.call(this);
    if(this.userData){
        var self = this;
        var item = this.userData;            //元素对象
        var el = this.contentElement;       //元素dom对象
        self.reLoadIndex = 0; //预加载图片索引
        self.reLoadEdNum = 0;
        el.style.width = item.item_width+"px";
        el.style.height = item.item_height+"px"; //todo
        //数据初始化
        self.minLeft = 0;                       //距离屏幕左边的距离
        self.maxLeft = self.minLeft + item.item_width; //距离屏幕右边的距离
        self.showIndex = 0;                     //显示图片索引
        self.startPosX = 0;                     //开始位置
        self.manuallyStart = 0;                 //是否手动开始拖拽
        self.lastNum = 0;                        //最后惯性围几圈
        self.lastToLeft = 0;                    //最后松开时状态 -1=向左  1=向右
        self.spinningSpeed = 20;                //默认速度20
        self.moveTime = 0;
        self.endTime = 0;

        self.bgArr = [];
        self.addEvent();
        if(item.item_val) {
            self.bgArr = item.item_val.split("|");
            el.setAttribute("src",self.bgArr[0]);
            self.loadImg();
        }


    }
};




