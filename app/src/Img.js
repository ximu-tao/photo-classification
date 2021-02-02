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

var currDir = ''
var fileList = {}
var currImgIndex = 0
var nextImg = () => {
    ____(1)
}

var previousImg = () => {
    ____(-1)
}

var pop = () => {
    let c = Math.floor(Math.random()*fileList.length)
    let s = fileList.pop(c)
    return s
}

var ____ = (a) => {
    img__.src = pop()
}

var setDir = async (__path__) => {
    currDir = __path__

    fileList = await fsReadDir(currDir)

    for (const i in fileList) {
        fileList[i] = path.join(currDir, fileList[i])
        // console.log( fileList[i] );
    }

    nextImg()
}

setDir(currDir)