// 文件名称: ScrollText
//
// 创 建 人: fishYu
// 创建日期: 2016/3/10 14:08
// 描    述: 滚动文字，滚动到底部的时候触发脚本
dms.ScrollText = function(text){
	dms.Text.call(this,text);
};

dms.inherit(dms.ScrollText,dms.Text);