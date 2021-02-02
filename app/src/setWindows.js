var __MyDIRNAME = __dirname.replace( "app.asar" ,"")

window.onload = function () {
    const path = require('path')

    var cancelBtn = $("#cancel");
    var submitBtn = $("#submit");
    var set_name_text = $('#set_name');
    var set_name_div_ = $('#set_name_div');

    var main = async () => {
        cancelBtn.hide();
        submitBtn.hide();
        set_name_div_.hide();

        let strConfigList = await lib.fileRead(
            path.join(
                __MyDIRNAME, './config.json'
            )
        )
        let configList = JSON.parse(strConfigList)

        let htmlText = '<tr><th>名称</th><th></th></tr>'

        for (const i in configList) {
            if (configList.hasOwnProperty(i)) {
                htmlText += `<tr><td>  ${i}  </td>
                <td>  
                <input type="button" class="_select_" value="选择" data-name='${i}' data-path='${configList[i]}'>
                </td>
            </tr>
            `
            }

            // <input type="button" value="选择" οnclick="select('${configList[i]}')">    
            // 原本是想这样写的, 但是 οnclick 属性无法正确的调用到 select 方法


        }
        __tab__.innerHTML = htmlText;

        $("._select_").on('click', select);
    }

    var select = async function (e) {

        let _path_ = e.target.getAttribute("data-path");

        console.log(_path_);

        document.body.style.cursor = 'wait'

        set_name_text.val(e.target.getAttribute("data-name"));

        let strConfig = await lib.fileRead(
            path.join(__MyDIRNAME, _path_)
        )

        console.log( __MyDIRNAME );

        keyConfig = JSON.parse(strConfig)

        let klt = '<tr><th>按键</th><th width="100%">路径</th></tr>'
        for (let i in keyConfig) {
            if (keyConfig.hasOwnProperty(i)) {
                klt +=
                    `<tr><td>${ i }</td><td><input id='${ i}' type='text' class="key-path"  value='${ keyConfig[i] }'></td></tr>`

            }
        }

        __tab__.innerHTML = klt;

        document.body.style.cursor = 'default';

        cancelBtn.show();
        submitBtn.show();
        set_name_div_.show();
    }

    var submit = async function () {

        /*
        $('.key-path').each(
            async function ( i , e ) {
                // console.log(i);
                // console.log(e);
                try {
                    if ( e.value != '') {
                        await lib.isDir(e.value ) 
                    }
                    
                } catch (error) {
                    console.log(error);
                    $(e).css({"background": "red"});
                }
            }
        )
        // JS的异步恶心到我了
            */


        let flag = true;

        let json_obj = {};

        var paths = document.getElementsByClassName("key-path");
        
        for (var i = 0, j = paths.length; i < j; i++) {

            e = paths[i];
            console.log("A");
            $(e).css({ "background": "white" });

            try {
                json_obj[ e.getAttribute("id") ] = e.value;

                if (e.value != '') {
                    await lib.isDir(e.value)
                }

            } catch (error) {
                console.log(error);
                $(e).css({ "background": "red" });

                flag = false;
            }
        }

        keySettingsStr = JSON.stringify(json_obj);
        
        if (flag) {

            let settingsStrName = set_name_text.val();
            // 配置名, 同时作为保存的文件名
            let save_path = `./use/${ settingsStrName }.json`;

            console.log( keySettingsStr );

            lib.fileWrite(
                path.join( __MyDIRNAME, save_path )
                , keySettingsStr );
console.log(path.join( __MyDIRNAME, save_path )
, keySettingsStr );
                
            console.log("写入完成");


            let strConfig = await lib.fileRead(
                path.join( __MyDIRNAME, './config.json' )
            )
            
            keyConfig = JSON.parse(strConfig);

            keyConfig[settingsStrName] = save_path;


            lib.fileWrite(
                path.join( __MyDIRNAME, './config.json' )
                ,    JSON.stringify(keyConfig)   );


            main();
        }


    }



    main()

    cancelBtn.on("click", main);
    submitBtn.on("click", submit);
}