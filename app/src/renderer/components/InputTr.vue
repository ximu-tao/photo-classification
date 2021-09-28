<template>
  <tr
      class='keymap-tr'
  >
    <td>{{ keypath }}</td>
    <td>
      <input
          :style="[ styleObj ]"
          @change="onChange"
          :value='img2path'
          :disabled="!can_edit"
      />
    </td>
  </tr>
</template>

<script>
import fs from "fs";

export default {
  name: "InputTr",
  props: {
    'keypath': {
      type: [String],
      validator: function (v) {
        let f = false;
        if ((v.length === 1) && ('abcdefghijklmnopqrstuvwxyz0123456789'.indexOf(v) !== -1)) {
          return true;
        }
        return f;
      }
    }
    , 'img2path': {
      type: [String]
    }
    , 'can_edit': Boolean
  }
  ,
  data() {
    return {
      styleObj: {
        backgroundColor: 'white'
      }
    }
  },
  methods: {
    init: function () {

    }

    , onChange: function (e) {
      //  : 在这里验证路径是否合法

      // 改了下判断条件, 现在目标路径可以为空了 (当然按对应按键时没有反应)
      if (!fs.existsSync(e.target.value) && e.target.value !== '') {
        this.styleObj.backgroundColor = 'red'

      } else {
        this.styleObj.backgroundColor = 'white'
        this.$emit('change', this.keypath, e.target.value)
      }
    }
  }

}
</script>

<style scoped>
input{
  text-align:right;
}
</style>
