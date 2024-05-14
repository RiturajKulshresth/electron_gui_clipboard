// main.js
const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("path");

let menu = null;
let mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 600,
        webPreferences: {
            nodeIntegration: true, // Ensure Node.js integration is enabled
            contextIsolation: false,
            preload: path.join(__dirname, "preload.js"),
        },
    });

    mainWindow.loadFile("index.html");

    // Open DevTools
    // mainWindow.webContents.openDevTools();

    //   const menu = Menu.buildFromTemplate(menuTemplate);
    //   Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on("show-menu", () => {
    if (!menu) {
        const menuTemplate = [
            {
                label: "View",
                submenu: [
                    {
                        label: "Zoom In",
                        accelerator: "CmdOrCtrl+Plus",
                        click: () => mainWindow.webContents.send("zoom-in"),
                    },
                    {
                        label: "Zoom Out",
                        accelerator: "CmdOrCtrl+-",
                        click: () => mainWindow.webContents.send("zoom-out"),
                    },
                    {
                        label: "Actual Size",
                        accelerator: "CmdOrCtrl+0",
                        click: () => mainWindow.webContents.send("actual-size"),
                    },
                ],
            },
        ];
        menu = Menu.buildFromTemplate(menuTemplate);
    }

    mainWindow.setMenu(menu);
});

ipcMain.on("hide-menu", () => {
    if (menu) {
        mainWindow.setMenu(null);
        menu = null;
    }
});
