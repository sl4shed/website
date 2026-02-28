<script>
import Wallpaper from "./assets/wallpaper.jpg"
import Folder from "./assets/folder.png"
import Window from "./components/Window.vue"
import Icon from "./components/Icon.vue"

const ICONS = {
  folder: Folder,
}

const DEFAULT_ICONS = [
  {name: "pepe", type: "folder", method: 'openWindow', row: 0, col: 0, dragging: false}
]

function hydrateIcons(icons, vm) {
  return icons.map(icon => ({
    ...icon,
    src: ICONS[icon.type] || Folder,
    dragging: false,
    callback: () => vm[icon.method]()
  }))
}

export default {
  components: { Window, Icon },
  provide() {
    return { windows: this.windows }
  },
  created() {
    this.icons = hydrateIcons(this._savedIcons || DEFAULT_ICONS, this)
  },
  data() {
    const savedIcons = JSON.parse(localStorage.getItem('icons') || 'null')
    const savedWindows = JSON.parse(localStorage.getItem('windows') || 'null')
    return {
      windows: savedWindows || [],
      activeWindow: null,
      icons: [],
      selectedIcon: null,
      Folder,
      _savedIcons: savedIcons
    }
  },
  watch: {
    icons: {
      deep: true,
      handler(icons) {
        localStorage.setItem('icons', JSON.stringify(
            icons.map(({ id, name, type, col, row }) => ({ id, name, type, col, row }))
        ))
      }
    },
    windows: {
      deep: true,
      handler(windows) {
        localStorage.setItem('windows', JSON.stringify(
            windows.map(({ id, title, posX, posY }) => ({ id, title, posX: posX || 0, posY: posY || 0 }))
        ))
      }
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
    }
  }
}
</script>

<template>
  <div class="windows" @mousedown="selectedIcon = null">
    <Window v-for="(win, i) in windows"
            :key="win.id"
            :title="win.title"
            :zIndex="i + 10"
            :active="win === activeWindow"
            :initialPosX="win.posX || 0"
            :initialPosY="win.posY || 0"
            @close="closeWindow(win)"
            @focus="focusWindow(win)"
            @move="win.posX = $event.posX; win.posY = $event.posY"
    />
  </div>

  <div class="icons">
    <Icon
        v-for="icon in icons"
        :key="icon.id"
        :name="icon.name"
        :icon="icon.src"
        :callback="icon.callback"
        :col="icon.col"
        :row="icon.row"
        :style="!icon.dragging ? { left: icon.col * 90 + 'px', top: icon.row * 90 + 'px', position: 'absolute' } : {}"
        :selected="selectedIcon === icon.id"
        @select="selectedIcon = icon.id"
        @changePosition="onIconMove(icon, $event)"
        @setDragging="icon.dragging = $event"
    />
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