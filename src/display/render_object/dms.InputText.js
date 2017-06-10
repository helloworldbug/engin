// 文件名称: InputText
//
// 创 建 人: fishYu
// 创建日期: 2015/6/17 10:28
// 描    述: 输入框
dms.InputText = function(text){
	this._text = new dms.DomText(text,document.createElement("input"));
	dms.Text.call(this,text);
};

dms.inherit(dms.InputText,dms.Text);