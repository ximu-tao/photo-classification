<template>
  <div id="app">
    <file-drag v-if="$store.getters.isImgListEmpty"/>
    <image-classifier-container v-if="!$store.getters.isImgListEmpty"/>
    <keymap-container v-if="!$store.getters.isImgListEmpty" />
    <setting-container></setting-container>
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="70%"
        :showClose="false"
        >
        <span>没有检测到配置文件, 请选择一个位置, 用于存储你的配置</span><br/>
        <br/>
        <el-button @click="saveConfigToFile_( USERDATA_CONFIG_PATH )">存储在用户文件夹下: {{ USERDATA_CONFIG_PATH }}</el-button><br/>
        <br/>
        <el-button  @click="saveConfigToFile_( APP_CONFIG_PATH )" type="primary">存储在程序路径下: {{ APP_CONFIG_PATH }}</el-button>

    </el-dialog>
  </div>
</template>

<script>

  import FileDrag from "./components/FileDrag";
  import ImageClassifierContainer from "./components/ImageClassifierContainer";
  import KeymapContainer from "./components/KeymapContainer";
  import SettingContainer from "./components/SettingContainer";
  import {hasConfig, saveConfigToFile , APP_CONFIG_PATH, USERDATA_CONFIG_PATH} from "./util/lib";

  export default {
    name: 'video-classification',
    components: {
      FileDrag,ImageClassifierContainer,KeymapContainer,SettingContainer
    },
    data(){
      return {
        dialogVisible: false,
        APP_CONFIG_PATH:APP_CONFIG_PATH,
        USERDATA_CONFIG_PATH:USERDATA_CONFIG_PATH,

      }
    },
    methods:{
      async saveConfigToFile_( path_ ){



        await saveConfigToFile( {keymapList: [this.$store.getters.template]}  , path_  )
        hasConfig()
        await this.$store.dispatch('init');
        this.dialogVisible=false
      }
    },
     mounted() {
       console.log("APP init");
      if ( !hasConfig() ){
        this.dialogVisible = true;

      }else{
        this.$store.dispatch('init');
      }

    }
  }
</script>

<style>
* {
  margin: 0px;
  padding: 0px;
  user-select: none;
}

body {
  width: 100%;
  height: 100%;
}
</style>
