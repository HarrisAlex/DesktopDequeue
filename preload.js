const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getIP: () => ipcRenderer.send('get-ip')
});