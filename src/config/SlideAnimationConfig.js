/**
 * Created by guyy on 2015/7/15
 * 页间动画配置
 */
dms.SlideAnimationConfig = {
    "A10001":function(){return dms.AniFade},        //上下  ：淡入淡出
    "A10002":function(){return dms.AniLeftRight3D}, //左右  : 3D侧翻
    "A10003":function(){return dms.AniScaleFade},   //上下  : 扩散淡出淡入
    "A10004":function(){return dms.AniSlide},       //上下  ：滑入滑出
    "A10005":function(){return dms.AniSlideScale},  //上下  ：滑入滑出缩小
    "A10006":function(){return dms.AniUpDown3D},    //上下  ：上下3D翻转
    "A10007":function(){return dms.AniOpenDoor}     //上下  ：中间开门动画
};
//动画手势
dms.SlideGesture = {
    "ud":"upDown",      //上下 默认值
    "lr":"leftRight",
    "c":"click"
};