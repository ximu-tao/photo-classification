<template>
  <div>

    <el-button  class="top-right-fixed"
                type="primary" icon="el-icon-setting"
                @click="settingVisible = true"></el-button>

    <el-dialog
        title="设 置"
        :visible.sync="settingVisible"
        :fullscreen="true"
        :show-close="false"
    >

      <div class="tip">一些软件的全局设置</div>
      <el-collapse>
        <el-collapse-item title="实验性功能 - 全局基础方案" name="1">
          启用全局基础方案功能
          <el-switch
              v-model="$store.state.__isEnabledBasicPointer"
              active-color="#13ce66"
              inactive-color="#ff4949">
          </el-switch>
          <el-select v-model="$store.state.__BasicPointer" :disabled="!$store.state.__isEnabledBasicPointer">
            <el-option
                v-for="( e , i ) in $store.getters.nameList"
                :key="e"
                :label="e"
                :value="i">
            </el-option>
          </el-select>
        </el-collapse-item>

      </el-collapse>

      <span slot="footer" class="dialog-footer">
<!--        <el-button @click="settingVisible = false">取 消</el-button>-->
        <el-button type="primary" @click="settingVisible = false">保存</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "SettingContainer",
  data() {
    return {
      value: true,
      settingVisible: false

    }
  }
}
</script>

<style scoped>



.tip {
  padding: 8px 16px;
  background-color: #ecf8ff;
  border-radius: 4px;
  border-left: 5px solid #50bfff;
  margin: 20px 0;

}


.top-right-fixed{
  position: absolute;
  top: 0px;
  right: 0px;
}



</style>
