<template>
  <div
      @mousewheel.prevent="onMousewheel"
      @mousedown="onMousedown"
      @keyup.prevent="onKeyUp"
      tabindex='-1'
      @contextmenu.prevent="popupMenu"
  >
<!--    <img :alt="$store.getters.currentImg" class="currentImg" v-show='isCurrentImg' :src="imgData">-->
    <DisplayRack></DisplayRack>
  </div>
</template>

<script>
import {exists, moveFileTo, undoMoveFile } from "../util/lib";
import { remote, clipboard } from 'electron';
import DisplayRack from "./DisplayRack";



export default {
  name: "ImageClassifierContainer",
  components : { DisplayRack },
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
        console.debug( e.key , "在当前方案中获取到目标目录" )
        this.moveTo( newPath );
        return;
      }
      if ( this.$store.getters.basicKeymap['enabled'] ){

        console.debug( e.key , "在当前方案中未定义目标目录, 将尝试在基础方案中获取目录" )
        newPath = this.$store.getters.basicKeymap['data'].keymap[e.key];
        if ( newPath ) {
          console.debug( e.key , "在基础方案中获取到目录" )
          this.moveTo( newPath );
          return;
        }else {
          console.debug( e.key , "当前方案和基础方案中未定义目标目录" )
        }
      }else{
        console.debug( e.key , "未启用基础方案功能" )
      }
    },
    moveTo( newPath ){
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

  }

}
</script>

<style scoped>




</style>
