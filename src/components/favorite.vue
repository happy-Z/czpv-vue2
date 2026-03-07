<template>
  <div>
    <div class="favorite-container">
      <div class="favorite-header my-animation-slide-top">
        <video class="index-video" autoplay="autoplay" muted="muted" loop="loop"
               :src="$store.state.sysConfig['webStaticResourcePrefix'] + 'assets/backgroundVideo.mp4'">
        </video>
        <div class="hero-mask"></div>

        <div class="hero-content">
          <div class="hero-title-wrap">
            <div class="hero-kicker">
              Notes
            </div>
            <div class="hero-title">
              Boxs
            </div>
            <div>
              Save your favorite corners in one place
            </div>
          </div>

          <div class="card-container">
             <div @click="changeFavorite(3)"
                  class="card-item card-friend"
                 :class="{ active: card === 3 }">
              <div class="card-item-content">
                <div class="card-top">
                  <div class="card-icon">FR</div>
                  <div class="card-chip">Social</div>
                </div>
                <div class="card-name">
                  Friend
                </div>
                <div class="card-desc">
                  Add czpv.top to your bookmarks
                </div>
              </div>
              <div class="card-layer-glow"></div>
            </div>

             <div @click="changeFavorite(2)"
                  class="card-item card-music"
                 :class="{ active: card === 2 }">
              <div class="card-item-content">
                <div class="card-top">
                  <div class="card-icon">MU</div>
                  <div class="card-chip">Rhythm</div>
                </div>
                <div class="card-name">
                  Music
                </div>
                <div class="card-desc">
                  We were both young,when I first saw you.
                </div>
              </div>
              <div class="card-layer-glow"></div>
            </div>

             <div @click="changeFavorite(1)"
                  class="card-item card-favorites"
                 :class="{ active: card === 1 }">
              <div class="card-item-content">
                <div class="card-top">
                  <div class="card-icon">FV</div>
                  <div class="card-chip">Toolkit</div>
                </div>
                <div class="card-name">
                  Favorites
                </div>
                <div class="card-desc">
                  Useful tools
                </div>
              </div>
              <div class="card-layer-glow"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="favorite-content">
        <div v-show="card === 1"
             class="favorite-pane">
          <div v-if="collectLoading" class="collect-status">
            Loading favorites...
          </div>
          <template v-else-if="!$common.isEmpty(collects)">
            <div v-for="(value, key) in collects" :key="key" class="collect-group">
              <div class="collect-classify">
                {{key}}
              </div>
              <div class="favorite-item-wrap">
                <div v-for="(item, index) in value" :key="index" @click="toUrl(item.url)" class="favorite-item">
                  <div>
                    <el-avatar class="favorite-item-image" :size="60"
                               :src="item.cover">
                    </el-avatar>
                  </div>
                  <div class="favorite-item-body">
                    <div class="favorite-item-title">
                      {{item.title}}
                    </div>
                    <div class="favorite-item-introduction">
                      {{item.introduction}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div v-else class="collect-status">
            No favorites yet.
          </div>
        </div>

        <div v-show="card === 2"
             class="favorite-pane">
          <funny></funny>
        </div>

        <div v-show="card === 3"
             class="favorite-pane">
          <friend></friend>
        </div>
      </div>
    </div>

    <div class="favorite-footer">
      <myFooter></myFooter>
    </div>
  </div>
</template>

<script>

  const myFooter = () => import("./common/myFooter");
  const funny = () => import("./funny");
  const friend = () => import("./friend");

  export default {
    components: {
      myFooter,
      funny,
      friend
    },

    data() {
      return {
        card: null,
        collects: {},
        collectLoading: false,
        loadedCards: {}
      }
    },

    computed: {},

    watch: {},

    created() {
      this.card = 3;
    },

    mounted() {
      this.loadedCards[this.card] = true;
    },

    methods: {
      toUrl(url) {
        window.open(url);
      },
      changeFavorite(card) {
        this.card = card;
        this.loadedCards[card] = true;
        if (card === 1) {
          if (this.$common.isEmpty(this.collects) && !this.collectLoading) {
            this.getCollect();
          }
        }
      },
      getCollect() {
        this.collectLoading = true;
        this.$http.get(this.$constant.baseURL + "/webInfo/listCollect")
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              this.collects = res.data;
            }
            this.collectLoading = false;
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
            this.collectLoading = false;
          });
      }
    }
  }
</script>

<style scoped>

  .favorite-container {
    padding: 30px 25px 10px;
    background: var(--favoriteBg);
  }

  .favorite-header {
    margin: 60px auto 30px;
    height: 330px;
    position: relative;
    overflow: hidden;
    border-radius: 24px;
    max-width: 1200px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 20px 48px rgba(11, 18, 32, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.22);
  }

  .index-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .hero-mask {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 82% 12%, rgba(255, 172, 111, 0.46), transparent 36%),
      radial-gradient(circle at 15% 85%, rgba(81, 206, 232, 0.45), transparent 35%),
      linear-gradient(115deg, rgba(43, 24, 66, 0.86), rgba(12, 63, 88, 0.64));
  }

  .hero-content {
    position: absolute;
    inset: 0;
    z-index: 2;
    color: var(--white);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 24px 30px 20px;
    backdrop-filter: blur(1px);
  }

  .hero-title-wrap {
    max-width: 360px;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.32);
  }

  .hero-kicker {
    display: inline-block;
    font-size: 14px;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.08);
    margin-bottom: 10px;
  }

  .hero-title {
    font-size: 42px;
    line-height: 1.2;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .card-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }

  .card-item {
    transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease, background 0.35s ease;
    --card-start: rgba(255, 191, 141, 0.24);
    --card-end: rgba(112, 223, 238, 0.16);
    --card-active-start: rgba(255, 140, 88, 0.56);
    --card-active-end: rgba(48, 198, 214, 0.38);
    --card-active-shadow: rgba(165, 92, 52, 0.35);
    position: relative;
    width: 250px;
    height: 128px;
    border-radius: 18px;
    animation: hideToShow 1s ease-in-out;
    cursor: pointer;
    overflow: hidden;
    color: var(--white);
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: linear-gradient(135deg, var(--card-start), var(--card-end));
    box-shadow: 0 10px 25px rgba(8, 17, 42, 0.28);
  }

  .card-item::before {
    content: "";
    position: absolute;
    inset: -30% -20%;
    background: linear-gradient(120deg, transparent 35%, rgba(255, 255, 255, 0.14), transparent 75%);
    transform: none;
    transition: none;
    pointer-events: none;
  }

  .card-item-content {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    padding: 14px 16px 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .card-icon {
    width: 34px;
    height: 34px;
    border-radius: 11px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    letter-spacing: 1px;
    font-weight: 700;
    color: var(--white);
    border: 1px solid rgba(255, 255, 255, 0.45);
    background: linear-gradient(140deg, var(--card-active-start), var(--card-active-end));
    box-shadow: 0 8px 16px rgba(5, 10, 24, 0.32);
  }

  .card-chip {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 4px 9px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.45);
    background: rgba(255, 255, 255, 0.14);
  }

  .card-layer-glow {
    position: absolute;
    right: -24px;
    bottom: -30px;
    width: 110px;
    height: 110px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0));
    pointer-events: none;
    mix-blend-mode: screen;
    opacity: 0.62;
    transition: transform 0.35s ease, opacity 0.35s ease;
  }

  .card-item:hover {
    transform: perspective(900px) translateY(-8px) rotateX(4deg);
    box-shadow: 0 18px 35px rgba(7, 14, 34, 0.36);
  }

  .card-item:hover .card-layer-glow {
    transform: scale(1.08) translate(-6px, -6px);
    opacity: 0.66;
  }

  .card-item.active {
    border-color: rgba(255, 255, 255, 0.82);
    background: linear-gradient(135deg, var(--card-active-start), var(--card-active-end));
    box-shadow: 0 18px 36px var(--card-active-shadow);
  }

  .card-friend {
    --card-start: rgba(255, 185, 126, 0.28);
    --card-end: rgba(255, 123, 102, 0.2);
    --card-active-start: rgba(255, 146, 92, 0.62);
    --card-active-end: rgba(255, 108, 132, 0.4);
    --card-active-shadow: rgba(170, 84, 66, 0.38);
  }

  .card-music {
    --card-start: rgba(122, 201, 255, 0.24);
    --card-end: rgba(98, 230, 217, 0.2);
    --card-active-start: rgba(74, 160, 247, 0.58);
    --card-active-end: rgba(34, 205, 186, 0.42);
    --card-active-shadow: rgba(41, 96, 142, 0.36);
  }

  .card-favorites {
    --card-start: rgba(255, 213, 122, 0.25);
    --card-end: rgba(137, 219, 176, 0.2);
    --card-active-start: rgba(255, 173, 77, 0.6);
    --card-active-end: rgba(72, 201, 148, 0.42);
    --card-active-shadow: rgba(126, 117, 42, 0.34);
  }

  .card-name {
    font-weight: bold;
    font-size: 22px;
    line-height: 1.1;
    display: inline-block;
    position: relative;
    padding-bottom: 8px;
  }

  .card-name:after {
    top: auto;
    bottom: 0;
    width: 26px;
    left: 0;
    height: 2px;
    background: var(--white);
    content: "";
    border-radius: 1px;
    position: absolute;
  }

  .card-desc {
    font-weight: 600;
    margin-top: 0;
    opacity: 0.9;
    font-size: 12px;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .favorite-content {
    margin: 0 auto;
    max-width: 1200px;
  }

  .favorite-pane {
    border-radius: 22px;
    padding: 18px 18px 24px;
    border: 1px solid rgba(118, 131, 170, 0.2);
    box-shadow: 0 14px 32px rgba(19, 26, 45, 0.08);
    background:
      linear-gradient(160deg, rgba(255, 249, 242, 0.92), rgba(238, 252, 255, 0.94));
    will-change: transform, opacity, filter;
  }

  .collect-status {
    height: 160px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 600;
    color: #49608f;
    letter-spacing: 0.5px;
    border: 1px dashed rgba(115, 137, 191, 0.35);
    background: linear-gradient(150deg, rgba(255, 251, 246, 0.86), rgba(237, 247, 255, 0.86));
  }

  .collect-group {
    margin-top: 20px;
  }

  .collect-classify {
    font-size: 26px;
    font-weight: bold;
    margin-bottom: 10px;
    color: var(--themeBackground);
    position: relative;
    padding-left: 14px;
  }

  .collect-classify::before {
    content: "";
    position: absolute;
    left: 0;
    top: 7px;
    width: 5px;
    height: 28px;
    border-radius: 10px;
    background: linear-gradient(to bottom, #ff8a5b, #2dc6d6);
  }

  .favorite-item-wrap {
    display: flex;
    flex-wrap: wrap;
    margin-left: -10px;
  }

  .favorite-item {
    transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
    border-radius: 16px;
    box-shadow: 0 10px 22px rgba(24, 36, 75, 0.1);
    background: linear-gradient(155deg, #fffaf4, #eefcff);
    border: 1px solid rgba(100, 118, 170, 0.14);
    display: flex;
    width: calc(100% / 4 - 20px);
    max-width: 320px;
    height: 90px;
    overflow: hidden;
    padding: 15px;
    cursor: pointer;
    margin: 10px;
  }

  .favorite-item:hover {
    transform: translateY(-7px) scale(1.02);
    box-shadow: 0 18px 30px rgba(39, 67, 139, 0.22);
    border-color: rgba(79, 118, 231, 0.42);
  }

  .favorite-item:hover .favorite-item-image {
    transform: rotate(-8deg) scale(0.9);
    box-shadow: 0 8px 20px rgba(59, 96, 184, 0.26);
  }

  .favorite-item-image {
    margin-right: 20px;
    transition: transform 0.35s ease, box-shadow 0.35s ease;
    box-shadow: 0 6px 12px rgba(36, 53, 105, 0.15);
  }

  .favorite-item-body {
    width: calc(100% - 80px);
  }

  .favorite-item-title {
    font-size: 19px;
    font-weight: bold;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-bottom: 5px;
  }

  .favorite-item-introduction {
    opacity: 0.7;
    font-weight: bold;
    letter-spacing: 1px;
    font-size: 14px;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  @media screen and (max-width: 906px) {
    .favorite-header {
      height: 380px;
    }

    .hero-content {
      padding: 20px;
    }

    .hero-title {
      font-size: 36px;
    }

    .card-item {
      width: calc(50% - 8px);
      height: 124px;
    }
  }

  @media screen and (max-width: 720px) {
    .favorite-item {
      width: calc(100% / 3 - 20px);
    }

    .favorite-header {
      height: 430px;
    }

    .hero-content {
      justify-content: flex-start;
    }

    .card-container {
      margin-top: 24px;
    }

    .favorite-pane {
      padding: 14px;
    }
  }

  @media screen and (max-width: 636px) {
    .favorite-item {
      width: calc(100% / 2 - 20px);
    }

    .card-item {
      width: 100%;
      height: 120px;
    }

    .hero-title {
      font-size: 30px;
    }

    .favorite-header {
      height: 590px;
    }

    .favorite-container {
      padding: 5px;
    }
  }

  @media screen and (max-width: 400px) {
    .favorite-item {
      width: calc(100% - 20px);
    }
  }

  .favorite-footer {
    background: var(--favoriteBg);
  }

  .card-item:active {
    transform: scale(0.97);
  }
</style>
