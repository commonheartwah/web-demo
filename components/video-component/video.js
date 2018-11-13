/**
*  视频播放
*   new Video({
            autoplay : false,
            controls : false,
            loop : false,
            preload : false,
            appNode:插入到哪个节点下,注意层级
            onReady: function onReady(event) {}, // 视频加载完成执行此函数
            onPaused:function onPaused(event) {}, // 视频暂停时执行此函数
            onEnded: function onEnded(event) {}, // 视频播放结束执行此函数
            onError: function onError(event) {}, // 视频错误执行此函数
            onTimeUpdate: function onTimeUpdate(event) {}, // 视频播放时实时返回当前播放到第几毫秒下，执行此函数
        }).playVideo("XXX");
* */
class Video {

    constructor(option) {
        this.el = null;

        let el = document.createElement("div");
        el.id = "VideoComponent";
        el.style.width = "100%";
        el.style.height = "100%";
    		
        option.appNode ? option.appNode.appendChild(el) : document.body.appendChild(el);
        el.innerHTML = `<video id="first-video" 
                            width="100%" height="100%"  
                            x5-video-player-type="h5" 
                            x5-video-player-fullscreen="false" 
                            x5-playsinline="" 
                            playsinline="true" 
                            autoplay="autoplay"
                            webkit-playsinline="true" 
                            preload="auto">
                        </video>
                        <button type="button" id='foo' style='
                            position: absolute;
                            z-index: 2;
                            padding: 0;
                            top:50%;
                            left:50%;
                            margin-left:-50px;
                            margin-top:-50px;
                            background-color: transparent;
                            box-sizing: border-box;
                            height: 1rem;
                            outline:none; 
                            border-style: solid;
                            border-width: 1.5rem 0px 1.5rem 2.5rem;
                            border-color: transparent transparent transparent #fff;'>
                        </button>`;
        el.children[0].src = option.src || "";
        el.children[0].autoplay = option.autoplay || 'autoplay';
        el.children[0].controls = false;
        el.children[0].loop = !!option.loop;
        el.children[0].preload = !!option.preload;
        this.el = el;
        this.playCotrol(option);
    };
    
    playVideo(url) {
        this.el.children[0].src=url
    };

    stopVideo() {
        this.el.children[0].pause();
    };

    setVideo(time) {
        this.el.children[0].currentTime=time;
        this.el.children[0].play();
    };

    // 当前视频时长
    VideoInfo() {
        return {
            currentSrc: this.el.children[0].currentSrc,
            duration: this.el.children[0].duration,
            currentTime: this.el.children[0].currentTime,
            ended: this.el.children[0].ended
        }
    };
    
    // 控制器
    playCotrol(option) {
        this.el.children[0].addEventListener("canplay", () => {
            option.onReady && option.onReady(this);
        }, false);
        this.el.children[0].addEventListener("pause", () => {
            if (!this.ended && option.onPaused) {
                option.onPaused(this);
            };
        }, false);
        this.el.children[0].addEventListener("ended", () => {
            option.onEnded && option.onEnded(this);
        }, false);
        this.el.children[0].addEventListener("error", () => {
            option.onError && option.onError(this);
        }, false);
        this.el.children[0].addEventListener("timeupdate",() => {
            let video = this.el.children[0];
            let timeDisplay =video.currentTime.toFixed(2);
            let btn = document.getElementById('foo');
            if(timeDisplay==0 || video.paused){
                btn.style.display='block'
            }else{
                btn.style.display='none'
            }
            option.onTimeUpdate&&option.onTimeUpdate(timeDisplay,this);
        },false);
        this.el.children[1].addEventListener('click', function() {
            let video = document.getElementById("first-video");
            video.play();
        });
        this.el.children[0].addEventListener("click",() => {
            let video = document.getElementById("first-video");
            video.pause();
            let btn = document.getElementById('foo');
            btn.style.display='block'
        },false);
    };
}
export default Video;
