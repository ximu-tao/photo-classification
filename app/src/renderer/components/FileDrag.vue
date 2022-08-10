<template>
  <div
      class="file-drag-container"
      :class="{ 'file-dragging': fileDragging }"
      @drop.prevent="onDrop"
      @dragenter.prevent="onDragenter"
      @dragover.prevent="onDragover"
      @dragleave.prevent="onDragleave"
      @click="selectFile"
  >
    <div class="border-dashed">
      <i class="el-icon-folder-opened file-icon-upload"></i>
      <div
          class="el-upload__text file-drag-prompt"
          v-if='!fileDragging'
      >拖拽到此，或<em>点击选择</em></div>
      <div class='file-drag-prompt' v-if='fileDragging'>松开鼠标选择此文件</div>
    </div>
  </div>
</template>

<script>
import { remote } from "electron";

export default {
  name: "FileDrag",
  data () {
    return {
      'fileDragging': false,
      "opened" : false,
    }
  },

  methods: {
    init: function () {
      //  : 文件拖拽组件初始化
    },
    onDrop: function (e) {
      //  :  拖拽文件后执行
      console.debug(e.dataTransfer.files);
      this.fileSelected(e.dataTransfer.files[0].path);
    },
    selectFile: function () {
      //  : 弹出文件选择框
      // 该事件是阻塞的, 多次触发事件会导致, 关闭文件选择框后继续弹出文件选择框, 但不会同时弹出
      if ( ! this.opened ){
        this.opened = true;
        const pathObjObj = remote.dialog.showOpenDialog(
            {
              title: '请选择一个包含图片文件夹',
              properties: [
                'openFile', 'openDirectory'
              ],
              buttonLabel: '选择此目录'
            }
        );
        console.debug(pathObjObj );
        setTimeout( ()=>{
          this.opened = false;
        } , 0 );
        // 0秒后再将 this.opened = false, 使得事件阻塞期间多次触发的事件无效
        this.fileSelected(pathObjObj[0] ) ;
      }
    },
    fileSelected: function (path) {
      //  : 获得路径后调用
      this.$store.dispatch('imgPath' , path );
    },
    onDragenter: function (e) {
      // : 拖拽文件进入后执行
      this.fileDragging = true;
    },
    onDragover: function (e) {
      this.fileDragging = true;
    },
    onDragleave: function (e) {
      // : 拖拽文件离开后执行
      this.fileDragging = false;
    },
  }
}
</script>

<style scoped>

.file-drag-container{
  width: 100%;
  height: 100%;
  /* background-color: aqua; */
  background-color: rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 0px;
  bottom: 0px;

  /* overflow:hidden;  */
  word-break:break-all;
}

.file-dragging{
  background-color: rgba(0, 0, 0, 0.2);
}

.file-icon-upload{
  margin: 40px 0 16px;
  left: 20px;
  bottom: 20px;
  right: 20px;
  top: 40px;

  font-size: 128px;
  text-align: center;
  border-radius:20px;
  border-right: 20px;
  position:fixed;
}
.file-drag-prompt{

  left: 20px;
  right: 20px;
  top: 200px;
  position:fixed;
  /* padding-top: 20%; */
  font-size: 32px;
  text-align: center;

}

.border-dashed{
  margin: 20px;

  left: 20px;
  bottom: 20px;
  right: 20px;
  top: 20px;
  border-radius:20px;
  position:fixed;
  border-style:dashed;
  border-width:4px;
  border-color: rgba(0, 0, 0, 0.2);
}
</style>
