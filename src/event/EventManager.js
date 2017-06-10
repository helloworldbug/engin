// 文件名称: EventManager
//
// 创 建 人: chenshy
// 创建日期: 2016/4/2 19:03
// 描    述: EventManager
(function(dms){
    /**
     * 事件管理
     * @constructor
     */
    var EventManager = function(container){
        //console.log(container);
        this.hammer = new Hammer(container);
        //add by fishYu 2016-4-5 17:52增加对滑动的上下左右的支持
        this.hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
        this.initEvent();
    };

    var p = EventManager.prototype;

    function eventHandle(e){
        var target = e.target;
        if(!target) return;
        var id = target.id;
        //todo 由于显示模块 元素小于60px时，点击热区都为60PX， 有可能点击到父容器区域。 modify by fishYu 2016-7-5 15:28
        //modify by fishYu 处理点击标签的时候事件问题
        var meLabel = target.getAttribute("data-label");
        if(meLabel){
            var meLabelSub = target.getAttribute("data-label-sub");
            if(meLabelSub){     //处理点击标签的动画区域
                if(!id){
                    id = (target.parentNode.parentNode).id;        //父容器的第一个子节点
                }
            }else{      //处理点击标签的内容区域
                if(!id){
                    id = (target.parentNode).id;        //父容器的第一个子节点
                }
            }
        }else{  //处理热区过小问题
            if(!id){
                if(target.firstChild){
                    id = (target.firstChild).id;        //父容器的第一个子节点
                }
            }
        }
        if(!id) return;

        var displayObject = dms.ObjectManager.getObj(id);
        if(!displayObject){
            return;
        }

        //console.log(e);

        //console.log(displayObject);
        //Swipeleft：向左滑动、Swiperight：向右滑动、Swipeup：向上滑动、Swipedown：向下滑动
        var eventType = e.type;
        switch (eventType){
            case 'tap':
                displayObject.tapHandle(e);
                break;
            case 'press':
                displayObject.holdHandle(e);
                break;
            case 'swipeleft':
                displayObject.swipeLeftHandle(e);
                break;
            case 'swiperight':
                displayObject.swipeRightHandle(e);
                break;
            case 'swipeup':
                displayObject.swipeUpHandle(e);
                break;
            case 'swipedown':
                displayObject.swipeDownHandle(e);
                break;
        }
    }

    p.initEvent = function(){
        var hm = this.hammer;

        //console.log("init");
        hm.on("tap",function(e){
            eventHandle(e);
        });

        hm.on("press",function(e){
            eventHandle(e);
        });

        hm.on("swipeleft",function(e){
            eventHandle(e);
        });

        hm.on("swiperight",function(e){
            eventHandle(e);
        });

        hm.on("swipeup",function(e){
            eventHandle(e);
        });

        hm.on("swipedown",function(e){
            eventHandle(e);
        });
    };

    dms.EventManager = EventManager;
})(dms);