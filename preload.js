const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	getIP: () => ipcRenderer.invoke("get-ip"),
	keystrokeRecorder: () => ipcRenderer.invoke("keystrokeRecorder"),
	getActions: () => ipcRenderer.invoke("get-actions"),
});
