(() => {
  const baiduTongjiId = String(window.XUNMAI_ANALYTICS?.baiduTongjiId || "").trim();
  if (!baiduTongjiId) return;

  window._hmt = window._hmt || [];

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://hm.baidu.com/hm.js?${encodeURIComponent(baiduTongjiId)}`;
  const firstScript = document.getElementsByTagName("script")[0];
  firstScript.parentNode.insertBefore(script, firstScript);
})();
