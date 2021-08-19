
const fs = require('fs');

export const isDir = (pathName)=> {
  let stat = fs.lstatSync(pathName);
  return stat.isDirectory()
}