// 文件名称: Password
//
// 创 建 人: fishYu
// 创建日期: 2015/11/27 15:26
// 描    述: 密码输入
dms.Password = function(){
    this._passwordTxt = document.createElement("input");
    this._passwordBtn = document.createElement("label");
    dms.RenderObject.call(this);
    this.contentElement.appendChild(this._passwordTxt);
    this.contentElement.appendChild(this._passwordBtn);
    this.currErrorCount = 0;
};

dms.inherit(dms.Password,dms.RenderObject);

dms.Password.prototype._checkOK = function(checkTxt, endScript){
    var self = this;
    var inputTxt = this._passwordTxt.value;
    var successScript = "";
    var errorScript = "";
    /**
     * endScript = {success:"show_el:1|hide_el:2", error:["show_el:2|hide_el:3", "show_el:4|hide_el:5", "show_el:6|hide_el:7"]}
     */
    //重新拆分脚本，成功脚本，失败脚本
    if(endScript && endScript.indexOf("success") > -1 && endScript.indexOf("error") > -1){
        try{
            var endScriptJson = JSON.parse(endScript);
            successScript = endScriptJson.success;
            errorScript = endScriptJson.error;
        }catch(e){
            console.log(e);
        }
    }
    if(checkTxt == inputTxt){
//        if(endScript){  //成功执行的脚本
//            dms.dispatcher.dispatchEvent(dms.createEvent("countdown:over",endScript));
//        }
        if(successScript){  //成功执行的脚本
//            dms.dispatcher.dispatchEvent(dms.createEvent("countdown:over",successScript));
            self.execAnimationEndActSuccess();
        }
    }else{
        var contentWrapper = this.stage || this.parent.stage;
        var msgContent = "回答错误,仔细想想？";
        var msgBtnContent = "好的";
        self.currErrorCount += 1;
        var curInvalidDetail = self.currErrorCount + self.historicalErrorCount;
        if(self.tplType == 11){
            var updateOptions = {};
            var detailJson = {};
            detailJson.ext_attr_31 = curInvalidDetail;
            updateOptions.invalid_detail = JSON.stringify(detailJson);
            if(curInvalidDetail == self.errorCount){
                updateOptions.tpl_invalid = 1;
            }
            if(curInvalidDetail == (self.errorCount - 1)){
//                msgContent = "还有一次机会了，好好把握！";
            }else if(curInvalidDetail >= self.errorCount){
                updateOptions.tpl_invalid = 1;
//                msgContent = "作品已经失效了！";
            }
        }
        //消息提示框,错误的时候回调下
//        new dms.MsgBox(contentWrapper[0], msgContent, msgBtnContent, function(){
//            //TODO 更改数据库里面的tpl表中的 tpl_invalid， invalid_detail两个字段值
//            //模版，不保存数据
//            if(self.tplType == 11 && curInvalidDetail <= 3){
//                dms.model.updateTpl(self.tplId, updateOptions, function(data){
//                    console.log(data);
//                }, function(err){
//                    console.log(err);
//                });
//            }
//        });
        this._passwordTxt.value = "";
        if(curInvalidDetail > 3){
            //三次失败之后就只是弹出提示框
            msgContent = "作品已经失效了！";
            new dms.MsgBox(contentWrapper[0], msgContent, msgBtnContent);
            return;
        }
        //错误脚本为数组，错误一次出现不同的脚本
        if(errorScript.length >= 1){
            if(curInvalidDetail <= 3){
                self.execAnimationEndActError();
//                var currErr = curInvalidDetail -1;
//                if(errorScript[currErr]){    //执行错误脚本
//                    dms.dispatcher.dispatchEvent(dms.createEvent("countdown:over",errorScript[currErr]));
//                }
            }
        }
        //模版，不保存数据
        if(self.tplType == 11 && curInvalidDetail <= 3){
            dms.model.updateTpl(self.tplId, updateOptions, function(data){
//                console.log(data);
            }, function(err){
                console.log(err);
            });
        }
    }
};

dms.Password.prototype.destroy = function(){
    dms.RenderObject.prototype.destroy.call(this);
    this.currErrorCount = 0;
    this.checkTxt = "";
    this.endScript = "";

};
/**
 * 密码的监听事件
 */
dms.Password.prototype.addListener = function(){
    var self = this;
    $(this._passwordBtn).on(dms.getEventName(), function(e){
        e.stopPropagation();
        e.preventDefault();
        self._checkOK(self.checkTxt, self.endScript)
    });
};