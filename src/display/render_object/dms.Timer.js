// 文件名称: Timer
//
// 创 建 人: fishYu
// 创建日期: 2015/11/27 15:26
// 描    述: 倒计时
dms.Timer = function(text){
    dms.Text.call(this,text);
    this.timerTime = 0;
    this.timerInterval = 0;
};

dms.inherit(dms.Timer,dms.Text);

/**
 * 转换时间格式
 * @param time
 * @returns {string}
 */
dms.Timer.prototype.returnFormattedToSeconds = function(time){
    var minutes = Math.floor(time / 60),
        seconds = Math.round(time - minutes * 60);
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return minutes + ":" + seconds;
};

/**
 * 开始倒计时
 * @param time
 * @returns {string}
 */
dms.Timer.prototype.startTimer = function(){
    if(this.timerTime > 0){
        var self = this;
        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(function () {
            self.timerTime--;
            self.contentElement.innerHTML = self.returnFormattedToSeconds(self.timerTime);
            if (self.timerTime <= 0) {
                clearInterval(self.timerInterval);
                if(self.endScript){
                    dms.dispatcher.dispatchEvent(dms.createEvent("countdown:over",self.endScript));
                }
            }
        }, 1000);
    }
};

/**
 * 清除倒计时
 * @param time
 * @returns {string}
 */
dms.Timer.prototype.stopTimer = function(){
    clearInterval(this.timerInterval);
    this.timerTime = this.initTimerTime;
    this.contentElement.innerHTML = this.returnFormattedToSeconds(this.initTimerTime);
};

dms.Timer.prototype.destroy = function(){
    dms.Text.prototype.destroy.call(this);
    this.timerTime = 0;
    this.initTimerTime = 0;
    clearInterval(this.timerInterval);
    this.timerInterval = 0;
};