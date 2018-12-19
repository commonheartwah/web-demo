import '../../css/audioStyle.css'
import popup from "../popup/popup_new";

class AudioStyle {

    constructor(option){
        this.el = null;
        let el = document.createElement('div');
        el.className = 'audio';
        el.style.width = '100%';
        el.innerHTML = `<div class='audio-title' id='audio-title'></div>
                        <div class="audio-top-content">
                            <div class="current-time" id="audio-current-time">00:00</div>
                            <div class="progress" id="audio-progress-bar">
                                <div class="progress-circular" id="audio-progress-circular"></div>
                                <div class="progress-bar" id="audio-progress-bar-realtime"></div>
                                <audio id="audio-component"></audio>
                            </div>
                            <div class="remaining-time" id="audio-remaining-time">00:00</div>
                        </div>
                        <div class="audio-bottom-content">
                            <div class="last-btn" id="audio-last"></div>
                            <div class="play-btn">
                                <div class="bottom-icon">
                                    <div class="play-or-pause-icon" id="playOrPause"></div>
                                </div>
                            </div>
                            <div class="next-btn" id="audio-next"></div>
                        </div>`;
        this.el = el;
        option.appNode ? option.appNode.appendChild(this.el) : document.body.appendChild(this.el);
        this.audioIndex = 0; // 传过来的音频数组标记
        this.flag = true; // 开始播放和暂停播放按钮的显示标记
        this.audioCurrentTime = document.getElementById('audio-current-time'); // 当前播放时间
        this.audio = document.getElementById('audio-component'); // audio标签
        this.audioRemainingTime = document.getElementById('audio-remaining-time'); // 音频总时间
        this.playOrPause = document.getElementById('playOrPause'); // 播放控制
        this.audioLast = document.getElementById('audio-last'); // 上一曲
        this.audioNext = document.getElementById('audio-next'); // 下一曲
        this.audioProgressBarRealtime = document.getElementById('audio-progress-bar-realtime');// 黄色进度条 width范围 0%～100%
        this.audioProgressCircular = document.getElementById('audio-progress-circular');// 可拖拽小圆球 left范围 -4%～96% 因为图片中心保证与进度条的起点对应上
        this.audioProgressBar = document.getElementById('audio-progress-bar');
        this.title = document.getElementById('audio-title');
        this.x1;
        this.x2;
        this.oriOffestLeft;
        this.maxLeft;
        this.maxRight;// 拖拽进度条上的小球时变量
        this.widthBar = this.audioProgressBar.offsetWidth; // 进度条的宽度
        this.flagDrop = false; // 是否可拖拽
        this.audioBtnIndex = 0;
        this.playCotrol(option);
    };

    // 设置audio的url
    setAudioUrl(info) {
        this.audio.src = info.url;
        this.title.innerHTML = info.title || '';
    };

    // 停止播放
    stopAudio(){
        this.audio.pause();
    };

    // 开始播放
    playAudio(){
        if(this.audio.src){
            this.audio.play();
        }else{
            popup.toast({msg : '音频url出问题了,请后退重试'});
        }
    };

    // 音频一些信息
    audioInfo(){
        return {
            currentSrc : this.audio.currentSrc,
            duration : this.audio.duration,
            currentTime : this.audio.currentTime,
            ended : this.audio.ended
        }
    }

    // 音频播放时间换算 
    transTime(value){
        let time = "";
        let h = parseInt(value / 3600);
        value %= 3600;
        let m = parseInt(value / 60);
        let s = parseInt(value % 60);
        if (h > 0) {
            time = this.formatTime(h + ":" + m + ":" + s);
        } else {
            time = this.formatTime(m + ":" + s);
        }
        return time;
    }

    // 格式化时间显示，补零对齐 eg：2:4  -->  02:04
    formatTime(value) {
        let time = "";
        let s = value.split(':');
        let i = 0;
        for (; i < s.length - 1; i++) {
            time += s[i].length == 1 ? ("0" + s[i]) : s[i];
            time += ":";
        }
        time += s[i].length == 1 ? ("0" + s[i]) : s[i];

        return time;
    }

    // 主控区
    playCotrol(option) {

        // 安卓切换后台音频暂停
        bind_trigger('pauseHTML',(res)=>{
            if(res) this.audio.pause();
        });

        // 初始化 上一曲 下一曲 按钮的显示状态
        if(option.audioList.length>0){
            this.setAudioUrl(option.audioList[0]);
            if(option.audioList.length==1){
                this.audioLast.classList.add('cancle');
                this.audioNext.classList.add('cancle');
            }
            if(option.audioList.length>1){
                this.audioLast.classList.add('cancle');
            }
        }

        // 按钮展示
        let lastAndNextBtn = ()=>{
            for(let i=0;i<option.audioList.length;i++){
                if(this.audio.src == option.audioList[i].url){
                    this.audioBtnIndex = i;
                }
            }
        }

        // 播放按钮点击
        this.playOrPause.addEventListener("click", (e) => {
            e.preventDefault();
            if(this.audio.src){
                if(this.flag){
                    this.playAudio();
                    this.playOrPause.classList.add('pause');
                    this.flag = false;
                }else{
                    this.stopAudio();
                    this.playOrPause.classList.remove('pause');
                    this.flag = true;
                }
            }else{
                popup.toast({msg : '音频url出问题了,请后退重试'});
            }
            
        }, false);

        // 上一曲按钮点击并播放
        this.audioLast.addEventListener("click", (e) => {
            e.preventDefault();
            lastAndNextBtn();
            this.audioIndex == this.audioBtnIndex ? this.audioIndex = this.audioIndex  : this.audioIndex = this.audioBtnIndex;
            this.audioIndex--;
            if(this.audioIndex<0) return false;
            if(option.audioList.length == 1 && this.audioIndex > option.audioList.length -1){
                this.audioIndex = 0;
            }else if(this.audioIndex > option.audioList.length -1 && option.audioList.length == 2){
                this.audioIndex = 0;
            }else if(this.audioIndex > option.audioList.length -1 && option.audioList.length > 2){
                this.audioIndex = option.audioList.length -2;
            }
            this.stopAudio();
            this.setAudioUrl(option.audioList[this.audioIndex]);
            let index;
            for(let i=0;i<option.audioList.length;i++){
                if(this.audio.src==option.audioList[i].url){
                    index = i;
                }
            }
            if(option.audioList.length == 2){
                this.audioLast.classList.add('cancle');
                this.audioNext.classList.remove('cancle');
            }else{
                if(index<=0){
                    this.audioLast.classList.add('cancle');
                }else{
                    this.audioNext.classList.remove('cancle');
                    this.audioLast.classList.remove('cancle');
                }
            }
            this.audioProgressBarRealtime.style.width = '0rem';
            this.audioProgressCircular.style.left = '-3%';
            this.playAudio();
            option.lastAudio && option.lastAudio(this.audioIndex);
        }, false);

        // 下一曲按钮点击并播放
        this.audioNext.addEventListener("click", (e) => {
            e.preventDefault();
            lastAndNextBtn();
            this.audioIndex == this.audioBtnIndex ? this.audioIndex = this.audioIndex  : this.audioIndex = this.audioBtnIndex;
            this.audioIndex++;
            if( this.audioIndex>option.audioList.length - 1) return false;
            if(option.audioList.length == 1 && this.audioIndex < 0){
                this.audioIndex = 0;
            }else if(this.audioIndex<0 && option.audioList.length > 1){
                this.audioIndex = 1;
            }
            this.stopAudio();
            this.setAudioUrl(option.audioList[this.audioIndex]);
            let index;
            for(let i=0;i<option.audioList.length;i++){
                if(this.audio.src==option.audioList[i].url){
                    index = i;
                }
            }
            if(option.audioList.length == 2){
                this.audioNext.classList.add('cancle');
                this.audioLast.classList.remove('cancle');
            }else{
                if(index>=option.audioList.length - 1){
                    this.audioNext.classList.add('cancle');
                }else{
                    this.audioLast.classList.remove('cancle');
                    this.audioNext.classList.remove('cancle');
                }
            }
            this.audioProgressBarRealtime.style.width = '0rem';
            this.audioProgressCircular.style.left = '-3%';
            this.playAudio();
            option.nextAudio && option.nextAudio(this.audioIndex);

        }, false);

        // 音频播放时 播放时间和进度条控制
        this.audio.addEventListener("timeupdate", (e) => {
            e.preventDefault();
            this.audioCurrentTime.innerHTML = this.transTime(this.audio.currentTime);
            if(this.audio.paused){
                this.playOrPause.classList.remove('pause');
            }else{
                this.playOrPause.classList.add('pause');
            }
            this.audioProgressBarRealtime.style.width = this.audio.currentTime / this.audio.duration * 100 - 0 + '%';
            this.audioProgressCircular.style.left = this.audio.currentTime / this.audio.duration * 100 - 2.5 + '%';
        },false);

        // 音频准备OK 设置总时间以及取到总时长
        this.audio.addEventListener("canplay", (e) => {
            e.preventDefault();
            if(this.audio.duration == Infinity){
                this.audioRemainingTime.innerHTML = '00:01';
            }else{
                this.audioRemainingTime.innerHTML = this.transTime(this.audio.duration);
            }
        },false);

        // 音频播放完毕 循环播放当前音频
        this.audio.addEventListener("ended", (e) => {
            this.playAudio();
        },false);

        // 开始拖拽
        let touchstart=(e)=>{
            if (!this.audio.paused || this.audio.currentTime != 0){
                this.flagDrop = true;
                this.stopAudio();
                this.oriOffestLeft = this.audioProgressCircular.offsetLeft;
                this.x1 = event.touches ? event.touches[0].clientX : event.clientX; // 要同时适配mousedown和touchstart事件
                this.maxLeft = this.oriOffestLeft; // 向左最大可拖动距离
                this.maxRight = this.widthBar - this.oriOffestLeft; // 向右最大可拖动距离

                // 禁止默认事件（避免鼠标拖拽进度点的时候选中文字）
                if (e && e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }

                // 禁止事件冒泡
                if (e && e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    window.e.cancelBubble = true;
                }
            }
        }

        // 拖拽中
        let touchmove=(e)=>{
            if (this.flagDrop){
                this.x2 = event.touches ? event.touches[0].clientX : event.clientX; // 要同时适配mousemove和touchmove事件
                let length = this.x2 - this.x1;
                if (length > this.maxRight) {
                    length = this.maxRight;
                } else if (length < -this.maxLeft) {
                    length = -this.maxLeft;
                }
                let rate = (this.oriOffestLeft + length) / this.widthBar;
                this.audio.currentTime = this.audio.duration * rate;
                if (e && e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }

                // 禁止事件冒泡
                if (e && e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    window.e.cancelBubble = true;
                }
            }
        }

        // 拖拽结束
        let touchend=(e)=>{
            this.playAudio();
            // 禁止默认事件（避免鼠标拖拽进度点的时候选中文字）
            if (e && e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }

            // 禁止事件冒泡
            if (e && e.stopPropagation) {
                e.stopPropagation();
            } else {
                window.e.cancelBubble = true;
            }
            this.flagDrop = false;
        }

        this.audioProgressCircular.addEventListener('mousedown',touchstart,false);
        this.audioProgressCircular.addEventListener('touchstart',touchstart,false);
        this.audioProgressCircular.addEventListener('mousemove',touchmove,false);
        this.audioProgressCircular.addEventListener('touchmove',touchmove,false);
        this.audioProgressCircular.addEventListener('mouseup',touchend,false);
        this.audioProgressCircular.addEventListener('touchend',touchend,false);
    }
}

export default AudioStyle;
