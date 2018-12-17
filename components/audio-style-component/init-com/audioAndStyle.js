/**
 * 带样式的audio组件
 * 使用：
 * 1 - 导入 eg:import audioPlayer from '../../common/scripts/widgets/audioAndStyle.js';
 * 2 - 实例化对象
 *  audioPlayer({
                    appNode: document.getElementById('div'), // 插入哪个节点下
                    audioList:this.arr,                      // 音频数组
                    lastAudio : this.lastAudio,              // 点击上一曲的回调
                    nextAudio : this.nextAudio,              // 点击下一曲的回调
                });
*  3 - 参数与方法说明
        arr : 音频数组 [
            {
                url:'', // 音频url
                title:'' // 音频名称 可为空
            }
        ]
        setAudioUrl : 设置音频URL并播放
            info : 设置播放哪个音频 {url : '', title : ''}
            audioList : 音频全部列表 主要用于渲染下一曲上一曲按钮的显示
        stopAudio : 暂停音频播放

 */
import AudioStyle from '../audioAndStyle';
import popup from "../../popup/popup_new";

class PlayAudio{
    constructor(option){
        this.el = new AudioStyle(option);
    }
 
    // 设置audio的url
    setAudioUrl(info,audioList) {
        document.getElementById('audio-component').src = info.url;
        document.getElementById('audio-title').innerHTML = info.title || '';
        let audioLast = document.getElementById('audio-last'); // 上一曲
        let audioNext = document.getElementById('audio-next'); // 下一曲
        let audioBtnIndex;
        for(let i=0;i<audioList.length;i++){
            if(document.getElementById('audio-component').src == audioList[i].url){
                audioBtnIndex = i;
            }
        }
        if(audioList.length==1){
            audioLast.classList.add('cancle');
            audioNext.classList.add('cancle');
        }
        if(audioList.length==2){
            if(audioBtnIndex == 0){
                audioNext.classList.add('cancle');
                audioLast.classList.remove('cancle');
            }else{
                audioNext.classList.remove('cancle');
                audioLast.classList.add('cancle');
            }
        }
        if(audioList.length>2){
            if(audioBtnIndex == 0){
                audioNext.classList.remove('cancle');
                audioLast.classList.add('cancle');
            }else if(audioBtnIndex == audioList.length - 1){
                audioNext.classList.add('cancle');
                audioLast.classList.remove('cancle');
            }else{
                audioNext.classList.remove('cancle');
                audioLast.classList.remove('cancle');
            }
        }
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

    // 上一曲
    lastAudio(){
        document.getElementById('audio-last').addEventListener('click',option.lastAudio(),false);

    }
    // 下一曲
    nextAudio(){
        document.getElementById('audio-next').addEventListener('click',option.nextAudio(),false);
    }
}

let getInstance = function(option){
    return document.querySelector('audio') ? '' : new PlayAudio(option);
}; 

export default getInstance;
