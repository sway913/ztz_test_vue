import { BrowserWindow, app, dialog } from "electron";
import { writeFileSync, promises } from "fs";
import { resolve, join } from "path";

import { ViewManager } from "../view-manager";
import { IpcEvents } from "@common/ipcEvents";

export class AppWindow {
  public win: BrowserWindow;

  public viewManager: ViewManager;

  public incognito: boolean;

  public constructor(incognito: boolean) {
    this.win = new BrowserWindow({
      frame: false,
      minWidth: 900,
      minHeight: 250,
      width: 900,
      height: 700,
      titleBarStyle: "hiddenInset",
      backgroundColor: "#ffffff",
      webPreferences: {
        plugins: true,
        // TODO: enable sandbox, contextIsolation and disable nodeIntegration to improve security
        nodeIntegration: true,
        contextIsolation: false,
        javascript: true,
        preload: join(__dirname, "../preload/index.js"),
      },
      trafficLightPosition: {
        x: 18,
        y: 18,
      },
      show: false,
    });
    this.incognito = incognito;
    this.viewManager = new ViewManager(this, incognito);

    const resize = () => {
      setTimeout(async () => {});

      setTimeout(() => {
        this.webContents.send("tabs-resize");
      }, 500);

      this.webContents.send("tabs-resize");
    };

    this.win.show();

    this.win.on("maximize", resize);
    this.win.on("restore", resize);
    this.win.on("unmaximize", resize);

    (async () => {
      if (process.env.NODE_ENV === "development") {
        // this.webContents.openDevTools({ mode: "detach" });
        await this.win.loadURL("http://localhost:5173/index.html");
        // await this.win.loadURL("http://localhost:4444/app.html");
      } else {
        await this.win.loadURL(join("file://", app.getAppPath(), "build/app.html"));
      }
    })();
  }

  public get id() {
    return this.win.id;
  }

  public get webContents() {
    return this.win.webContents;
  }

  public fixDragging() {
    const bounds = this.win.getBounds();
    this.win.setBounds({
      height: bounds.height + 1,
    });
    this.win.setBounds(bounds);
  }

  public send(channel: string, ...args: any[]) {
    this.webContents.send(channel, ...args);
  }

  public updateTitle() {
    const { selected } = this.viewManager;
    if (!selected) return;

    this.win.setTitle(selected.title.trim() === "" ? app.name : `${selected.title} - ${app.name}`);
  }
}
