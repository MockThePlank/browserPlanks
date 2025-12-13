import { slides } from "./slides/index.js";

const defaultTransition = {
  type: "fade",
  duration: 500,
  easing: "ease-in-out",
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

class SlideRenderer {
  createSlide(slide, index, total) {
    const el = document.createElement("section");
    el.className = `slide slide-type-${slide.type || "text"}`;
    el.dataset.slideId = slide.id || `slide-${index}`;
    el.setAttribute(
      "aria-label",
      `Slide ${index + 1} von ${total}: ${slide.title ?? slide.type}`
    );

    const template = this.templates[slide.type] || this.templates.text;
    template.call(this, el, slide);
    return el;
  }

  templates = {
    text: (el, slide) => {
      const title = document.createElement("h1");
      const renderTitle = slide.title || "Titel fehlt";
      if (slide.id === "outro") {
        const rainbow = "🌈";
        const idx = renderTitle.lastIndexOf(rainbow);
        if (idx !== -1) {
          const before = renderTitle.slice(0, idx);
          const after = renderTitle.slice(idx + rainbow.length);
          title.textContent = "";
          title.append(before);
          const span = document.createElement("span");
          span.className = "rainbow-rotated";
          span.textContent = rainbow;
          title.append(span, after);
        } else {
          title.textContent = renderTitle;
        }
      } else {
        title.textContent = renderTitle;
      }
      const subtitle = document.createElement("h2");
      subtitle.textContent = slide.subtitle || "";
      const body = document.createElement("p");
      body.className = "slide-body slide-content is-hidden";
      body.setAttribute("aria-hidden", "true");
      body.textContent =
        slide.body ||
        "Diese Text-Slide hat keinen Body. Ergänze 'body' im Slide-Objekt.";

      el.append(title, subtitle, body);

      this.appendOptionalImage(el, slide);
    },
    table: (el, slide) => {
      const heading = document.createElement("h1");
      heading.textContent = slide.title || "Tabelle";

      const table = document.createElement("table");
      table.classList.add("slide-content", "is-hidden");
      table.setAttribute("aria-hidden", "true");
      table.setAttribute("role", "table");

      const columns = slide.table?.columns || [];
      const rows = slide.table?.rows || [];

      if (columns.length) {
        const thead = document.createElement("thead");
        const headRow = document.createElement("tr");
        columns.forEach((col) => {
          const th = document.createElement("th");
          th.scope = "col";
          th.textContent = col;
          headRow.appendChild(th);
        });
        thead.appendChild(headRow);
        table.appendChild(thead);
      }

      const tbody = document.createElement("tbody");
      rows.forEach((row) => {
        const tr = document.createElement("tr");
        row.forEach((cell) => {
          const td = document.createElement("td");
          td.textContent = cell;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);

      if (!rows.length) {
        const empty = document.createElement("p");
        empty.className = "muted slide-content is-hidden";
        empty.setAttribute("aria-hidden", "true");
        empty.textContent =
          "Keine Daten vorhanden. Ergänze 'table.rows' in der Slide-Konfiguration.";
        el.append(heading, empty);
        return;
      }

      el.append(heading, table);

      this.appendOptionalImage(el, slide);
    },
    video: (el, slide) => {
      const heading = document.createElement("h1");
      heading.textContent = slide.title || "Video";

      const wrapper = document.createElement("div");
      wrapper.className = "video-wrapper slide-content is-hidden";
      wrapper.setAttribute("aria-hidden", "true");

      if (!slide.video?.src) {
        const fallback = document.createElement("p");
        fallback.className = "muted";
        fallback.textContent =
          "Kein Video-URL hinterlegt. Setze 'video.src' in der Slide-Konfiguration.";
        wrapper.appendChild(fallback);
        el.append(heading, wrapper);
        return;
      }

      const video = document.createElement("video");
      video.src = slide.video.src;
      video.preload = "metadata";
      video.playsInline = true;
      video.controls = slide.video.controls ?? true;
      video.autoplay = slide.video.autoplay ?? false;
      video.muted = slide.video.muted ?? false;
      video.poster = slide.video.poster ?? "";

      wrapper.appendChild(video);
      el.append(heading, wrapper);
    },
    image: (el, slide) => {
      const heading = document.createElement("h1");
      heading.textContent = slide.title || "Bild";
      const subtitle = document.createElement("h2");
      subtitle.textContent = slide.subtitle || "";

      const wrapper = this.createImageWrapper(slide.image, { overlay: false, hidden: false });
      el.append(heading, subtitle, wrapper);
    },
    finale: (el, slide) => {
      el.classList.add("rainbow-finale");
      const heading = document.createElement("h1");
      heading.textContent = slide.title || "Finale";
      const subtitle = document.createElement("h2");
      subtitle.textContent = slide.subtitle || "";
      el.append(heading, subtitle);
    },
  };

  appendOptionalImage(el, slide) {
    if (!slide.image?.src) return;
    const wrapper = this.createImageWrapper(slide.image, { overlay: true, hidden: false });
    el.append(wrapper);
  }

  createImageWrapper(imageConfig = {}, { overlay = true, hidden = true } = {}) {
    const wrapper = document.createElement("div");
    wrapper.className = `image-wrapper${overlay ? " image-overlay" : ""} slide-content`;
    if (hidden) {
      wrapper.classList.add("is-hidden");
      wrapper.setAttribute("aria-hidden", "true");
    }

    const src = imageConfig.src;
    if (!src) return wrapper;

    const img = document.createElement("img");
    img.src = src;
    img.alt = imageConfig.alt || "Bild";
    img.loading = "lazy";
    img.decoding = "async";
    wrapper.appendChild(img);

    if (imageConfig.caption && !overlay) {
      const caption = document.createElement("p");
      caption.className = "image-caption";
      caption.textContent = imageConfig.caption;
      wrapper.appendChild(caption);
    }

    return wrapper;
  }
}

class TransitionManager {
  constructor(containerEl) {
    this.containerEl = containerEl;
  }

  cleanupDangling(allowed = new Set()) {
    this.containerEl.querySelectorAll(".slide").forEach((slide) => {
      if (allowed.has(slide)) return;
      if (
        slide.classList.contains("is-active") ||
        slide.classList.contains("is-entering")
      ) {
        return;
      }
      slide.remove();
    });
  }

  apply(oldEl, newEl, options) {
    this.cleanupDangling(new Set([oldEl]));

    const type = options?.type || defaultTransition.type;
    const duration = options?.duration ?? defaultTransition.duration;
    const easing = options?.easing || defaultTransition.easing;
    const direction = options?.direction || "forward";

    newEl.style.setProperty("--t-duration", `${duration}ms`);
    newEl.style.setProperty("--t-easing", easing);
    newEl.classList.add(`t-${type}`, `dir-${direction}`, "is-entering");
    this.containerEl.appendChild(newEl);

    if (oldEl) {
      oldEl.style.setProperty("--t-duration", `${duration}ms`);
      oldEl.style.setProperty("--t-easing", easing);
      oldEl.classList.add(`t-${type}`, `dir-${direction}`, "is-leaving");
    }

    const run = () => {
      newEl.classList.add("is-active");
      newEl.classList.remove("is-entering");
      if (oldEl) oldEl.classList.add("is-leaving-active");
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(run);
    });

    return new Promise((resolve) => {
      const finish = () => {
        oldEl?.remove();
        resolve();
      };
      const timer = setTimeout(finish, duration + 80);
      const onDone = () => {
        clearTimeout(timer);
        finish();
      };

      newEl.addEventListener("transitionend", onDone, { once: true });
      if (oldEl) oldEl.addEventListener("transitionend", onDone, { once: true });
    });
  }
}

class Deck {
  constructor(slides, { stageEl, slidesRootEl, indicatorEl }) {
    this.slides = slides;
    this.stageEl = stageEl;
    this.slidesRootEl = slidesRootEl;
    this.indicatorEl = indicatorEl;
    this.renderer = new SlideRenderer();
    this.transitioner = new TransitionManager(slidesRootEl);
    this.currentIndex = -1;
    this.isRoutingFromHash = false;
    this.isTransitioning = false;
    this.queuedIndex = null;
  }

  init() {
    this.bindEvents();
    const initialIndex = this.indexFromHash();
    const hasHash = Boolean(window.location.hash);
    this.goTo(initialIndex, { direction: "forward", fromHash: hasHash });
    this.stageEl.focus();
  }

  bindEvents() {
    document.querySelector(".nav-btn.prev")?.addEventListener("click", () => this.prev());
    document.querySelector(".nav-btn.next")?.addEventListener("click", () => this.next());
    this.stageEl.addEventListener("click", (event) => {
      if (!(event.target instanceof HTMLElement)) return;
      if (event.target.closest("button, video, a, input, textarea")) return;
      if (this.revealHiddenContent()) return;
      this.next();
    });

    window.addEventListener("keydown", (event) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (["input", "textarea", "select"].includes(activeTag)) return;

      if (["ArrowRight", "PageDown"].includes(event.key)) {
        event.preventDefault();
        this.next();
      }
      if (["ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        this.prev();
      }
      if (event.key === "Home") {
        this.goTo(0);
      }
      if (event.key === "End") {
        this.goTo(this.slides.length - 1);
      }
      if (event.key?.toLowerCase() === "f") {
        this.stageEl.focus();
      }
    });

    window.addEventListener("hashchange", () => {
      const target = this.indexFromHash();
      this.goTo(target, { fromHash: true });
    });
  }

  indexFromHash() {
    const match = window.location.hash.match(/#\/(\d+)/);
    if (!match) return 0;
    const parsed = Number.parseInt(match[1], 10) - 1;
    return clamp(parsed, 0, this.slides.length - 1);
  }

  updateHash() {
    this.isRoutingFromHash = true;
    window.location.hash = `#/${this.currentIndex + 1}`;
    setTimeout(() => (this.isRoutingFromHash = false), 0);
  }

  async goTo(targetIndex, { direction, fromHash = false } = {}) {
    const clampedIndex = clamp(targetIndex, 0, this.slides.length - 1);
    const isFirstRender = this.currentIndex === -1;
    if (clampedIndex === this.currentIndex && !isFirstRender) return;

    if (this.isTransitioning && !isFirstRender) {
      this.queuedIndex = clampedIndex;
      return;
    }
    this.isTransitioning = true;

    const newDirection =
      direction ||
      (isFirstRender
        ? "forward"
        : clampedIndex > this.currentIndex
        ? "forward"
        : "backward");

    const nextSlide = this.slides[clampedIndex];
    const nextEl = this.renderer.createSlide(
      nextSlide,
      clampedIndex,
      this.slides.length
    );

    const currentEl = this.slidesRootEl.querySelector(".slide.is-active");
    this.pauseMedia(currentEl);

    const transition = {
      ...defaultTransition,
      ...(nextSlide.transition || {}),
      direction: newDirection,
    };

    await this.transitioner.apply(currentEl, nextEl, transition);
    this.currentIndex = clampedIndex;
    this.updateIndicator();
    this.stageEl.setAttribute(
      "aria-label",
      `Slide ${clampedIndex + 1} von ${this.slides.length}: ${nextSlide.title}`
    );

    if (!fromHash && !this.isRoutingFromHash && this.currentIndex >= 0) {
      this.updateHash();
    }

    this.isTransitioning = false;
    if (this.queuedIndex !== null && this.queuedIndex !== this.currentIndex) {
      const nextTarget = this.queuedIndex;
      this.queuedIndex = null;
      this.goTo(nextTarget, { direction: nextTarget > this.currentIndex ? "forward" : "backward" });
    } else {
      this.queuedIndex = null;
    }
  }

  next() {
    this.goTo(this.currentIndex + 1, { direction: "forward" });
  }

  prev() {
    this.goTo(this.currentIndex - 1, { direction: "backward" });
  }

  revealHiddenContent() {
    const activeSlide = this.slidesRootEl.querySelector(".slide.is-active");
    if (!activeSlide) return false;
    const content = activeSlide.querySelector(".slide-content.is-hidden");
    if (!content) return false;
    content.classList.remove("is-hidden");
    content.removeAttribute("aria-hidden");
    return true;
  }

  pauseMedia(el) {
    if (!el) return;
    el.querySelectorAll("video").forEach((video) => {
      video.pause();
      video.currentTime = 0;
    });
  }

  updateIndicator() {
    const label = `Slide ${this.currentIndex + 1} / ${this.slides.length}`;
    if (this.indicatorEl) this.indicatorEl.textContent = label;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const stageEl = document.getElementById("stage");
  const slidesRootEl = document.getElementById("slides-root");
  const indicatorEl = document.getElementById("slide-indicator");
  const baseWidth = 1200;
  const baseHeight = 675;

  if (!stageEl || !slidesRootEl) {
    console.error("Stage oder Slides-Root fehlt in der Seite.");
    return;
  }

  const updateUiScale = () => {
    const scale = Math.min(
      stageEl.clientWidth / baseWidth,
      stageEl.clientHeight / baseHeight
    );
    document.documentElement.style.setProperty("--ui-scale", scale.toFixed(3));
  };

  window.addEventListener("resize", updateUiScale);
  window.addEventListener("orientationchange", updateUiScale);

  const deck = new Deck(slides, { stageEl, slidesRootEl, indicatorEl });
  deck.init();
  updateUiScale();
});
