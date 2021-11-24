import Vue from 'vue'
import Vuex from 'vuex'
import {readConfig, listDir, checkType , saveConfigToFile } from "../util/lib.js";

Vue.use(Vuex)
const parse = (text) => {
  let jsonData = JSON.parse(text);
  console.debug( jsonData );
  if ( jsonData['keymapList'] === undefined ){
    // 如果 keymapList 为空, 说明是 data-v2 版本的存储数据格式
    console.debug( "存储数据格式版本 data-v2" )
    return {keymapList: jsonData}
  }

  console.debug( "存储数据格式版本 data-v3" )
  return jsonData;
}

export default new Vuex.Store({
  state: () => {
    return {
      /**
       * 方案列表
       */
      __KeymapList: [],
      /**
       * 方案列表游标, 指向当前方案
       */
      __KeymapPointer: 0,
      /**
       * 图像资源列表
       */
      __ImgPathList: [],
      /**
       * 图像资源列表游标, 指向当前图片
       */
      __ImgPointer: 0,
      /**
       * 已移动的图片栈, 用于撤销移动操作
       */
      __MovedStack: [],
    }
  },
  getters: {
    /**
     * 方案列表
     * @type {Object[]}
     * @param state
     * @return {Object[]}
     */
    keymapList(state) {
      return state.__KeymapList;
    },
    /**
     * 方案列表
     * @type {Object[]}
     * @param state
     * @return {Object[]}
     */
    currentKeymap(state) {
      return state.__KeymapList[state.__KeymapPointer];
    },
    /**
     * 方案名列表
     * @type {string[]}
     * @param state
     * @return {string[]}
     */
    nameList(state) {
      return state.__KeymapList.map(v => v.configName);
    },
    /**
     * 当前图片路径
     * @type {string}
     * @param state
     * @return {string}
     */
    currentImg(state) {
      return state.__ImgPathList[state.__ImgPointer];
    },
    /**
     * 当前图片游标
     * @type {int}
     * @param state
     * @return {int}
     */
    currentImgIndex( state ){
      return state.__ImgPointer;
    },
    /**
     * 当前图像资源内的剩余数量
     * @type {int}
     * @param state
     * @return {int}
     */
    imgListSize( state ){
      return state.__ImgPathList.length;
    },
    /**
     * 当前图片游标, 指向当前图片
     * @type {int}
     * @param state
     * @return {int}
     */
    currentKeymapIndex( state ){
      return state.__KeymapPointer;
    },
    /**
     * 当前图像列表是否为空
     * @type {boolean}
     * @param state
     * @return {boolean}
     */
    isImgListEmpty( state ){
      // return true;
      return !state.__ImgPathList.length
    },
    /**
     * 上一个被移动的图片
     * @type {string}
     * @param state
     * @return {string}
     */
    lastMovedImg( state ){
      return state.__MovedStack[ state.__MovedStack.length-1 ]
    },
    /**
     * 方案模板
     * @type {Object}
     * @param state
     * @return {Object}
     */
    template( state ){
      return {
        keymap:{'0': '', '1': '', '2': '', '3': '', '4': '', '5': '', '6': '', '7': '', '8': '', '9': '', 'a': '', 'b': '', 'c': '', 'd': '', 'e': '', 'f': '', 'g': '', 'h': '', 'i': '', 'j': '', 'k': '', 'l': '', 'm': '', 'n': '', 'o': '', 'p': '', 'q': '', 'r': '', 's': '', 't': '', 'u': '', 'v': '', 'w': '', 'x': '', 'y': '', 'z': ''},
        configName : "newConfig"
      }
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
    /**
     * 相对与当前图像, 移动游标至第n个图像
     * @param state
     * @param n
     */
    switchImg( state , n ){
      state.__ImgPointer += ( state.__ImgPathList.length + n );
      state.__ImgPointer %= state.__ImgPathList.length;
      console.debug("切换图片" , state.__ImgPointer ,
        state.__ImgPathList.length , state.__ImgPathList[state.__ImgPointer] );
    },

    /**
     * 删除一个按键方案, 未传入参数时默认删除当前方案
     * @param state
     * @param index
     */
    deleteKeymap( state , index ){
      if ( index === undefined ){
        index = state.__KeymapPointer;
      }

      state.__KeymapList.splice( index , 1);

      if ( (state.__KeymapPointer >= state.__KeymapList.length) ||
        (index < state.__KeymapPointer) ){
        state.__KeymapPointer-=1;
      }

      saveConfigToFile( {keymapList: state.__KeymapList} );
    }

  },
  actions: {

    /**
     * 读取 配置文件 , 初始化数据
     */
    init(context) {
      console.debug("Store init");
      readConfig().then((data) => {
        console.debug(data);
        let jsonData = parse(data);
        context.commit('setKeymapList', jsonData.keymapList);
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
     * 将 当前图片 的路径移动至 __MovedStack, 并从 __ImgPathList 中移除 当前图片
     * @param context
     * @param newPath
     */
    popCurrent( context , newPath ){
      context.state.__MovedStack.push( { old:context.state.__ImgPathList[ context.state.__ImgPointer ], new:newPath } );
      context.state.__ImgPathList.splice( context.state.__ImgPointer , 1);
      context.state.__ImgPointer %= context.state.__ImgPathList.length;
      if ( isNaN(context.state.__ImgPointer) ){
        context.state.__ImgPointer = 0;
      }
    },

    /**
     * 从移动图片栈中去除最后一张图片并添加到已图片列表
     * @param context
     */
    popLastMoved( context ){
      let src = context.state.__MovedStack.pop().old;
      context.state.__ImgPathList.splice( context.state.__ImgPointer, 0, src );
    },


    /**
     * 修改当前按键方案或方案名
     * @param state
     * @param k:{ configName , keymap }
     */
    alterCurrentKeymap( {state} , k ){
      state.__KeymapList[state.__KeymapPointer].configName = k.configName;
      state.__KeymapList[state.__KeymapPointer].keymap = k.keymap;
      saveConfigToFile( {keymapList: state.__KeymapList} );
    },

    /**
     * 添加一个按键方案
     * @param state
     * @param k:{ configName , keymap }
     */
    addKeymap({state} , k ){
      state.__KeymapList.push( k );
      state.__KeymapPointer = state.__KeymapList.length-1;
      saveConfigToFile( {keymapList: state.__KeymapList} );
    }
  },


})
