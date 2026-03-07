/**
 * 前端安全卫士 - 自动识别环境版
 */
if (process.env.NODE_ENV === 'production') {
  (function() {
    // 1. 屏蔽常用调试快捷键
    document.onkeydown = function(e) {
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || // Ctrl+Shift+I/J
        (e.ctrlKey && e.keyCode === 85) || // Ctrl+U
        (e.ctrlKey && e.keyCode === 83)    // Ctrl+S
      ) {
        return false;
      }
    };

    // 2. 屏蔽右键菜单
    document.addEventListener('contextmenu', e => e.preventDefault());

    // 3. 性能监测：利用 debugger 阻断检测
    const checkDebugger = function() {
      const startTime = performance.now();
      // 利用构造函数生成的 debugger 无法被常规混淆工具轻易移除
      (function() {}.constructor('debugger')());
      const endTime = performance.now();
      if (endTime - startTime > 100) {
        window.location.replace("about:blank");
      }
    };

    // 4. 隐蔽检测：利用 Console 对象渲染特性
    const devtoolsDetector = function() {};
    devtoolsDetector.toString = function() {
      window.location.replace("about:blank");
      return '';
    };

    // 启动循环监听
    setInterval(() => {
      checkDebugger();
      console.log('%c', devtoolsDetector);
      console.clear();
    }, 1000);

    // 5. 额外防御：检测窗口宽高差（当控制台侧边打开时有效）
    const threshold = 160;
    setInterval(() => {
      if (window.outerWidth - window.innerWidth > threshold ||
          window.outerHeight - window.innerHeight > threshold) {
        window.location.replace("about:blank");
      }
    }, 1e3);

  })();
} else {
  // 开发环境下只给个友好的提醒
  console.log("%c[Security] %c防御脚本已就绪，当前为开发模式，已自动跳过限制。", "color:red;font-weight:bold;", "color:green;");
}
