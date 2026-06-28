(() => {
  const links = [...document.querySelectorAll("[data-product-link]")];
  const countNodes = [...document.querySelectorAll("[data-local-click-count]")];
  const viewNodes = [...document.querySelectorAll("[data-local-product-view-count]")];
  const rateNodes = [...document.querySelectorAll("[data-local-click-rate]")];
  const productSection = document.getElementById("product");
  const storageKey = "xunmai.productLinkClicks.v1";
  const campaign = "sxx_2026_hechuan_ich_agri";
  let productViewRecorded = false;

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

  const updateLocalStats = () => {
    const events = readEvents();
    const clicks = events.filter((event) => event.event_type === "purchase_click" || !event.event_type).length;
    const views = events.filter((event) => event.event_type === "product_view").length;
    const rate = views > 0 ? Math.round((clicks / views) * 100) : 0;

    countNodes.forEach((node) => {
      node.textContent = String(clicks);
    });
    viewNodes.forEach((node) => {
      node.textContent = String(views);
    });
    rateNodes.forEach((node) => {
      node.textContent = `${rate}%`;
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
    const eventName = detail.analytics_event || "purchase_link_click";
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...detail });

    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, detail);
    }

    if (Array.isArray(window._hmt)) {
      window._hmt.push(["_trackEvent", detail.category || "purchase_link", detail.action, detail.product_name || "助农产品"]);
    }
  };

  const recordEvent = (detail) => {
    const event = {
      ...detail,
      page_path: window.location.pathname,
      page_hash: window.location.hash,
      timestamp: new Date().toISOString(),
    };
    writeEvents([...readEvents(), event]);
    emitAnalytics(event);
    updateLocalStats();
  };

  const recordProductView = () => {
    if (productViewRecorded) return;
    productViewRecorded = true;
    recordEvent({
      event_type: "product_view",
      analytics_event: "product_section_view",
      category: "product_section",
      action: "view",
      product_name: "助农产品",
      link_ready: links.some((link) => Boolean((link.dataset.purchaseUrl || "").trim())),
    });
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
      recordEvent({
        event_type: "purchase_click",
        analytics_event: "purchase_link_click",
        category: "purchase_link",
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

  if (productSection) {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            recordProductView();
            observer.disconnect();
          }
        },
        { threshold: 0.35 },
      );
      observer.observe(productSection);
    } else {
      recordProductView();
    }
  }

  updateLocalStats();
})();
