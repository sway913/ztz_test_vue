import { app, shell, BrowserWindow, ipcMain } from "electron"
import { join } from "path"
import { is } from "@electron-toolkit/utils"
import icon from "../../resources/icon.png?asset"
import { screen } from "electron"
import WebViewManager from "@main/viewsMannger/WebViewManager"
import IpcClient from "./IpcClient"

import { Application } from "./application"

const application = Application.instance
;(async () => {
  await application.start()
})()

// class MainApp {
//   private win: BrowserWindow | null = null
//   WebViewManager: WebViewManager | null = null
//   IpcClient: IpcClient | null = null
//   constructor() {
//     app.whenReady().then(this.createWindow.bind(this))
//     app.on("activate", this.onActivate.bind(this))
//   }

//   initSkeleton(win: BrowserWindow) {
//     this.WebViewManager = new WebViewManager(win, { x: 10, y: 50, width: 1200, height: 600 })
//     this.IpcClient = new IpcClient(win, this.WebViewManager)
//   }

//   private createWindow(): void {
//     const { width, height } = screen.getPrimaryDisplay().workAreaSize

//     this.win = new BrowserWindow({
//       width,
//       height,
//       frame: true,
//       fullscreen: false,
//       show: false,
//       autoHideMenuBar: true,
//       ...(process.platform === "linux" ? { icon } : {}),
//       webPreferences: {
//         preload: join(__dirname, "../preload/index.js"),
//         sandbox: false,
//         devTools: true,
//         nodeIntegration: true,
//       },
//     })

//     this.initSkeleton(this.win)

//     this.win.on("ready-to-show", async () => {
//       this.win?.show()
//     })

//     this.win.webContents.setWindowOpenHandler((details) => {
//       shell.openExternal(details.url)
//       return { action: "deny" }
//     })

//     if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
//       this.win.loadURL(process.env["ELECTRON_RENDERER_URL"])
//       // this.win.loadURL("https://pro.kuaijianji.com/editor")
//     } else {
//       this.win.loadFile(join(__dirname, "../renderer/index.html"))
//     }
//   }

//   private onActivate(): void {
//     if (BrowserWindow.getAllWindows().length === 0) {
//       this.createWindow()
//     }
//   }
// }

// new MainApp()
