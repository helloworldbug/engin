// 文件名称: Timer_setAttr
//
// 创 建 人: fishYu
// 创建日期: 2015/11/27 15:27
// 描    述: 设置倒计时属性
dms.Timer.createObject = function(item, scriptParser){
    var displayObject = new dms.Timer();
    //displayObject.userData = item;
    //ROSetItemId.call(displayObject,item, scriptParser);
    return displayObject;
};
dms.Timer.prototype.resetAttribute = function(){
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
        var isPlay = item.auto_play;
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
        //格式化倒计时时间秒单位 TODO 默认为数字格式的
        var timeVal = Number(itemVal);
        this.initTimerTime = timeVal;   //初始值，
        this.timerTime = timeVal;       //用于倒计时用
        el.innerHTML = this.returnFormattedToSeconds(this.timerTime);
        //添加一个isPlay item.auto_play开关用于是否一开始就执行倒计时
        if(isPlay) {
            this.startTimer();
        }
    }
};

