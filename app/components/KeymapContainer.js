// KeymapContainer

export default {
  props: {},
  data: function () {
    return {
      canedit: false,
      pathVerificaError: 0
      , styleObj: function () {
        return {
          'backgroundColor': 'write'
        }
      }
      , keymap_: null
      , keymapName: ''
      , selectedConfigIndex: 0,
      editKeymapName : '',
      keymapEdit : {},
      addConfiging :false,
      isMinimize:false
    }
  },
  computed: {


  },

  // keymap-container 部分 用 v-if 时,切换显示时有明显卡顿 所以使用 v-show 了
  template: `
       <div class='keymap-father'>
        <div class="minimize-container" v-if='isMinimize'>
            <input type='button' @click='switchMinimize' value='展开'>
        </div>

        <div
        v-show='!isMinimize'
        class='keymap-container'
        :class="{ 'keymap-container-canedit': canedit , 'keymap-container-unedit': !canedit }"
        >
        <div v-show="!canedit">
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
            <div v-show="addConfiging">
            方案名: <input type="text" v-model="editKeymapName" >
            
            </div>
            
            <table class='keymap-table'>
                <tr><th><kbd>按键</kbd></th><th>目录</th>
                </tr>
                <tr
                    v-show="!canedit"
                    is='input-tr' 
                    v-for='(val, key, index) in $store.getters.currentKeymap.keymap'
                    :img2path='val'
                    :keypath='key'
                    :key="'1'+key"
                    :can_edit='canedit'

                    ></tr>
                   
                <tr
                    v-if="canedit"
                    is='input-tr'
                    v-for='(val, key, index) in keymapEdit'
                    :img2path='val'
                    :keypath='key'
                    :key="'2'+key"
                    :can_edit='canedit'
                    @change='onChange'
                    ></tr>


                <tr v-if='canedit'>
                    <td v-show="!addConfiging"><input type='button' @click='saveEdit' value='保存'></td>
                    <td v-show="addConfiging"><input type='button' @click='saveAddConfig' value='保存'></td>
                    <td><input type='button' @click='cancelEdit' value='取消'></td>
                </tr>

                <tr v-if='!canedit'>
                    <td></td>
                    <td><input type='button' @click='startEdit' value='修改方案'></td>
                </tr>

           </table>
        </div>
        </div>`,


  methods: {
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
      this.addConfiging = true;
      this.canedit = true;

    },

    saveAddConfig(){

      this.$store.dispatch( 'addKeymap' , {
          configName:this.editKeymapName, keymap:this.keymapEdit
        } )
      this.addConfiging = false;
      this.canedit = false;
    }


    ,addConfiged( keymapListLength ){
      this.selectedConfigIndex = keymapListLength-1;

      // this.init();
      // this.switchConfig();

    }


    , switchMinimize : function(){
      this.$data.isMinimize = !this.$data.isMinimize;
    }

    , onChange: function (_pathkey_, _img2path_) {
      //  : path 经过验证后才会调用这个方法

      this.keymapEdit[_pathkey_] = _img2path_;

    }
    , cancelEdit: function () {
      this.canedit = false;
      this.addConfiging = false;
    }

    , saveEdit: function () {
      //  : 通知父组件 并将新的 keymap 传递
      this.canedit = false;
      this.$store.dispatch('setCurrentKeymap' , {
        configName:this.editKeymapName, keymap:this.keymapEdit
      } )
    }
    , startEdit: function () {
      this.keymapEdit = this.$store.getters.currentKeymap.keymap;
      this.editKeymapName = this.$store.getters.currentKeymap.configName;
      this.canedit = true;
    }

  }

}