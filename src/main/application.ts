import { app, ipcMain } from "electron";
import { SessionsService } from "./sessions-service";
import { WindowsService } from "./windows-service";
import { Settings } from "./models/settings";
import { IpcEvents } from "@common/ipcEvents";

export class Application {
  public static instance = new Application();

  public sessions: SessionsService = {};

  public settings: Settings;

  public windows: WindowsService;

  constructor() {}

  public async start() {
    const gotTheLock = app.requestSingleInstanceLock();

    if (!gotTheLock) {
      app.quit();
      return;
    } else {
      app.on("open-url", async (_, url) => {});
    }

    ipcMain.on("create-window", (e, incognito = false) => {
      this.windows.open(incognito);
    });
    await this.onReady();
  }

  private async onReady() {
    await app.whenReady();

    this.sessions = new SessionsService();
    this.windows = new WindowsService(this.sessions);
    this.settings = new Settings();

    this.windows.open();
  }
}
