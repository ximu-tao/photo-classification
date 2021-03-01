const remote = require('electron').remote;
const fs = require("fs");
const path = require("path");
var __MyDIRNAME = path.join(
    __dirname.replace("app.asar", ""), "../../"
)

function isDir(pathName) {
    let stat = fs.lstatSync(pathName);
    return stat.isDirectory()
}

Vue.component(
    "file-drag",
    {
        data: function () {
            return {
                'fileDraging': false
            }
        },
        template: `
        <div
            class="file-drag-container"
            :class="{ 'file-draging': fileDraging }"
            @drop="onDrop"
            @dragenter="onDragenter"
            @dragover="onDragover" 
            @dragleave="onDragleave" 
            @click="selectFile"
            >
            <div class='file-drag-prompt' v-if='!fileDraging' >点击选择文件夹, 或拖拽文件到此</div>
            <div class='file-drag-prompt' v-if='fileDraging' >在此处松开鼠标即可选择此文件</div>
        </div>`,

        methods: {
            init: function () {
                //  : 文件拖拽组件初始化
            },
            onDrop: function (e) {
                //  :  拖拽文件后执行
                // console.log('onDrop');
                this.fileSelected(e.dataTransfer.files[0].path);
            },
            selectFile: async function () {
                //  : 弹出文件选择框
                var pathObjObj = await remote.dialog.showOpenDialog(
                    {
                        title: '请选择一个包含图片文件夹',
                        properties: [
                            'openFile', 'openDirectory'
                        ],
                        buttonLabel: '选择此目录'
                    }
                )
                // console.log(pathObjObj.filePaths[0]);
                this.fileSelected(pathObjObj.filePaths[0]);
            },
            fileSelected: function (path) {
                //  : 获得路径后调用
                this.$emit('file-selected', path);
            },
            onDragenter: function (e) {
                // : 拖拽文件进入后执行
                this.fileDraging = true;
                e.preventDefault();
            },
            onDragover: function (e) {
                e.preventDefault();
            },
            onDragleave: function (e) {
                // : 拖拽文件离开后执行
                this.fileDraging = false;
                e.preventDefault();
            },
        }
    }
)

Vue.component(
    "keymap-container",
    {
        props: {
            'currentKeymap': Object,
            'keymapList': Array,
            'can_edit': {
                type: Boolean,

                default: true,
            }
            , 'isMinimize' : Boolean
            
        },
        data: function () {
            return {
                canedit: true,
                pathVerificaError: 0
                , styleObj: function () {
                    return {
                        'backgroundColor': 'write'
                    }
                }
                , keymap_: null
                , keymapName: ''
                , selectedConfigIndex: 0
            }
        },
        computed: {

        },

        // keymap-container 部分 用 v-if 时,切换显示时有明显卡顿 所以使用 v-show 了
        template: `
       <div class='keymap-father'>
        <div class="minimize-container" v-if='isMinimize'>
            <input type='button' @click='switchMinimize' value='展开'>
        </div>

        <div
        v-show='!isMinimize'
        class='keymap-container'
        :class="{ 'keymap-container-canedit': canedit , 'keymap-container-unedit': !canedit }"
        >
            <select 
                @change='switchConfig' 
                v-model='selectedConfigIndex'
                >
                <option disabled selected= "selected" value="">请选择</option>
                <option 
                    v-for='( e , i ) in keymapList' 
                    :value='i' >
                    {{ e.configName }}</option>

            </select>
            <button @click='switchMinimize'>缩小</button>

            <table class='keymap-table'>
                <tr><th><kbd>按键</kbd></th><th>目录</th>
                </tr>
                <tr 
                    is='input-tr' 
                    v-for='(val, key, index) in keymap_'
                    :img2path='val'
                    :keypath='key'
                    :can_edit='canedit'
                    @change='onChange'
                    ></tr>

                <tr v-if='canedit'>
                    <td><input type='button' @click='saveEdit' value='保存'></td>
                    <td><input type='button' @click='cancelEdit' value='取消'></td>
                </tr>

                <tr v-if='!canedit'>
                    <td></td>
                    <td><input type='button' @click='startEdit' value='修改方案'></td>
                </tr>

           </table>
        </div>
        </div>`,
        methods: {
            init: function () {
                this.keymap_ = { ...this.currentKeymap.keymap };
                this.keymapName = this.currentKeymap.configName;
                this.canedit = this.can_edit;

                // console.log(this.keymapList);
            }

            , switchMinimize : function(){
                this.$emit('switchminimize');
            }

            , onChange: function (_pathkey_, _img2path_) {
                //  : path 经过验证后才会调用这个方法
                // this.$emit( 'change', _pathkey_ , _img2path_ );
                this.keymap_[_pathkey_] = _img2path_;

            }
            , cancelEdit: function () {
                this.init();
                this.canedit = false;
            }

            , saveEdit: function () {
                //  : 通知父组件 并将新的 keymap 传递
                this.canedit = false;
                // console.log(this.configName);
                this.$emit('keymapedit', this.keymapName, this.keymap_)
            }
            , startEdit: function () {
                this.canedit = true;
            }
            , switchConfig: function () {
                console.log(this.selectedConfigIndex);
                this.$emit('switchconfig', this.selectedConfigIndex)
            }
        }
        , created: function () {
            this.init();
        }
        , watch: {
            currentKeymap: function (newval, oldVal) {
                this.init()
            }
        }
    }
)

Vue.component(
    'input-tr',
    {
        props: {
            'keypath': {
                type: [String],
                validator: function (v) {
                    let f = false;
                    if ((v.length == 1) && ('abcdefghijklmnopqrstuvwxyz0123456789'.indexOf(v) != -1)) {
                        return true;
                    }
                    return f;
                }
            }
            , 'img2path': {
                type: [String]
            }
            , 'can_edit': Boolean
        }
        ,
        data: function () {
            return {
                styleObj: {
                    backgroundColor: 'white'
                }
            }
        },
        template: `
                <tr
                    class='keymap-tr'
                    >
                    <td>{{ keypath }}</td>
                    <td>
                     <input
                     :style="[ styleObj ]"
                     @change="onChange"
                     :value='img2path'
                     :disabled="!can_edit"
                     />
                    </td>
                </tr>
    `
        , methods: {
            init: function () {

            }

            , onChange: function (e) {
                //  : 在这里验证路径是否合法

                // 改了下判断条件, 现在目标路径可以为空了 (当然按对应按键时没有反应)
                if (!fs.existsSync(e.target.value) && e.target.value !== '') {
                    this.styleObj.backgroundColor = 'red'

                } else {
                    this.styleObj.backgroundColor = 'white'
                    this.$emit('change', this.keypath, e.target.value)
                }
            }
        }
    }
)

Vue.component(
    'image-classifier-container', {

    props: {
        currentPath: {
            type: [String]
            , required: true,
        },

        keymap: {
            type: [Object]
            , required: true,
        }
    },

    data() {
        return {
            img_queue: [],
            moved_stack: [],
            currentImgIndex: 0,
            isCurrentImg: true,
            switchImg: {
                '-1': this.previousImg,
                '1': this.nextImg,
                '3': this.nextImg,
                '4': this.previousImg,
                '37': this.previousImg,
                '38': this.previousImg,
                '39': this.nextImg,
                '40': this.nextImg
            },
            trueCurrentImgPath: "",
            controlKeyFun: {
                'z': this.undo,
            }
        }
    },

    computed: {
        currentImgPath: function () {
            return this.img_queue[this.currentImgIndex];
        }
        , nextImgPath: function () {
            return this.img_queue[this.currentImgIndex + 1];
        }
    },

    template: `
        <div 
            class="img-container"
            @mousewheel="onMousewheel"
            @mousedown="onMousedown"
            @keyup="onKeyUp"
            tabindex='-1'
            >
            <img class="currentImg" v-show='isCurrentImg' :src="currentImgPath">
            
        </div>
        `

    // <img class="nextImg" v-show='!isCurrentImg' :src="nextImgPath">
    , methods: {
        init: function () {
            let files_list = fs.readdirSync(this.currentPath);
            let this_ = this;


            files_list.forEach(
                function (key, index, array) {
                    array[index] = path.join(this_.currentPath, key)
                }
            );

            files_list = files_list.filter(
                function (item) {
                    return (
                        // 增加了一些支持的图片类型
                        ['.jpg', '.png', '.jpeg'
                        , '.gif', '.webp' , '.apng' 
                        , '.bmp' , '.ico', '.cur' , 
                        '.jfif', '.pjpeg', '.pjp'
                        , '.svg']
                        .indexOf(path.extname(item).toLowerCase()) != -1
                        && fs.existsSync(item)
                        && !isDir(item))
                }
            )

            this.img_queue = files_list;


        }
        , nextImg: function () {
            //  : 切换下一张图片
            this.currentImgIndex += 1;
            this.currentImgIndex %= this.img_queue.length;
        }
        , previousImg: function () {
            //  : 切换上一张图片
            this.currentImgIndex += (this.img_queue.length - 1);
            // console.log( this.currentImgIndex );
            this.currentImgIndex %= this.img_queue.length;
        }
        , moveImg: function (oldImgIndex, newPath) {
            //  : 移动图片的路径
            try {
                fs.renameSync(this.img_queue[oldImgIndex], newPath)

                this.moved_stack.push(newPath);
                this.img_queue.splice(oldImgIndex, 1);

                // 倒数第一张图片移动文件后无法正常显示第一张图片
                this.currentImgIndex %= this.img_queue.length;
            } catch (err) {
                throw err;

                // TODO ERROR: 如果目标文件夹已存在同名文件, 或其他情况
            }
        }

        , onKeyUp: function (e) {
            //  : 当按键被按下时, 判断按键并调用函数
            e.preventDefault();
            // console.log('onKeyUp');
            // console.log(e);

            // console.log( e.key );
            // console.log( this.keymap[e.key] );

            if (e.ctrlKey) {
                // console.log(e.keyCode );

                // console.log(this.controlKeyFun[e.key]);
                try {
                    this.controlKeyFun[e.key]()
                } catch (err) {
                    console.log(err);
                }
            } else {

                if (this.keymap[e.key]) {
                    this.moveImg(
                        this.currentImgIndex,
                        path.join(this.keymap[e.key],
                            path.basename(this.currentImgPath)
                        )
                    )
                } else {
                    try {
                        this.switchImg[e.keyCode]();
                        // console.log( this.currentImgIndex );
                    } catch (error) {
                        console.log(error);
                    }
                }


            }
        }

        , onMousewheel: function (e) {
            // TODO : 鼠标滚轮
            e.preventDefault();
        }
        , onMousedown: function (e) {
            // TODO : 鼠标侧键

            // 为什么这里 e.preventDefault(); 后 , kekyup 事件就不生效了呢?
            // console.log( '鼠标侧键' );
        }
        , undo: function () {
            //  : 撤销文件移动
            let src_path = this.moved_stack.pop();

            console.log(src_path);
            let new_path = path.join(this.currentPath,
                path.basename(src_path)
            );
            fs.renameSync(src_path, new_path);

            this.img_queue.splice(this.currentImgIndex, 0, new_path);

            // this.previousImg();
        }

    }
    , mounted: function () {
        this.init()
    }
    , watch: {
        img_queue: function (newval, oldVal) {
            if (newval == 0) {
                this.$emit('queueempty')
            }
        }
    }
}
)


var app = new Vue(
    {
        el: "#app"

        , computed: {
            configFilePath: function () {
                return path.join(
                    __MyDIRNAME, './config.json'
                );
            }
        }

        , data: {
            'keymapTemplate': {
                'configName': '默认',
                'keymap': {
                    '0': '', '1': '', '2': '',
                    '3': '', '4': '', '5': '',
                    '6': '', '7': '', '8': '',
                    '9': '', 'a': '', 'b': '',
                    'c': '', 'd': '', 'e': '',
                    'f': '', 'g': '', 'h': '',
                    'i': '', 'j': '', 'k': '',
                    'l': '', 'm': '', 'n': '',
                    'o': '', 'p': '', 'q': '',
                    'r': '', 's': '', 't': '',
                    'u': '', 'v': '', 'w': '',
                    'x': '', 'y': '', 'z': ''
                }
            },

            'keymapList': []
            // 配置名 及 按键目录 键值对

            , 'currentPath': ""
            // 图片文件所在的路径

            , 'is_keymap_containeris_minimize' : false
        }

        , methods: {
            init: function () {
                //  : 读取 config 文件, 获取配置信息并存储在 keymapList 和 currentKeymap

                if (!fs.existsSync(this.configFilePath)) {
                    this.keymapList.push(this.keymapTemplate);
                    this.setConfigFile();
                }

                let data = fs.readFileSync(
                    this.configFilePath, 'utf-8');

                this.keymapList = JSON.parse(data);

                this.currentKeymap = this.keymapList[0];

            },

            setConfigFile: function () {
                //  : 把配置信息写入文件 

                fs.writeFileSync(
                    this.configFilePath
                    , JSON.stringify(this.keymapList)
                );

            },

            onFileSelected: async function (_path_) {
                //  : 获得路径后, 判断是否合法, 判断文件夹中是否包含图片文件

                let path_ = ""
                if (fs.existsSync(_path_)) {

                    let flag = isDir(_path_)

                    if (flag) {
                        path_ = _path_
                    } else {
                        path_ = path.dirname(_path_)
                    }

                    this.currentPath = path_;
                }
            }
            , onChange: function (_pathkey_, _img2path_) {
                app.currentKeymap.keymap[_pathkey_] = _img2path_;
            }

            , printKeymap: function () {
                console.log(app.currentKeymap.keymap);
            }

            , onKeymapedit: function (_configName_, _keymap_) {
                console.log(_keymap_);
                this.currentKeymap.configName = _configName_;
                this.currentKeymap.keymap = { ..._keymap_ };

                this.setConfigFile()
            }

            , onSwitchConfig: function (configIndex) {
                // console.log( configIndex );

                this.currentKeymap = this.keymapList[configIndex]
            }
            , onQueueEmpty: function () {
                this.currentPath = ""
            }

            , onSwitchMinimize : function(){
                this.is_keymap_containeris_minimize = !this.is_keymap_containeris_minimize;
            }
        }
        , mounted() {
            // console.log(this.currentKeymap);

            this.init()
        },

    }
)