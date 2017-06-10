// 文件名称: dms.LongPress
//
// 创 建 人: fishYu
// 创建日期: 2015/10/28 19:05
// 描    述: 长按

dms.Shake = function(){
    var self = this;
    dms.RenderObject.call(this);
    this.endScript = "";
    var el = this.contentElement;
    el.setAttribute("data-type","me-shake");
    el.id = "shake" + dms.getNewID();
    this.shakeHandle = null;
    //监听滑动翻页到该页的时候开始摇一摇事件
    dms.dispatcher.on("start:shake:handle", function(){
        if(self.startShake){
            self.startShake();
        }
    });
    //监听滑动翻页到非该页的时候停止摇一摇事件
    dms.dispatcher.on("stop:shake:handle", function(){
        if(self.stopShake){
            self.stopShake();
        }
    });
};

dms.inherit(dms.Shake,dms.RenderObject);




dms.Shake.prototype.startShake = function(){
    var self = this;
    if (window.DeviceMotionEvent) {
        var $el = $(this.contentElement);
        if(!$el.hasClass("yaoYiYao")){
            $el.addClass("yaoYiYao");
        }
        //TODO 这里变量只能 放这，，放到该对象上，会促使在IOS手机上面不出现摇一摇元素
        var SHAKE_THRESHOLD = 800;
        var shake_last_update = 0;
        var shake_x =  0;
        var shake_y = 0;
        var shake_z = 0;
        var shake_last_x = 0;
        var shake_last_y = 0;
        var shake_last_z = 0;
        this.shakeHandle = function deviceMotionShakeHandler (eventData){
            var acceleration =eventData.accelerationIncludingGravity;
            var curTime = new Date().getTime();
            if ((curTime - shake_last_update)> 300) {
                var diffTime = curTime - shake_last_update;
                shake_last_update = curTime;
                if(acceleration){
                    shake_x = acceleration.x;
                    shake_y = acceleration.y;
                    shake_z = acceleration.z;
                }
                var speed = Math.abs(shake_x + shake_y + shake_z - shake_last_x - shake_last_y - shake_last_z) / diffTime * 10000;
                if (speed > SHAKE_THRESHOLD) {
                    //TODO 只支持摇晃一次执行,去掉摇晃的样式
                    //执行脚本
                    if(self.endScript){
//                        dms.dispatcher.dispatchEvent(dms.createEvent("countdown:over",self.endScript));
                        //更换脚本的执行
                        self.execAnimationEndAct();
                    }
                }
                shake_last_x = shake_x;
                shake_last_y = shake_y;
                shake_last_z = shake_z;
            }
        };
//        $(window).on('devicemotion',deviceMotionShakeHandler);
        if(this.shakeHandle){
            window.addEventListener('devicemotion',this.shakeHandle, false);
        }
    }
};


dms.Shake.prototype.stopShake = function(){
    if (window.DeviceMotionEvent) {
//        $(window).off('devicemotion');
        window.removeEventListener('devicemotion', this.shakeHandle, false);
        this.shakeHandle = null;
    }
};

dms.Shake.prototype.destroy = function(){
    dms.RenderObject.prototype.destroy.call(this);
    dms.dispatcher.removeAllEventListeners("start:shake:handle");
    dms.dispatcher.removeAllEventListeners("stop:shake:handle");
    this.stopShake();
};