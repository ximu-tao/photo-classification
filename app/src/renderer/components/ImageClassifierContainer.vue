<template>
  <div
      class="img-container"
      @mousewheel.prevent="onMousewheel"
      @mousedown="onMousedown"
      @keyup.prevent="onKeyUp"
      tabindex='-1'
  >
    <img :alt="$store.getters.currentImg" class="currentImg" v-show='isCurrentImg' :src="imgData">

  </div>
</template>

<script>
import {exists, moveFileTo, moveFileTo2 , readImgAsBase64} from "../util/lib";

export default {
  name: "ImageClassifierContainer",
  data() {
    return {
      isCurrentImg: true,
      switchImg: {
        '-1': this.previousImg,
        '1': this.nextImg,
        '3': this.nextImg,
        '4': this.previousImg,
        '37': this.previousImg,
        '38': this.previousImg,
        '39': this.nextImg,
        '40': this.nextImg
      },
      controlKeyFun: {
        'z': this.undo,
      }
    }
  },
  methods: {

    nextImg: function () {
      //  : 切换下一张图片
      this.$store.commit('nextImg');
    }
    , previousImg: function () {
      //  : 切换上一张图片
      this.$store.commit('previousImg');
    }
    , moveImg: function (oldImgIndex, newPath) {

    }

    , onKeyUp: function (e) {
      //  : 当按键被按下时, 判断按键并调用函数
      if (e.ctrlKey) {
        try {
          this.controlKeyFun[e.key]()
        } catch (err) {
          console.log(err);
        }
      } else {
        let newPath = this.$store.getters.currentKeymap.keymap[e.key];
        if ( newPath ) {
          console.debug( this.$store.getters.currentImg, `将被移动至` , newPath )

          if ( !exists( newPath , this.$store.getters.currentImg) ) {
            moveFileTo(  this.$store.getters.currentImg , newPath);
            this.$store.dispatch('popCurrent' , newPath );

          }else{
            console.debug(  newPath , '内存在' ,
                this.$store.getters.currentImg , '的同名文件, 移动失败'
            )
          }

        } else {
          try {
            this.switchImg[e.keyCode]();
            // console.log( this.currentImgIndex );
          } catch (error) {
            console.log(error);
          }
        }


      }
    }

    , onMousewheel: function (e) {
      // TODO : 鼠标滚轮
    }
    , onMousedown: function (e) {
      // TODO : 鼠标侧键

      // 为什么这里 e.preventDefault(); 后 , keyup 事件就不生效了呢?
      // console.log( '鼠标侧键' );
    }
    , undo: function () {
      //  : 撤销文件移动

      let moved = this.$store.getters.lastMovedImg;
      moveFileTo2( moved.new , moved.old );
      this.$store.dispatch( 'popLastMoved' );
    }

  }
  , mounted: function () {

  },
  computed: {
    imgData: function () {
      return  readImgAsBase64( this.$store.getters.currentImg );
    }
  }

}
</script>

<style scoped>

.currentImg{
  text-align: center;
  max-width: 100%;
  max-height: 100%;
  display:block;
  z-index: 100;
  margin: 0 auto;
}

.img-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* overflow: hidden; */
  background-color: #211f1f;

}
</style>
