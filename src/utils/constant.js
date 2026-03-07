// 自动判断环境（开发和测试共用一套）
const isDevOrTest = ['localhost', '127.0.0.1', '119.xxxxxx.175'].includes(location.hostname) || location.hostname.includes('test')

const envConfig = isDevOrTest ? {
  webURL: "https://czpv.top/",
  baseURL: "http://42.xxxxxx.52:8081",
  //imBaseURL: "http://localhost:81/im",
} : {
  webURL: location.protocol + "//" + location.hostname,
  baseURL: location.protocol + "//" + location.hostname + "/interface",
  //imBaseURL: location.protocol + "//" + location.hostname + "/im",
}

export default {
  ...envConfig,

  host: location.hostname + (location.port ? ':' + location.port : ''),

  //live2d_path: "https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/",
  //cdnPath: "https://cdn.jsdelivr.net/gh/fghrsh/live2d_api/",
  waifuPath: "/webInfo/getWaifuJson",
  hitokoto: "https://v1.hitokoto.cn",
  shehui: "https://api.oick.cn/yulu/api.php",
  tocbot: "https://cdnjs.cloudflare.com/ajax/libs/tocbot/4.18.2/tocbot.min.js",
  jinrishici: "https://v1.jinrishici.com/all.json",
  //前后端定义的密钥，AES使用16位
  cryptojs_key: "czpczpczpczp",
/* 色彩采用PANTONE,NCS,RAL劳尔及潘通国际标准色号 */
  before_color_list: ["black", "rgb(126, 143, 187)", " #EF794F", "rgb(187, 38, 73)", "rgb(74, 98, 103)", "rgb(177, 204, 197)"],

  tree_hole_color: ["rgb(180, 224, 255)", "rgb(180, 203, 255)", "rgb(238, 186, 188)", "rgb(255, 214, 198)", "rgb(255, 205, 143)", "rgb(238, 255, 143)", "rgb(220, 255, 165)", "rgb(164, 234, 192)", "rgb(202, 241, 233)", "rgb(230, 230, 250)"],

  before_color_1: "black",
  after_color_1: "linear-gradient(45deg, #f43f3b , rgb(187, 38, 73))",

  before_color_2: "rgb(126, 143, 187)",
  after_color_2: "linear-gradient(45deg, #f43f3b, rgb(238, 186, 188))",

  sortColor: ["linear-gradient(to right, #F0EEE9, #F5E7D8)",
    "linear-gradient(to right, rgb(222, 232, 190), #AEC9C9)",
    "linear-gradient(to right,  #EF794F, #F5DF4D)",
    "linear-gradient(120deg, rgb(238, 186, 188) 0%, rgba(255, 128, 0, 1) 100%)",
    "linear-gradient(120deg,  rgb(100, 57, 65) 0%,  rgb(74, 98, 103) 100%)"
  ],

  pageColor: " #EF794F",
  commentPageColor: "rgb(74, 98, 103)",
  userId: 1,
  source: 0,
    /* 色彩采用PANTONE,NCS,RAL劳尔及潘通国际标准色号*/

  emojiList: ['花痴', '羞涩微笑', '好吃', '微笑天使', '好崇拜哦', '嘿嘿', '困', '翻白眼', '大笑','墨镜笑脸', '滑稽', '羞涩亲亲', '头昏眼花', '放声大哭', '恳求的脸', '小丑', '小鸡破壳', '出拳', '带单片眼镜的脸', '发财', '想一想', '打喷嚏', '牛仔帽脸', '吓死了', '嘘', '涨涨涨', '青蛙', '18禁', '马头', '摇滚']
}
