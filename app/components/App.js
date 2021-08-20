
const fs = require('fs');
const path = require('path');

import {isDir} from "../util/lib.js";

var __MyDIRNAME = path.join(
  __dirname.replace("app.asar", ""), "../../"
)
console.log( __MyDIRNAME )
export default  {
  el: "#app",

  template:
    `
  <div>
  <file-drag v-if="!currentPath" @file-selected='onFileSelected'></file-drag>
        <!-- <file-drag v-if="0" @file-selected='onFileSelected'></file-drag> -->

        <image-classifier-container 
        ref="image_classifier_container_"
            v-if="currentPath"
            
            :current-path='currentPath'
            :keymap='currentKeymap.keymap'
            @queueempty='onQueueEmpty'
        ></image-classifier-container>

        <keymap-container
            ref="keymap_container_"
            v-if="currentPath" 
            :current-keymap="currentKeymap"
            :can_edit='false'
            :keymap-list='keymapList'
            :is-minimize='is_keymap_containeris_minimize'
            @addconfig="onAddConfig"
            @switchminimize='onSwitchMinimize'
            @change='onChange'
            @keymapedit='onKeymapedit'
            @switchconfig='onSwitchConfig'
            >
        </keymap-container>
       </div>
  `
    , computed: {
  configFilePath: function () {
    return path.join(
      __MyDIRNAME, './config.json'
    );
  }
}

, data: {
  'keymapTemplate': {
    'configName': 'newConfig',
      'keymap': {
      '0': '', '1': '', '2': '',
        '3': '', '4': '', '5': '',
        '6': '', '7': '', '8': '',
        '9': '', 'a': '', 'b': '',
        'c': '', 'd': '', 'e': '',
        'f': '', 'g': '', 'h': '',
        'i': '', 'j': '', 'k': '',
        'l': '', 'm': '', 'n': '',
        'o': '', 'p': '', 'q': '',
        'r': '', 's': '', 't': '',
        'u': '', 'v': '', 'w': '',
        'x': '', 'y': '', 'z': ''
    }
  },

  'keymapList': []
    // 配置名 及 按键目录 键值对

    , 'currentPath': ""
    // 图片文件所在的路径

    , 'is_keymap_containeris_minimize' : false
}

, methods: {
  init: function () {
    //  : 读取 config 文件, 获取配置信息并存储在 keymapList 和 currentKeymap

    if (!fs.existsSync(this.configFilePath)) {
      this.keymapList.push(this.keymapTemplate);
      this.setConfigFile();
    }

    let data = fs.readFileSync(
      this.configFilePath, 'utf-8');

    this.keymapList = JSON.parse(data);

    this.currentKeymap = this.keymapList[0];

  },

  setConfigFile: function () {
    //  : 把配置信息写入文件

    fs.writeFileSync(
      this.configFilePath
      , JSON.stringify(this.keymapList)
    );

  },

  onFileSelected: async function (_path_) {
    //  : 获得路径后, 判断是否合法, 判断文件夹中是否包含图片文件

    let path_ = ""
    if (fs.existsSync(_path_)) {

      let flag = isDir(_path_)

      if (flag) {
        path_ = _path_
      } else {
        path_ = path.dirname(_path_)
      }

      this.currentPath = path_;
    }
  }
, onChange: function (_pathkey_, _img2path_) {
    this.currentKeymap.keymap[_pathkey_] = _img2path_;
  }

, printKeymap: function () {
    console.log(this.currentKeymap.keymap);
  }

, onKeymapedit: function (_configName_, _keymap_) {
    console.log(_keymap_);
    this.currentKeymap.configName = _configName_;
    this.currentKeymap.keymap = { ..._keymap_ };

    this.setConfigFile()
  }

, onSwitchConfig: function (configIndex) {
    // console.log( configIndex );
    this.currentKeymap = this.keymapList[configIndex];
    this.$refs.keymap_container_.currentKeymap = this.currentKeymap;
    this.$refs.keymap_container_.init();
    this.$refs.image_classifier_container_.keymap = this.currentKeymap.keymap;

    // console.log( this.currentKeymap );
  }
, onQueueEmpty: function () {
    this.currentPath = ""
  }

, onSwitchMinimize : function(){
    this.is_keymap_containeris_minimize = !this.is_keymap_containeris_minimize;
  }

, onAddConfig( configName , keymap ){
    this.keymapList.push( { configName , keymap} );
    this.$refs.keymap_container_.addConfiged(  this.keymapList.length );
      this.setConfigFile()
  }
}
, mounted() {
  // console.log(this.currentKeymap);

  this.init()
},

}