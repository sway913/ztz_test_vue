/* Copyright (c) 2021-2024 Damon Smith */

import { session, ipcMain } from "electron";
import { resolve, basename, parse, extname } from "path";
import { Application } from "./application";
import { registerProtocol } from "./models/protocol";
import { URL } from "url";
import { IDownloadItem, BrowserActionChangeType } from "@interfaces/index";

const rimraf = require("rimraf");

const rf = (path: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    rimraf(path, (err: Error | null) => {
      if (err) {
        reject(err);
      } else {
        resolve(undefined);
      }
    });
  });
};

export class SessionsService {
  public view = session.fromPartition("persist:view");
  public viewIncognito = session.fromPartition("view_incognito");

  public incognitoExtensionsLoaded = false;
  public extensionsLoaded = false;

  public extensions: Electron.Extension[] = [];

  public constructor() {
    registerProtocol(this.view);
    registerProtocol(this.viewIncognito);

    this.clearCache("incognito");

    if (process.env.ENABLE_EXTENSIONS) {
      ipcMain.on("load-extensions", async () => {
        await this.loadExtensions();
      });

      ipcMain.handle("get-extensions", () => {
        return this.extensions;
      });
    }

    this.view.setPermissionRequestHandler(async (webContents, permission, callback, details) => {
      const window = Application.instance.windows.findByContentsView(webContents.id);
      if (!window) {
        return;
      }

      if (webContents.id !== window.viewManager.selectedId) return;

      if (permission === "fullscreen") {
        callback(true);
      } else {
        try {
          const { hostname } = new URL(details.requestingUrl);
          let mediaTypes = "";
          if ("mediaTypes" in details) {
            mediaTypes = JSON.stringify(details.mediaTypes);
          }
          const perm: any = await Application.instance.storage.findOne({
            scope: "permissions",
            query: {
              url: hostname,
              permission,
              mediaTypes,
            },
          });
        } catch (e) {
          callback(false);
        }
      }
    });

    // TODO(sentialx): clean up the download listeners
    this.view.on("will-download", (event, item, webContents) => {
      
    });

    session.defaultSession.on("will-download", (event, item, webContents) => {
      
    });

    ipcMain.on("clear-browsing-data", () => {
      this.clearCache("normal");
      this.clearCache("incognito");
    });
  }

  public clearCache(session: "normal" | "incognito") {
    const ses = session === "incognito" ? this.viewIncognito : this.view;

    ses.clearCache().catch((err) => {
      console.error(err);
    });

    ses.clearStorageData({
      storages: [
        "cookies",
        "filesystem",
        "indexdb",
        "localstorage",
        "shadercache",
        "websql",
        "serviceworkers",
        "cachestorage",
      ],
    });
  }

  public unloadIncognitoExtensions() {

  }

  // Loading extensions in an off the record BrowserContext is not supported.
  public async loadExtensions() {
   
  }

  async uninstallExtension(id: string) {
    
  }

  public onCreateTab = async () => {
    return 0;
  };

  public onBrowserActionUpdate = (extensionId: string, action: BrowserActionChangeType, details: any) => {
    Application.instance.windows.list.forEach((w) => {
      w.send("set-browserAction-info", extensionId, action, details);
    });
  };
}
