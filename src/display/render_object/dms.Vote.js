// 文件名称: Vote
//
// 创 建 人: fishYu
// 创建日期: 2015/9/14 15:00
// 描    述: 投票
dms.Vote = function(){
    dms.RenderObject.call(this);
};

dms.inherit(dms.Vote,dms.RenderObject);

/**
 * 投票点击事件
 */
dms.Vote.prototype.addListener = function(){
    var self = this;
    this.onClick = function(e){
        e.preventDefault();
        e.stopPropagation();
        var contentWrapper = this.stage || this.parent.stage;
        if(this.__isVote){
            var pageVote = parseInt(this.contentElement.innerHTML)+1;
            this.contentElement.innerHTML = pageVote;
            var pageId = this.voteInfor.pageId;
            //TODO 更新页里面的投票数目
            if(pageId){
                dms.model.addPagesVote(pageId, function(obj){
//                    console.log(obj);
                },function(err){console.log(err);});
            }
        }else{
            new dms.MsgBox(contentWrapper[0], "您已经投过票了");
        }
        this.__isVote = false;
    };
};