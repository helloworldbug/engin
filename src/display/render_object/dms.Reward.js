// 文件名称: Reward
//
// 创 建 人: fishYu
// 创建日期: 2015/12/22 15:20
// 描    述: 打赏按钮
dms.Reward = function(text){
    dms.Text.call(this,text);
};

dms.inherit(dms.Reward,dms.Text);

//销毁
dms.Reward.prototype.destroy = function(){
    dms.Text.prototype.destroy.call(this);
};
/**
 *
 */
dms.Reward.prototype.addListener = function(){
    var self = this;
    if(!self.itemHref) return;
    this.onClick = function(e){
        e.stopPropagation();
        e.preventDefault();
        var testReward = self.rewardInfor;
        //添加正式还是测试服
        testReward.fmawr = fmawr || "0";
        //TODO 存储本地localstorage
        window.localStorage.tpl_award_info = JSON.stringify(testReward);
        window.location.href = self.itemHref;
    };
};