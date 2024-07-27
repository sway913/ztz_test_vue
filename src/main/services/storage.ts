/* Copyright (c) 2021-2024 Damon Smith */

import { ipcMain, dialog } from "electron";
import Nedb, * as Datastore from "@seald-io/nedb";
import { fileTypeFromBuffer } from "file-type";
import * as icojs from "parse-ico";

import { getPath } from "@utils/index"; // Import getPath function from utils module
import {
  IFindOperation,
  IInsertOperation,
  IRemoveOperation,
  IUpdateOperation,
  IFavicon,
} from "@interfaces/index";
import { countVisitedTimes } from "@utils/history";
import { promises } from "fs";
import { Application } from "../application";
import { Settings } from "../models/settings";

interface Databases {
  [key: string]: Nedb;
}

const convertIcoToPng = async (icoData: Buffer): Promise<ArrayBuffer> => {
  return (await icojs.parse(icoData, "image/png"))[0].buffer;
};

const createDatabase = (name: string) => {
  // @ts-ignore
  return new Datastore({
    filename: getPath(`storage/${name}.db`),
    autoload: true,
  });
};

const encodeHref = (str: string) => {
  return (str || "").replace(/"/g, "&quot;");
};

const encodeTitle = (str: string) => {
  return (str || "").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
};

const indentLength = 4;
const indentType = " ";

export class StorageService {
  public settings: Settings;

  public databases: Databases = {
    favicons: null,
    bookmarks: null,
    history: null,
    formfill: null,
    startupTabs: null,
    permissions: null,
  };

  public favicons: Map<any, any> = new Map();

  public constructor(settings: Settings) {
    this.settings = settings;

    ipcMain.handle("storage-get", async (e, data: IFindOperation) => {
      return await this.find(data);
    });

    ipcMain.handle("storage-get-one", async (e, data: IFindOperation) => {
      return await this.findOne(data);
    });

    ipcMain.handle("storage-insert", async (e, data: IInsertOperation) => {
      return await this.insert(data);
    });

    ipcMain.handle("storage-remove", async (e, data: IRemoveOperation) => {
      return await this.remove(data);
    });

    ipcMain.handle("storage-update", async (e, data: IUpdateOperation) => {
      return await this.update(data);
    });
  }

  public find<T>(data: IFindOperation): Promise<T[]> {
    const { scope, query } = data;

    return new Promise((resolve, reject) => {
      this.databases[scope].find(query, (err: any, docs: any) => {
        if (err) reject(err);
        resolve(docs);
      });
    });
  }

  public findOne<T>(data: IFindOperation): Promise<T> {
    const { scope, query } = data;

    return new Promise((resolve, reject) => {
      this.databases[scope].findOne(query, (err: any, doc: any) => {
        if (err) reject(err);
        resolve(doc);
      });
    });
  }

  public insert<T>(data: IInsertOperation): Promise<T> {
    const { scope, item } = data;

    return new Promise((resolve, reject) => {
      this.databases[scope].insert(item, (err: any, doc: any) => {
        if (err) reject(err);
        resolve(doc);
      });
    });
  }

  public remove(data: IRemoveOperation): Promise<number> {
    const { scope, query, multi } = data;

    return new Promise((resolve, reject) => {
      this.databases[scope].remove(query, { multi }, (err: any, removed: number) => {
        if (err) reject(err);
        resolve(removed);
      });
    });
  }

  public update(data: IUpdateOperation): Promise<number> {
    const { scope, query, value, multi } = data;

    return new Promise((resolve, reject) => {
      this.databases[scope].update(query, { $set: value }, { multi }, (err: any, replaced: number) => {
        if (err) reject(err);
        resolve(replaced);
      });
    });
  }

  public async run() {
    for (const key in this.databases) {
      this.databases[key] = this.createDatabase(key.toLowerCase());
    }
    await this.loadBookmarks();
    await this.loadFavicons();
    await this.loadHistory();
  }

  private async loadFavicons() {
    const faviconsFromDB: IFavicon[] = await this.find<IFavicon>({ scope: "favicons", query: {} });

    // Load favicons from bookmarks and history items
    const faviconsFromItems: Set<string> = new Set();

    // Combine favicons from DB and items
    const allFavicons = [...faviconsFromDB, ...Array.from(faviconsFromItems)];

    // Update the favicons map
    allFavicons.forEach((favicon) => {
      if (typeof favicon === "object" && favicon !== null) {
        const { url, data } = favicon;

        if (!this.favicons.get(url)) {
          this.favicons.set(url, data);
        }
      }
    });
  }

  private async loadHistory() {
  
  }

  private async loadBookmarks() {
    
  }

  public async removeBookmark(id: string) {
    
  }

  private createDatabase = (name: string) => {
    // @ts-ignore
    return new Datastore({
      filename: getPath(`storage/${name}.db`),
      autoload: true,
    });
  };
}
