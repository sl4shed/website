<script>
import Wallpaper from "./assets/wallpaper.jpg"
import Folder from "./assets/folder.png"
import Window from "./components/Window.vue"
import Icon from "./components/Icon.vue"
import Text from "./assets/text.png"
import { writeFile, readFile, deleteFile, listFiles } from "./virtualfs.js"
import { markRaw } from 'vue'
import MdReader from "./components/MdReader.vue"
import { componentRegistry } from "./componentRegistry.js"
import RightClickMenu from "./components/RightClickMenu.vue"

const ICONS = {
  folder: Folder,
  text: Text,
}

const DEFAULT_ICONS = []

function serializeWindow(win) {
  return {
    ...win,
    content: {
      componentName: Object.keys(componentRegistry).find(
        key => componentRegistry[key] === win.content.component
      ),
      props: win.content.props
    }
  }
}

function hydrateIcons(icons, vm) {
  listFiles().forEach(file => {
    if (!icons.some(icon => icon.id === file.created)) {
      icons.push({ id: file.created, name: file.name, type: 'text', col: 0, row: 0, method: 'openWindow' })
    }
  })

  return icons.map(icon => ({
    ...icon,
    src: ICONS[icon.type] || Folder,
    dragging: false,
    callback: (registry) => vm[icon.method](registry)
  }))
}

export default {
  components: { Window, Icon, MdReader, RightClickMenu },
  provide() {
    return { windows: this.windows }
  },
  created() {
    writeFile("test.md", "Hello world\n# Hello\n# sugi pula")
    this.icons = hydrateIcons(this._savedIcons || DEFAULT_ICONS, this)
    document.addEventListener('contextmenu', event => event.preventDefault());
  },
  data() {
    const savedIcons = JSON.parse(localStorage.getItem('icons') || 'null')
    const savedWindows = JSON.parse(localStorage.getItem('windows') || '[]')
    const windows = savedWindows.map(win => ({
      ...win,
      content: {
        component: componentRegistry[win.content.componentName],
        props: win.content.props
      }
    }))
    return {
      windows: windows || [],
      activeWindow: null,
      icons: [],
      selectedIcon: null,
      Folder,
      _savedIcons: savedIcons,

      rightClicking: false,
      rightClickingPos: {x: 0, y: 0},
      rightClickingTarget: "desktop"
    }
  },
  watch: {
    icons: {
      deep: true,
      handler(icons) {
        localStorage.setItem('icons', JSON.stringify(
          icons.map(({ id, name, type, col, row, method }) => ({ id, name, type, col, row, method }))
        ))
      }
    },
    windows: {
      deep: true,
      handler(windows) {
        localStorage.setItem('windows', JSON.stringify(windows.map(serializeWindow)))
      }
    }
  },
  methods: {
    openWindow(icon) {
      if (icon.type == "text") {
        const file = readFile(icon.name);
        console.log(file);
        this.windows.push({
          id: Date.now(),
          title: icon.name,
          content: {
            component: markRaw(MdReader),
            props: { content: file.content }
          }
        });
      } else {
        this.windows.push({
          id: Date.now(),
          title: icon.name,
          content: `<p>No preview available for ${icon.name}</p>`
        })
      }
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
    },

    onIconMove(icon, { col, row }) {
      const occupied = (c, r) => this.icons.some(ic => ic !== icon && ic.col === c && ic.row === r)

      if (!occupied(col, row)) {
        icon.col = col
        icon.row = row
        return
      }

      // find nearest free spot
      for (let radius = 1; radius < 10; radius++) {
        for (let dc = -radius; dc <= radius; dc++) {
          for (let dr = -radius; dr <= radius; dr++) {
            if (Math.abs(dc) !== radius && Math.abs(dr) !== radius) continue
            const c = Math.max(0, col + dc)
            const r = Math.max(0, row + dr)
            if (!occupied(c, r)) {
              icon.col = c
              icon.row = r
              return
            }
          }
        }
      }
      // holy fucking nest
    },

    generalClick(event) {
      if (event.button == 0) { // left click
        this.selectedIcon = null
        this.rightClicking = false
      } else if (event.button == 2) { // right click
        if (event.target.className == "windows" && this.rightClicking == false) {
          event.preventDefault();
          this.rightClicking = true;
          this.rightClickingTarget = "desktop";
          this.rightClickingPos = {x: event.clientX, y: event.clientY}
        } else {
          event.preventDefault();
          this.rightClicking = false;
        }
      }
    },

    // todo redo this entire right click detection thing
    iconsClick(event) {
      console.log("yeah")
      if (event.button == 2) { // right click
        if (this.rightClicking == false) { // basically i decided that if youre right clickign on icons youre basically always clicking on an icon so yeah
          console.log("shut the fuck up")
          event.preventDefault();
          this.rightClicking = true;
          this.rightClickingTarget = "icon";
          this.rightClickingPos = {x: event.clientX, y: event.clientY}
        } else {
          event.preventDefault();
          this.rightClicking = false;
        }
      }
    }
  }
}
</script>

<template>
  <div class="windows" @mousedown="generalClick">
    <Window v-for="(win, i) in windows" :key="win.id" :title="win.title" :zIndex="i + 10" :active="win === activeWindow"
      :initialPosX="win.posX || 0" :initialPosY="win.posY || 0" @close="closeWindow(win)" @focus="focusWindow(win)"
      @move="win.posX = $event.posX; win.posY = $event.posY">
      <template v-if="win.content && win.content.component">
        <component :is="win.content.component" v-bind="win.content.props" />
      </template>
      <div v-else-if="win.content" v-html="win.content"></div>
    </Window>
  </div>

  <div class="icons" @mousedown="iconsClick">
    <Icon v-for="icon in icons" :key="icon.id" :registry="icon"
      :style="!icon.dragging ? { left: icon.col * 90 + 'px', top: icon.row * 90 + 'px', position: 'absolute' } : {}"
      :selected="selectedIcon === icon.id" @select="selectedIcon = icon.id" @changePosition="onIconMove(icon, $event)"
      @setDragging="icon.dragging = $event" />
  </div>

  <RightClickMenu v-if="rightClicking" :target="rightClickingTarget" :targetInfo="{ filename: 'test.txt' }" :clipboardInfo="{}" :position="rightClickingPos" />
</template>

<style lang="scss">
html,
body {
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