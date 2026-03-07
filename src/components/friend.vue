<template>
  <div>
    <div class="friend-wrap">
      <div class="friend-main">
        <!-- 添加友链 -->
        <div @click="clickLetter()" class="form-wrap">
          <!-- 信封上面 -->
          <img class="before-img" :src="$store.state.sysConfig['webStaticResourcePrefix'] + 'assets/friendLetterTop.png'" style="width: 100%"/>
          <!-- 信 -->
          <div class="envelope" style="animation: hideToShow 2s">
            <div class="form-main">
              <img :src="$store.state.sysConfig['webStaticResourcePrefix'] + 'assets/friendLetterMiddle.jpg'" style="width: 100%"/>
              <div>
                <h3 style="text-align: center">有朋自远方来</h3>
                <div>
                  <div class="myCenter form-friend">
                    <div class="user-title">
                      <div>名称：</div>
                      <div>简介：</div>
                      <div>封面：</div>
                      <div>网址：</div>
                    </div>
                    <div class="user-content">
                      <div>
                        <el-input maxlength="30" v-model="friend.title"></el-input>
                      </div>
                      <div>
                        <el-input maxlength="120" v-model="friend.introduction"></el-input>
                      </div>
                      <div>
                        <el-input maxlength="200" v-model="friend.cover"></el-input>
                      </div>
                      <div>
                        <el-input maxlength="200" v-model="friend.url"></el-input>
                      </div>
                    </div>
                  </div>
                  <div class="myCenter" style="margin-top: 20px">
                    <proButton :info="'提交'"
                               @click.native.stop="submitFriend()"
                               :before="$constant.before_color_2"
                               :after="$constant.after_color_2">
                    </proButton>
                  </div>
                </div>
                <div>
                  <img :src="$store.state.sysConfig['webStaticResourcePrefix'] + 'assets/friendLetterBiLi.png'" style="width: 100%;margin: 5px auto"/>
                </div>
                <p style="font-size: 12px;text-align: center;color: #999">欢迎交换友链</p>
              </div>
            </div>
          </div>
          <img class="after-img" :src="$store.state.sysConfig['webStaticResourcePrefix'] + 'assets/friendLetterBottom.png'" style="width: 100%"/>
        </div>

        <div style="font-size: 20px;font-weight: bold;margin-top: 40px">❤️本站信息</div>
        <div>
          <blockquote>
            <div>网站名称: {{$store.state.sysConfig['friendWebName']}}</div>
            <div>网址: {{$store.state.sysConfig['friendUrl']}}</div>
            <div>头像: {{$store.state.sysConfig['friendAvatar']}}</div>
            <div>描述: {{$store.state.sysConfig['friendIntroduction']}}</div>
            <div>网站封面: {{$store.state.sysConfig['friendCover']}}</div>
          </blockquote>
        </div>
        <div style="font-size: 20px;font-weight: bold">👀申请方式</div>
        <div>
          <blockquote>
            <div>点击上方信封✉️</div>
            <div>注意:不会添加带有广告营销和没有实质性内容的友链🚫🚫🚫</div>
            <div>申请之前请将本网站添加为您的友链哦🎟️🎟️🎟️</div>
          </blockquote>
        </div>

        <template v-if="friendList.hasOwnProperty('❤Me')">
          <hr>

          <h2 style="margin-top: 60px">❤Me</h2>
          <card :resourcePathList="friendList['❤Me']" @clickResourcePath="clickFriend"></card>
        </template>

        <template v-if="friendList.hasOwnProperty('🥇友接')">
          <hr>

          <h2 style="margin-top: 60px">🥇友接</h2>
          <card :resourcePathList="friendList['🥇友接']" @clickResourcePath="clickFriend"></card>
        </template>

        <template v-for="(value, key, index) in friendList">
          <template v-if="key !== '❤Me' && key !== '🥇友接'">
            <hr :key="index">

            <h2 style="margin-top: 60px" :key="index">{{ key }}</h2>
            <card :resourcePathList="value" @clickResourcePath="clickFriend" :key="index"></card>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  const card = () => import( "./common/card");
  const proButton = () => import( "./common/proButton");

  export default {
    components: {
      card,
      proButton
    },

    data() {
      return {
        friendList: {},
        friend: {
          title: "",
          introduction: "",
          cover: "",
          url: ""
        }
      }
    },

    computed: {},

    watch: {},

    created() {
      this.getFriends();
    },

    mounted() {

    },

    methods: {
      clickLetter() {
        if (document.body.clientWidth < 700) {
          $(".form-wrap").css({"height": "1000px", "top": "-200px"});
        } else {
          $(".form-wrap").css({"height": "1150px", "top": "-200px"});
        }
      },
      submitFriend() {
        if (this.$common.isEmpty(this.$store.state.currentUser)) {
          this.$message({
            message: "请先登录！",
            type: "error"
          });
          return;
        }

        if (this.friend.title.trim() === "") {
          this.$message({
            message: "你还没写名称呢~",
            type: "warning"
          });
          return;
        }

        if (this.friend.introduction.trim() === "") {
          this.$message({
            message: "你还没写简介呢~",
            type: "warning"
          });
          return;
        }

        if (this.friend.cover.trim() === "") {
          this.$message({
            message: "你还没设置封面呢~",
            type: "warning"
          });
          return;
        }

        if (this.friend.url.trim() === "") {
          this.$message({
            message: "你还没写网址呢~",
            type: "warning"
          });
          return;
        }

        this.$http.post(this.$constant.baseURL + "/webInfo/saveFriend", this.friend)
          .then((res) => {
            $(".form-wrap").css({"height": "447px", "top": "0"});
            this.$message({
              type: 'success',
              message: '提交成功，待管理员审核！'
            });
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      clickFriend(path) {
        window.open(path);
      },
      getFriends() {
        this.$http.get(this.$constant.baseURL + "/webInfo/listFriend")
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              this.friendList = res.data;
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      }
    }
  }
</script>

<style scoped>

  .friend-main {
    max-width: 1200px;
    margin: 40px auto;
    border-radius: 24px;
    padding: 40px;
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(circle at 100% 0%, rgba(255, 188, 144, 0.22), transparent 40%),
      radial-gradient(circle at 0% 100%, rgba(111, 205, 232, 0.2), transparent 42%),
      linear-gradient(150deg, rgba(255, 255, 255, 0.94), rgba(241, 249, 255, 0.92));
    border: 1px solid rgba(126, 146, 190, 0.18);
    box-shadow: 0 20px 40px rgba(21, 33, 63, 0.1);
  }

  .friend-main:before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(120deg, rgba(255, 255, 255, 0.18), transparent 55%);
  }

  .friend-main h2 {
    font-size: 24px;
    color: #274780;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .friend-main h2:before {
    content: "";
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: linear-gradient(120deg, #ff8f60, #4dc6de);
    box-shadow: 0 0 0 4px rgba(255, 143, 96, 0.12);
  }

  hr {
    position: relative;
    margin: 40px auto;
    border: 1px dashed rgba(116, 138, 191, 0.45);
    overflow: visible;
  }

  hr:before {
    position: absolute;
    top: -4px;
    left: 8%;
    color: transparent;
    content: '❄';
    font-size: 0;
    line-height: 0;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: linear-gradient(120deg, #ff8f60, #4dc6de);
    box-shadow: 0 0 0 6px rgba(255, 143, 96, 0.11);
    transition: all 0.9s ease;
  }

  hr:hover:before {
    left: calc(92% - 10px);
  }

  .form-wrap {
    margin: 0 auto;
    overflow: hidden;
    width: 530px;
    height: 447px;
    position: relative;
    top: 0;
    transition: all 1s ease-in-out .3s;
    z-index: 0;
    cursor: pointer;
    border-radius: 20px;
    box-shadow:
      0 20px 35px rgba(34, 42, 74, 0.16),
      0 8px 18px rgba(31, 54, 102, 0.1);
    transform-style: preserve-3d;
  }


  .before-img {
    position: absolute;
    bottom: 126px;
    left: 0;
    background-repeat: no-repeat;
    width: 530px;
    height: 317px;
    z-index: -100;
    filter: drop-shadow(0 6px 12px rgba(29, 44, 83, 0.2));
  }

  .after-img {
    position: absolute;
    bottom: -2px;
    left: 0;
    background-repeat: no-repeat;
    width: 530px;
    height: 259px;
    z-index: 100;
    filter: drop-shadow(0 -2px 6px rgba(39, 53, 89, 0.28));
  }

  .friend-wrap {
    color: var(--black);
  }

  .envelope {
    position: relative;
    margin: 0 auto;
    transition: all 1s ease-in-out .3s;
    padding: 200px 20px 20px;
    transform: translateZ(10px);
  }

  .form-main {
    background: var(--white);
    margin: 0 auto;
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid rgba(119, 141, 189, 0.2);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
  }


  .user-title {
    text-align: right;
    user-select: none;
  }

  .user-content {
    text-align: left;
  }

  .user-title div {
    height: 55px;
    line-height: 55px;
    text-align: center;
  }

  .user-content > div {
    height: 55px;
    display: flex;
    align-items: center;
  }

  .user-content >>> .el-input__inner {
    border: none;
    height: 35px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(235, 245, 255, 0.72));
    border: 1px solid rgba(114, 138, 194, 0.2);
  }

  .form-friend {
    margin-top: 12px;
    background: linear-gradient(155deg, #f8fbff, #f0f6ff);
    border: 1px solid rgba(123, 143, 191, 0.2);
    border-radius: 12px;
    padding: 20px 0;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85);
  }

  blockquote {
    line-height: 2;
    border-left: 4px solid transparent;
    border-image: linear-gradient(to bottom, #ff8e66, #49c6dd) 1;
    padding: 10px 1rem;
    background: linear-gradient(140deg, rgba(255, 243, 236, 0.92), rgba(236, 248, 255, 0.9));
    border-radius: 10px;
    border: 1px solid rgba(122, 143, 191, 0.14);
    margin: 20px auto;
    color: #39507f;
    box-shadow: 0 10px 18px rgba(31, 47, 85, 0.08);
  }

  .friend-wrap >>> .card {
    border-radius: 16px;
    transition: transform 0.35s ease, box-shadow 0.35s ease;
  }

  .friend-wrap >>> .card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 28px rgba(37, 59, 106, 0.18);
  }

  @media screen and (max-width: 700px) {
    .form-wrap {
      width: auto;
      border-radius: 14px;
    }

    .before-img {
      width: auto;
    }

    .after-img {
      width: auto;
    }
  }

  @media screen and (max-width: 500px) {
    .friend-main {
      padding: 40px 15px;
      border-radius: 16px;
    }

    .friend-main h2 {
      font-size: 20px;
    }
  }
</style>
