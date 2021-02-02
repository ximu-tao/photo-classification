var __MyDIRNAME = __dirname.replace( "app.asar" ,"")

var keyConfig = null

var setKeyConfig = async () => {
    __loading__.innerHTML = '加载中'
    document.body.style.cursor = 'wait'
    console.log( config_file.innerHTML );
    
    let index = config_file.selectedIndex; 

    let __path__ = config_file.options[index].value


    let strConfig = await lib.fileRead(
        path.join(__MyDIRNAME , __path__)
    )


    

    keyConfig = JSON.parse(strConfig)

    __loading__.innerHTML = '加载完成'
    document.body.style.cursor = 'default'

    setTableEntry(keyConfig)
}

var getConfigList = async () => {
    let strConfigList = await lib.fileRead(
        path.join(
            __MyDIRNAME, './config.json'
        )
    )
    let configList = JSON.parse(strConfigList)
    // console.log(configList);
    let options = ''

    for (const i in configList) {
        if (configList.hasOwnProperty(i)) {
            // console.log(i);
            // console.log(configList[i]);

            options +=
                "<option value=" + configList[i] + ">" + i + "</option>"

        }
    }
    config_file.innerHTML = options
    setKeyConfig()
}

config_file.addEventListener('change', setKeyConfig)

getConfigList()


document.body.addEventListener('keyup',
    (e) => {
        if (!( e.key in keyConfig )) {
            return
        }
        console.log(e.key in keyConfig);
        
        console.log(img__.getAttribute('src') );
        console.log(
            path.join(keyConfig[e.key],
                path.basename(img__.src)
            )
        );
        if (keyConfig[e.key]) {
            lib.reName(
                img__.getAttribute('src'),
                path.join(keyConfig[e.key],
                    path.basename(img__.src)
                )
            )
            nextImg()
        }

    }
)