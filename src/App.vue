<template>
  <div id="app">
    <router-view/>
    <global-music-player></global-music-player>
  </div>
</template>

<script>
import globalMusicPlayer from "@/components/common/globalMusicPlayer.vue";

export default {
  components: {
    globalMusicPlayer
  },
  data() {
    return {}
  },

  computed: {},

  watch: {},

  created() {

  },

  mounted() {

  },

  methods: {}
}
</script>

<style scoped>

</style>
