var electron = require('electron')

var BrowserWindow = electron.BrowserWindow

var app = electron.app

var mainWindows = null;

app.on('ready',
    () => {
        mainWindows = new BrowserWindow(
            {
                webPreferences: {
                    nodeIntegration: true,
        
                    enableRemoteModule: true
                    , contextIsolation:false
                },
                width: 800,
                heiht: 600
            }
        )

        mainWindows.loadFile('index.html')
    
        require('./menu.js');
      
        mainWindows.on('closed',
            () => {
                mainWindows = null;
            }
        )
    
    }
)
