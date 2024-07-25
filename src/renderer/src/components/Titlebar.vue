<script setup lang="ts">
import { IpcEvents } from "@common/ipcEvents"

const handleClick = (action: 'new' | 'show' | 'close'): void => {
  alert(window.electron)
  if (action === 'new') {
    // window.electron.ipcRenderer.send(IpcEvents.PC_VIEW_CREATE, "https://pro.kuaijianji.com/editor")
    window.electron.ipcRenderer.send(IpcEvents.PC_VIEW_CREATE, "https://www.baidu.com")
  }
  if (action === 'show') {
    window.electron.ipcRenderer.send(IpcEvents.PC_VIEW_SELECT, 2, 1)
  }
}

</script>


<template>
  <div class="main">
    <div class="win-control" @click="handleClick('new')">新建  </div>
    <div class="win-control" @click="handleClick('show')">  显示</div>
  </div>
</template>

<style>
.main {
  flex: 1;
  display: flex;
  margin: 0 auto;
  margin-right: 4px;
}
.win-control {
  padding: 10px;
  &__btn {
    color: #ccc;
    display: inline-block;
    height: 100%;
    width: 46px;
    font-size: 16px;

    &:hover {
      background-color: hsla(0, 0%, 100%, 0.1);
    }
  }

  &__btn-close {
    &:hover {
      background-color: rgba(232, 17, 35, 0.9);
    }
  }
}
</style>
