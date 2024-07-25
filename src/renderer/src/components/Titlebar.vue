<script setup lang="ts">
import { IpcEvents } from "@common/ipcEvents"

const ipcHandle = () => window.electron.ipcRenderer.send(IpcEvents.PC_VIEW_CREATE, "https://pro.kuaijianji.com/editor")
// const ipcHandle = () => window.electron.ipcRenderer.send(IpcEvents.PC_VIEW_CREATE, "https://www.baidu.com")

const handleClick = (action: 'min' | 'max' | 'close'): void => {
  // alert(action)
  window.electron.ipcRenderer.send(IpcEvents.PC_VIEW_CREATE, "https://pro.kuaijianji.com/editor")
  // alert(window.electron)
}

</script>

<template>
  <div class="action">
    <a target="_blank" rel="noreferrer" @click="handleClick('min')">open url</a>
  </div>
</template>
