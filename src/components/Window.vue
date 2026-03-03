<script>
import "7.css/dist/7.css";

export default {
  name: "Window",
  props: {
    title: { required: false, type: String, default: "" },
    zIndex: { type: Number, default: 1 },
    active: { required: true },
    initialPosX: { type: Number, default: 0 },
    initialPosY: { type: Number, default: 0 },
  },
  emits: ["close", "focus", "move", "resize"],
  mounted() {
    document.addEventListener("mousemove", this.mousemove);
  },

  beforeUnmount() {
    document.removeEventListener("mousemove", this.mousemove);
  },
  methods: {
    close() {
      this.$emit("close");
    },

    mousemove(e) {
      if (this.dragging) {
        this.posX += e.clientX - this.initialX
        this.posY += e.clientY - this.initialY
        this.initialX = e.clientX
        this.initialY = e.clientY
        this.$emit('move', { posX: this.posX, posY: this.posY })
      }

      if(this.resizing != null) {
        const dx = e.clientX - this.initialX
        const dy = e.clientY - this.initialY
        this.initialX = e.clientX
        this.initialY = e.clientY

        if (this.resizing.includes('right'))  this.width  += dx
        if (this.resizing.includes('left'))  { this.width  -= dx; this.posX += dx }
        if (this.resizing.includes('bottom')) this.height += dy
        if (this.resizing.includes('top'))   { this.height -= dy; this.posY += dy }
        this.$emit('resize', { width: this.width, height: this.height })
      }
    },

    dragStart(e) {
      if (this.$refs.titleBarControls.contains(e.target)) return;
      this.dragging = true;
      this.initialX = e.clientX;
      this.initialY = e.clientY;
    },

    focus() {
      this.$emit('focus')
    },

    dragEnd() {
      this.dragging = false;
    },

    resizeStart(e, direction) {
      this.resizing = direction
      this.initialX = e.clientX
      this.initialY = e.clientY
      e.stopPropagation()
    },

    resizeEnd() {
      this.resizing = null
    }
  },
  data() {
    return {
      posX: this.initialPosX,
      posY: this.initialPosY,
      width: 300,
      height: 300,
      maximized: false,
      dragging: false,
      initialX: 0,
      initialY: 0,
    }
  }
}
</script>

<template>
  <div class="window glass"
       :class="{ active: active }"
       :style="{position: 'absolute',
                left: posX + 'px',
                top: posY + 'px',
                userSelect: 'none',
                zIndex: zIndex + 5 }"
       ref="window"
       @mousedown="focus">
    <div class="title-bar" @mousedown="dragStart" @mouseup="dragEnd" ref="titleBar">
      <div class="title-bar-text" ref="title">{{ title }}</div>
      <div class="title-bar-controls" ref="titleBarControls">
        <button aria-label="Close" @click="close" />
      </div>
    </div>

    <div class="window-body has-space"
         :style="`min-width: ${ width }px;
                  min-height: ${ height }px;`">
      <slot></slot>
    </div>

    <!-- resizing grips -->
    <div class="grip left" @mousedown.stop="(e) => resizeStart(e, 'left')" @mouseup="resizeEnd"></div>
    <div class="grip right" @mousedown.stop="(e) => resizeStart(e, 'right')" @mouseup="resizeEnd"></div>
    <div class="grip top" @mousedown.stop="(e) => resizeStart(e, 'top')" @mouseup="resizeEnd"></div>
    <div class="grip bottom" @mousedown.stop="(e) => resizeStart(e, 'bottom')" @mouseup="resizeEnd"></div>

    <div class="corner-grip top-left" @mousedown.stop="(e) => resizeStart(e, 'top-left')" @mouseup="resizeEnd"></div>
    <div class="corner-grip top-right" @mousedown.stop="(e) => resizeStart(e, 'top-right')" @mouseup="resizeEnd"></div>
    <div class="corner-grip bottom-left" @mousedown.stop="(e) => resizeStart(e, 'bottom-left')" @mouseup="resizeEnd"></div>
    <div class="corner-grip bottom-right" @mousedown.stop="(e) => resizeStart(e, 'bottom-right')" @mouseup="resizeEnd"></div>
  </div>
</template>

<style scoped lang="scss">
.grip {
  width: 10px;
  height: 10px;
  position: absolute;
  z-index: 0; // below corner grips

  &.left   { top: 0; left: 0; height: 100%; cursor: ew-resize; }
  &.right  { top: 0; right: 0; height: 100%; cursor: ew-resize; }
  &.top    { top: 0; left: 0; width: 100%; cursor: ns-resize; }
  &.bottom { bottom: 0; left: 0; width: 100%; cursor: ns-resize; }
}

.corner-grip {
  width: 10px;
  height: 10px;
  position: absolute;
  z-index: 1; // above edge grips

  &.top-left     { top: 0; left: 0; cursor: nwse-resize; }
  &.top-right    { top: 0; right: 0; cursor: nesw-resize; }
  &.bottom-left  { bottom: 0; left: 0; cursor: nesw-resize; }
  &.bottom-right { bottom: 0; right: 0; cursor: nwse-resize; }
}
</style>