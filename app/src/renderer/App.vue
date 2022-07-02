<template>
  <div id="app">
    <file-drag v-if="$store.getters.isImgListEmpty"/>
    <image-classifier-container v-if="!$store.getters.isImgListEmpty"/>
    <keymap-container v-if="!$store.getters.isImgListEmpty" />
  </div>
</template>

<script>

  import FileDrag from "./components/FileDrag";
  import ImageClassifierContainer from "./components/ImageClassifierContainer";
  import KeymapContainer from "./components/KeymapContainer";

  export default {
    name: 'video-classification',
    components: {
      FileDrag,ImageClassifierContainer,KeymapContainer
    },
     mounted() {
       console.log("APP init");
      this.$store.dispatch('init');
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
