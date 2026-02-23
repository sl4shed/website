<template>
  <div>
    <Window v-for="(win, i) in windows"
            :key="win.id"
            :title="win.title"
            :style="{ zIndex: i }"
            :active="win === activeWindow"
            @close="closeWindow(win)"
            @focus="focusWindow(win)"/>
    <button @click="windows.push({ id: Date.now(), title: 'New Window' })">Open</button>
  </div>
</template>

<script>


import Window from "./components/Window.vue"

export default {
  components: { Window },
  provide() {
    return { windows: this.windows }
  },
  data() {
    return {
      windows: [{ id: Date.now(), title: 'First Window' }],
      activeWindow: null
    }
  },
  methods: {
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