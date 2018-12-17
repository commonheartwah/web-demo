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
        option.appNode ? option.appNode.appendChild(el) : document.body.appendChild(el);
        this.playCotrol(option);
    };

    // 设置audio的url
    setAudioUrl(info) {
        document.getElementById('audio-component').src = info.url;
        document.getElementById('audio-title').innerHTML = info.title || '';
    };

    // 停止播放
    stopAudio(){
        document.getElementById('audio-component').pause();
    };

    // 开始播放
    playAudio(){
        if(document.getElementById('audio-component').src){
            document.getElementById('audio-component').play();
        }else{
            popup.toast({msg : '音频url出问题了,请后退重试'});
        }
    };

    // 音频一些信息
    audioInfo(){
        return {
            currentSrc : document.getElementById('audio-component').currentSrc,
            duration : document.getElementById('audio-component').duration,
            currentTime : document.getElementById('audio-component').currentTime,
            ended : document.getElementById('audio-component').ended
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
        var time = "";
        var s = value.split(':');
        var i = 0;
        for (; i < s.length - 1; i++) {
            time += s[i].length == 1 ? ("0" + s[i]) : s[i];
            time += ":";
        }
        time += s[i].length == 1 ? ("0" + s[i]) : s[i];

        return time;
    }

    // 主控区
    playCotrol(option) {
        let audioIndex = 0; // 传过来的音频数组标记
        let flag = true; // 开始播放和暂停播放按钮的显示标记
        let audioCurrentTime = document.getElementById('audio-current-time'); // 当前播放时间
        let audio = document.getElementById('audio-component'); // audio标签
        let audioRemainingTime = document.getElementById('audio-remaining-time'); // 音频总时间
        let playOrPause = document.getElementById('playOrPause'); // 播放控制
        let audioLast = document.getElementById('audio-last'); // 上一曲
        let audioNext = document.getElementById('audio-next'); // 下一曲
        let audioProgressBarRealtime = document.getElementById('audio-progress-bar-realtime');// 黄色进度条 width范围 0%～100%
        let audioProgressCircular = document.getElementById('audio-progress-circular');// 可拖拽小圆球 left范围 -4%～96% 因为图片中心保证与进度条的起点对应上
        let audioProgressBar = document.getElementById('audio-progress-bar');
        let x1,x2,oriOffestLeft,maxLeft,maxRight;// 拖拽进度条上的小球时变量
        let widthBar = audioProgressBar.offsetWidth; // 进度条的宽度
        let flagDrop = false; // 是否可拖拽
        let audioBtnIndex;

        // 安卓切换后台音频暂停
        bind_trigger('pauseHTML',(res)=>{
            if(res) audio.pause();
        });

        // 初始化 上一曲 下一曲 按钮的显示状态
        if(option.audioList.length>0){
            this.setAudioUrl(option.audioList[0]);
            if(option.audioList.length==1){
                audioLast.classList.add('cancle');
                audioNext.classList.add('cancle');
            }
            if(option.audioList.length>1){
                audioLast.classList.add('cancle');
            }
        }

        // 按钮展示
        let lastAndNextBtn = function(){
            for(let i=0;i<option.audioList.length;i++){
                if(audio.src == option.audioList[i].url){
                    audioBtnIndex = i;
                }
            }
        }

        // 播放按钮点击
        playOrPause.addEventListener("click", (e) => {
            e.preventDefault();
            if(audio.src){
                if(flag){
                    this.playAudio();
                    playOrPause.classList.add('pause');
                    flag = false;
                }else{
                    this.stopAudio();
                    playOrPause.classList.remove('pause');
                    flag = true;
                }
            }else{
                popup.toast({msg : '音频url出问题了,请后退重试'});
            }
            
        }, false);

        // 上一曲按钮点击并播放
        audioLast.addEventListener("click", (e) => {
            e.preventDefault();
            lastAndNextBtn();
            audioIndex == audioBtnIndex ? audioIndex = audioIndex  : audioIndex = audioBtnIndex;
            audioIndex--;
            if(audioIndex<0) return false;
            if(option.audioList.length == 1 && audioIndex > option.audioList.length -1){
                audioIndex = 0;
            }else if(audioIndex > option.audioList.length -1 && option.audioList.length == 2){
                audioIndex = 0;
            }else if(audioIndex > option.audioList.length -1 && option.audioList.length > 2){
                audioIndex = option.audioList.length -2;
            }
            this.stopAudio();
            this.setAudioUrl(option.audioList[audioIndex]);
            let index;
            for(let i=0;i<option.audioList.length;i++){
                if(audio.src==option.audioList[i].url){
                    index = i;
                }
            }
            if(option.audioList.length == 2){
                audioLast.classList.add('cancle');
                audioNext.classList.remove('cancle');
            }else{
                if(index<=0){
                    audioLast.classList.add('cancle');
                }else{
                    audioNext.classList.remove('cancle');
                    audioLast.classList.remove('cancle');
                }
            }
            audioProgressBarRealtime.style.width = '0rem';
            audioProgressCircular.style.left = '-3%';
            this.playAudio();
            option.lastAudio && option.lastAudio(audioIndex);
        }, false);

        // 下一曲按钮点击并播放
        audioNext.addEventListener("click", (e) => {
            e.preventDefault();
            lastAndNextBtn();
            audioIndex == audioBtnIndex ? audioIndex = audioIndex  : audioIndex = audioBtnIndex;
            audioIndex++;
            if( audioIndex>option.audioList.length - 1) return false;
            if(option.audioList.length == 1 && audioIndex < 0){
                audioIndex = 0;
            }else if(audioIndex<0 && option.audioList.length > 1){
                audioIndex = 1;
            }
            this.stopAudio();
            this.setAudioUrl(option.audioList[audioIndex]);
            let index;
            for(let i=0;i<option.audioList.length;i++){
                if(audio.src==option.audioList[i].url){
                    index = i;
                }
            }
            if(option.audioList.length == 2){
                audioNext.classList.add('cancle');
                audioLast.classList.remove('cancle');
            }else{
                if(index>=option.audioList.length - 1){
                    audioNext.classList.add('cancle');
                }else{
                    audioLast.classList.remove('cancle');
                    audioNext.classList.remove('cancle');
                }
            }
            audioProgressBarRealtime.style.width = '0rem';
            audioProgressCircular.style.left = '-3%';
            this.playAudio();
            option.nextAudio && option.nextAudio(audioIndex);

        }, false);

        // 音频播放时 播放时间和进度条控制
        audio.addEventListener("timeupdate", (e) => {
            e.preventDefault();
            audioCurrentTime.innerHTML = this.transTime(audio.currentTime);
            if(audio.paused){
                playOrPause.classList.remove('pause');
            }else{
                playOrPause.classList.add('pause');
            }
            audioProgressBarRealtime.style.width = audio.currentTime / audio.duration * 100 - 0 + '%';
            audioProgressCircular.style.left = audio.currentTime / audio.duration * 100 - 2.5 + '%';
        },false);

        // 音频准备OK 设置总时间以及取到总时长
        audio.addEventListener("canplay", (e) => {
            e.preventDefault();
            if(audio.duration == Infinity){
                audioRemainingTime.innerHTML = '00:01';
            }else{
                audioRemainingTime.innerHTML = this.transTime(audio.duration);
            }
        },false);

        // 音频播放完毕 循环播放当前音频
        audio.addEventListener("ended", (e) => {
            this.playAudio();
        },false);

        // 开始拖拽
        let touchstart=(e)=>{
            if (!audio.paused || audio.currentTime != 0){
                flagDrop = true;
                this.stopAudio();
                oriOffestLeft = audioProgressCircular.offsetLeft;
                x1 = event.touches ? event.touches[0].clientX : event.clientX; // 要同时适配mousedown和touchstart事件
                maxLeft = oriOffestLeft; // 向左最大可拖动距离
                maxRight = widthBar - oriOffestLeft; // 向右最大可拖动距离

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
            if (flagDrop){
                x2 = event.touches ? event.touches[0].clientX : event.clientX; // 要同时适配mousemove和touchmove事件
                let length = x2 - x1;
                if (length > maxRight) {
                    length = maxRight;
                } else if (length < -maxLeft) {
                    length = -maxLeft;
                }
                let rate = (oriOffestLeft + length) / widthBar;
                audio.currentTime = audio.duration * rate;
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
            flagDrop = false;
        }

        audioProgressCircular.addEventListener('mousedown',touchstart,false);
        audioProgressCircular.addEventListener('touchstart',touchstart,false);
        audioProgressCircular.addEventListener('mousemove',touchmove,false);
        audioProgressCircular.addEventListener('touchmove',touchmove,false);
        audioProgressCircular.addEventListener('mouseup',touchend,false);
        audioProgressCircular.addEventListener('touchend',touchend,false);
    }
}

export default AudioStyle;
