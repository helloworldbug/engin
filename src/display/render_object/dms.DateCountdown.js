// 文件名称: DateCountdown
//
// 创 建 人: fishYu
// 创建日期: 2015/12/9 13:38
// 描    述: 日期倒计时
dms.DateCountdown = function(text){
    dms.Text.call(this,text);
    this.timestamp = 0;
    this.dateInterval = 0;
};

dms.inherit(dms.DateCountdown,dms.Text);

/**
 * 转换时间格式
 * @param time
 * @returns {string}
 */
dms.DateCountdown.prototype.returnFormattedToDate = function(time){
    var day = Math.floor(time/86400);
    var hour = Math.floor(time%86400/3600);
    hour = hour < 10 ? "0" + hour : hour;
    var minute = Math.floor(time%86400%3600/60);
    minute = minute < 10 ? "0" + minute : minute;
    var seconds = Math.floor(time%86400%3600%60);
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return day + "天 " + hour + ":"+ minute + ":" + seconds;
};

/**
 * 转换时间格式2
 * @param time
 * @returns {string}
 */
dms.DateCountdown.prototype.returnFormattedToDate2 = function(time){
    var tempData = new Date(time);
    var year = tempData.getFullYear();
    var month = tempData.getMonth();
    var date = tempData.getDate();
    var hour = tempData.getHours();
    hour = hour < 10 ? "0" + hour : hour;
    var minute = tempData.getMinutes();
    minute = minute < 10 ? "0" + minute : minute;
    var seconds = tempData.getSeconds();
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return  year + "年" + (month + 1) + "月" + date + "日<br/>" + hour + ":"+ minute + ":" + seconds;
};

/**
 * 开始倒计时
 * @param time
 * @returns {string}
 */
dms.DateCountdown.prototype.startDate = function(){
    var self = this;
    //此处处理是为了，模版的时候，不用到预定设置的时间再预览。
    //自己做的也不需要到指定时间才能预览
    var tplType = this.dateInfor.tplType;
    var tplUser = this.dateInfor.tplUser;
    var curUser = fmacloud.User.current();
    var curUserId = "";
    if(curUser){
        curUserId = curUser.id;
    }
    //三种情况下直接查看，自己的作品，模版，超过自己设定的时间
    if(10 == tplType || tplUser == curUserId || self.timestamp <= 0 ){
        //设置1秒后就可以预览
        setTimeout(function(){
            if(self.endScript){
                dms.dispatcher.dispatchEvent(dms.createEvent("countdown:over",self.endScript));
            }
        }, 1000*8);
    }else{
        if(self.timestamp > 0){
            clearInterval(this.dateInterval);
            this.dateInterval = setInterval(function () {
                self.timestamp--;
    //        self.contentElement.innerHTML = self.returnFormattedToDate(self.timestamp);
                if (self.timestamp <= 0) {
                    clearInterval(self.dateInterval);
                    if(self.endScript){
                        dms.dispatcher.dispatchEvent(dms.createEvent("countdown:over",self.endScript));
                    }
                }
            }, 1000);
        }
    }
};

dms.DateCountdown.prototype.destroy = function(){
    dms.Text.prototype.destroy.call(this);
    this.timestamp = 0;
    clearInterval(this.dateInterval);
    this.dateInterval = 0;
};