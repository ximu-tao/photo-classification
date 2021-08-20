// KeymapContainer

export default {
  props: {
    'currentKeymap': Object,
    'keymapList': Array,
    'can_edit': {
      type: Boolean,

      default: true,
    }
    , 'isMinimize' : Boolean

  },
  data: function () {
    return {
      canedit: true,
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
      addConfiging :false
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
            <select 
                @change='switchConfig' 
                v-model='selectedConfigIndex'
                >
                <option disabled selected= "selected" value="">请选择</option>
                <option 
                    v-for='( e , i ) in keymapList' 
                    :value='i' >
                    {{ e.configName }}</option>

            </select>
            <button @click='addConfig'>添加配置</button>
            <button @click='switchMinimize'>缩小</button>
            
            <div v-show="addConfiging">
            方案名: <input type="text" v-model="editKeymapName" >
            
</div>
            
            <table class='keymap-table'>
                <tr><th><kbd>按键</kbd></th><th>目录</th>
                </tr>
                <tr 
                    v-show="!canedit"
                    is='input-tr' 
                    v-for='(val, key, index) in keymap_'
                    :img2path='val'
                    :keypath='key'
                    :can_edit='canedit'

                    ></tr>
                   
                <tr
                    v-if="canedit"
                    is='input-tr'
                    v-for='(val, key, index) in keymapEdit'
                    :img2path='val'
                    :keypath='key'
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
    init: function () {
      this.keymap_ = { ...this.currentKeymap.keymap };
      this.keymapName = this.currentKeymap.configName;
      this.canedit = this.can_edit;

      // console.log(this.keymapList);
    }

    ,addConfig(){

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
        this.$emit("addconfig" , this.editKeymapName , this.keymapEdit );

      this.addConfiging = false;
      this.canedit = false;
    }


    ,addConfiged( keymapListLength ){
      this.selectedConfigIndex = keymapListLength-1;

      this.init();
      this.switchConfig();

    }


    , switchMinimize : function(){
      this.$emit('switchminimize');
    }

    , onChange: function (_pathkey_, _img2path_) {
      //  : path 经过验证后才会调用这个方法
      // this.$emit( 'change', _pathkey_ , _img2path_ );
      this.keymapEdit[_pathkey_] = _img2path_;

    }
    , cancelEdit: function () {
      this.init();
      this.canedit = false;
      this.addConfiging = false;
    }

    , saveEdit: function () {
      //  : 通知父组件 并将新的 keymap 传递
      this.canedit = false;
      // console.log(this.configName);
      this.$emit('keymapedit', this.editKeymapName, this.keymapEdit)
    }
    , startEdit: function () {
      this.keymapEdit = this.keymap_;
      this.editKeymapName = this.keymapName;
      this.canedit = true;
    }
    , switchConfig: function () {
      console.log( this.keymapName );
      console.log(this.selectedConfigIndex);
      this.$emit('switchconfig', this.selectedConfigIndex)
    }
  }
  , created: function () {
    this.init();
  }
  , watch: {
    currentKeymap: function (newval, oldVal) {
      this.init()
    }
  }
}