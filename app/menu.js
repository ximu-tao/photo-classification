const { Menu, BrowserWindow } = require('electron')
var win = null;
var menuList = [
    {
        label: '菜单',
        submenu: [
            {
                label: '按键配置',


                click: () => {
                    if ( win != null) {
                        return
                    }

                    win = new BrowserWindow(
                        {
                            webPreferences: {
                                nodeIntegration: true,
                              
                            },
                            width: 800,
                            heiht: 600
                        }
                    )

                    win.loadFile('./setWindows.html')

                    win.on('closed',
                        () => {
                            win = null;
                        }
                    )
                },
            },

            
            
            {
                label: "调试",
                role : 'toggleDevTools'
            }
            ,
            {
        
                label: '退出',
                role: 'quit'
        
            }
        ]
    }


]

var m = Menu.buildFromTemplate(menuList)

Menu.setApplicationMenu(m)
