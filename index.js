"use strict";

const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");
const path = require("path");
const fs = require("fs");
const ip = require("ip");
const http = require("http");

const { networkInterfaces } = require("os");
const nets = networkInterfaces();
const lan_ip = ip.address();

const createWindow = () => {
	const window = new BrowserWindow({
		width: 1600,
		height: 900,
		minWidth: 800,
		minHeight: 450,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	});

	window.loadFile("index.html");

	ipcMain.handle("get-ip", () => lan_ip);
};

var actions;
function getActions() {
	actions = require("./actions.json");
	return actions;
}

function setActions(event, actions) {
	fs.writeFileSync("./actions.json", JSON.stringify(actions));
}

app.whenReady().then(() => {
	createWindow();
	ipcMain.handle("get-actions", getActions);
	ipcMain.handle("set-actions", setActions);

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

const { fork } = require("child_process");
const ps = fork(`${__dirname}/server.js`);
