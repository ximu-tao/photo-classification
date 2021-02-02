const fs = require('fs')

async function fileRead(path) {
    return new Promise(
        function (resolve, reject) {
            if (! fs.existsSync(path) ) {
                reject("文件不存在")
                return;
            }


            fs.readFile(path, { flag: 'r', encoding: 'utf-8' },
                function (err, data) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(data)
                    }
                }
            )
        }
    )
}

async function fileWrite( path , data ){
    return new Promise(
        function (resolve, reject) {
            fs.writeFile( path , data, { flag: 'w', encoding: 'utf-8' },
                function (err,) {
                    if (err) {
                        reject(err)
                    }
                }
            )
        }
    )
}


async function fsReadDir(path) {
    return new Promise(
        function (resolve, reject) {
            fs.readdir(path,
                function (err, data) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(data)
                    }
                }
            )
        }
    )
}

async function reName(oldPath, newPath) {
    return new Promise(
        function (resolve, reject) {
            if (fs.existsSync(newPath)) {
                reject("文件已存在")
                return;
            }

            fs.rename(oldPath, newPath,
                function (err) {
                    if (err) {
                        reject(err);
                        return
                    }
                    fs.stat(newPath,
                        function (err, stats) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve('stats: ' + JSON.stringify(stats))
                            }
                        }
                    );
                }
            );
        }
    )
}

async function isFile(pathName) {
    return new Promise(
        function (resolve, reject) {
            fs.stat(pathName, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data.isFile());
                }
            })
        }
    )
}

async function isDir(pathName) {
    return new Promise(
        function (resolve, reject) {
            fs.stat(pathName, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data.isDirectory());
                }
            })
        }
    )
}
/*
fs.rename(sourceFile, destPath, function (err) {
    if (err) throw err;
    fs.stat(destPath, function (err, stats) {
        if (err) throw err;
        console.log('stats: ' + JSON.stringify(stats));
    });
});
*/



module.exports.fileRead = fileRead
module.exports.fileWrite = fileWrite
module.exports.fsReadDir = fsReadDir
module.exports.reName = reName
module.exports.isDir = isDir
module.exports.isFile = isFile