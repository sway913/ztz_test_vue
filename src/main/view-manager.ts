import { ipcMain } from "electron";
import { AppWindow } from "./windows/app";
import { Application } from "./application";
import { EventEmitter } from "events";
import { View } from "./view";
import { IpcEvents } from "@common/ipcEvents";

export class ViewManager extends EventEmitter {
  public views = new Map<number, View>();
  public selectedId = 0;
  public _fullscreen = false;

  public incognito: boolean;

  private readonly window: AppWindow;

  public constructor(window: AppWindow, incognito: boolean) {
    super();

    this.window = window;
    this.incognito = incognito;

    const { id } = window.win;

    // ipcMain.handle(IpcEvents.PC_VIEW_CREATE, (e, options) => {
    //   return options.map((option: any) => {
    //     return this.create(option, false, false).id;
    //   });
    // });

    ipcMain.on(IpcEvents.PC_VIEW_CREATE, (e, options) => {
      // return options.map((option: any) => {
      //   return this.create(option, false, false).id;
      // });
      this.create(options, false, false).id;
    });
  }

  public get selected() {
    return this.views.get(this.selectedId);
  }

  public create(details: any, isNext = false, sendMessage = true) {
    const view = new View(this.window, details, this.incognito);

    const { webContents } = view.webContentsView;
    const { id } = view;

    this.views.set(id, view);

    if (process.env.ENABLE_EXTENSIONS) {
      Application.instance.sessions.chromeExtensions.addTab(webContents, this.window.win);

      if (details.active) {
        Application.instance.sessions.chromeExtensions.selectTab(webContents);
      }
    }

    webContents.once("destroyed", () => {
      this.views.delete(id);
    });

    if (sendMessage) {
      this.window.send("create-tab", { ...details }, isNext, id);
    }
    return view;
  }
}
