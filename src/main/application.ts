/* Copyright (c) 2021-2024 Damon Smith */

import { app, ipcMain, Menu } from "electron";
import { isAbsolute, extname } from "path";
import { existsSync } from "fs";
import { SessionsService } from "./sessions-service";
import { checkFiles } from "@utils/files";
import { Settings } from "./models/settings";
import { isURL, prefixHttp } from "@utils/index";
import { WindowsService } from "./windows-service";
import { StorageService } from "./services/storage";
import { DialogsService } from "./services/dialogs-service";
export class Application {
  public static instance = new Application();

  public sessions: SessionsService | null;

  public settings: Settings | null;

  public storage: StorageService | null;

  public windows: WindowsService | null;

  public async start() {
    const gotTheLock = app.requestSingleInstanceLock();

    if (!gotTheLock) {
      app.quit();
      return;
    } else {
      app.on("open-url", async (_, url) => {
        if (!this.windows) {
          return;
        }

        if (!this.windows.current) {
          this.windows.current = this.windows.open();
        }
        this.windows.current.win.focus();
        this.windows.current.viewManager.create({
          url: url,
          active: true,
        });
        this.windows.current.win.webContents.once("dom-ready", () => {
          if (this.windows && this.windows.current) {
            this.windows.current.viewManager.create({
              url: url,
              active: true,
            });
          }
        });
      });

      app.on("second-instance", async (e, argv) => {
        const path = argv[argv.length - 1];
        if (!this.windows) {
          return;
        }

        if (isAbsolute(path) && existsSync(path)) {
          if (process.env.NODE_ENV !== "development") {
            const path = argv[argv.length - 1];
            const ext = extname(path);

            if (ext === ".html") {
              if (!this.windows.current) {
                this.windows.current = this.windows.open();
              }

              this.windows.current.win.focus();
              this.windows.current.viewManager.create({
                url: `file:///${path}`,
                active: true,
              });
              this.windows.current.win.webContents.once("dom-ready", () => {
                if (this.windows && this.windows.current) {
                  this.windows.current.viewManager.create({
                    url: `file:///${path}`,
                    active: true,
                  });
                }
              });
            }
          }
          return;
        } else if (isURL(path)) {
          if (!this.windows.current) {
            this.windows.current = this.windows.open();
          }

          this.windows.current.win.focus();
          this.windows.current.viewManager.create({
            url: prefixHttp(path),
            active: true,
          });
          this.windows.current.win.webContents.once("dom-ready", () => {
            if (this.windows && this.windows.current) {
              this.windows.current.viewManager.create({
                url: prefixHttp(path),
                active: true,
              });
            }
          });

          return;
        }

        this.windows.open();
      });
    }

    await this.onReady();
  }

  private async onReady() {
    await app.whenReady();

    // new ExtensionServiceHandler();

    // NetworkServiceHandler.get();

    // checkFiles();

    // runDefaultBrowserService(app);

    this.sessions = new SessionsService();
    this.windows = new WindowsService(this.sessions);
    this.settings = new Settings();
    this.storage = new StorageService(this.settings);

    // await this.storage.run();
    // await this.dialogs.run();

    this.windows.open();

    // Menu.setApplicationMenu(getMainMenu());

    // app.on("activate", () => {
    //   if (this.windows.list.filter((x) => x !== null).length === 0) {
    //     this.windows.open();
    //   }
    // });

    // const { object: webset } = Application.instance.settings;
    // if (!webset.hardwareacceleration) {
    //   app.disableHardwareAcceleration();
    // }
  }
}
