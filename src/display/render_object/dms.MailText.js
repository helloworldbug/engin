// 文件名称: MailText
//
// 创 建 人: fishYu
// 创建日期: 2015/6/17 10:16
// 描    述: 邮件
dms.MailText = function(text){
	this._text = new dms.DomText(text,document.createElement("a"));
	dms.Text.call(this,text);
};

dms.inherit(dms.MailText,dms.Text);