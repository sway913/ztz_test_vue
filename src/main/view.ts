import { WebContentsView, app, ipcMain } from "electron";
import { Application } from "./application";
import { AppWindow } from "./windows";
import { resolve, join } from "path";

export class View {
  public webContentsView: WebContentsView;
  private readonly window: AppWindow;
  public incognito = false;
  public homeUrl: string;

  public constructor(window: AppWindow, url: string, incognito: boolean) {
    const { object: webset } = Application.instance.settings;

    this.webContentsView = new WebContentsView({
      webPreferences: {
        preload: join(__dirname, "./preload/index.js"),
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
        partition: incognito ? "view_incognito" : "persist:view",
        plugins: true,
        webSecurity: true,
        javascript: true,
        ...(!webset.autoplay
          ? {
              autoplayPolicy: "user-gesture-required",
            }
          : undefined),
      },
    });

    this.webContentsView.setBackgroundColor("#FFFFFFFF");

    this.incognito = incognito;

    this.window = window;
    this.homeUrl = url;
  }

  public get webContents() {
    return this.webContentsView.webContents;
  }

  public get id() {
    return this.webContents.id;
  }
}
