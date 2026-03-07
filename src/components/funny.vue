<template>
  <div class="funny-wrap" v-if="!$common.isEmpty(funnys)">
    <div v-for="(item, index) in funnys" :key="index" class="funny-group">
      <div class="funny-head">
        <span class="iconRotate funny-head-icon">
          <svg viewBox="0 0 1024 1024" width="28" height="28">
            <path
              d="M502.272 948.224l-427.008-427.008c-1.536-1.536-1.536-3.584 0-4.608l427.008-427.008c1.536-1.536 3.584-1.536 4.608 0l427.008 427.008c1.536 1.536 1.536 3.584 0 4.608L506.88 948.224c-1.536 1.024-3.584 1.024-4.608 0z"
              fill="#C9E6FF"></path>
            <path
              d="M504.32 956.416c-2.56 0-5.632-1.024-7.68-3.072l-427.008-427.008c-4.096-4.096-4.096-11.264 0-15.36L496.64 83.456c4.096-4.096 11.264-4.096 15.36 0l427.008 427.008c4.096 4.096 4.096 11.264 0 15.36L512 953.344c-2.048 2.048-4.608 3.072-7.68 3.072z m-420.864-437.76l420.864 420.864 420.864-420.864L504.32 97.28l-420.864 421.376z"
              fill="#2E66FF"></path>
            <path
              d="M497.152 97.792l13.312 414.208 395.264-395.264c5.632-5.632 2.048-15.872-6.144-16.384L506.88 88.064c-5.632-0.512-9.728 4.096-9.728 9.728z"
              fill="#FFFFFF"></path>
            <path
              d="M503.296 529.92l-13.824-432.128c0-4.608 1.536-9.216 5.12-12.8s7.68-5.12 12.8-5.12l392.704 12.8c7.168 0 12.8 4.608 15.36 10.752 2.56 6.656 1.024 13.312-3.584 18.432l-408.576 408.064z m1.536-432.64l12.8 396.8 382.464-382.464c0.512-0.512 0.512-1.024 0.512-2.048-0.512-0.512-1.024-1.024-1.536-1.024l-392.704-12.8c-0.512 0-1.024 0.512-1.536 0.512v1.024z"
              fill="#2E66FF"></path>
            <path
              d="M522.24 946.688L508.416 532.48l-395.264 395.264c-5.632 5.632-2.048 15.872 6.144 16.384l392.704 12.8c5.632 0 10.24-4.608 10.24-10.24z"
              fill="#FFFFFF"></path>
            <path
              d="M512.512 964.096h-0.512l-392.704-12.8c-7.168 0-12.8-4.608-15.36-10.752-2.56-6.656-1.024-13.312 3.584-18.432l407.552-407.552 13.824 432.128c0 4.608-1.536 9.216-5.12 12.8-2.048 3.072-6.656 4.608-11.264 4.608z m-11.264-413.696l-382.464 382.464c-0.512 0.512-0.512 1.024-0.512 2.048 0.512 0.512 1.024 1.024 1.536 1.024l392.704 12.8c0.512 0 1.024-0.512 1.536-0.512 0 0 0.512-0.512 0.512-1.536l-13.312-396.288z"
              fill="#2E66FF"></path>
            <path
              d="M931.84 509.952l-414.208 13.312 395.264 395.264c5.632 5.632 15.872 2.048 16.384-6.144l12.8-392.704c0-5.632-4.608-10.24-10.24-9.728z"
              fill="#FFB5EC"></path>
            <path
              d="M919.552 929.28c-4.608 0-8.704-1.536-11.776-5.12l-407.552-407.552 432.128-13.824c4.608 0 9.216 1.536 12.8 5.12s5.12 8.192 5.12 12.8l-12.8 392.704c0 7.168-4.608 12.8-10.752 15.36-3.072 0-5.12 0.512-7.168 0.512z m-384-398.848l382.464 382.464c0.512 0.512 1.024 0.512 2.048 0.512 0.512-0.512 1.024-1.024 1.024-1.536l12.8-392.704c0-0.512-0.512-1.024-0.512-1.536 0 0-1.024-0.512-1.536-0.512l-396.288 13.312z"
              fill="#2E66FF"></path>
            <path
              d="M76.8 526.848l414.208-13.312-394.752-395.264c-5.632-5.632-15.872-2.048-16.384 6.144L67.072 517.12c0 5.632 4.096 10.24 9.728 9.728z"
              fill="#FFF152"></path>
            <path
              d="M76.8 534.528c-4.608 0-8.704-2.048-12.288-5.12-3.584-3.584-5.12-8.192-5.12-12.8l12.8-392.704c0-7.168 4.608-12.8 10.752-15.36 6.656-2.56 13.312-1.024 18.432 3.584l407.552 407.552-432.128 13.824v1.024z m12.8-411.136h-0.512c-0.512 0.512-1.024 1.024-1.024 1.536l-12.8 392.704c0 0.512 0.512 1.024 0.512 1.536 0 0 0.512 0.512 1.536 0.512L474.112 506.88 90.624 123.904c-0.512-0.512-1.024-0.512-1.024-0.512z"
              fill="#2E66FF"></path>
          </svg>
        </span>
        <div class="funny-head-text">
          <span class="funny-index">{{ index + 1 }}</span>
          <span class="funny-title">My Love - {{ item.classify }}</span>
        </div>
        <span class="funny-count">{{ item.count || (item.data && item.data.length) || 0 }} tracks</span>
      </div>
      <div class="process-wrap">
        <el-collapse class="funny-collapse" v-model="activeName" accordion @change="changeFunny(item.classify)">
          <el-collapse-item :title="'Taylor Swift'" :name="index">
            <div class="my-animation-slide-bottom funny-grid" v-if="!$common.isEmpty(item.data)">
              <div class="funny-card" :class="{ 'is-active': currentSource === funny.url }" v-for="(funny, i) in item.data" :key="i">
                <el-avatar class="funny-avatar myCenter" :size="110"
                           @click.native="playSound(funny, item.data, i, item.classify)"
                           :src="funny.cover">
                </el-avatar>
                <div class="funny-item-title" :title="funny.title">{{ funny.title }}</div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <hr>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    components: {},

    data() {
      return {
        pagination: {
          current: 1,
          size: 9999,
          order: "title",
          desc: false,
          resourceType: "funny",
          classify: ""
        },
        activeName: 0,
        funnys: [{
          classify: "",
          count: null,
          data: [{
            classify: "",
            cover: "",
            url: "",
            title: ""
          }]
        }],
        funny: {
          classify: "",
          title: "",
          cover: "",
          url: ""
        }
      }
    },

    computed: {
      currentSource() {
        return this.$store.state.musicPlayer.source;
      }
    },

    watch: {},

    created() {
      this.getFunny();
    },

    mounted() {},

    methods: {
      getFunny() {
        this.$http.get(this.$constant.baseURL + "/webInfo/listFunny")
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              this.funnys = res.data;
              this.changeFunny(this.funnys[0].classify);
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      listFunny() {
        this.$http.post(this.$constant.baseURL + "/webInfo/listResourcePath", this.pagination)
          .then((res) => {
            if (!this.$common.isEmpty(res.data) && !this.$common.isEmpty(res.data.records)) {
              this.funnys.forEach(funny => {
                if (funny.classify === this.pagination.classify) {
                  funny.data = res.data.records;
                  this.$forceUpdate();
                }
              });
            }
            this.pagination.classify = "";
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      changeFunny(classify) {
        this.funnys.forEach(funny => {
          if (funny.classify === classify && this.$common.isEmpty(funny.data)) {
            this.pagination.classify = classify;
            this.listFunny();
          }
        });
      },
      playSound(track, playList, index, classify) {
        if (this.$common.isEmpty(track) || this.$common.isEmpty(track.url)) {
          return;
        }
        const currentSource = this.$store.state.musicPlayer.source;
        if (currentSource === track.url) {
          this.$store.commit("musicToggle");
        } else {
          this.$store.commit("musicPlay", {
            track: track,
            playList: Array.isArray(playList) ? playList : [],
            index: index,
            classify: classify || ""
          });
        }
      }
    }
  }
</script>

<style scoped>

  .funny-wrap {
    border-radius: 24px;
    max-width: 1600px;
    padding: 22px 18px 36px;
    background:
      radial-gradient(circle at 90% 0%, rgba(255, 190, 140, 0.22), transparent 42%),
      radial-gradient(circle at 4% 100%, rgba(112, 206, 232, 0.22), transparent 44%),
      linear-gradient(145deg, rgba(255, 252, 246, 0.9), rgba(241, 250, 255, 0.95));
    border: 1px solid rgba(111, 134, 173, 0.16);
    box-shadow: 0 20px 40px rgba(18, 30, 58, 0.08);
  }

  .funny-group {
    margin-bottom: 28px;
  }

  .funny-head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border-radius: 14px;
    background: linear-gradient(150deg, rgba(255, 255, 255, 0.96), rgba(241, 247, 255, 0.9));
    border: 1px solid rgba(118, 138, 186, 0.2);
    box-shadow: 0 12px 24px rgba(19, 34, 69, 0.08);
  }

  .funny-head-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(140deg, rgba(234, 245, 255, 0.92), rgba(255, 234, 245, 0.7));
    border: 1px solid rgba(118, 141, 194, 0.24);
    box-shadow: 0 8px 16px rgba(29, 52, 101, 0.12);
  }

  .funny-head-text {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  .funny-index {
    min-width: 28px;
    height: 28px;
    border-radius: 9px;
    font-size: 14px;
    font-weight: 700;
    color: #264381;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, rgba(203, 229, 255, 0.8), rgba(255, 223, 198, 0.72));
  }

  .funny-title {
    color: #203b75;
    font-size: 24px;
    font-weight: 700;
    line-height: 1.2;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .funny-count {
    margin-left: auto;
    font-size: 12px;
    letter-spacing: 1px;
    text-transform: uppercase;
    border-radius: 999px;
    padding: 5px 12px;
    color: #2a4a86;
    border: 1px solid rgba(85, 116, 182, 0.24);
    background: rgba(242, 249, 255, 0.82);
  }

  .process-wrap {
    margin: 14px 0 0;
  }

  .process-wrap hr {
    position: relative;
    margin: 24px auto 42px;
    border: 1px dashed rgba(117, 142, 199, 0.45);
    overflow: visible;
  }

  .process-wrap hr:before {
    position: absolute;
    top: -5px;
    left: 8%;
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: linear-gradient(120deg, #ff9568, #5ac8df);
    box-shadow: 0 0 0 6px rgba(255, 149, 104, 0.1);
    transition: all 0.9s ease;
  }

  .process-wrap hr:hover:before {
    left: calc(92% - 10px);
  }

  .process-wrap >>> .el-collapse-item__header {
    border-bottom: unset;
    font-size: 20px;
    font-weight: 700;
    color: #2f508e;
    background: linear-gradient(155deg, rgba(255, 255, 255, 0.94), rgba(239, 247, 255, 0.94));
    border-radius: 14px;
    padding: 24px 26px;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
  }

  .process-wrap >>> .el-collapse-item__wrap {
    background: linear-gradient(165deg, rgba(253, 251, 247, 0.94), rgba(237, 248, 255, 0.94));
  }

  .process-wrap .el-collapse {
    border-top: unset;
    border-bottom: unset;
    border-radius: 14px;
    border: 1px solid rgba(114, 136, 183, 0.2);
    box-shadow: 0 12px 24px rgba(20, 35, 66, 0.08);
    overflow: hidden;
  }

  .process-wrap >>> .el-collapse-item__wrap {
    border-bottom: unset;
  }

  .funny-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 18px;
    padding: 22px;
  }

  .funny-card {
    width: 150px;
    border-radius: 18px;
    padding: 16px 10px 12px;
    transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
    border: 1px solid rgba(123, 143, 191, 0.16);
    background: linear-gradient(155deg, rgba(255, 255, 255, 0.96), rgba(243, 250, 255, 0.9));
    box-shadow: 0 10px 18px rgba(27, 44, 85, 0.08);
  }

  .funny-card.is-active {
    border-color: rgba(58, 132, 235, 0.62);
    box-shadow: 0 18px 30px rgba(26, 74, 150, 0.22);
    background: linear-gradient(155deg, rgba(255, 255, 255, 1), rgba(230, 245, 255, 0.95));
  }

  .funny-card:hover {
    transform: translateY(-8px);
    border-color: rgba(86, 123, 212, 0.36);
    box-shadow: 0 18px 30px rgba(28, 46, 89, 0.2);
  }

  .funny-item-title {
    text-align: center;
    margin: 10px 4px 0;
    font-size: 16px;
    font-weight: 700;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .funny-item-title:hover {
    text-overflow: unset;
    overflow: unset;
  }

  .funny-avatar {
    cursor: pointer;
    transition: transform 0.45s ease, box-shadow 0.45s ease;
    user-select: none;
    margin: 0 auto;
    display: block;
    box-shadow: 0 10px 20px rgba(33, 52, 101, 0.18);
    border: 3px solid rgba(255, 255, 255, 0.85);
  }

  .funny-avatar:hover {
    transform: perspective(800px) rotateY(18deg) translateY(-4px);
    box-shadow: 0 14px 24px rgba(32, 53, 99, 0.28);
  }

  @media screen and (max-width: 760px) {
    .funny-wrap {
      padding: 16px 10px 24px;
    }

    .funny-head {
      flex-wrap: wrap;
      row-gap: 8px;
    }

    .funny-title {
      font-size: 20px;
    }

    .funny-count {
      margin-left: 0;
    }

    .funny-grid {
      justify-content: center;
      padding: 16px;
    }

  }

</style>
