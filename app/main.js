const { app, BrowserWindow , Menu} = require('electron')

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

        mainWindows.loadFile('./page/index/index.html')
        // Menu.setApplicationMenu(null);
        mainWindows.on('closed',
            () => {
                mainWindows = null;
            }
        )
    
    }
)
