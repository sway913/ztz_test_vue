/* Copyright (c) 2021-2024 Damon Smith */

import { ipcMain, dialog, app } from "electron";
// import { getPassword, setPassword, deletePassword } from 'keytar';

import { AppWindow } from "../windows";
import { Application } from "../application";
import { IFormFillData } from "@interfaces/index";
import { URL } from "url";
import { IpcEvents } from "../../common/ipcEvents";
import { Base64 } from "js-base64";
import SDKHelper from "../utils/sdk-helper";
const path = require("path");
const fs = require("fs");

export const runMessagingService = (appWindow: AppWindow) => {
  const { id } = appWindow;

  ipcMain.on(`window-focus-${id}`, () => {
    appWindow.win.focus();
    appWindow.webContents.focus();
  });

  ipcMain.on(`window-toggle-maximize-${id}`, () => {
    if (appWindow.win.isMaximized()) {
      appWindow.win.unmaximize();
    } else {
      appWindow.win.maximize();
    }
  });

  ipcMain.on(`window-minimize-${id}`, () => {
    appWindow.win.minimize();
  });

  ipcMain.on(`window-close-${id}`, () => {
    appWindow.win.close();
  });

  ipcMain.on(`window-fix-dragging-${id}`, () => {
    appWindow.fixDragging();
  });

  ipcMain.on(`show-menu-dialog-${id}`, (e, x, y) => {

  });

  ipcMain.on(`search-show-${id}`, (e, data) => {

  });

  ipcMain.handle(`is-dialog-visible-${id}`, (e, dialog) => {
    return Application.instance.dialogs.isVisible(dialog);
  });

  ipcMain.on(`show-tab-preview-${id}`, (e, tab) => {

  });

  ipcMain.on(`hide-tab-preview-${id}`, (e, tab) => {

  });

  ipcMain.on(`find-show-${id}`, () => {
  });

  ipcMain.on(`find-in-page-${id}`, () => {
    appWindow.send("find");
  });

  ipcMain.on(`show-add-bookmark-dialog-${id}`, (e, left, top) => {

  });

  if (process.env.ENABLE_EXTENSIONS) {
    ipcMain.on(`show-extension-popup-${id}`, (e, left, top, url, inspect) => {

    });
  }

  ipcMain.on(`show-downloads-dialog-${id}`, (e, left, top) => {

  });

  ipcMain.on(`show-menu_extra-dialog-${id}`, (e, left, top) => {

  });

  ipcMain.on(`show-zoom-dialog-${id}`, (e, left, top) => {

  });

  ipcMain.on(`show-tabgroup-dialog-${id}`, (e, tabGroup) => {

  });

  ipcMain.on(`edit-tabgroup-${id}`, (e, tabGroup) => {
    appWindow.send(`edit-tabgroup`, tabGroup);
  });

  ipcMain.on(`is-incognito-${id}`, (e) => {
    e.returnValue = appWindow.incognito;
  });

  ipcMain.on(`show-incognitoMenu-dialog-${id}`, (e, x, y) => {

  });

  //-------------ztz TEST-----------
  ipcMain.handle(IpcEvents.PC_OPEN_DIALOG, async (e, strParams) => {
    // console.log("strParams", strParams);
    return await dialog
      .showOpenDialog(appWindow.win!, {
        title: "Select Videos",
        properties: ["openFile", "multiSelections"],
        filters: [{ name: "video file", extensions: ["mp4"] }],
      })
      .then((re) => {
        if (!re.canceled) {
          console.log(re.filePaths);
          let jsonData = { code: 0 };
          var fileList = {
            file: re.filePaths[0],
            filesize: "87324797",
            info: '{"BitRate":"10167642","Duration":"70000","FileSize":"87324797","Format":"MPEG-4","FrameRate":"25.000","audio":[{"Duration":"70000","Format":"AAC"}],"video":[{"BitRate":"10037274","Duration":"70000","Format":"AVC","FrameRate":"25.000","Height":"1080","Width":"1920"}]}',
          };
          jsonData["filelist"] = [fileList];
          let strJson = JSON.stringify(jsonData);
          console.log(strJson);
          return jsonData;
        }
        return re.filePaths;
      });
  });

  ipcMain.handle("getSystemInfo", async (e, params) => {
    let jsonData = {
      code: 0,
      data: {
        arch: "x64",
        channel: "domain",
        inst_hours: "816",
        ip: "10.17.39.113",
        m2: "b3474e70658157c89fc024d79c63f9e6061581c22b4c",
        mid: "78dcee0191e150704c8cc6a087347263",
        os: "Windows 11",
        product_name: "aikkkk",
        version: "1.0.0.1001",
      },
    };
    let strJson = JSON.stringify(jsonData);
    // console.log("------------------------------GetSystemInfo 1------------------------------------", strJson);
    return jsonData;
  });

  ipcMain.handle("GetSystemInfo", async (e, params) => {
    const sdkHelper = new SDKHelper();
    sdkHelper.init();
    sdkHelper.close();
    let jsonData = {
      code: 0,
      data: {
        arch: "x64",
        channel: "domain",
        inst_hours: "816",
        ip: "10.17.39.113",
        m2: "b3474e70658157c89fc024d79c63f9e6061581c22b4c",
        mid: "78dcee0191e150704c8cc6a087347263",
        os: "Windows 11",
        product_name: "aikkkk",
        version: "1.0.0.1001",
      },
    };
    let strJson = JSON.stringify(jsonData);
    // console.log("------------------------------GetSystemInfo 2------------------------------------", strJson);
    return jsonData;
  });

  ipcMain.handle("GetSystemFonts", async (e, params) => {
    let jsonData = {
      code: 0,
      fontlist: [
        "Agency FB",
        "Algerian",
        "Arial",
        "Arial Black",
        "Arial Narrow",
        "Arial Rounded MT Bold",
        "Bahnschrift",
      ],
    };
    let strJson = JSON.stringify(jsonData);
    // console.log("------------------------------GetSystemFonts------------------------------------", strJson);
    return jsonData;
  });

  ipcMain.handle("GetBaseConfig", async (e, params) => {
    const appDataPath = app.getPath("appData");
    let jsonData = {
      cache: appDataPath + "\\AIQuickMediaEditor\\User Data\\MediaCache\\",
      code: 0,
      export: "C:\\AI快剪辑视频\\",
      hwaccelexport: 1,
      project: appDataPath + "\\AIQuickMediaEditor\\User Data\\MyProjects\\",
      supporthwaccel: 1,
    };
    let strJson = JSON.stringify(jsonData);
    // console.log("------------------------------GetBaseConfig------------------------------------", strJson);
    return jsonData;
  });

  ipcMain.handle("PathExist", async (e, params) => {
    let jsonData = {
      code: 0,
      exist: 1,
      filesize: "8050",
    };
    let strJson = JSON.stringify(jsonData);
    // console.log("------------------------------PathExist------------------------------------", strJson);
    return jsonData;
  });

  interface ContentData {
    method: string;
    params?: {
      content: string;
      path?: string;
    };
  }

  ipcMain.handle("SaveFile", async (e, params) => {
    let inJson = JSON.stringify(params);
    // console.log("-------------SaveFile------" + inJson);
    let outPath = "";
    const json_data: ContentData = JSON.parse(params);
    if (json_data.params && json_data.params.path) {
      outPath = json_data.params.path;
      const dirPath = path.dirname(outPath);
      if (fs.existsSync(dirPath)) {
        // console.log("Directory exists.")
      } else {
        await fs.promises
          .mkdir(dirPath)
          .then(function () {
            console.log("Directory created successfully");
          })
          .catch(function () {
            console.log("failed to create directory");
          });
      }
      // all content is base64
      fs.writeFileSync(outPath, Base64.decode(json_data.params.content));
    }

    let jsonData = { code: 0, path: outPath };
    let strJson = JSON.stringify(jsonData);
    return strJson;
  });

  ipcMain.on(IpcEvents.PC_WINDOW_OPERATE, (e, data) => {
    if (data === "minimize") {
      appWindow.win.minimize();
    } else if (data === "close") {
      appWindow.win.close();
    }
  });


  if (process.env.ENABLE_AUTOFILL) {
    // TODO: autofill
    // ipcMain.on(`form-fill-show-${id}`, async (e, rect, name, value) => {
    //   const items = await getFormFillMenuItems(name, value);

    //   if (items.length) {
    //     appWindow.dialogs.formFillDialog.send(`formfill-get-items`, items);
    //     appWindow.dialogs.formFillDialog.inputRect = rect;

    //     appWindow.dialogs.formFillDialog.resize(
    //       items.length,
    //       items.find((r) => r.subtext) != null,
    //     );
    //     appWindow.dialogs.formFillDialog.rearrange();
    //     appWindow.dialogs.formFillDialog.show(false);
    //   } else {
    //     appWindow.dialogs.formFillDialog.hide();
    //   }
    // });

    // ipcMain.on(`form-fill-hide-${id}`, () => {
    //   appWindow.dialogs.formFillDialog.hide();
    // });

    ipcMain.on(`form-fill-update-${id}`, async (e, _id: string, persistent = false) => {
      const url = appWindow.viewManager.selected.url;
      const { hostname } = new URL(url);

      const item =
        _id &&
        (await Application.instance.storage.findOne<IFormFillData>({
          scope: "formfill",
          query: { _id },
        }));

      if (item && item.type === "password") {
        // item.fields.password = await getPassword(
        //   'lunarwolf',
        //   `${hostname}-${item.fields.username}`,
        // );
      }

      appWindow.viewManager.selected.send(`form-fill-update-${id}`, item, persistent);
    });

    // ipcMain.on(`credentials-show-${id}`, (e, data) => {
    //   appWindow.dialogs.credentialsDialog.send('credentials-update', data);
    //   appWindow.dialogs.credentialsDialog.rearrange();
    //   appWindow.dialogs.credentialsDialog.show();
    // });

    // ipcMain.on(`credentials-hide-${id}`, () => {
    //   appWindow.dialogs.credentialsDialog.hide();
    // });

    ipcMain.on(`credentials-save-${id}`, async (e, data) => {
      const { username, password, update, oldUsername } = data;
      const view = appWindow.viewManager.selected;
      const hostname = view.hostname;

      if (!update) {
        // const item = await Application.instance.storage.insert<IFormFillData>({
        //   scope: "formfill",
        //   item: {
        //     type: "password",
        //     url: hostname,
        //     favicon: appWindow.viewManager.selected.favicon,
        //     fields: {
        //       username,
        //       passLength: password.length,
        //     },
        //   },
        // });
        // appWindow.viewManager.settingsView.webContents.send("credentials-insert", item);
      } else {
        await Application.instance.storage.update({
          scope: "formfill",
          query: {
            type: "password",
            url: hostname,
            "fields.username": oldUsername,
            "fields.passLength": password.length,
          },
          value: {
            "fields.username": username,
          },
        });

        appWindow.viewManager.settingsView.webContents.send("credentials-update", { ...data, hostname });
      }

      // await setPassword('lunarwolf', `${hostname}-${username}`, password);

      appWindow.send(`has-credentials-${view.id}`, true);
    });

    ipcMain.on(`credentials-remove-${id}`, async (e, data: IFormFillData) => {
      const { _id, fields } = data;
      const view = appWindow.viewManager.selected;

      await Application.instance.storage.remove({
        scope: "formfill",
        query: {
          _id,
        },
      });

      // await deletePassword('lunarwolf', `${view.hostname}-${fields.username}`);

      appWindow.viewManager.settingsView.webContents.send("credentials-remove", _id);
    });

    ipcMain.on("credentials-get-password", async (e, id: string, account: string) => {
      // const password = await getPassword('lunarwolf', account);
      // e.sender.send(id, password);
    });
  }
};
