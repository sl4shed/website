<script>
export default {
  name: "Icon",
  props: {
    icon: {
      required: true
    },
    name: {
      type: String,
      required: true
    },
    callback: {
      type: Function,
      required: true
    }
  }
}
</script>

<template>
  <div class="icon">
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
  width: 48px;
  height: 48px;
}

.icon p {
  user-select: none;
  font-family: "Segoe UI", sans-serif;
  font-size: 11px;
  text-shadow: 0 1px 3px #000, 0 0 4px #000;
  text-align: center;
}

.icon:hover {
  background-color: #3399ff66;
  border: 1px solid #3399ffaa;
  border-radius: 3px;
}
</style>