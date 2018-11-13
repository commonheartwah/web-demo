/**
*  音频播放
*   new Audio({
            autoplay : false,
            controls : false,
            loop : false,
            preload : false,
            onReady: function onReady(event) {},
            onPaused:function onPaused(event) {},
            onEnded: function onEnded(event) {},
            onError: function onError(event) {}
        }).playAudio("XXX");
*
*  更多属性、方法：
*  http://www.w3school.com.cn/jsref/dom_obj_audio.asp
*
* */

class Audio {

    constructor(option){
        this.el = null;

        let el = document.createElement("AUDIO");
        el.id = "audioComponent";
        el.style.display = "none";

        el.src = option.src || "";
        el.autoplay = !!option.autoplay;
        el.controls = !!option.controls;
        el.loop = !!option.loop;
        el.preload = !!option.preload;
        document.body.appendChild(el);

        this.el = el;
        this.playCotrol(option);
    };

    playAudio(url) {
        //fastSeek(currentTime);Safari浏览器支持该方法，Chrome浏览器里没有该方法
        //不支持暂停后继续播放
        this.el.src = url;
        this.el.play();
    };

    stopAudio(){

        this.el.pause();
    };

    audioInfo(){

        return {
            currentSrc : this.el.currentSrc,
            duration : this.el.duration,
            currentTime : this.el.currentTime,
            ended : this.el.ended
        }
    }

    playCotrol(option) {

        this.el.addEventListener("canplay", () => {

            option.onReady && option.onReady(this);
        },false);

        this.el.addEventListener("pause", () => {

            if(!this.ended && option.onPaused){

                 option.onPaused(this);
            };
        }, false);

        this.el.addEventListener("ended", () => {

            option.onEnded && option.onEnded(this);
        }, false);

        this.el.addEventListener("error", () => {

            option.onError && option.onError(this);
        }, false);
    }
}

export default Audio;
