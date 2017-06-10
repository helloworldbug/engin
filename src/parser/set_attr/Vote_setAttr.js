// 文件名称: Vote_setAttr
//
// 创 建 人: fishYu
// 创建日期: 2015/9/14 15:00
// 描    述: 设置投票的属性
dms.Vote.createObject = function(item, scriptParser){
    var displayObject = new dms.Vote();
    //displayObject.userData = item;
    //ROSetItemId.call(displayObject,item, scriptParser);
    return displayObject;
};
dms.Vote.prototype.resetAttribute = function(){
    dms.RenderObject.prototype.resetAttribute.call(this);
	var self = this;
    this.__isVote = true;
    if(this.userData){
        var item = this.userData;
        var el = this.contentElement;
        var color = item.item_color;
        var fontSize = item.font_size;
        var itemVal = item.item_val;
        el.style.width = item.item_width + "px";
        el.style.height = item.item_height + "px";
        el.style.color = color;
        el.style.fontSize = fontSize;
        // if(this.voteInfor){
        //     var voteNum = this.voteInfor.voteNum;
        // }
        // el.innerHTML = voteNum;
        //通过表单单独去查询数据
        if(this.voteInfor){
            var pid = this.voteInfor.pageId;
            dms.model.queryPageVoteNumber(pid, function (data) { 
                if (data) {
                    console.log(data);
                    el.innerHTML = data.get("page_vote") || 0;
                } else {
                    el.innerHTML = 0;
                }
            }, function (err) {
                el.innerHTML = 0;
                console.log(err);
            });
        }
//        el.className = itemVal;
        //为了多段动画修改 created by fishYu 2016-1-19
        $(el).attr("data-vote", itemVal);
    }
    //添加投票点击事件
    self.addListener();
};

