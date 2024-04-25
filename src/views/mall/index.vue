<template>
    <div>
        <iframe name="iframeChild" id="iframeChild" v-bind:src="getPageUrl" width="100%" :height="iframeHeight"
            frameborder="0" scrolling="no" ref="iframeDom"></iframe>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    name: "server",
    data() {
        return {
            iframeHeight: 7500,
            getPageUrl: `http://127.0.0.1:8080/tmall`
        }
    },
    mounted: function () {
        this.$nextTick(() => {
            if (this.$refs.iframeDom)
                this.iframeHeight = window.innerHeight - this.$refs.iframeDom.$el.offsetTop;
        })
    },
}
</script>

<style scoped></style>
