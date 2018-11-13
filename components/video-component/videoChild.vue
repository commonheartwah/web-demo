<template>
  <div class="container" :class="[{an:isAndroid,ios:isiOS}]">
    <video id="first-video"
    			 width="80%"
    			 height="100%"
                 controls = 'true'
    			 x5-video-player-type="h5"
    			 x5-video-player-fullscreen="false"
    			 x5-playsinline=""
    			 playsinline =true
    			 webkit-playsinline=true
    			 preload="auto"
    			 :poster="poster"
    			 :src="url"
    			 :playOrPause="playOrPause"
    			 x-webkit-airplay="allow"
    			 @click="pauseVideo"
    			 @ended="onPlayerEnded($event)"
    >
    </video>
    <img v-show="isVideoShow" class="play" @click="playvideo" v-if="isiOS"  />
  	<img v-show="isShow" class="platStart" @click="androidPlay" v-if="isAndroid"  >
  </div>
</template>
<script>
export default {
  name: "videoChild",
  props: {
    url: String,
    poster: String
  },
  data() {
    var u = navigator.userAgent;
    let video = document.querySelector("video");
    return {
      isVideoShow: true,
      isShow: true,
      playOrPause: false,
      video: null,
      isAndroid: u.indexOf("Android") > -1 || u.indexOf("Adr") > -1, // android终端
      isiOS: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
    };
  },
  methods: {
    playvideo(event) {
      if (this.isiOS) {
        let vid = document.querySelector("video");
        let currentTime = vid.currentTime.toFixed(4);

        this.isVideoShow = false;
        video.play();
        this.getvideoprogress()
        //进入全屏
        window.onresize = function() {
          video.style.width = window.innerWidth + "px";
          video.style.height = window.innerHeight + "px";
        };
      }
    },
    pauseVideo() {
      //暂停\播放
      let video = document.querySelector("video");
      if (this.playOrPause) {
        video.pause();
      } else {
        video.play();
      }
      this.playOrPause = !this.playOrPause;
    },
    onPlayerEnded(player) {
      //视频结束
      this.isVideoShow = true;
      this.isShow = true;
    },
    androidPlay() {
      let video = document.querySelector("video");
      this.isShow = false;
      video.play();
      this.getvideoprogress()
    },
    // 毫秒监听
    getvideoprogress() {
      setTimeout(()=> {
        var vid = document.getElementById('first-video');
        var currentTime = vid.currentTime.toFixed(4);
        if (currentTime == vid.duration) {
          //结束触发终止定时器
          return false;
        }
        console.log(currentTime);
        console.log(vid.duration);
        this.getvideoprogress();
      }, 10);
    }
  }
};
</script>
<style scoped>
#first-video {
  object-fit: scale-down;
}
.container {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999;
  background-color: #000;
}
.play,
.platStart {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  object-fit: scale-down;
}
</style>