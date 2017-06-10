// 文件名称: PhoneText
//
// 创 建 人: fishYu
// 创建日期: 2015/6/17 10:16
// 描    述: 电话
dms.PhoneText = function(text){
	this._text = new dms.DomText(text,document.createElement("a"));
	dms.Text.call(this,text);
};

dms.inherit(dms.PhoneText,dms.Text);