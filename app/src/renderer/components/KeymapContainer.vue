<template>
  <div class='keymap-father'>
    <div class="minimize-container" v-if="!canEdit">
<!--      <el-button size="mini" v-if='isMinimize' @click='switchMinimize' round class="el-icon-zoom-in">展开</el-button>-->
<!--      <el-button size="mini" v-if='!isMinimize' @click='switchMinimize' round class="el-icon-zoom-out">缩小</el-button>-->
      <el-button size="mini" @click='switchMinimize' round :class="{ 'el-icon-zoom-in':isMinimize , 'el-icon-zoom-out':!isMinimize }">{{ isMinimize ? '展开' : '缩小'}}</el-button>
    </div>

    <div
        v-show='!isMinimize'
        class='keymap-container'
        :class="{ 'keymap-container-canedit': canEdit , 'keymap-container-unedit': !canEdit }"
    >

      <el-button size="mini" @click='addConfig'  v-show="!canEdit" round class="float-right  el-icon-document-add">添加配置</el-button>
      <div v-show="!canEdit">
        <el-select v-model="$store.state.__KeymapPointer" filterable placeholder="请选择">
          <el-option
              v-for="( e , i ) in $store.getters.nameList"
              :key="e"
              :label="e"
              :value="i">
          </el-option>
        </el-select>

      </div>
      <div v-show="addingConfig">
        方案名: <input type="text" v-model="editKeymapName" >

      </div>

      <table class='keymap-table'>
        <tr><th><kbd>按键</kbd></th><th>目录</th>
        </tr>
        <tr
            v-show="(!canEdit) && (val!='')"
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

      </table>

      <div v-if='canEdit'>
        <el-button size="mini" @click='save' class="el-icon-circle-check" round>保存</el-button>
        <el-button size="mini" @click='cancelEdit' class="el-icon-circle-close" round>取消</el-button>
      </div>
      <div v-show='!canEdit'>
        <el-button size="mini" @click='startEdit' class="el-icon-edit" round>修改方案</el-button>
        <el-button size="mini" @click='deleteKeymap' class="el-icon-delete" round>删除方案</el-button>
      </div>
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

      this.$confirm(`你确定要删除${currName}吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('deleteKeymap');
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      });

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
  z-index: 99;
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
  top: 0px;
}

.float-right{
  float: right;
}
</style>
