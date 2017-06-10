// 文件名称: dms.leftRight3D
//
// 创 建 人: guyy
// 创建日期: 2015/8/25 19:40
// 描    述: dms.leftRight3D
/* 过渡效果处理函数
 * @param HTMLElement cpage 参与动画的前序页面
 * @param Float cp 目标页面过渡比率，取值范围-1到1
 * @param HTMLElement tpage 参与动画的后序页面；如果非循环loop模式，则在切换到边缘页面时可能不存在该参数
 * @param Float tp 目标页面过渡比率，取值范围-1到1；如果非循环loop模式，则在切换到边缘页面时可能不存在该参数
 */
new Array("X","Y").forEach(function(name){
    dms.pageAnimation["leftRight3D"+name] = function (){
        var width,height,containerPage,nextPage,nameIndex,rotateName,
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
            if(!cpage || !tpage || Math.abs(cp) > 1 || Math.abs(tp) > 1){
                return;
            }
            nameIndex = "XY".indexOf(name);
            rotateName = nameIndex ? "X":"Y";
            width = $(cpage).width();
            height = $(cpage).height();
            containerPage = new dms.Container(cpage);
            if(tpage)
                nextPage = new dms.Container(tpage);
            containerPage.parentCss3("perspective","300px");
            if(tpage)
                nextPage.zIndex = 101;
            var flag = 0;
            containerPage.css3("transition","none");
            if(tpage)
                nextPage.css3("transition","none");
            containerPage.css3("transform","translate3d(0%,0%,0px) scale(1) rotate"+rotateName+"(0deg)");
            if(tpage)
                nextPage.css3("transform","translate3d(0%,0%,-200px) scale(1) rotate"+rotateName+"(0deg)");
            setTimeout(function(){
                // document.execCommand('Refresh');
                flag=10;
                containerPage.css3("transition","all "+time/2+"ms");
                if(tpage)
                    nextPage.css3("transition","all "+time/2+"ms");
                containerPage.css3("transform","translate3d("+(50*cp)*(1-nameIndex)+"%,"+(50*cp)*nameIndex+"%,-100px) scale(0.8) rotate"+rotateName+"("+(20*cp*(nameIndex?1:-1))+"deg)");
                if(tpage)
                    nextPage.css3("transform","translate3d("+(50*cp*-1)*(1-nameIndex)+"%,"+(50*cp*-1)*nameIndex+"%,-100px) scale(0.8) rotate"+rotateName+"("+(20*cp*(nameIndex?-1:1))+"deg)");
                // setTimeout(function(){
                //     flag=100;
                //     // containerPage.css3("transition","all "+time/2+"ms");
                //     // nextPage.css3("transition","all "+time/2+"ms");
                //     containerPage.css3("transform","translate3d(0%,0%,-200px) scale(1) rotate"+rotateName+"(0deg)");
                //     nextPage.css3("transform","translate3d(0%,0%,0px) scale(1) rotate"+rotateName+"(0deg)");
                // },time/2+200);
            },100);
            var fn = function(){
                if(flag == 10){

                    setTimeout(function(){
                        flag=100;
                        // containerPage.css3("transition","all "+time/2+"ms");
                        // nextPage.css3("transition","all "+time/2+"ms");
                        containerPage.css3("transform","translate3d(0%,0%,-200px) scale(1) rotate"+rotateName+"(0deg)");
                        if(tpage)
                            nextPage.css3("transform","translate3d(0%,0%,0px) scale(1) rotate"+rotateName+"(0deg)");
                    },10);
                    return;
                }
                cpage.removeEventListener(transitionEndName,fn);
                containerPage.css3("transition","none");
                if(tpage)
                    nextPage.css3("transition","none");  
                // document.execCommand('Refresh');   
                callback();
            };
            cpage.addEventListener(transitionEndName,fn);

        };
    }();
});