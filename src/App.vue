<script>
import Wallpaper from "./assets/wallpaper.jpg"
import Folder from "./assets/folder.png"
import Window from "./components/Window.vue"
import Icon from "./components/Icon.vue"

export default {
  components: { Window, Icon },
  provide() {
    return { windows: this.windows }
  },
  data() {
    return {
      windows: [{ id: Date.now(), title: 'First Window' }],
      activeWindow: null,
      Folder
    }
  },
  methods: {
    openWindow(win) {
      this.windows.push({ id: Date.now(), title: 'New Window' })
    },

    focusWindow(win) {
      this.activeWindow = win
      const i = this.windows.indexOf(win)
      this.windows.splice(i, 1)
      this.windows.push(win)
    },
    closeWindow(win) {
      this.activeWindow = null
      const i = this.windows.indexOf(win)
      this.windows.splice(i, 1)
    }
  }
}
</script>

<template>
  <div class="windows">
    <Window v-for="(win, i) in windows"
            :key="win.id"
            :title="win.title"
            :style="{ zIndex: i }"
            :active="win === activeWindow"
            @close="closeWindow(win)"
            @focus="focusWindow(win)"/>
  </div>

  <div class="icons">
    <Icon name="pepe" :icon="Folder" :callback="openWindow"></Icon>
  </div>
</template>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
}

.windows {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;

  background-image: url('./assets/wallpaper.jpg');
}
</style>