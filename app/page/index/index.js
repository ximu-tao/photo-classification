
import FileDrag from "../../components/FileDrag.js"
import KeymapContainer from "../../components/KeymapContainer.js";
import InputTr from "../../components/InputTr.js";
import ImageClassifierContainer from "../../components/ImageClassifierContainer.js";
import App from "../../components/App.js";

Vue.component( "file-drag", FileDrag );
Vue.component( "keymap-container", KeymapContainer );
Vue.component('input-tr', InputTr );
Vue.component('image-classifier-container', ImageClassifierContainer );

new Vue( App );