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
    <div class='file-drag-prompt' v-if='!fileDragging'>点击选择文件夹, 或拖拽文件到此</div>
    <div class='file-drag-prompt' v-if='fileDragging'>在此处松开鼠标即可选择此文件</div>
  </div>
</template>

<script>
const remote = require('electron').remote;

export default {
  name: "FileDrag",
  data () {
    return {
      'fileDragging': false
    }
  },

  methods: {
    init: function () {
      //  : 文件拖拽组件初始化
    },
    onDrop: function (e) {
      //  :  拖拽文件后执行
      // console.log('onDrop');
      console.log(e.dataTransfer.files);
      console.log(e.dataTransfer.files[0]);
      this.fileSelected(e.dataTransfer.files[0].path);
    },
    selectFile: function () {
      //  : 弹出文件选择框
      const pathObjObj = remote.dialog.showOpenDialog(
          {
            title: '请选择一个包含图片文件夹',
            properties: [
              'openFile', 'openDirectory'
            ],
            buttonLabel: '选择此目录'
          }
      );
      console.log(pathObjObj );
      this.fileSelected(pathObjObj[0] ) ;
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

.file-drag-prompt{
  margin: 20px;

  left: 20px;
  bottom: 20px;
  right: 20px;
  top: 20px;

  /* padding-top: 20%; */
  font-size: 64px;
  text-align: center;
  border-radius:20px;
  border-right: 20px;
  position:fixed;
  border-style:dashed;
  border-width:10px;
  border-color: rgba(0, 0, 0, 0.2);;
}
</style>
