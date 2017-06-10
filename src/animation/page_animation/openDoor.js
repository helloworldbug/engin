// 文件名称: dms.newOpenDoor
//
// 创 建 人: Saino
// 创建日期: 2015/12/4 18:14
// 修改：by Saino 2015/12/4
// 描    述: dms.newOpenDoor
dms.animationMouseLock["openDoorX"] = true;
dms.animationMouseLock["openDoorY"] = true;
new Array("X","Y").forEach(function(name){
	dms.pageAnimation["openDoor" + name] = function(){
	//	console.log("llllllllllllllllllllllll");
		var nowPage,nextPage,copy1,copy2,ele1,ele2,width,height,dirction,
            transitionEndName=function(){
                var t;  
                var el = document.createElement('fakeelement');  
                var transitions = {  
                    'OTransition':'oTransitionEnd',  
                    'MozTransition':'transitionend',  
                    'WebkitTransition':'webkitTransitionEnd',  
                    'MsTransition':'msTransitionEnd',
                    'transition':'transitionend'
                }  
                for(t in transitions){  
                    if( el.style[t] !== undefined ){  
                        return transitions[t];
                    }  
                }
                return '';  
            }();
		return function(cpage,cp,tpage,tp,time,callback){
			dirction = "XY".indexOf(name);
            //width = $(cpage).offsetWidth;
            width = cpage.offsetWidth;
            //height = $(cpage).height();;
            height = cpage.offsetHeight;
            nowPage = new dms.Container(cpage);
            nextPage = new dms.Container(tpage);
 			ele1 = cp<0 ? cpage.cloneNode(true) : tpage&&tpage.cloneNode(true);
 			ele2 = cp<0 ? cpage.cloneNode(true) : tpage&&tpage.cloneNode(true);
            if(ele1&&ele2){
                cpage.parentNode.appendChild(ele1);
                cpage.parentNode.appendChild(ele2);

                copy1 = new dms.Container(ele1);
                copy2 = new dms.Container(ele2);
                copy1.css2("clip", "rect(0px," + width/(dirction+1) + "px," + height/(2-dirction) + "px,0px)");    //负轴的半面
                copy2.css2("clip", "rect("+(1-dirction)*height/2+"px," + width + "px," + height + "px,"+dirction*width/2+"px)"); //正轴的半面
                var leftPositionS = cp<0 ? 0 : -50;
                var leftPositionE = cp<0 ? -50 : 0;
                var rightPositionS = cp<0 ? 0 : 50;
                var rightPositionE = cp<0 ? 50 : 0;
                var XorY = dirction ? "X" : "Y";
                copy1.css3("transform","translate"+XorY+"("+leftPositionS+"%)");  //负轴半面起始位置
                copy2.css3("transform","translate"+XorY+"("+rightPositionS+"%)"); //正轴半面起始位置
                copy1.css2("overflow","hidden");
                copy2.css2("overflow","hidden");
                copy1.zIndex = 102;
                copy2.zIndex = 102;
             
                if(cp<0){     //往负轴方向滑动
                    var aniList = $(copy1.element).find(".animated");
                    for(var i=0;i<aniList.length;i++){
                        if(aniList[i]&&aniList[i].className.indexOf("animated")>=0){
                            $(aniList[i]).css({"animation-play-state":"paused","-webkit-animation-play-state":"paused"});
                            // $(aniList[i]).css("-webkit-animation-play-state","paused");
                        }
                    }
                    aniList = $(copy2.element).find(".animated");
                    for(var i=0;i<aniList.length;i++){
                        if(aniList[i]&&aniList[i].className.indexOf("animated")>=0){
                            $(aniList[i]).css({"animation-play-state":"paused","-webkit-animation-play-state":"paused"});
                            // $(aniList[i]).css("-webkit-animation-play-state","paused");
                        }
                    }
                    // $(copy1.element).find(".animated").removeClass("animated");
                    // $(copy2.element).find(".animated").removeClass("animated");
                    nextPage.zIndex = 100;
                    nextPage.css2("opacity","0");
                    nextPage.css3("transform","scale(0.6)");
                    nowPage.css2("display","none");
                    document.execCommand('Refresh');
                    // setTimeout(function(){
                        copy1.css3("transition","all "+time+"ms");
                        copy2.css3("transition","all "+time+"ms");
                        nextPage.css3("transition","all "+time+"ms");

                        nextPage.css2("opacity","1");
                        nextPage.css3("transform","scale(1)");
                        copy1.css3("transform","translate"+XorY+"("+leftPositionE+"%)");
                        copy2.css3("transform","translate"+XorY+"("+rightPositionE+"%)");       
                    // },100);

                }else{        //往正轴方向滑动
                    nowPage.zIndex = 100;
                    nextPage.zIndex = 100;
                    nextPage.css2("opacity","0");
                    // document.execCommand('Refresh');
                    setTimeout(function(){
                        copy1.css3("transition","all "+time+"ms");
                        copy2.css3("transition","all "+time+"ms");
                        nowPage.css3("transition","all "+time+"ms");

                        nowPage.css2("opacity","0")
                        nowPage.css3("transform","scale(0.6)");
                        copy1.css3("transform","translate"+XorY+"("+leftPositionE+"%)");
                        copy2.css3("transform","translate"+XorY+"("+rightPositionE+"%)"); 
                    },100);
                }
                var page = cp<0 ? tpage : cpage
                var fn = function(){
                    page.removeEventListener(transitionEndName,fn);
                    if(ele1){
                        ele1.parentNode &&  ele1.parentNode.removeChild(ele1);
                        ele1 = null;
                    }
                    if(ele2){
                        ele2.parentNode &&  ele2.parentNode.removeChild(ele2);
                        ele2 = null;
                    }
                    nextPage.css2("opacity","1");
                    nextPage.css3("transition","none");
                    nextPage.css2("opacity","1");
                    nowPage.css2("display","none");
                    nowPage.css2("opacity","1");
                    nowPage.css3("transition","none");
                    nowPage.css3("transform","scale(1)");
                    // document.execCommand('Refresh');
                    callback();
                };
                page.addEventListener(transitionEndName,fn);
            }
		}
	}();
});