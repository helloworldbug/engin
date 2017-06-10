// 文件名称: DateCountdown_setAttr
//
// 创 建 人: fishYu
// 创建日期: 2015/12/9 13:37
// 描    述: 设置日期倒计时属性
dms.DateCountdown.createObject = function(item, scriptParser){
    var displayObject = new dms.DateCountdown();
    //displayObject.userData = item;
    //ROSetItemId.call(displayObject,item, scriptParser);
    return displayObject;
};
dms.DateCountdown.prototype.resetAttribute = function(){
    dms.Text.prototype.resetAttribute.call(this);
	var self = this;
    if(this.userData) {
        var item = this.userData;
        var el = this.contentElement;
        var style = el.style;
        style.overflowY = "hidden";
        this.endScript = item.animate_end_act;
        var contentWrapper = this.stage || this.parent.stage;
        var itemVal = item.item_val;    //倒计时的
        var isPlay = item.auto_play;    //添加一个isPlay item.auto_play开关用于是否一开始就执行倒计时
        //音视频的时候取值为它的二级内容
        var dataFor = item.data_for;
        if(dataFor){
            var dataForType = this.userProperties.item_type;
            if( dataForType == 7 || dataForType == 8){  //视频音频的情况下，只能取它的item_val_sub
                itemVal = this.userProperties.item_val_sub;
            }else{
                itemVal = this.userProperties.item_val;
            }
        }
        //TODO 处理刚哥遗留的BUG
        var tempDate = new Date(itemVal);
        var timeVal = tempDate.getTime();
        if(timeVal){
            timeVal = tempDate.getTime();
        }else{
            timeVal = 1450972800000;
        }
        //格式化倒计时时间秒单位 TODO 默认为数字格式的  1450972800000
//        var timeVal = Number(itemVal);
        //设置的时间戳-当前的时间戳 圣诞节的时间戳1450972800000 2015-12-25 00:00:00
        this.timestamp =Math.floor((timeVal - (new Date()).getTime())/1000);
//        el.innerHTML = this.returnFormattedToDate(this.timestamp);
        el.innerHTML = this.returnFormattedToDate2(timeVal);
        this.startDate();
    }
};

