let titleTime, OriginTitile = document.title;
document.addEventListener("visibilitychange", (function () {
  document.hidden ? (document.title = "好快的切屏~", clearTimeout(titleTime)) : (document.title = "归！", titleTime = setTimeout((function () {
    document.title = OriginTitile
  }), 2e3))
}));
