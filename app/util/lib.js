const fs = require('fs');
const path = require('path');

/**
 * 判断一个文件是否是文件夹
 * @param pathName
 * @returns {boolean}
 */
export const isDir = (pathName)=> {
  let stat = fs.lstatSync(pathName);
  return stat.isDirectory()
}

/**
 * 当前项目的根路径
 * @type {string}
 * @private
 */
const __ROOT_PATH = path.join(
  __dirname.replace("app.asar", ""), "../../"
)

/**
 * 获取当前项目的根路径
 * @returns {string}
 */
export const rootPath = ()=>{
  return __ROOT_PATH;
}

/**
 * 配置文件的路径
 * @type {string}
 * @private
 */
const __CONFIG_PATH = path.join(
  rootPath() , './config.json'
);

// 第一次使用此软件, 会使用这个做配置文件模板
const newKeymap = "[{\"configName\":\"newConfig\",\"keymap\":{\"0\":\"\",\"1\":\"\",\"2\":\"\",\"3\":\"\",\"4\":\"\",\"5\":\"\",\"6\":\"\",\"7\":\"\",\"8\":\"\",\"9\":\"\",\"a\":\"\",\"b\":\"\",\"c\":\"\",\"d\":\"\",\"e\":\"\",\"f\":\"\",\"g\":\"\",\"h\":\"\",\"i\":\"\",\"j\":\"\",\"k\":\"\",\"l\":\"\",\"m\":\"\",\"n\":\"\",\"o\":\"\",\"p\":\"\",\"q\":\"\",\"r\":\"\",\"s\":\"\",\"t\":\"\",\"u\":\"\",\"v\":\"\",\"w\":\"\",\"x\":\"\",\"y\":\"\",\"z\":\"\"}}]"

/**
 * 异步读取配置文件, 返回 JSON 格式的配置项
 * @returns {Promise<string>}
 */
export const readConfig = async ()=>{
  let data;
  if (!fs.existsSync( __CONFIG_PATH )) {
    data = newKeymap;
    this.setConfigFile();
  }else {
    data = fs.readFileSync( __CONFIG_PATH, 'utf-8');
  }
  return data;
}

/**
 * 同步读取文件夹中的所有文件, 返回完整路径的文件列表
 * @param _path
 * @returns {string[]}
 */
export const listDir = (_path ) => {
    let files_list = fs.readdirSync(_path);
    return files_list.map( v => path.join( _path , v ) );
}

/**
 * 受支持的文件类型, 全部小写
 * @type {string[]}
 */
const supportedTypes = ['.jpg', '.png', '.jpeg', '.gif', '.webp' , '.apng', '.bmp' , '.ico', '.cur' , '.jfif', '.pjpeg', '.pjp', '.svg'];

/**
 * 判断文件是否受支持
 * @param fileName
 * @returns {boolean}
 */
export const checkType = ( fileName ) => {
  return !isDir(fileName) &&
    supportedTypes.indexOf( path.extname(item).toLowerCase()) !== -1 &&
    fs.existsSync(fileName)

}