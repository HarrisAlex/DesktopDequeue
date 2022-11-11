'use strict';

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const { networkInterfaces } = require('os');

const nets = networkInterfaces();
var lan_ip = null;

//Get local IP
for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;

        if (net.family === familyV4Value && !net.internal) {
            if (net.address.toString().includes('192')) {
                lan_ip = net.address;
            }
        }
    }
}


const createWindow = () => {
    const window = new BrowserWindow({
      width: 800,
      height: 800,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })

    window.loadFile('index.html');

    ipcMain.handle('get-ip', () => lan_ip);
}



app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    });
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
