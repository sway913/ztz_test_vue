<script setup lang="ts">
import { ref } from 'vue'
import TitleBar from './components/TitleBar.vue'
import useIpcRendererOn from './hook/useIpcRendererOn'
import { getVideoInfoList } from './utils/video'

import { VideoFile, VideoInfo } from '../../common/types'
import { IpcEvents } from '../../common/ipcEvents'

const videoName = ref<string>('')

const togglePlaylist = (): void => {

}

useIpcRendererOn(IpcEvents.EV_PLAY, async (_, videos: VideoFile[]) => {
  const videoInfoList = await getVideoInfoList(videos)
  window.electron.ipcRenderer.send(IpcEvents.EV_ADD_VIDEOS, videoInfoList)
})

useIpcRendererOn(IpcEvents.EV_PAUSE, () => {

})
</script>

<template>
  <TitleBar :title="videoName" @toggle-playlist="togglePlaylist"></TitleBar>
  <div class="main">

  </div>
</template>

<style lang="scss">
@import './assets/css/styles.scss';
@import './assets/font/codicon.scss';

.main {
  flex: 1;
  display: flex;
}
</style>
