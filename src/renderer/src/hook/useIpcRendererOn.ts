/* eslint-disable  @typescript-eslint/no-explicit-any */
import { onUnmounted } from "vue";
import { IpcRendererEvent } from "electron";
import { IpcEvents } from "../../../common/ipcEvents";

type IpcRendererListener = (event: IpcRendererEvent, ...args: any[]) => void;

export default function useIpcRendererOn(channel: IpcEvents, listener: IpcRendererListener) {
  const ipc = window.electron.ipcRenderer;

  onUnmounted(() => {
    ipc.removeListener(channel, listener);
  });

  window.electron.ipcRenderer.on(channel, listener);
}
