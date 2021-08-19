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
      , selectedConfigIndex: 0
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

            <table class='keymap-table'>
                <tr><th><kbd>按键</kbd></th><th>目录</th>
                </tr>
                <tr 
                    is='input-tr' 
                    v-for='(val, key, index) in keymap_'
                    :img2path='val'
                    :keypath='key'
                    :can_edit='canedit'
                    @change='onChange'
                    ></tr>

                <tr v-if='canedit'>
                    <td><input type='button' @click='saveEdit' value='保存'></td>
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
      this.$emit("addconfig");
    }

    ,addConfiged( newConfigName ){
      for (let i = this.keymapList.length-1; i >= 0 ; i--) {
        // console.log( this.keymapList[i].configName );
        if ( this.keymapList[i].configName === newConfigName ){
          this.selectedConfigIndex = i;
          break;
        }
      }

      // this.init();
      this.switchConfig();

      setTimeout(
        this.startEdit,
        100
      );
    }


    , switchMinimize : function(){
      this.$emit('switchminimize');
    }

    , onChange: function (_pathkey_, _img2path_) {
      //  : path 经过验证后才会调用这个方法
      // this.$emit( 'change', _pathkey_ , _img2path_ );
      this.keymap_[_pathkey_] = _img2path_;

    }
    , cancelEdit: function () {
      this.init();
      this.canedit = false;
    }

    , saveEdit: function () {
      //  : 通知父组件 并将新的 keymap 传递
      this.canedit = false;
      // console.log(this.configName);
      this.$emit('keymapedit', this.keymapName, this.keymap_)
    }
    , startEdit: function () {
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