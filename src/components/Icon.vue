<script>
export default {
  name: "Icon",
  emits: ["changePosition", "select", "setDragging"],
  props: {
    icon: { required: true },
    name: { type: String, required: true },
    callback: { type: Function, required: true },
    col: { type: Number, required: true },
    row: { type: Number, required: true },
    cellW: { type: Number, default: 90 },
    cellH: { type: Number, default: 90 },
    selected: { type: Boolean, default: false }
  },
  data() {
    return {
      dragging: false,
      dragOffsetX: 0,
      dragOffsetY: 0,
      liveX: 0,
      liveY: 0,
      startX: 0,
      startY: 0,
    }
  },
  methods: {
    click(e) {
      this.$emit("select")
      this.dragOffsetX = e.clientX - this.col * this.cellW
      this.dragOffsetY = e.clientY - this.row * this.cellH
      this.startX = e.clientX
      this.startY = e.clientY
      window.addEventListener('mousemove', this.mouseMove)
      window.addEventListener('mouseup', this.mouseUp)
    },

    mouseUp(e) {
      window.removeEventListener('mousemove', this.mouseMove)
      window.removeEventListener('mouseup', this.mouseUp)
      if (this.dragging) {
        this.dragging = false
        this.$emit('setDragging', false)
        const col = Math.max(0, Math.round(this.liveX / this.cellW))
        const row = Math.max(0, Math.round(this.liveY / this.cellH))
        this.$emit('changePosition', { col, row })
      }
    },

    mouseMove(e) {
      const dx = e.clientX - this.startX
      const dy = e.clientY - this.startY
      // only start dragging after moving 5px
      if (!this.dragging && Math.sqrt(dx*dx + dy*dy) > 5) {
        this.dragging = true
        this.liveX = this.col * this.cellW
        this.liveY = this.row * this.cellH
        this.$emit('setDragging', true)
      }
      if (this.dragging) {
        this.liveX = e.clientX - this.dragOffsetX
        this.liveY = e.clientY - this.dragOffsetY
      }
    },

    doubleclick() {
      console.log("calling callback");
      this.callback();
    },
  }
}
</script>

<template>
  <div class="icon"
       :class="{ selected, dragging }"
       @mousedown="click"
       @dblclick="doubleclick"
       :style="dragging ? { left: liveX + 'px', top: liveY + 'px', position: 'fixed', zIndex: 9999 } : {}"
       ref="icon">
    <img :src="icon"  :alt="name" />
    <p>{{ name }}</p>
  </div>
</template>

<style scoped>
.icon {
  color: white;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: 80px;
  height: 75px;
  max-width: 80px;
  max-height: 75px;
  min-width: 80px;
  min-height: 75px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  user-select: none;

  border: solid 1px transparent;
  z-index: 0;
  gap: 4px;
}

.icon img {
  user-select: none;
  user-drag: none;
  -webkit-user-drag: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  pointer-events: none;
  width: 48px;
  height: 48px;
}

.icon p {
  user-select: none;
  font-family: "Segoe UI", sans-serif;
  font-size: 11px;
  text-shadow: 0 1px 3px #000, 0 0 4px #000;
  text-align: center;
  margin: 0;
  padding: 0;
  line-height: 1.3;
}

.icon:hover {
  background-color: rgba(148, 207, 255, 0.4);
  border: 1px solid rgba(111, 185, 255, 0.67);
  border-radius: 3px;
}

.icon.selected {
  background-color: rgba(148, 207, 255, 0.55);
  border: 1px solid rgba(111, 185, 255, 0.87);
  border-radius: 3px;
}

.icon.dragging {
  opacity: 0.6;
  pointer-events: none;
}
</style>