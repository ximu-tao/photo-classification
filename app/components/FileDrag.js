const remote = require('electron').remote;

export default {
  data: function () {
    return {
      'fileDraging': false
    }
  },
  template: `
        <div
            class="file-drag-container"
            :class="{ 'file-draging': fileDraging }"
            @drop="onDrop"
            @dragenter="onDragenter"
            @dragover="onDragover" 
            @dragleave="onDragleave" 
            @click="selectFile"
            >
            <div class='file-drag-prompt' v-if='!fileDraging' >点击选择文件夹, 或拖拽文件到此</div>
            <div class='file-drag-prompt' v-if='fileDraging' >在此处松开鼠标即可选择此文件</div>
        </div>`,

  methods: {
    init: function () {
      //  : 文件拖拽组件初始化
    },
    onDrop: function (e) {
      //  :  拖拽文件后执行
      // console.log('onDrop');
      this.fileSelected(e.dataTransfer.files[0].path);
    },
    selectFile: async function () {
      //  : 弹出文件选择框
      var pathObjObj = await remote.dialog.showOpenDialog(
        {
          title: '请选择一个包含图片文件夹',
          properties: [
            'openFile', 'openDirectory'
          ],
          buttonLabel: '选择此目录'
        }
      )
      // console.log(pathObjObj.filePaths[0]);
      this.fileSelected(pathObjObj.filePaths[0]);
    },
    fileSelected: function (path) {
      //  : 获得路径后调用
      this.$emit('file-selected', path);
    },
    onDragenter: function (e) {
      // : 拖拽文件进入后执行
      this.fileDraging = true;
      e.preventDefault();
    },
    onDragover: function (e) {
      e.preventDefault();
    },
    onDragleave: function (e) {
      // : 拖拽文件离开后执行
      this.fileDraging = false;
      e.preventDefault();
    },
  }
}