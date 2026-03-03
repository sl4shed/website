<script>
export default {
    props: {
        content: { type: String, default: "" }
    },
    created() {
        console.log(this.content);
    }
}
</script>

<template>
<p>{{  content }}</p>
</template>

<style scoped>

</style>