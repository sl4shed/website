<script>
import "7.css/dist/7.css";

export default {
    name: "RightClickWindow",
    props: {
        target: { required: true, type: String },
        targetInfo: { type: Object, required: true },
        clipboardInfo: { type: Object, required: true },
        position: { type: Object, required: true }
    },

    emits: [
        "openMd",
        "editMd",
        "copy",
        "paste",
        "cut",
        "delete",
        "rename"
    ],

    methods: {
        openMd() {
            this.$emit("openMd", this.targetInfo.filename);
        },

        editMd() {
            this.$emit("editMd", this.targetInfo.filename);
        },

        cut() {
            this.$emit("cut", this.targetInfo.filename);
        },

        copy() {
            this.$emit("copy", this.targetInfo.filename);
        },

        paste() {
            this.$emit("paste", this.targetInfo.filename);
        },

        del() {
            this.$emit("delete", this.targetInfo.filename);
        },

        rename() {
            this.$emit("rename", this.targetInfo.filename);
        },

        refresh() {
            // do nothing
        }
    }
}
</script>

<template>
    <div :style="{
        position: 'absolute',
        left: position.x + 'px',
        top: position.y + 'px',
        zIndex: 200
    }">
        <ul role="menu" style="width: 200px" v-if="target == 'text'">
            <li role="menuitem" @click="openMd"><a href="#menu" class="bold">Open</a></li>
            <li role="menuitem" @click="editMd"><a href="#menu">Edit</a></li>
            <li role="menuitem" @click="cut" class="has-divider">
                <a href="#menu">Cut</a>
            </li>
            <li role="menuitem" @click="copy"><a href="#menu">Copy</a></li>
            <li role="menuitem" @click="del"><a href="#menu">Delete</a></li>
            <li role="menuitem" @click="rename"><a href="#menu">Rename</a></li>
        </ul>

        <ul role="menu" class="can-hover" style="width: 200px" v-if="target == 'desktop'">
            <li role="menuitem" @click="refresh" class="has-divider"><a href="#menu">Refresh</a></li>
            <li role="menuitem" @click="paste" aria-disabled="true"><a href="#menu">Paste</a></li>
        </ul>
    </div>
</template>

<style scoped>
.bold {
    font-weight: bold !important;
}
</style>