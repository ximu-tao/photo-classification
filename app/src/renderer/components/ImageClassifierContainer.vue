<template>
  <div
      class="img-container"
      @mousewheel.prevent="onMousewheel"
      @mousedown="onMousedown"
      @keyup.prevent="onKeyUp"
      tabindex='-1'
      @contextmenu.prevent="popupMenu"
  >
    <img :alt="$store.getters.currentImg" class="currentImg" v-show='isCurrentImg' :src="imgData">

  </div>
</template>

<script>
import {exists, moveFileTo, undoMoveFile , readImgAsBase64} from "../util/lib";
import { remote, clipboard } from 'electron';



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
      },
      contextmenu:remote.Menu.buildFromTemplate([
        {
          label: '复制文件路径',
          click: () => {
            console.debug("复制文件路径")
            clipboard.writeText(this.$store.getters.currentImg );
            console.debug(`复制文件路径成功${ this.$store.getters.currentImg }`)
          },
        }
      ])
    }
  },
  methods: {
    popupMenu(){

      // 弹出右键菜单
      this.contextmenu.popup(
          {
            window: remote.getCurrentWindow()
          }
      );
    },

    nextImg: function () {
      //  : 切换下一张图片
      this.$store.commit('nextImg');
    }
    , previousImg: function () {
      //  : 切换上一张图片
      this.$store.commit('previousImg');
    }
    , moveImg: function (oldImgIndex, newPath) {

    },
    specialFunctions( e ){
      if ( e.key in this.controlKeyFun){
        this.controlKeyFun[e.key]()
      }
      return;
    },
    moveImgFunctions(e){
      let newPath = this.$store.getters.currentKeymap.keymap[e.key];
      if ( newPath ) {
        console.debug( this.$store.getters.currentImg, `将被移动至` , newPath )

        if ( !exists( newPath , this.$store.getters.currentImg) ) {
          moveFileTo(  this.$store.getters.currentImg , newPath);
          this.$store.dispatch('popCurrent' , newPath );

          const h = this.$createElement;
          this.$notify({
            title: '移动成功',
            message: h('i', { style: 'color: teal'}, `${this.$store.getters.currentImg}被移动至${newPath}` )
          });

        }else{
          let msg = `${newPath} , '内存在' , ${ this.$store.getters.currentImg} 的同名文件, 移动失败`
          console.debug(  msg )

          this.$message.error( msg );
        }
      }
      return
    },
    switchImgFunctions( e ){
      try {
        this.switchImg[e.keyCode]();
      } catch (error) {
        console.debug(error);
      }
      return;
    }

    , onKeyUp: function (e) {
      //  : 当按键被按下时, 判断按键并调用函数
      if (e.ctrlKey) {
        this.specialFunctions(e);
        return;
      }

      if ( e.key in this.$store.getters.currentKeymap.keymap  ){
        this.moveImgFunctions(e);
        return;
      }

      if ( e.keyCode in this.switchImg ) {
        this.switchImgFunctions(e);
        return;
      }



    }

    , onMousewheel: function (e) {
      // TODO : 鼠标滚轮
    }
    , onMousedown: function (e) {
      // TODO : 鼠标侧键
      // 为什么这里 e.preventDefault(); 后 , keyup 事件就不生效了呢?
    }
    , undo: function () {
      //  : 撤销文件移动

      let moved = this.$store.getters.lastMovedImg;
      undoMoveFile( moved.new , moved.old );
      this.$store.dispatch( 'popLastMoved' );
    }

  }
  , mounted: function () {

  },
  computed: {
    imgData: function () {
      let base64 = readImgAsBase64( this.$store.getters.currentImg );
      let newImage = new Image();
      newImage.src = base64;
      newImage.onload = () => {
        let title = `${this.$store.getters.currentImg} - [${ this.$store.getters.currentImgIndex+1 }/${ this.$store.getters.imgListSize }] ${newImage.width}:${newImage.height} - 图片分类`;
        document.title = title;
        console.debug( title );
      }

      return base64;
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
