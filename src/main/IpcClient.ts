import { ipcMain, BrowserWindow } from "electron"
import { IpcEvents } from "@common/ipcEvents"
import WebViewManager from "@main/viewsMannger/WebViewManager"

export default class IpcManager {
  win: BrowserWindow
  viewManager: WebViewManager

  constructor(win: BrowserWindow, manager: WebViewManager) {
    this.win = win
    this.viewManager = manager

    ipcMain.on(IpcEvents.PC_NEW_WINDOW, (_event, params: string) => {
      this.viewManager.addWebView(params)
      console.log(IpcEvents.PC_NEW_WINDOW, params)
    })

    ipcMain.on(IpcEvents.PC_TEST, (_event, params: string) => {
      console.log(IpcEvents.PC_TEST, params)
    })
  }
}

// const registerIpc = (): void => {
//   ipcMain.on(IpcEvents.EV_SHOW_OPEN_DIALOG, async (e) => {
//     const win = BrowserWindow.fromWebContents(e.sender)
//     win!.focus()
//     dialog
//       .showOpenDialog(win!, {
//         title: "Select Videos",
//         properties: ["openFile", "multiSelections"],
//         // filters: [{ extensions: getVideoExtensions(false), name: "Video" }],
//       })
//       .then((re) => {
//         if (!re.canceled) {
//           const videoFiles: VideoFile[] = []
//           re.filePaths.forEach((p) => {
//             // const file = getVideoFromPath(p)
//             // if (file) videoFiles.push(file)
//           })
//           e.sender.send(IpcEvents.EV_PLAY, videoFiles)
//         }
//       })
//   })

//   ipcMain.on(IpcEvents.EV_ADD_VIDEOS, (e, videos: VideoInfo[]) => {
//     // const paths = videos.map((v) => v.path)
//     // e.reply(IpcEvents.EV_ADD_VIDEOS, list)
//   })

//   ipcMain.handle(IpcEvents.EV_GET_PLAYLIST, () => {
//     return ""
//   })

//   ipcMain.on(IpcEvents.PC_TEST, (_event, params: string) => {
//     console.log("PC_TEST:", params)
//   })
// }

// export default { registerIpc }
