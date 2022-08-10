import fs from "fs";
import path from "path";

/**
 * 判断一个文件是否是文件夹
 * @param {string} pathName 文件路径
 * @returns {boolean} 是否为文件夹
 */
const isDir = (pathName)=> {
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
const rootPath = ()=>{
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
 * @param configPath
 * @returns {Promise<string>}
 */
const readConfig = async ( configPath=__CONFIG_PATH )=>{
  let data;
  if ( configPath ){
    configPath=__CONFIG_PATH
  }
  console.debug(  configPath  )

  if (!fs.existsSync( configPath )) {
    console.debug( `${configPath} 文件不存在 , 将使用默认配置`);
    data = newKeymap;
    // this.setConfigFile();
  }else {
    console.debug( `${configPath} 文件存在 , 将使用该配置` );

    data = fs.readFileSync( configPath, 'utf-8');
  }
  return data;
}

/**
 * 将新的配置信息保存至文件
 * @param config
 * @param configPath
 * @returns {Promise<void>}
 */
const saveConfigToFile = async ( config , configPath =__CONFIG_PATH)=>{
  if ( configPath ){
    configPath=__CONFIG_PATH
  }
  fs.writeFileSync(
    configPath
    , JSON.stringify( config )
  );
}

/**
 * 同步读取文件夹中的所有文件, 返回完整路径的文件列表
 * 如果 _path 是一个文件, 则会读取同路径下的所有文件
 * @param _path
 * @returns {string[]}
 */
const listDir = (_path ) => {
  if ( !isDir( _path ) ){
    _path = path.dirname( _path );
  }
  let files_list = fs.readdirSync(_path);
    return files_list.map( v => path.join( _path , v ) );
}

/**
 * 受支持的图片文件后缀名, 全部小写
 * @type {string[]}
 */
const imgTypes = ['.jpg', '.png', '.jpeg', '.gif', '.webp' , '.apng', '.bmp' , '.ico', '.cur' , '.jfif', '.pjpeg', '.pjp', '.svg'];

/**
 * 受支持的视频文件后缀名, 全部小写
 * @type {string[]}
 */
const videoTypes = [".mp4" , ".webm" ];

/**
 * 受支持的文件后缀名, 全部小写
 * @type {string[]}
 */
const supportedTypes = [ ...imgTypes , ...videoTypes];

/**
 * 通过后缀名判断文件是否是一个图片文件
 * @param fileName
 * @returns {boolean}
 */
const isImg = ( fileName ) => {
  return imgTypes.indexOf( path.extname(fileName).toLowerCase()) !== -1
}


/**
 * 通过后缀名判断文件是否是一个视频文件
 * @param fileName
 * @returns {boolean}
 */
const isVideo = ( fileName ) => {
  return videoTypes.indexOf( path.extname(fileName).toLowerCase()) !== -1
}

/**
 * 判断文件是否受支持
 * @param fileName
 * @returns {boolean}
 */
const checkType = ( fileName ) => {
  return !isDir(fileName) &&
    supportedTypes.indexOf( path.extname(fileName).toLowerCase()) !== -1 &&
    fs.existsSync(fileName)

}

/**
 * 将文件移动到指定路径, 存在同名文件时会覆盖
 * @param filePath 源文件的全路径, 含文件名
 * @param newPath 目标路径
 */
const moveFileTo = ( filePath , newPath ) => {
  let fileName = path.basename( filePath );
  fs.renameSync( filePath , path.join( newPath , fileName )  );
}

/**
 * 将文件移动到指定路径, 存在同名文件时会覆盖
 * @param {string} filePath 源文件的全路径, 不含文件名
 * @param {string} newPath 目标路径, 含文件名
 */
const undoMoveFile = ( filePath , newPath ) => {
  let fileName = path.basename( newPath );
  fs.renameSync( path.join( filePath , fileName ) , newPath );
}


/**
 * 判断指定路径是否存在 fileName 的同名文件
 * @param {string} newPath 目标路径
 * @param {string} fileName 文件名
 * @returns {boolean} 文件是否存在
 */
const exists = ( newPath , fileName ) =>{
  return fs.existsSync( path.join(
    newPath , path.basename( fileName )
  ) );
}

/**
 * 读取指定图片文件并转化为 Base64 编码
 * @param {string} path 图片路径
 * @returns {string} BASE64编码形式的图片
 */
const readImgAsBase64 = ( path )=>{
    let data = fs.readFileSync( path);
    return "data:image/jpg;base64," + data.toString('base64');
}


export default {
  isDir,
  rootPath,
  readConfig,
  saveConfigToFile,
  listDir,
  checkType,
  moveFileTo,
  undoMoveFile,
  exists,
  readImgAsBase64,
}

export {
  isDir,
  rootPath,
  readConfig,
  saveConfigToFile,
  listDir,
  checkType,
  moveFileTo,
  undoMoveFile,
  exists,
  readImgAsBase64,
  isVideo,
  isImg,
}
