/* Copyright (c) 2021-2024 Damon Smith */

import { ipcMain, shell } from 'electron';
const os = require('os');

export const runDefaultBrowserService = (app: any) => {
  ipcMain.on('open-settings-default', () => {
    //if (window.navigator.appVersion.indexOf('Win') !== -1) { window.location.href = "ms-settings:defaultapps" }
    if (os.platform().indexOf('win') !== -1)
      shell.openExternal('ms-settings:defaultapps');
  });

  let isDefault = true;

  ipcMain.handle('is-default-browser', () => {
    return isDefault;
  });

  const _get_default = () => {
    return false;
  };
}
