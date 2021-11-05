import fs from "fs";
import path from "path";

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
  console.log(  __CONFIG_PATH  )
  if (!fs.existsSync( __CONFIG_PATH )) {
    console.log( "__CONFIG_PATH 文件不存在 , 将使用默认配置");
    data = newKeymap;
    // this.setConfigFile();
  }else {
    console.log( "__CONFIG_PATH 文件存在 , 将使用该配置");

    data = fs.readFileSync( __CONFIG_PATH, 'utf-8');
  }
  return data;
}

/**
 * 将新的配置信息保存至文件
 * @param config
 * @returns {Promise<void>}
 */
export const saveConfigToFile = async ( config )=>{
  fs.writeFileSync(
    __CONFIG_PATH
    , JSON.stringify( config )
  );
}

/**
 * 同步读取文件夹中的所有文件, 返回完整路径的文件列表
 * 如果 _path 是一个文件, 则会读取同路径下的所有文件
 * @param _path
 * @returns {string[]}
 */
export const listDir = (_path ) => {
  if ( !isDir( _path ) ){
    _path = path.dirname( _path );
  }
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
    supportedTypes.indexOf( path.extname(fileName).toLowerCase()) !== -1 &&
    fs.existsSync(fileName)

}

/**
 * 将文件移动到指定路径, 存在同名文件时会覆盖
 * @param filePath 源文件的全路径, 含文件名
 * @param newPath 目标路径
 */
export const moveFileTo = ( filePath , newPath ) => {
  let fileName = path.basename( filePath );
  fs.renameSync( filePath , path.join( newPath , fileName )  );
}

/**
 * 将文件移动到指定路径, 存在同名文件时会覆盖
 * @param filePath 源文件的全路径, 不含文件名
 * @param newPath 目标路径, 含文件名
 */
export const moveFileTo2 = ( filePath , newPath ) => {
  let fileName = path.basename( newPath );
  fs.renameSync( path.join( filePath , fileName ) , newPath );
}


/**
 * 判断指定路径是否存在 fileName 的同名文件
 * @param newPath
 * @param fileName
 */
export const exists = ( newPath , fileName ) =>{
  return fs.existsSync( path.join(
    newPath , path.basename( fileName )
  ) );
}

/**
 * 读取指定图片文件并转化为 Base64 编码
 * @param path
 * @return string
 */
export const readImgAsBase64 = ( path )=>{
    let data = fs.readFileSync( path);
    return "data:image/jpg;base64," + data.toString('base64');
}
