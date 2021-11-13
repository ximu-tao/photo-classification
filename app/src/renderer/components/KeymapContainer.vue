<template>
  <div class='keymap-father'>
    <div class="minimize-container" v-if='isMinimize'>
      <input type='button' @click='switchMinimize' value='展开'>
    </div>

    <div
        v-show='!isMinimize'
        class='keymap-container'
        :class="{ 'keymap-container-canedit': canEdit , 'keymap-container-unedit': !canEdit }"
    >
      <div v-show="!canEdit">
        <!--
        使用临时变量无法在添加方案后切换到新的方案
        使用 v-model='$store.getters' 无法双绑
        使用 :values='$store.getters' 无法手动切换
        暂时这样用, 以后想办法改
         -->
        <!--                @change='switchConfig'-->
        <!-- TODO : 💩 : 不建议直接使用 $store.state.__KeymapPointer , 想办法使用其他方法完成双绑 -->
        <select
            v-model='$store.state.__KeymapPointer'
        >
          <option disabled selected= "selected" value="">请选择</option>
          <option
              v-for='( e , i ) in $store.getters.nameList'
              :value='i' >
            {{ e }}</option>

        </select>
        <button @click='addConfig'>添加配置</button>
        <button @click='switchMinimize'>缩小</button>

      </div>
      <div v-show="addingConfig">
        方案名: <input type="text" v-model="editKeymapName" >

      </div>

      <table class='keymap-table'>
        <tr><th><kbd>按键</kbd></th><th>目录</th>
        </tr>
        <tr
            v-show="!canEdit"
            is='input-tr'
            v-for='(val, key) in $store.getters.currentKeymap.keymap'
            :img2path='val'
            :keypath='key'
            :key="'1'+key"
            :can_edit='canEdit'

        ></tr>

        <tr
            v-if="canEdit"
            is='input-tr'
            v-for='(val, key) in keymapEdit'
            :img2path='val'
            :keypath='key'
            :key="'2'+key"
            :can_edit='canEdit'
            @change='onChange'
        ></tr>


        <tr v-if='canEdit'>
          <td><input type='button' @click='save' value='保存'></td>
          <td><input type='button' @click='cancelEdit' value='取消'></td>
        </tr>

        <tr v-if='!canEdit'>
          <td></td>
          <td><input type='button' @click='startEdit' value='修改方案'>
            <input type='button' @click='deleteKeymap' value='删除方案'></td>
        </tr>

      </table>
    </div>
  </div>
</template>

<script>
import InputTr from "./InputTr";

export default {
  name: "KeymapContainer",
  data: function () {
    return {
      canEdit: false,
      styleObj: function () {
        return {
          'backgroundColor': 'write'
        }
      },
      editKeymapName : '',
      keymapEdit : {},
      addingConfig :false,
      isMinimize:false
    }
  },
  components : {InputTr},
  computed: {},
  methods: {
    deleteKeymap(){
      let currName = this.$store.getters.currentKeymap.configName;
      if (window.confirm(`你确定要删除${currName}吗?`)) {

        this.$store.commit('deleteKeymap');
      }

    },

    save(){
      if ( this.addingConfig ){
        this.saveAddConfig();
      }else{
        this.saveEdit();
      }
    },

    addConfig(){

      this.keymapEdit = {
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
      this.editKeymapName = "newConfig";
      this.addingConfig = true;
      this.canEdit = true;

    },

    saveAddConfig(){

      this.$store.dispatch( 'addKeymap' , {
        configName:this.editKeymapName, keymap:this.keymapEdit
      } )
      this.addingConfig = false;
      this.canEdit = false;
    }


    , switchMinimize : function(){
      this.$data.isMinimize = !this.$data.isMinimize;
    }

    , onChange: function (_pathKey_, _img2path_) {
      //  : path 经过验证后才会调用这个方法

      this.keymapEdit[_pathKey_] = _img2path_;

    }
    , cancelEdit: function () {
      this.canEdit = false;
      this.addingConfig = false;
    }

    , saveEdit: function () {
      this.canEdit = false;
      this.$store.dispatch('alterCurrentKeymap' , {
        configName:this.editKeymapName, keymap:this.keymapEdit
      } )
    }
    , startEdit: function () {
      this.keymapEdit = this.$store.getters.currentKeymap.keymap;
      this.editKeymapName = this.$store.getters.currentKeymap.configName;
      this.canEdit = true;
    }

  },
  mounted() {
    console.debug( this.$store.getters.currentKeymap.keymap)
  }

}
</script>

<style scoped>
.keymap-container{
  z-index: 100;
  top: 0px;
  left: 0px;
  height: 100%;
  position: absolute;
  overflow-y: scroll;
  background-color: rgba( 255 , 255 , 255 , 0.3 );
}
.minimize-container{
  z-index: 100;
  position: absolute;
  left: 0px;
  bottom: 0px;
}
</style>
