import {readConfig, listDir, checkType} from "../util/lib.js";

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
    }
  },
  mutations: {

    /**
     * 设置 __KeymapList 数据, 从配置文件中读取数据后调用1
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
      let imgList = listDir(imgPath).filter(checkType);
      context.commit('appendImg', imgList);
    }
  }
}