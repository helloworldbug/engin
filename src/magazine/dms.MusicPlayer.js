// 文件名称: dms.MusicPlayer
//
// 创 建 人: chenshy
// 创建日期: 2015/12/3 10:29
// 描    述: 音乐播放器
(function(dms){

    //url : tpl.tpl_music, 音乐地址
    //lrcConfig : tpl.tpl_music_lrc,歌词配置信息
    //loop : tpl.tpl_music_replay, 是循环播放
    //autoplay : tpl.tpl_music_autoplay, 是否自动播放
    //lrcOn : tpl.tpl_lrc_on 是否显示歌词
    //lrcConfig
    //{
    //    url:"http://aa.lrc",//歌词链接地址
    //    color:"#ffffff",//歌词颜色
    //    singing_color:"",//正在唱的歌词颜色
    //    font_size:"24px", //歌词显示字体大小
    //    show_type:"bottom",//歌词显示方式 scroll:滚动歌词 bottom:底部显示
    //    pos:[20,40],//歌词显示的位置[x,y]
    //    frame_size:[200,100],//歌词的显示区域大小[宽度，高度]
    //}

    var MusicPlayer = function(config){
        this._sound = null;
        this._lrcPlayer = null;
        this._lrcLayer = null;
        this._initConfig(config);
        this._initPlayer();
    };

    var p = MusicPlayer.prototype;

    p._initConfig = function(config){
        this.lrcContainer = config.lrcContainer || document.createElement("div");


        config = config || {};
        config.url = config.url || "";
        config.lrcConfig = config.lrcConfig || {};
        config.loop = !!config.loop;
        config.autoplay = !!config.autoplay;
        config.lrcOn = !!config.lrcOn;

        //console.log(config.lrcConfig);

        this.lrcConfig = config.lrcConfig;

        this.lrcConfig.frame_size = this.lrcConfig.frame_size || [600,100];
        this.lrcConfig.color = this.lrcConfig.color || "#FFFFFF";
        this.lrcConfig.singing_color = this.lrcConfig.singing_color || "#ffffff";
        this.lrcConfig.font_size = this.lrcConfig.font_size || "24px";
        //this.lrcConfig.show_type = this.lrcConfig.show_type;
        this.lrcConfig.pos = this.lrcConfig.pos || [20,30];

        //console.log(config.lrcOn);
        this.lrcOn = config.lrcOn;

        config.lrcContainer = null;
        delete config.lrcContainer;

        this.config = config;

        config.lrcConfig = null;
        delete config.lrcConfig;
    };

    Object.defineProperties(p,{
        lrcOn : {
            get : function(){
                return !!this._lrcOn;
            },
            set : function(value){
                this._lrcOn = !!value;
                if(value && !this._lrcPlayer && this.lrcConfig.url){
                    var self = this;

                    function callback(text){
                        self._initLrcPlayer(text);
                    }

                    $.ajax({
                        url : this.lrcConfig.url,
                        dataType : "text",
                        contenttype :"application/x-www-form-urlencoded;charset=utf-8",
                        success : function(text){
                            //console.log(text);
                            callback(text);
                        }
                    });

                }

                if(value && !this._lrcLayer){
                    this._lrcLayer = document.createElement("div");
                    var style = this._lrcLayer.style;
                    style.color = this.lrcConfig.color;
                    style.fontSize = this.lrcConfig.font_size;
                    style.position = "absolute";
                    style.zIndex = "999999";
                    style.left = this.lrcConfig.pos[0] + "px";
                    style.top = this.lrcConfig.pos[1] + "px";
                    style.width = this.lrcConfig.frame_size[0] + "px";
                    style.height = this.lrcConfig.frame_size[1] + "px";
                    style.overflow = "hidden";
                    style.pointerEvents = "none";

                    this.lrcContainer.appendChild(this._lrcLayer);

                    switch (this.lrcConfig.show_type){
                        case 'bottom':
                            this._animationFn = LrcBottomAnimation;
                            break;
                        case 'scroll':
                            this._animationFn = LrcScrollAnimation;
                            break;
                        default :
                            this._animationFn = LrcOneRowFadeAnimation;
                            break;
                    }

                    this._animationFn = this._animationFn(this._lrcLayer,this.lrcConfig);

                    //if(this.lrcConfig.show_type == 'bottom'){
                    //    this._animationFn = LrcBottomAnimation(this._lrcLayer,this.lrcConfig);
                    //}else if(this.lrcConfig.show_type == 'scroll'){
                    //    this._animationFn = LrcScrollAnimation(this._lrcLayer,this.lrcConfig);
                    //}

                    //LrcScrollAnimation(this._lrcLayer,this.lrcConfig);//
                }

                if(value && this._lrcPlayer){
                    this._lrcLayer.style.display = "block";
                    if(!this.isPaused() && this._sound){
                        this._lrcPlayer.play((this._sound.getTime() * 1000));
                    }
                }else if(!value && this._lrcPlayer){
                    this._lrcLayer.style.display = "none";
                    this._lrcPlayer.stop();
                }

                //console.log(this);
                //console.log(this._lrcPlayer);
            }
        }
    });

    p._initLrcPlayer = function(text){
        var self = this;
        this._lrcPlayer = new Lrc(text,function(currentLrc,o){
            //console.log(l);
            self._updateLrc(currentLrc,o);
        });
    };

    p._initPlayer = function(){
        var config = this.config;
        if(config.url){
            this._sound = new buzz.sound(this.config.url,{
                loop : config.loop,
                autoplay : config.autoplay,
                preload  : true
            });

            var self = this;

            var autoplay = config.autoplay;

            this._sound.bind("canplaythrough",function(){
                if(autoplay){
                    self.play();
                    //self.setTime(3);
                }
            });
        }
    };
    p._updateLrc = function(currentLrc,o){
        //console.log(this._lrcLayer);
        this._animationFn(currentLrc,this._lrcPlayer,this);
        //this._lrcLayer && (this._lrcLayer.innerHTML = currentLrc);
    };

    p.enable = function(){
        return !!this._sound;
    };

    p._playLrc = function(){
        //console.log(this._sound.getTime());
        this._sound && !this._sound.isPaused() &&
        (this.lrcOn && this._lrcPlayer &&
        this._lrcPlayer.play(this._sound.getTime() * 1000));
    };

    p._stopLrc = function(){
        this._lrcPlayer && this._lrcPlayer.stop();
    };

    p.play = function(){
        if(this.isPaused()){    //modify by fishYu 2016-5-4 17:38 修改暂停的时候菜能播放
            this._sound && this._sound.play();
            this._playLrc();
        }
    };
    /**
     * 新增加载音频的方法
     */
    p.load = function(){
        this._sound && this._sound.load();
    };
    p.setTime = function(time){
        this._sound && this._sound.setTime(time);
        this._lrcPlayer && this._lrcPlayer.play(time * 1000);
    };

    p.pause = function(){
        this._sound && this._sound.pause();
        this._stopLrc();
    };

    p.stop = function(){
        this._sound && this._sound.stop();
        this._stopLrc();
    };

    p.togglePlay = function(){
        this._sound && this._sound.togglePlay();
        if(this._sound && this._sound.isPaused()){
            this._stopLrc();
        }else if(this._sound && !this._sound.isPaused()){
            this._playLrc();
        }
    };

    p.destroy = function(){
        this._stopLrc();
        this._sound && this._sound.unload();
        this._lrcPlayer && (this._lrcPlayer.handler = null);
        this.lrcContainer = null;
    };

    p.getTime = function(){
        if(!this._sound){
            return  0;
        }
        return this._sound.getTime();
    };

    p.isPaused = function(){
        if(!this._sound){
            return false;
        }
        return this._sound.isPaused();
    };

    dms.MusicPlayer = MusicPlayer;
})(dms);