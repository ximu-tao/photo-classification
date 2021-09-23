// ImageClassifierContainer

import { moveFileTo, exists, moveFileTo2 } from "../util/lib.js";

export default {

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

  computed: {

  },

  template: `
        <div 
            class="img-container"
            @mousewheel="onMousewheel"
            @mousedown="onMousedown"
            @keyup="onKeyUp"
            tabindex='-1'
            >
            <img :alt="$store.getters.currentImg" class="currentImg" v-show='isCurrentImg' :src="$store.getters.currentImg">
            
        </div>
        `


  , methods: {

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
      e.preventDefault();

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
      e.preventDefault();
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

  }

}