(() => {
  const links = [...document.querySelectorAll("[data-product-link]")];
  const countNodes = [...document.querySelectorAll("[data-local-click-count]")];
  const storageKey = "xunmai.productLinkClicks.v1";
  const campaign = "sxx_2026_hechuan_ich_agri";

  const readEvents = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch {
      return [];
    }
  };

  const writeEvents = (events) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(events.slice(-200)));
    } catch {
      // Storage can be unavailable in strict privacy modes; analytics hooks still run.
    }
  };

  const updateLocalCount = () => {
    const count = readEvents().length;
    countNodes.forEach((node) => {
      node.textContent = String(count);
    });
  };

  const withTrackingParams = (rawUrl, productId) => {
    const url = new URL(rawUrl, window.location.href);
    url.searchParams.set("utm_source", "xunmai_hechuan_h5");
    url.searchParams.set("utm_medium", "product_link");
    url.searchParams.set("utm_campaign", campaign);
    url.searchParams.set("utm_content", productId);
    return url.toString();
  };

  const emitAnalytics = (detail) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "purchase_link_click", ...detail });

    if (typeof window.gtag === "function") {
      window.gtag("event", "purchase_link_click", detail);
    }

    if (Array.isArray(window._hmt)) {
      window._hmt.push(["_trackEvent", "purchase_link", detail.action, detail.product_name]);
    }
  };

  const recordClick = (detail) => {
    const event = {
      ...detail,
      page_path: window.location.pathname,
      page_hash: window.location.hash,
      timestamp: new Date().toISOString(),
    };
    writeEvents([...readEvents(), event]);
    emitAnalytics(event);
    updateLocalCount();
  };

  links.forEach((link) => {
    const rawUrl = (link.dataset.purchaseUrl || "").trim();
    const productId = link.dataset.productId || "unknown-product";
    const productName = link.dataset.productName || productId;

    if (rawUrl) {
      link.href = withTrackingParams(rawUrl, productId);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else {
      link.classList.add("is-disabled");
      link.dataset.linkReady = "false";
      link.setAttribute("title", "待接入当地农户、合作社或商家真实销售链接");
    }

    link.addEventListener("click", (event) => {
      const enabled = Boolean(rawUrl);
      recordClick({
        action: enabled ? "outbound_click" : "link_request",
        product_id: productId,
        product_name: productName,
        link_ready: enabled,
        outbound_url: enabled ? link.href : "",
      });

      if (!enabled) {
        event.preventDefault();
        link.dataset.clicked = "true";
        link.textContent = "链接待接入，已记录意向";
        document.getElementById("tracking-note")?.focus({ preventScroll: true });
      }
    });
  });

  updateLocalCount();
})();
