// ImageClassifierContainer

const fs = require("fs");
const path = require("path");

import {isDir , moveFileTo , exists } from "../util/lib.js";

export default {

  props: {
    currentPath: {
      type: [String]
      , required: true,
    },

    keymap: {
      type: [Object]
      , required: true,
    }
  },

  data() {
    return {
      img_queue: [],
      moved_stack: [],
      currentImgIndex: 0,
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
      trueCurrentImgPath: "",
      controlKeyFun: {
        'z': this.undo,
      }
    }
  },

  computed: {
    currentImgPath: function () {
      return this.img_queue[this.currentImgIndex];
    }
    , nextImgPath: function () {
      return this.img_queue[this.currentImgIndex + 1];
    }
  },

  template: `
        <div 
            class="img-container"
            @mousewheel="onMousewheel"
            @mousedown="onMousedown"
            @keyup="onKeyUp"
            tabindex='-1'
            >
<!--            <img class="currentImg" v-show='isCurrentImg' :src="currentImgPath">-->
            <img class="currentImg" v-show='isCurrentImg' :src="$store.getters.currentImg">
            
        </div>
        `

  // <img class="nextImg" v-show='!isCurrentImg' :src="nextImgPath">
  , methods: {
    init: function () {
      let files_list = fs.readdirSync(this.currentPath);
      let this_ = this;


      files_list.forEach(
        function (key, index, array) {
          array[index] = path.join(this_.currentPath, key)
        }
      );

      files_list = files_list.filter(
        function (item) {
          return (
            // 增加了一些支持的图片类型
            ['.jpg', '.png', '.jpeg'
              , '.gif', '.webp' , '.apng'
              , '.bmp' , '.ico', '.cur' ,
              '.jfif', '.pjpeg', '.pjp'
              , '.svg']
              .indexOf(path.extname(item).toLowerCase()) != -1
            && fs.existsSync(item)
            && !isDir(item))
        }
      )

      this.img_queue = files_list;


    }
    , nextImg: function () {
      //  : 切换下一张图片
      this.currentImgIndex += 1;
      this.currentImgIndex %= this.img_queue.length;
      this.$store.commit('nextImg');
    }
    , previousImg: function () {
      //  : 切换上一张图片
      this.currentImgIndex += (this.img_queue.length - 1);
      // console.log( this.currentImgIndex );
      this.currentImgIndex %= this.img_queue.length;
      this.$store.commit('previousImg');
    }
    , moveImg: function (oldImgIndex, newPath) {
      //  : 移动图片的路径

      console.log( newPath );

      if (fs.existsSync(newPath) ) {
        // 目标文件夹存在同名文件, 不执行移动操作
        // TODO : 对用户的提示 ,
        return ;
      }

      try {
        fs.renameSync(this.img_queue[oldImgIndex], newPath)

        this.moved_stack.push(newPath);
        this.img_queue.splice( oldImgIndex, 1);

        // 倒数第一张图片移动文件后无法正常显示第一张图片
        this.currentImgIndex %= this.img_queue.length;
      } catch (err) {
        throw err;

        // TODO ERROR: 如果目标文件夹已存在同名文件, 或其他情况
      }
    }

    , onKeyUp: function (e) {
      //  : 当按键被按下时, 判断按键并调用函数
      e.preventDefault();
      // console.log('onKeyUp');
      // console.log(e);

      // console.log( e.key );
      // console.log( this.keymap[e.key] );

      if (e.ctrlKey) {
        // console.log(e.keyCode );

        // console.log(this.controlKeyFun[e.key]);
        try {
          this.controlKeyFun[e.key]()
        } catch (err) {
          console.log(err);
        }
      } else {
        // console.log( app.currentKeymap );
        // console.log( this.keymap );
        console.log( e.key );
        console.log( this.keymap[e.key] );
        if ( this.$store.getters.currentKeymap.keymap[e.key]) {
          console.debug( this.$store.getters.currentImg, `将被移动至` , this.$store.getters.currentKeymap.keymap[e.key] )

          if ( !exists( this.$store.getters.currentKeymap.keymap[e.key] ,
            this.$store.getters.currentImg
            ) ) {
            moveFileTo(  this.$store.getters.currentImg ,
              this.$store.getters.currentKeymap.keymap[e.key]
            );
            this.$store.dispatch('popCurrent');

          }else{
            console.debug(  this.$store.getters.currentKeymap.keymap[e.key] , '内存在' ,
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

      // 为什么这里 e.preventDefault(); 后 , kekyup 事件就不生效了呢?
      // console.log( '鼠标侧键' );
    }
    , undo: function () {
      //  : 撤销文件移动
      let src_path = this.moved_stack.pop();

      console.log(src_path);
      let new_path = path.join(this.currentPath,
        path.basename(src_path)
      );
      fs.renameSync(src_path, new_path);

      this.img_queue.splice(this.currentImgIndex, 0, new_path);

      // this.previousImg();
    }

  }
  , mounted: function () {
    this.init()
  }
  , watch: {
    img_queue: function (newval, oldVal) {
      if (newval == 0) {
        this.$emit('queueempty')
      }
    }
  }
}