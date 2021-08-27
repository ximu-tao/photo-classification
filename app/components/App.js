import Store from "../store/index.js"

export default  {
  el: "#app",
  store : new Vuex.Store( Store ),
  template:
    `
  <div>
    <file-drag v-if="$store.getters.isImgListEmpty"/>
    <image-classifier-container v-if="!$store.getters.isImgListEmpty"/>
    <keymap-container v-if="!$store.getters.isImgListEmpty" />
   </div>
  `
, mounted() {
    this.$store.dispatch('init');
  }

}