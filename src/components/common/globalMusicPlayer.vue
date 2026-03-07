<template>
  <div>
    <div class="global-music-shell" :style="shellStyle" v-if="hasTrack">
      <div class="global-music" v-if="!isMinimized">
        <el-avatar class="music-cover" :size="46" :src="currentTrack.cover"></el-avatar>
        <div class="music-main">
          <div class="music-info">
            <div class="music-title" :title="currentTrack.title">{{ currentTrack.title || "Unknown Track" }}</div>
            <div class="music-meta">{{ currentClassify || currentTrack.classify || "Music" }}</div>
          </div>
          <div class="music-progress">
            <span class="music-time">{{ formatTime(progressValue) }}</span>
            <el-slider
              v-model="progressValue"
              :max="Math.max(duration, 1)"
              :show-tooltip="false"
              @change="onProgressChange">
            </el-slider>
            <span class="music-time">{{ formatTime(duration) }}</span>
          </div>
        </div>
        <div class="music-actions">
          <el-button class="music-circle-btn" size="mini" circle @click="playPrev" :disabled="!canControlPlaylist" title="Prev">⏮️</el-button>
          <el-button class="music-circle-btn" size="mini" type="primary" circle @click="togglePlay" :title="isPlaying ? 'Pause' : 'Play'">{{ isPlaying ? "⏯️" : "▶️" }}</el-button>
          <el-button class="music-circle-btn" size="mini" circle @click="playNext" :disabled="!canControlPlaylist" title="Next">⏭️</el-button>
          <div class="music-volume">
            <span>Vol</span>
            <el-slider
              v-model="volumeValue"
              :max="100"
              :show-tooltip="false">
            </el-slider>
          </div>
          <el-button class="music-circle-btn" size="mini" circle @click="toggleMinimize" title="Minimize">➖</el-button>
        </div>
      </div>

      <div
        class="global-music-mini"
        :class="{ dragging: isDragging }"
        ref="miniPlayer"
        v-else
        @mousedown="onMiniMouseDown"
        @touchstart="onMiniTouchStart">
        <el-avatar class="mini-cover" :size="36" :src="currentTrack.cover" @click.native.stop="restorePlayer"></el-avatar>
        <button class="mini-btn" type="button" @click.stop="togglePlay">{{ isPlaying ? "⏯️" : "▶️" }}</button>
        <button class="mini-btn" type="button" @click.stop="restorePlayer">⤢</button>
        <span class="mini-drag-tip">:::</span>
      </div>
    </div>
    <audio ref="musicAudio" preload="metadata"></audio>
  </div>
</template>

<script>
  export default {
    name: "globalMusicPlayer",

    data() {
      return {
        audio: null,
        isPlaying: false,
        duration: 0,
        progressValue: 0,
        isMinimized: localStorage.getItem("musicPlayerMinimized") === "true",
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        miniPosX: null,
        miniPosY: null,
        miniWidth: 128,
        miniHeight: 50,
        isDragging: false,
        dragOffsetX: 0,
        dragOffsetY: 0
      };
    },

    computed: {
      player() {
        return this.$store.state.musicPlayer;
      },
      currentTrack() {
        return this.player.currentTrack || {};
      },
      currentClassify() {
        return this.player.currentClassify || "";
      },
      playList() {
        return Array.isArray(this.player.playList) ? this.player.playList : [];
      },
      hasTrack() {
        return !this.$common.isEmpty(this.currentTrack) && !this.$common.isEmpty(this.currentTrack.url);
      },
      canControlPlaylist() {
        return this.playList.length > 1;
      },
      volumeValue: {
        get() {
          return this.player.volume;
        },
        set(value) {
          this.$store.commit("musicSetVolume", value);
        }
      },
      shellStyle() {
        if (!this.isMinimized) {
          return {
            right: "10px",
            bottom: "10px"
          };
        }
        const style = {
          left: `${this.miniPosX || 0}px`,
          top: `${this.miniPosY || 0}px`
        };
        if (!this.isDragging) {
          style.transition = "left .22s cubic-bezier(0.22, 1, 0.36, 1), top .22s cubic-bezier(0.22, 1, 0.36, 1)";
        }
        return style;
      }
    },

    watch: {
      "player.commandId"() {
        this.handleCommand();
      },
      "player.volume"(value) {
        if (this.audio != null) {
          this.audio.volume = value / 100;
        }
      },
      isMinimized(value) {
        localStorage.setItem("musicPlayerMinimized", value ? "true" : "false");
        if (value) {
          this.$nextTick(() => {
            this.measureMiniSize();
            this.ensureMiniPosition();
            this.persistMiniPosition();
          });
        }
      },
      hasTrack(value) {
        if (value && this.isMinimized) {
          this.$nextTick(() => {
            this.measureMiniSize();
            this.ensureMiniPosition();
          });
        }
      }
    },

    mounted() {
      this.initAudio();
      this.restoreMiniPosition();
      window.addEventListener("resize", this.onWindowResize);
      if (this.isMinimized) {
        this.$nextTick(() => {
          this.measureMiniSize();
          this.ensureMiniPosition();
        });
      }
    },

    beforeDestroy() {
      this.removeAudioListeners();
      this.removeDragListeners();
      window.removeEventListener("resize", this.onWindowResize);
      if (this.audio != null) {
        this.audio.pause();
        this.audio = null;
      }
    },

    methods: {
      initAudio() {
        if (this.audio != null) {
          return;
        }
        this.audio = this.$refs.musicAudio;
        if (this.audio == null) {
          return;
        }
        this.audio.volume = this.player.volume / 100;
        this.audio.addEventListener("play", this.handleAudioPlay);
        this.audio.addEventListener("pause", this.handleAudioPause);
        this.audio.addEventListener("ended", this.handleAudioEnded);
        this.audio.addEventListener("loadedmetadata", this.handleLoadedMetadata);
        this.audio.addEventListener("durationchange", this.handleLoadedMetadata);
        this.audio.addEventListener("timeupdate", this.handleTimeUpdate);
      },
      removeAudioListeners() {
        if (this.audio == null) {
          return;
        }
        this.audio.removeEventListener("play", this.handleAudioPlay);
        this.audio.removeEventListener("pause", this.handleAudioPause);
        this.audio.removeEventListener("ended", this.handleAudioEnded);
        this.audio.removeEventListener("loadedmetadata", this.handleLoadedMetadata);
        this.audio.removeEventListener("durationchange", this.handleLoadedMetadata);
        this.audio.removeEventListener("timeupdate", this.handleTimeUpdate);
      },
      handleCommand() {
        this.initAudio();
        if (this.audio == null) {
          return;
        }
        if (this.player.commandType === "play") {
          const url = (this.player.commandPayload && this.player.commandPayload.url) || this.player.source;
          this.startPlay(url);
          return;
        }
        if (this.player.commandType === "toggle") {
          this.togglePlay();
          return;
        }
        if (this.player.commandType === "pause") {
          this.audio.pause();
        }
      },
      handleAudioPlay() {
        this.isPlaying = true;
      },
      handleAudioPause() {
        this.isPlaying = false;
      },
      handleAudioEnded() {
        if (!Array.isArray(this.playList) || this.playList.length === 0) {
          return;
        }
        if (this.player.index >= this.playList.length - 1) {
          this.isPlaying = false;
          return;
        }
        this.playNext();
      },
      handleLoadedMetadata() {
        this.duration = Number.isFinite(this.audio.duration) ? this.audio.duration : 0;
      },
      handleTimeUpdate() {
        this.progressValue = this.audio.currentTime || 0;
        if ((!this.duration || this.duration <= 0) && Number.isFinite(this.audio.duration)) {
          this.duration = this.audio.duration;
        }
      },
      safePlay() {
        const playPromise = this.audio.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(error => {
            if (error && (error.name === "AbortError" || error.name === "NotAllowedError")) {
              return;
            }
            console.error("Audio play failed:", error);
          });
        }
      },
      startPlay(url) {
        if (this.audio == null || this.$common.isEmpty(url)) {
          return;
        }
        const currentSource = this.audio.getAttribute("src") || "";
        if (currentSource !== url) {
          this.audio.pause();
          this.duration = 0;
          this.progressValue = 0;
          this.audio.setAttribute("src", url);
          this.audio.load();
        }
        this.safePlay();
      },
      playByIndex(targetIndex) {
        if (!Array.isArray(this.playList) || this.playList.length === 0) {
          return;
        }
        const size = this.playList.length;
        const nextIndex = (targetIndex + size) % size;
        const targetTrack = this.playList[nextIndex];
        if (this.$common.isEmpty(targetTrack) || this.$common.isEmpty(targetTrack.url)) {
          return;
        }
        const classify = this.currentClassify || targetTrack.classify || "";
        this.$store.commit("musicSetTrack", {
          playList: this.playList,
          index: nextIndex,
          classify: classify,
          track: targetTrack
        });
        this.startPlay(targetTrack.url);
      },
      playPrev() {
        this.playByIndex(this.player.index - 1);
      },
      playNext() {
        this.playByIndex(this.player.index + 1);
      },
      togglePlay() {
        if (this.audio == null || this.$common.isEmpty(this.player.source)) {
          return;
        }
        if (this.audio.paused) {
          this.safePlay();
        } else {
          this.audio.pause();
        }
      },
      onProgressChange(value) {
        if (this.audio == null) {
          return;
        }
        this.audio.currentTime = value;
        this.progressValue = value;
      },
      toggleMinimize() {
        this.isMinimized = !this.isMinimized;
      },
      restorePlayer() {
        this.isMinimized = false;
        localStorage.setItem("musicPlayerMinimized", "false");
      },
      onWindowResize() {
        this.viewportWidth = window.innerWidth;
        this.viewportHeight = window.innerHeight;
        if (this.isMinimized) {
          this.measureMiniSize();
          this.ensureMiniPosition();
          this.persistMiniPosition();
        }
      },
      restoreMiniPosition() {
        try {
          const raw = localStorage.getItem("musicPlayerMiniPos");
          if (!raw) {
            return;
          }
          const pos = JSON.parse(raw);
          if (Number.isFinite(pos.x) && Number.isFinite(pos.y)) {
            this.miniPosX = pos.x;
            this.miniPosY = pos.y;
          }
        } catch (error) {
          this.miniPosX = null;
          this.miniPosY = null;
        }
      },
      persistMiniPosition() {
        if (!Number.isFinite(this.miniPosX) || !Number.isFinite(this.miniPosY)) {
          return;
        }
        localStorage.setItem("musicPlayerMiniPos", JSON.stringify({
          x: this.miniPosX,
          y: this.miniPosY
        }));
      },
      ensureMiniPosition() {
        const maxX = Math.max(0, this.viewportWidth - this.miniWidth);
        const maxY = Math.max(0, this.viewportHeight - this.miniHeight);
        if (!Number.isFinite(this.miniPosX) || !Number.isFinite(this.miniPosY)) {
          this.miniPosX = maxX;
          this.miniPosY = Math.max(0, this.viewportHeight - this.miniHeight - 96);
        }
        this.miniPosX = Math.min(Math.max(0, this.miniPosX), maxX);
        this.miniPosY = Math.min(Math.max(0, this.miniPosY), maxY);
      },
      measureMiniSize() {
        const miniEl = this.$refs.miniPlayer;
        if (!miniEl || !miniEl.getBoundingClientRect) {
          return;
        }
        const rect = miniEl.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          this.miniWidth = rect.width;
          this.miniHeight = rect.height;
        }
      },
      isControlElement(target) {
        if (!target || typeof target.closest !== "function") {
          return false;
        }
        return !!(target.closest(".mini-btn") || target.closest(".mini-cover"));
      },
      onMiniMouseDown(event) {
        if (event.button !== 0 || this.isControlElement(event.target)) {
          return;
        }
        this.startDragging(event.clientX, event.clientY);
      },
      onMiniTouchStart(event) {
        if (this.isControlElement(event.target)) {
          return;
        }
        const point = this.extractPoint(event);
        if (!point) {
          return;
        }
        this.startDragging(point.x, point.y);
      },
      startDragging(clientX, clientY) {
        if (!this.isMinimized) {
          return;
        }
        this.measureMiniSize();
        this.ensureMiniPosition();
        this.isDragging = true;
        this.dragOffsetX = clientX - this.miniPosX;
        this.dragOffsetY = clientY - this.miniPosY;
        document.addEventListener("mousemove", this.onDragMove);
        document.addEventListener("mouseup", this.onDragEnd);
        document.addEventListener("touchmove", this.onDragMove, {passive: false});
        document.addEventListener("touchend", this.onDragEnd);
      },
      removeDragListeners() {
        document.removeEventListener("mousemove", this.onDragMove);
        document.removeEventListener("mouseup", this.onDragEnd);
        document.removeEventListener("touchmove", this.onDragMove);
        document.removeEventListener("touchend", this.onDragEnd);
      },
      extractPoint(event) {
        if (!event) {
          return null;
        }
        if (event.touches && event.touches[0]) {
          return {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
          };
        }
        if (event.changedTouches && event.changedTouches[0]) {
          return {
            x: event.changedTouches[0].clientX,
            y: event.changedTouches[0].clientY
          };
        }
        if (Number.isFinite(event.clientX) && Number.isFinite(event.clientY)) {
          return {
            x: event.clientX,
            y: event.clientY
          };
        }
        return null;
      },
      onDragMove(event) {
        if (!this.isDragging) {
          return;
        }
        const point = this.extractPoint(event);
        if (!point) {
          return;
        }
        if (event.cancelable) {
          event.preventDefault();
        }
        const maxX = Math.max(0, this.viewportWidth - this.miniWidth);
        const maxY = Math.max(0, this.viewportHeight - this.miniHeight);
        this.miniPosX = Math.min(Math.max(0, point.x - this.dragOffsetX), maxX);
        this.miniPosY = Math.min(Math.max(0, point.y - this.dragOffsetY), maxY);
      },
      onDragEnd() {
        if (!this.isDragging) {
          return;
        }
        this.isDragging = false;
        this.removeDragListeners();
        this.snapToNearestEdge();
        this.persistMiniPosition();
      },
      snapToNearestEdge() {
        const maxX = Math.max(0, this.viewportWidth - this.miniWidth);
        const maxY = Math.max(0, this.viewportHeight - this.miniHeight);
        const left = this.miniPosX;
        const right = maxX - this.miniPosX;
        const top = this.miniPosY;
        const bottom = maxY - this.miniPosY;
        const minDistance = Math.min(left, right, top, bottom);
        if (minDistance === left) {
          this.miniPosX = 0;
        } else if (minDistance === right) {
          this.miniPosX = maxX;
        } else if (minDistance === top) {
          this.miniPosY = 0;
        } else {
          this.miniPosY = maxY;
        }
      },
      formatTime(seconds) {
        if (!Number.isFinite(seconds) || seconds <= 0) {
          return "00:00";
        }
        const total = Math.floor(seconds);
        const minute = Math.floor(total / 60);
        const second = total % 60;
        return `${minute < 10 ? "0" + minute : minute}:${second < 10 ? "0" + second : second}`;
      }
    }
  }
</script>

<style scoped>
  .global-music-shell {
    position: fixed;
    z-index: 1200;
    max-width: calc(100vw - 20px);
  }

  .global-music,
  .global-music-mini {
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.36);
    background: linear-gradient(140deg, rgba(255, 255, 255, 0.36), rgba(255, 255, 255, 0.14) 58%, rgba(197, 224, 255, 0.26));
    box-shadow: 0 12px 28px rgba(30, 54, 96, 0.22);
    backdrop-filter: blur(16px) saturate(140%);
    -webkit-backdrop-filter: blur(16px) saturate(140%);
  }

  .global-music::before,
  .global-music-mini::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(125deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.08) 55%, rgba(172, 204, 255, 0.18));
  }

  .global-music > *,
  .global-music-mini > * {
    position: relative;
    z-index: 1;
  }

  .global-music {
    width: min(620px, calc(100vw - 20px));
    display: flex;
    align-items: center;
    gap: 10px;
    border-radius: 14px;
    padding: 8px 10px;
  }

  .music-cover {
    flex-shrink: 0;
    border: 2px solid rgba(255, 255, 255, 0.88);
    box-shadow: 0 5px 12px rgba(28, 53, 97, 0.25);
  }

  .music-main {
    flex: 1;
    min-width: 0;
  }

  .music-info {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 4px;
  }

  .music-title {
    font-size: 14px;
    font-weight: 700;
    color: #1d3669;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .music-meta {
    font-size: 11px;
    color: #4b679b;
    max-width: 180px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .music-progress {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .music-progress .el-slider {
    flex: 1;
  }

  .music-time {
    font-size: 11px;
    color: #39568d;
    min-width: 32px;
    text-align: center;
  }

  .music-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .music-circle-btn {
    width: 36px;
    height: 36px;
    min-height: 36px;
    padding: 0;
    border-radius: 50%;
    font-size: 18px;
    line-height: 36px;
    text-align: center;
  }

  .music-volume {
    width: 115px;
    display: flex;
    align-items: center;
    gap: 6px;
    color: #355083;
    font-size: 11px;
  }

  .music-volume .el-slider {
    flex: 1;
  }

  .global-music-mini {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 8px;
    border-radius: 12px;
    touch-action: none;
    cursor: grab;
    user-select: none;
  }

  .global-music-mini.dragging {
    cursor: grabbing;
  }

  .mini-cover {
    cursor: pointer;
    border: 2px solid rgba(255, 255, 255, 0.88);
  }

  .mini-btn {
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    color: #234078;
    background: rgba(233, 244, 255, 0.92);
    font-weight: 700;
    line-height: 30px;
    padding: 0;
    font-size: 16px;
  }

  .mini-btn:hover {
    background: rgba(210, 232, 255, 0.95);
  }

  .mini-drag-tip {
    font-size: 10px;
    color: #3e5b90;
    letter-spacing: 1px;
    margin-left: 2px;
  }

  @media screen and (max-width: 920px) {
    .global-music {
      width: min(calc(100vw - 20px), 560px);
      flex-wrap: wrap;
      gap: 8px;
    }

    .music-main,
    .music-actions {
      width: 100%;
    }

    .music-actions {
      justify-content: flex-start;
    }

    .music-volume {
      width: 100%;
    }
  }
</style>
