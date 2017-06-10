dms.DomText = function(text,dom){
	if(dom){
	    this.element = dom;
	}

	dms.BaseText.call(this,text);
};

dms.inherit(dms.DomText,dms.BaseText);