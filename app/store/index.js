import {readConfig, listDir, checkType , saveConfigToFile } from "../util/lib.js";

const parse = (text) => {
  return {keymapList: JSON.parse(text)}
}

export default {
  state: () => {
    return {
      __KeymapList: [],
      __KeymapPointer: 0,
      __ImgPathList: [],
      __ImgPointer: 0,
      __MovedStack: [],
    }
  },
  getters: {
    keymapList(state) {
      return state.__KeymapList;
    },
    currentKeymap(state) {
      return state.__KeymapList[state.__KeymapPointer];
    },
    nameList(state) {
      return state.__KeymapList.map(v => v.configName);
    },
    currentImg(state) {
      return state.__ImgPathList[state.__ImgPointer];
    },
    currentKeymapIndex( state ){
      return state.__KeymapPointer;
    },
    isImgListEmpty( state ){
      // return true;
      return !state.__ImgPathList.length
    }
  },
  mutations: {
    /**
     * 设置 __KeymapList 数据, 从配置文件中读取数据后调用
     */
    setKeymapList(state, list) {
      state.__KeymapList = list;
      console.log('init', state.__KeymapList)
    },

    /**
     * 将 imgList 追加到现有的 __ImgPathList 中
     */
    appendImg(state, imgList) {
      state.__ImgPathList.push(...imgList);
    },

    /**
     * 切换按键方案
     */
    switchConfig( state , configIndex ){
      state.__KeymapPointer = configIndex;
    },

    /**
     * 切换到下一张图片
     * @param state
     */
    nextImg( state ){
      state.__ImgPointer += ( state.__ImgPathList.length + 1 );
      state.__ImgPointer %= state.__ImgPathList.length;
      console.debug("切换至下一张图片" , state.__ImgPointer ,
        state.__ImgPathList.length , state.__ImgPathList[state.__ImgPointer] );
      },

    /**
     * 切换到上一张图片
     * @param state
     */
    previousImg( state ){
      state.__ImgPointer += ( state.__ImgPathList.length - 1 );
      state.__ImgPointer %= state.__ImgPathList.length;
      console.debug("切换至上一张图片" , state.__ImgPointer ,
        state.__ImgPathList.length , state.__ImgPathList[state.__ImgPointer] );
    },

    switchImg( state , n ){
      state.__ImgPointer += ( state.__ImgPathList.length + n );
      state.__ImgPointer %= state.__ImgPathList.length;
      console.debug("切换至上一张图片" , state.__ImgPointer ,
        state.__ImgPathList.length , state.__ImgPathList[state.__ImgPointer] );
    }

  },
  actions: {

    /**
     * 读取 配置文件 , 初始化数据
     */
    init(context) {
      readConfig().then((data) => {
        context.commit('setKeymapList', parse(data).keymapList);
      });
    },

    /**
     * 从 imgPath 中读取文件列表, 过滤掉不受支持的文件类型, 添加到 __ImgPathList
     */
    imgPath(context, imgPath) {
      let imgList = listDir( imgPath ).filter(checkType);
      context.commit('appendImg', imgList);
    },

    /**
     * 从图片列表中去除当前图片并添加到已移动图片栈
     * @param context
     */
    popCurrent( context ){
      context.state.__MovedStack.push( context.state.__ImgPathList[ context.state.__ImgPointer ] );
      context.state.__ImgPathList.splice( context.state.__ImgPointer , 1);
      context.state.__ImgPointer %= context.state.__ImgPathList.length;
    },

    /**
     * 修改当前按键方案或方案名
     * @param state
     * @param k:{ configName , keymap }
     */
    setCurrentKeymap( {state} , k ){
      state.__KeymapList[state.__KeymapPointer].configName = k.configName;
      state.__KeymapList[state.__KeymapPointer].keymap = k.keymap;
      saveConfigToFile( state.__KeymapList );
    },

    /**
     * 添加一个按键方案
     * @param state
     * @param k:{ configName , keymap }
     */
    addKeymap({state} , k ){
      state.__KeymapList.push( k );
      state.__KeymapPointer = state.__KeymapList.length-1;
      saveConfigToFile( state.__KeymapList );
    }
  },


}