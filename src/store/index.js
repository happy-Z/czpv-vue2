import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    toolbar: JSON.parse(localStorage.getItem("toolbar") || '{"visible": false, "enter": true}'),
    sortInfo: JSON.parse(localStorage.getItem("sortInfo") || '[]'),
    currentUser: JSON.parse(localStorage.getItem("currentUser") || '{}'),
    currentAdmin: JSON.parse(localStorage.getItem("currentAdmin") || '{}'),
    sysConfig: JSON.parse(localStorage.getItem("sysConfig") || '{}'),
    webInfo: JSON.parse(localStorage.getItem("webInfo") || '{"webName": "", "webTitle": [], "notices": [], "randomCover": [], "footer": "", "backgroundImage": "", "avatar": ""}'),
    musicPlayer: {
      playList: [],
      index: -1,
      currentClassify: "",
      currentTrack: {
        classify: "",
        title: "",
        cover: "",
        url: ""
      },
      source: "",
      volume: Number(localStorage.getItem("musicVolume") || 80),
      commandId: 0,
      commandType: "",
      commandPayload: null
    }
  },
  getters: {
    articleTotal: state => {
      if (state.sortInfo !== null && state.sortInfo.length !== 0) {
        if (state.sortInfo.length === 1) {
          return state.sortInfo[0].countOfSort;
        } else {
          return state.sortInfo.reduce((prev, curr) => {
            if (typeof prev === "number") {
              return prev + curr.countOfSort;
            } else {
              return prev.countOfSort + curr.countOfSort;
            }
          });
        }
      } else {
        return 0;
      }
    },
    navigationBar: state => {
      if (state.sortInfo !== null && state.sortInfo.length !== 0) {
        return state.sortInfo.filter(f => f.sortType === 0);
      } else {
        return [];
      }
    }
  },
  mutations: {
    changeToolbarStatus(state, toolbarState) {
      state.toolbar = toolbarState;
      localStorage.setItem("toolbar", JSON.stringify(toolbarState));
    },
    loadSortInfo(state, sortInfo) {
      if (sortInfo !== null && sortInfo.length !== 0) {
        state.sortInfo = sortInfo.sort((s1, s2) => s1.priority - s2.priority);
        localStorage.setItem("sortInfo", JSON.stringify(sortInfo.sort((s1, s2) => s1.priority - s2.priority)));
      }
    },
    loadCurrentUser(state, user) {
      state.currentUser = user;
      localStorage.setItem("currentUser", JSON.stringify(user));
    },
    loadSysConfig(state, sysConfig) {
      state.sysConfig = sysConfig;
      localStorage.setItem("sysConfig", JSON.stringify(sysConfig));
    },
    loadCurrentAdmin(state, user) {
      state.currentAdmin = user;
      localStorage.setItem("currentAdmin", JSON.stringify(user));
    },
    loadWebInfo(state, webInfo) {
      webInfo.webTitle = webInfo.webTitle.split('');
      webInfo.notices = JSON.parse(webInfo.notices);
      webInfo.randomCover = JSON.parse(webInfo.randomCover);
      state.webInfo = webInfo;
      localStorage.setItem("webInfo", JSON.stringify(webInfo));
    },
    musicPlay(state, payload) {
      const list = Array.isArray(payload.playList) ? payload.playList : [];
      state.musicPlayer.playList = list;
      state.musicPlayer.index = typeof payload.index === "number" ? payload.index : -1;
      state.musicPlayer.currentClassify = payload.classify || "";
      state.musicPlayer.currentTrack = Object.assign({
        classify: "",
        title: "",
        cover: "",
        url: ""
      }, payload.track || {});
      state.musicPlayer.source = state.musicPlayer.currentTrack.url || "";
      state.musicPlayer.commandId += 1;
      state.musicPlayer.commandType = "play";
      state.musicPlayer.commandPayload = {url: state.musicPlayer.source};
    },
    musicToggle(state) {
      state.musicPlayer.commandId += 1;
      state.musicPlayer.commandType = "toggle";
      state.musicPlayer.commandPayload = null;
    },
    musicPause(state) {
      state.musicPlayer.commandId += 1;
      state.musicPlayer.commandType = "pause";
      state.musicPlayer.commandPayload = null;
    },
    musicSetTrack(state, payload) {
      if (Array.isArray(payload.playList)) {
        state.musicPlayer.playList = payload.playList;
      }
      if (typeof payload.index === "number") {
        state.musicPlayer.index = payload.index;
      }
      if (payload.classify !== undefined) {
        state.musicPlayer.currentClassify = payload.classify || "";
      }
      if (payload.track) {
        state.musicPlayer.currentTrack = Object.assign({
          classify: "",
          title: "",
          cover: "",
          url: ""
        }, payload.track);
        state.musicPlayer.source = state.musicPlayer.currentTrack.url || "";
      }
    },
    musicSetVolume(state, volume) {
      let val = Number(volume);
      if (!Number.isFinite(val)) {
        val = 80;
      }
      if (val < 0) {
        val = 0;
      }
      if (val > 100) {
        val = 100;
      }
      state.musicPlayer.volume = val;
      localStorage.setItem("musicVolume", String(val));
    }
  },
  actions: {},
  modules: {},
  plugins: []
})
