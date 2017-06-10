// 文件名称: dms.flip3D
//
// 创 建 人: guYY
// 创建日期: 2015/8/27 15:07
// 描    述: dms.flip3D
/* 3D立体翻转过渡效果处理函数
 * @param HTMLElement cpage 参与动画的前序页面
 * @param Float cp 目标页面过渡比率，取值范围-1到1
 * @param HTMLElement tpage 参与动画的后序页面；如果非循环loop模式，则在切换到边缘页面时可能不存在该参数
 * @param Float tp 目标页面过渡比率，取值范围-1到1；如果非循环loop模式，则在切换到边缘页面时可能不存在该参数
 */
new Array("X","Y","").forEach(function(name){
    dms.pageAnimation["flip3D"+name] = function(){
        var inited = false,
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
            if(!cpage || !tpage || Math.abs(cp) > 1 || Math.abs(tp) > 1)
                return;
            if(!inited){
                inited = true;
            }
            cpage.parentNode.parentNode.style["-webkit-perspective"]='1000px';
            cpage.parentNode.parentNode.style["perspective"]='1000px';
            cpage.parentNode.style["-webkit-transformStyle"]='preserve-3d';
            cpage.parentNode.style["transformStyle"]='preserve-3d';
            var prop = name||["X"],
                fe = prop=='X'?-1:1,
                fix = fe*(cp<0?1:-1),
                zh=cpage['offset'+(prop=='X'?'Height':'Width')]/2;
            cpage.parentNode.style["-webkit-transform"]='translateZ(-'+zh+'px) rotate'+prop+'('+0+'deg)';
            cpage.parentNode.style["transform"]='translateZ(-'+zh+'px) rotate'+prop+'('+0+'deg)';
            cpage.style["-webkit-transform"]='rotate'+prop+'(0) translateZ('+zh+'px)';
            cpage.style["transform"]='rotate'+prop+'(0) translateZ('+zh+'px)';
            if(tpage){
                tpage.style["-webkit-transform"]='rotate'+prop+'('+(fix*90)+'deg) translateZ('+zh+'px)';
                tpage.style["transform"]='rotate'+prop+'('+(fix*90)+'deg) translateZ('+zh+'px)';
            }
            // document.execCommand('Refresh');
            setTimeout(function(){
                cpage.parentNode.style["-webkit-transition"] = "all "+time+"ms";
                cpage.parentNode.style["transition"] = "all "+time+"ms";
                cpage.parentNode.style["-webkit-transform"]='translateZ(-'+zh+'px) rotate'+prop+'('+cp*90*fe+'deg)';
                cpage.parentNode.style["transform"]='translateZ(-'+zh+'px) rotate'+prop+'('+cp*90*fe+'deg)';
            },100);

            var page = cpage.parentNode;
            var fn = function(){
                page.removeEventListener(transitionEndName,fn);
                inited = false;
                cpage.parentNode.style["-webkit-transition"] = "none";
                cpage.parentNode.style["transition"] = "none";
                cpage.parentNode.parentNode.style["-webkit-perspective"]='none';
                cpage.parentNode.parentNode.style["perspective"]='none';
                cpage.parentNode.style["-webkit-transformStyle"]='flat';
                cpage.parentNode.style["transformStyle"]='flat';
                cpage.parentNode.style['-webkit-transform'] = 'translateZ(0px) rotateX(0deg)';
                cpage.parentNode.style['transform'] = 'translateZ(0px) rotateX(0deg)';
                if(tpage){
                    tpage.style['-webkit-transform'] = 'rotate'+prop+'(0deg) translateZ(0px)';
                    tpage.style['transform'] = 'rotate'+prop+'(0deg) translateZ(0px)';
                }
                // document.execCommand('Refresh');
                callback();
            };
            page.addEventListener(transitionEndName,fn);
        }

      
    }();
});