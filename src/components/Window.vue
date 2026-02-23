<script>
import "7.css/dist/7.css";

export default {
  name: "Window",
  props: {
    title: {
      required: false,
      type: String,
      default: ""
    },
    active: {
      required: true
    }
  },
  emits: ["close", "focus"],
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
        this.posX += e.clientX - this.initialX;
        this.posY += e.clientY - this.initialY;

        this.initialX = e.clientX;
        this.initialY = e.clientY;
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
  },
  data() {
    return {
      posX: 0,
      posY: 0,
      width: 300,
      height: 300,
      zIndex: 0,
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
       :style="`position: absolute;
                left: ${ posX }px;
                top: ${ posY }px;
                user-select: none;
                z-index: ${ zIndex };`"
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
      <p>sour patch kids are pretty yummy - european</p>
    </div>
  </div>
</template>