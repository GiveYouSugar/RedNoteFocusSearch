// ==UserScript==
// @name         小红书专注搜索
// @namespace    https://github.com/GiveYouSugar/RedNoteFocusSearch
// @version      1.0
// @description  小红书网页版首页仅保留搜索框并美化，适配移动端
// @author       Shan
// @license      MIT
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @include      https://www.xiaohongshu.com/*
// ==/UserScript==

(function() {
  const css = `
    /* 核心隐藏 */
    #mfContainer { display: none !important; }
    .mask-paper { background: none !important; backdrop-filter: none !important; min-height: 100vh; }
    /* 隐藏创作中心/业务合作按钮 */
    .dropdown-nav { display: none !important; }

    /* Logo样式：居中置于搜索框上方 */
    #link-guide {
      position: fixed !important;
      top: calc(35vh - 80px) !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      z-index: 9997 !important;
      width: auto !important;
      height: auto !important;
      pointer-events: auto !important;
    }

    #link-guide .header-logo {
      width: 120px !important;
      height: auto !important;
    }

    /* 侧边栏：移至屏幕外 */
    .side-bar {
      position: fixed !important;
      top: 0 !important;
      left: -9999px !important;
      width: 1px !important;
      height: 1px !important;
      opacity: 0 !important;
      z-index: -1000 !important;
      pointer-events: none !important;
      overflow: hidden !important;
    }

    /* 自定义顶部导航栏：右上角*/
    #custom-top-nav {
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      z-index: 9999 !important;
      display: flex !important;
      align-items: center !important;
      gap: 20px !important;
      background: transparent !important;
      padding: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
    }

    /* 顶部导航按钮样式 */
    #custom-top-nav .nav-item {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 6px !important;
      color: rgba(51, 51, 51, 0.8) !important;
      text-decoration: none !important;
      font-size: 14px !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
      font-weight: 400 !important;
      line-height: 1.4 !important;
      padding: 10px 12px !important;
      height: 40px !important;
      border-radius: 100px !important;
      background: rgba(0, 0, 0, 0) !important;
      border: 0px none rgba(51, 51, 51, 0.8) !important;
      transition: all 0.2s ease !important;
      cursor: pointer !important;
      box-sizing: border-box !important;
    }

    /* 统一按钮内文字样式 */
    #custom-top-nav .nav-item .channel,
    #custom-top-nav .nav-item .text {
      font-size: 14px !important;
      color: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }

    /* 统一图标大小 */
    #custom-top-nav .nav-item svg {
      width: 18px !important;
      height: 18px !important;
      fill: currentColor !important;
      flex-shrink: 0 !important;
    }

    /* 按钮hover效果 */
    #custom-top-nav .nav-item:hover {
      background: rgba(0, 0, 0, 0.03) !important;
      color: rgb(51, 51, 51) !important;
      border-radius: 999px !important;
    }

    /* 激活状态 */
    #custom-top-nav .nav-item.active {
      background: transparent !important;
      color: #fe2c55 !important;
    }

    /* 头像样式：强制显示容器 */
    #custom-top-nav .nav-item .reds-avatar {
      width: 22px !important;
      height: 22px !important;
      border-radius: 50% !important;
      margin-right: 4px !important;
      flex-shrink: 0 !important;
      display: block !important;
      opacity: 1 !important;
    }

    /* 禁用懒加载相关样式 */
    #custom-top-nav .reds-img {
      opacity: 1 !important;
      display: block !important;
      visibility: visible !important;
      transition: none !important;
    }

    /* 搜索框容器：居中布局 */
    .input-box {
      position: fixed !important;
      top: 35vh !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      width: 720px !important;
      height: 64px !important;
      background: #fff !important;
      border: 1px solid rgba(0,0,0,0.08) !important;
      border-radius: 32px !important;
      box-shadow: 0 8px 30px rgba(0,0,0,0.08) !important;
      padding: 0 20px !important;
      box-sizing: border-box !important;
      z-index: 9998 !important;
      pointer-events: auto !important;
    }

    .input-box:hover, .input-box:focus-within {
      box-shadow: 0 12px 40px rgba(0,0,0,0.12) !important;
    }

    /* 输入框内部美化 */
    .input-box input, #search-input {
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      height: 100% !important;
      font-size: 20px !important;
      color: #333 !important;
      line-height: 64px !important;
      padding: 0 10px !important;
    }
    .input-box input:focus { outline: none !important; }
    .input-button { transform: scale(1.2); margin-right: 5px; background: transparent !important; }
    .input-box .prefix-icon, .input-box .suffix-icon { background: transparent !important; }

    /* 推荐词下拉框：同步居中 */
    .search-suggestion,
    div[class*="suggestion"] {
      position: fixed !important;
      top: calc(35vh + 76px) !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      width: 720px !important;
      margin-top: 0 !important;
      background: #fff !important;
      border-radius: 24px !important;
      box-shadow: 0 16px 40px rgba(0,0,0,0.1) !important;
      border: 1px solid rgba(0,0,0,0.05) !important;
      z-index: 9996 !important;
    }

    /* 移动端适配 */
    @media screen and (max-width: 768px) {
      /* 隐藏右上角自定义导航栏 */
      #custom-top-nav {
        display: none !important;
      }

      /* 移除搜索按钮和菜单按钮 */
      button.reds-button-new.min-width-search-icon.large.primary.has-icon.pure-icon.min-width-search-icon {
        display: none !important;
      }
      div.menu-icon-btn {
        display: none !important;
      }
      div.menu-icon-btn > button.reds-button-new.large.primary.has-icon.pure-icon {
        display: none !important;
      }

      #link-guide {
        top: calc(30vh - 60px) !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        z-index: 9997 !important;
      }

      #link-guide .header-logo {
        width: 100px !important;
      }

      #custom-top-nav .nav-item {
        font-size: 12px !important;
        padding: 8px 10px !important;
        height: 36px !important;
        gap: 4px !important;
        border-radius: 100px !important;
      }

      #custom-top-nav .nav-item:hover {
        border-radius: 999px !important;
      }

      #custom-top-nav .nav-item span:not(.reds-avatar) {
        display: none !important;
      }

      .input-box {
        width: 90% !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        height: 50px !important;
        top: 30vh !important;
        z-index: 9998 !important;
      }
      #search-input { font-size: 16px !important; line-height: 50px !important; }

      .search-suggestion,
      div[class*="suggestion"] {
        width: 90% !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        top: calc(30vh + 60px) !important;
        z-index: 9996 !important;
      }
    }
  `;

  // 同步头像
  function syncAvatar(originalLink, newImgElement) {
    if (!originalLink || !newImgElement) return;

    let attempts = 0;
    const maxAttempts = 100; // 覆盖慢加载场景

    const intervalId = setInterval(() => {
      attempts++;
      const originalImg = originalLink.querySelector('.reds-img');
      if (!originalImg) return;


      const realSrc = originalImg.src ||
                      originalImg.dataset.src ||
                      originalImg.dataset.url ||
                      originalImg.getAttribute('data-srcset');


      if (realSrc && realSrc.startsWith('http')) {
        newImgElement.src = realSrc;
        newImgElement.removeAttribute('loading');
        newImgElement.removeAttribute('data-src');
        newImgElement.removeAttribute('data-url');
        newImgElement.removeAttribute('data-srcset');
        newImgElement.loading = 'eager'; // 主动触发加载

        if (newImgElement.complete) {
          clearInterval(intervalId);
        }
      }


      if (attempts >= maxAttempts) {
        clearInterval(intervalId);
      }
    }, 500);
  }

  // 创建自定义导航栏
  function createCustomNav() {
    const checkSidebar = setInterval(() => {
      const channelList = document.querySelector('.channel-list-content');
      const myButton = channelList?.querySelector('a:has(.reds-avatar)');


      if (channelList && myButton) {
        clearInterval(checkSidebar);


        if(document.getElementById('custom-top-nav')) return;

        const navContainer = document.createElement('div');
        navContainer.id = 'custom-top-nav';
        document.body.appendChild(navContainer);

        const navItems = channelList.querySelectorAll('li, .bottom-channel');

        navItems.forEach(item => {
          if (!item || item.innerHTML.trim() === '') return;
          const link = item.querySelector('a');
          if (!link) return;

          const buttonText = link.textContent.trim();


          if (buttonText === '发现' || (buttonText === '我' && !link.querySelector('.reds-avatar'))) {
            return;
          }

          const navItem = document.createElement('a');
          navItem.className = 'nav-item';
          navItem.href = link.href;
          navItem.target = link.target || '_self';
          navItem.innerHTML = link.innerHTML;


          if (buttonText === '我') {
            const newAvatarImg = navItem.querySelector('.reds-img');
            if (newAvatarImg) {
              newAvatarImg.loading = 'eager';
              syncAvatar(link, newAvatarImg);
            }
          }


          if (link.classList.contains('active') || item.classList.contains('active-channel')) {
            navItem.classList.add('active');
          }
          navContainer.appendChild(navItem);
        });
      }
    }, 300);
  }

  let styleNode = null;

  function addStyle() {
    if (styleNode) return;
    styleNode = document.createElement("style");
    styleNode.textContent = css;
    (document.head || document.documentElement).appendChild(styleNode);
    createCustomNav();
  }


  function removeStyle() {
    if (styleNode) styleNode.remove();
    styleNode = null;
    const navContainer = document.getElementById('custom-top-nav');
    if (navContainer) navContainer.remove();
  }

  // 仅在explore生效
  function checkURL() {
    const path = location.pathname;
    if ((path === "/explore" || path === "/") && !path.endsWith("/")) {
      addStyle();
    } else {
      removeStyle();
    }
  }

  const _wr = function(type) {
    const orig = history[type];
    return function() {
      const rv = orig.apply(this, arguments);
      unsafeWindow.dispatchEvent(new Event("urlchange"));
      return rv;
    };
  };
  history.pushState = _wr("pushState");
  history.replaceState = _wr("replaceState");
  unsafeWindow.addEventListener("popstate", () => unsafeWindow.dispatchEvent(new Event("urlchange")));
  unsafeWindow.addEventListener("urlchange", checkURL);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkURL);
  } else {
    checkURL();
  }
  setTimeout(checkURL, 1000);
})();