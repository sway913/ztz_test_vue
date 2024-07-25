import { BrowserWindow, BrowserWindowConstructorOptions } from "electron"
import { join } from "path"
import { is } from "@electron-toolkit/utils"
import icon from "@resources/icon.png?asset"
import { InjectData } from "@main/utils/inject"
import { getSystemInfo } from "@main/utils/systemHelper"

let mainWindow: BrowserWindow
export enum START_STATUS {
  pending = "pending",
  success = "success",
  fail = "fail",
}

interface ICreateWin {
  config: BrowserWindowConstructorOptions
  url: string
  injectData?: any
  route?: string
}

// 加载的url
export function initWinUrl(win: BrowserWindow, url: string) {
  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    win.loadURL(process.env["ELECTRON_RENDERER_URL"])
  } else {
    win.loadFile(join(__dirname, "@renderer/index.html"))
  }
}

export async function createWin({ config, url, injectData, route }: ICreateWin): Promise<BrowserWindow> {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      sandbox: false,
      webSecurity: false,
      preload: join(__dirname, "../preload/index.js"),
      experimentalFeatures: true,
      enableBlinkFeatures: "MediaStreamTrack.getDisplayMedia",
    },
    ...config,
  })
  InjectData({
    webContents: win.webContents,
    data: {
      system: await getSystemInfo(),
      ...injectData,
    },
  })
  if (route) {
    win.webContents.on("did-finish-load", () => {
      win.webContents.send("INIT_ROUTE", route)
    })
  }
  initWinUrl(win, url)
  return win
}

export async function createMainWin(): Promise<BrowserWindow> {
  mainWindow = await createWin({
    config: {
      width: 1200,
      height: 720,
      show: false,
      minWidth: 800,
      minHeight: 600,
      autoHideMenuBar: true,
      frame: false,
      ...(process.platform === "linux" ? { icon } : {}),
    },
    url: "/index.html",
  })
  mainWindow["customId"] = "main"
  mainWindow.on("ready-to-show", () => {
    mainWindow.show()
  })
  return mainWindow
}
