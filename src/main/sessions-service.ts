import { session, ipcMain } from "electron";
import { ElectronChromeExtensions } from "electron-chrome-extensions-suit";

export class SessionsService {
  public chromeExtensions: ElectronChromeExtensions;

  public incognitoExtensionsLoaded = false;
  public extensionsLoaded = false;

  public extensions: Electron.Extension[] = [];

  public constructor() {
    if (process.env.ENABLE_EXTENSIONS) {
      ipcMain.on("load-extensions", async () => {
        await this.loadExtensions();
      });

      ipcMain.handle("get-extensions", () => {
        return this.extensions;
      });
    }
  }
}
