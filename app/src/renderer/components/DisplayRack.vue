<template>
  <div class="container" >
    <img :alt="$store.getters.currentImg" class="currentImg" v-show='isImg' :src="filePath">
    <div class="fullscreen" v-show="isVideo">
      <video class="currentImg" :muted="isMuted" autoplay loop controls :src="filePath"></video>
    </div>
  </div>
</template>

<script>

import {isDir, isVideo, isImg, readImgAsBase64} from "../util/lib";
export default {
  name: "DisplayRack",
  data(){
    return {
      isImg : false,
      isDir : false,
      isVideo: false,

      isMuted:true,
    }
  },
  computed:{
    filePath(){
      let data = this.$store.getters.currentImg

      this.isImg = isImg( this.$store.getters.currentImg )

      if ( !this.isImg ){
        this.isVideo = isVideo( this.$store.getters.currentImg )

        if ( !this.isVideo ){
          this.isDir = isDir( this.$store.getters.currentImg )
        }
      }

      if ( this.isImg ){
        data = process.env.NODE_ENV === 'development'
            ? readImgAsBase64( this.$store.getters.currentImg )
            : this.$store.getters.currentImg;
      }

      return data
    }
  }


}
</script>

<style scoped>
.currentImg{
  text-align: center;
  max-width: 100%;
  max-height: 100%;
  display:block;
  z-index: 100;
  margin: 0 auto;
}

.fullscreen video {
  position: fixed;
  right: 0px;
  bottom: 0px;
  min-width: 100%;
  min-height: 100%;
  height: auto;
  width: auto; /*加滤镜*/ /*-webkit-filter: grayscale(100%);*/ /*filter:grayscale(100%);*/
}

.fullscreen source {
  min-width: 100%;
  min-height: 100%;
  height: auto;
  width: auto;
}

.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* overflow: hidden; */
  background-color: #211f1f;

}

</style>
